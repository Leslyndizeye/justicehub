import Groq from 'groq-sdk';
import {providerFailure} from './chatDiagnostics.js';
import {retryDelaySeconds} from './chatProvider.js';

// This changes only the connection, never the prompt, model, source checks or
// response format. Switching accounts to evade a quota is not supported.
export function createGroqServiceFailover({primary,secondary,now=Date.now,circuitMs=30000,requestTimeoutMs=10000,onAccount=()=>{}}) {
  const clients={primary,secondary};
  const unavailableUntil={primary:0,secondary:0};
  let quotaAccount,quotaUntil=0,lastAccount;
  const unavailable=()=>Object.assign(new Error('Chat service temporarily unavailable'),{status:503});
  const observe=account=>{
    if(account!==lastAccount) {
      lastAccount=account;
      // Operational observers must not break a user's request.
      try { onAccount(account); } catch {}
    }
  };
  const record=(account,error)=>{
    if(error.status===429) {
      quotaAccount=account;
      quotaUntil=Math.max(quotaUntil,now()+retryDelaySeconds(error,now())*1000);
    } else if(providerFailure(error))unavailableUntil[account]=now()+circuitMs;
  };
  const attempt=async(account,request,options)=>{
    options.signal?.throwIfAborted();
    if(unavailableUntil[account]>now())throw unavailable();
    observe(account);
    try {
      const response=await clients[account].chat.completions.create(request,{...options,timeout:Math.min(options.timeout??requestTimeoutMs,requestTimeoutMs),maxRetries:0});
      options.signal?.throwIfAborted();
      unavailableUntil[account]=0;
      if(!response?.[Symbol.asyncIterator])return response;
      // Once a stream starts, never replay it on a different account. Record
      // its failure for later requests, while preserving Stop and partial text.
      return (async function*(){
        try {
          for await(const chunk of response) {
            options.signal?.throwIfAborted();
            yield chunk;
          }
        } catch(error) {
          options.signal?.throwIfAborted();
          record(account,error);
          throw error;
        }
      })();
    } catch(error) {
      options.signal?.throwIfAborted();
      record(account,error);
      throw error;
    }
  };
  return {chat:{completions:{async create(request,options={}) {
    options.signal?.throwIfAborted();
    // A quota response pins subsequent calls to that account until its reset.
    // Existing model-level fallback can still try another model on that account.
    if(quotaUntil>now())return attempt(quotaAccount,request,options);
    if(unavailableUntil.primary>now())return attempt('secondary',request,options);
    try { return await attempt('primary',request,options); }
    catch(error) {
      options.signal?.throwIfAborted();
      if(!providerFailure(error) || quotaUntil>now() || unavailableUntil.secondary>now())throw error;
      return attempt('secondary',request,options);
    }
  }}}};
}

export function configuredGroqConnection(env=process.env,{Client=Groq,...options}={}) {
  const mode=env.GROQ_ACCOUNT_MODE?.trim().toLowerCase() || 'primary';
  if(!['primary','secondary','failover'].includes(mode))throw new Error('GROQ_ACCOUNT_MODE must be primary, secondary or failover');
  const primaryKey=env.GROQ_API_KEY?.trim();
  const secondaryKey=env.GROQ_SECONDARY_API_KEY?.trim();
  if(mode!=='secondary'&&!primaryKey)throw new Error('GROQ_API_KEY is required for this connection mode');
  if(mode!=='primary'&&!secondaryKey)throw new Error('GROQ_SECONDARY_API_KEY is required for this connection mode');
  if(mode==='failover'&&primaryKey===secondaryKey)throw new Error('Failover requires two distinct API keys');
  const primary=mode!=='secondary'?new Client({apiKey:primaryKey,maxRetries:0}):undefined;
  const secondary=mode!=='primary'?new Client({apiKey:secondaryKey,maxRetries:0}):undefined;
  return {mode,client:mode==='failover'?createGroqServiceFailover({primary,secondary,...options}):mode==='secondary'?secondary:primary};
}
