import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ts from 'typescript';
import {normalizeMemory,captureMemory} from '../lib/userMemory.js';
import {memoryContextForChat,readMemoryContext} from '../../shared/memoryContext.js';

const source=fs.readFileSync(new URL('../components/MemorySettings.tsx',import.meta.url),'utf8')
  .replace('../lib/userMemory.js',new URL('../lib/userMemory.js',import.meta.url).href)
  .replace('../../shared/memoryFacts.js',new URL('../../shared/memoryFacts.js',import.meta.url).href);
const compiled=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const cache=path.resolve('node_modules/.cache/justicehub-tests');fs.mkdirSync(cache,{recursive:true});
const modulePath=path.join(cache,'MemorySettings.mjs');fs.writeFileSync(modulePath,compiled,'utf8');
const {default:MemorySettings}=await import(pathToFileURL(modulePath).href);
const render=(memory=normalizeMemory(null),status='local')=>renderToStaticMarkup(React.createElement(MemorySettings,{memory,status,persistent:true,disabled:false,onSave:async()=>true,onClose(){},onReload(){}}));

test('memory controls explain consent, manual case saving, review and browser-only persistence without enabling AI sharing by default',()=>{
  const html=render();
  assert.match(html,/aria-labelledby="memory-title"/);assert.match(html,/Close memory settings/);
  assert.match(html,/Case details are saved only when you ask/);assert.match(html,/backup connection/);
  assert.match(html,/Saved in this browser. Account sync is unavailable/);
  const sharing=html.split('</label>').find(part=>part.includes('Use saved details in AI replies'));
  assert.doesNotMatch(sharing.match(/<input[^>]*>/)[0],/checked/);
  assert.match(html,/Reload account memory/);assert.match(html,/240 characters|0\/240/);
});

test('the review shows the actual case note as text and opt-out removes it from new request payloads',()=>{
  let memory=captureMemory(null,'Remember that my case concerns a tenancy dispute.',()=> 'case');
  memory={...memory,shareWithAI:true};
  assert.match(render(memory,'saved'),/Synced with your account/);
  assert.match(render(memory),/my case concerns a tenancy dispute/);
  assert.equal(readMemoryContext(memoryContextForChat(memory))[0].category,'case_context');
  assert.equal(memoryContextForChat({...memory,shareWithAI:false}),undefined);
  assert.equal(memoryContextForChat(captureMemory(memory,'Forget everything about me')),undefined);
});
