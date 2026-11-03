import {buildChatMessages} from './chatPrompt.js';
import {evidenceBundle,evidenceRepairInstruction} from './evidenceAnswer.js';

// Character budgets are conservative heuristics, not exact tokenizer counts.
// Drop whole optional context entries. Never cut the user's latest question,
// an article, a quotation, or the application's source-check instructions.
export function prepareEvidenceRequest({message,role,history=[],legalDocs=[],routing,language,correction,research,now,repairReason,memoryContext=[],evidenceMode=true,searchEnabled=false,instructionRole='developer'},compact=false) {
  const context={history:[...history],legalDocs:[...legalDocs]};
  let limitedResearch=research && {...research,sources:[...(research.sources || [])]};
  let sharedContext=memoryContext;
  const budget=compact?12000:18000;
  let bundle,messages;
  let compactPrompt=compact;
  const build=()=>{
    bundle=evidenceMode?evidenceBundle(message,context.history,context.legalDocs,limitedResearch):undefined;
    messages=buildChatMessages({message,role,...context,routing,legalDocs:bundle?.docs || context.legalDocs,evidenceMode,compact:compactPrompt,correction,memoryContext:sharedContext,
      replyLanguage:language,externalSearchResult:bundle?.research || limitedResearch,searchEnabled:evidenceMode?false:searchEnabled,now,instructionRole});
    if(repairReason)messages[0].content+='\n'+evidenceRepairInstruction(repairReason);
    return messages.reduce((sum,item)=>sum+item.content.length,0);
  };
  let size=build();
  // Prefer shorter instructions over discarding useful history or evidence.
  if(size>budget && !evidenceMode && !compactPrompt) { compactPrompt=true;size=build(); }
  while(size>budget) {
    if(context.history.length)context.history.shift();
    else if(sharedContext.length)sharedContext=[];
    else if(context.legalDocs.length>1)context.legalDocs.pop();
    else if(limitedResearch?.sources?.length) {
      limitedResearch.sources.pop();
      if(!limitedResearch.sources.length)limitedResearch={...limitedResearch,status:'omitted',reason:'context_size'};
    } else break;
    size=build();
  }
  return {context,bundle,messages,size,research:bundle?.research || limitedResearch};
}
