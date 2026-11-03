import React, {useEffect,useRef,useState} from 'react';
import {X} from 'lucide-react';
import {addMemoryNote,captureMemory,normalizeMemory,removeMemoryItem} from '../lib/userMemory.js';
import {memoryCategoryLabels} from '../../shared/memoryFacts.js';

interface Props {
  memory:ReturnType<typeof normalizeMemory>;
  status:string;
  persistent:boolean;
  disabled:boolean;
  onSave:(memory:ReturnType<typeof normalizeMemory>)=>Promise<boolean>;
  onReload:()=>void;
  onClose:()=>void;
}

export default function MemorySettings({memory,status,persistent,disabled,onSave,onReload,onClose}:Props) {
  const dialogRef=useRef<HTMLDialogElement>(null);
  const closeRef=useRef<HTMLButtonElement>(null);
  const [note,setNote]=useState('');
  const [caseNote,setCaseNote]=useState(false);
  const [busy,setBusy]=useState(false);
  const [feedback,setFeedback]=useState('');
  useEffect(()=>{
    const dialog=dialogRef.current;if(!dialog)return;
    dialog.showModal();closeRef.current?.focus();
    return ()=>dialog.close();
  },[]);
  const locked=disabled||busy||status==='loading';
  const save=async(next:ReturnType<typeof normalizeMemory>)=>{
    setBusy(true);setFeedback('');
    try {setFeedback(await onSave(next)?'Saved.':'Available for this visit only; storage is unavailable.');}
    catch {setFeedback('Your change could not be saved. Please try again.');}
    finally {setBusy(false);}
  };
  const add=async()=>{
    const value=note.trim();
    if(!value||value.length>240){setFeedback('Write a summary of 240 characters or fewer, keeping important conditions.');return;}
    const next=addMemoryNote(memory,value,()=>crypto.randomUUID(),{category:caseNote?'case_context':'note'});
    if(next.items.length===memory.items.length){setFeedback('This note was not added. It may already be saved, memory may be full or off, or it may contain credentials.');return;}
    await save(next);setNote('');
  };
  return <dialog ref={dialogRef} className="chat-delete-dialog chat-memory-dialog" aria-labelledby="memory-title" onCancel={event=>{event.preventDefault();onClose();}}>
    <button ref={closeRef} type="button" className="chat-delete-close chat-icon-button" aria-label="Close memory settings" onClick={onClose}><X size={19}/></button>
    <h2 id="memory-title">Memory</h2>
    <p role="status">{status==='loading'?'Loading saved memory…':status==='saved'?'Synced with your account.':status==='saving'?'Saving to your account…':status==='conflict'?'Memory changed elsewhere. Sharing is paused until you reload account memory.':persistent?'Saved in this browser. Account sync is unavailable.':'Available for this visit only.'}</p>
    <div className="chat-memory-controls">
      <label><input type="checkbox" checked={memory.enabled} disabled={locked} onChange={event=>void save({...memory,enabled:event.target.checked})}/>Save and recall memory</label>
      <label><input type="checkbox" checked={memory.autoSave} disabled={locked||!memory.enabled} onChange={event=>void save({...memory,autoSave:event.target.checked})}/>Remember basic details and preferences automatically</label>
      <p>Case details are saved only when you ask or add a case note.</p>
      <label><input type="checkbox" checked={memory.shareWithAI} disabled={locked||!memory.enabled} onChange={event=>void save({...memory,shareWithAI:event.target.checked})}/>Use saved details in AI replies</label>
      <p>When enabled, relevant saved details can be sent to the AI service, including its backup connection. Share case information only with permission. Recent case notes are used first; saved reports are not verified legal facts.</p>
    </div>
    <h3>Saved details</h3>
    {!memory.items.length?<p>No details saved yet.</p>:<ul className="chat-memory-items">{memory.items.map(item=><li key={item.id}>
      <div><strong>{item.kind==='name'?'Name':memoryCategoryLabels[item.category]||'Saved note'}</strong><p>{item.value}</p></div>
      <button type="button" disabled={locked} onClick={()=>void save(removeMemoryItem(memory,item.id))} aria-label={`Forget ${item.kind==='name'?'name':memoryCategoryLabels[item.category]||'note'}`}>Forget</button>
    </li>)}</ul>}
    <label className="chat-memory-note-label" htmlFor="memory-note">Add a short note or case summary</label>
    <textarea id="memory-note" value={note} onChange={event=>setNote(event.target.value)} disabled={locked||!memory.enabled} rows={3} aria-describedby="memory-note-help"/>
    <p id="memory-note-help">{note.length}/240 characters. Keep names and identity numbers out unless necessary; never save passwords or API keys.</p>
    <label className="chat-memory-case"><input type="checkbox" checked={caseNote} onChange={event=>setCaseNote(event.target.checked)} disabled={locked||!memory.enabled}/>This is case context I have permission to save</label>
    <div className="chat-memory-actions">
      <button type="button" disabled={locked||!memory.enabled||!note.trim()} onClick={()=>void add()}>Save note</button>
      <button type="button" disabled={locked} onClick={onReload}>Reload account memory</button>
      <button type="button" disabled={locked||!memory.items.length} onClick={()=>void save(captureMemory(memory,'Forget everything about me'))}>Clear saved memory</button>
    </div>
    <p className="chat-memory-feedback" role="status">{feedback}</p>
  </dialog>;
}
