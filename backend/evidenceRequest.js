import {buildChatMessages} from './chatPrompt.js';
import {evidenceBundle} from './evidenceAnswer.js';

// Character budgets are conservative heuristics, not exact tokenizer counts.
// Drop whole optional context entries. Never cut the user's latest question,
// an article, a quotation, or the application's source-check instructions.
export function prepareEvidenceRequest({message,role,history=[],legalDocs=[],routing,language,correction,research,now},compact=false) {
  const context={history:[...history],legalDocs:[...legalDocs]};
  let limitedResearch=research && {...research,sources:[...(research.sources || [])]};
  const budget=compact?12000:18000;
  let bundle,messages;
  const build=()=>{
    bundle=evidenceBundle(message,context.history,context.legalDocs,limitedResearch);
    messages=buildChatMessages({message,role,...context,routing,legalDocs:bundle.docs,evidenceMode:true,correction,
      replyLanguage:language,externalSearchResult:bundle.research,searchEnabled:false,now,instructionRole:'developer'});
    return messages.reduce((sum,item)=>sum+item.content.length,0);
  };
  let size=build();
  while(size>budget) {
    if(context.history.length)context.history.shift();
    else if(context.legalDocs.length>1)context.legalDocs.pop();
    else if(limitedResearch?.sources?.length) {
      limitedResearch.sources.pop();
      if(!limitedResearch.sources.length)limitedResearch={...limitedResearch,status:'omitted',reason:'context_size'};
    } else break;
    size=build();
  }
  return {context,bundle,messages,size};
}
