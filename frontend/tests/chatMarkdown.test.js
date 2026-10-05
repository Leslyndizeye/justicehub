import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

// Compile the actual TSX renderer into an ignored local cache, without adding a test dependency.
const source = fs.readFileSync(new URL('../components/ChatMarkdown.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const cache = path.resolve('node_modules/.cache/justicehub-tests');
fs.mkdirSync(cache, { recursive: true });
const rendererPath = path.join(cache, 'ChatMarkdown.mjs');
fs.writeFileSync(rendererPath, compiled, 'utf8');
const { default: ChatMarkdown } = await import(pathToFileURL(rendererPath).href);
const render = content => renderToStaticMarkup(React.createElement(ChatMarkdown, { content }));

test('renders bordered, scrollable tables with safe line breaks', () => {
  const markup = render('| Service | Contact |\n| --- | --- |\n| **Example** | First line<br>Second line |');
  assert.match(markup, /overflow-x-auto/);
  assert.match(markup, /<table/);
  assert.match(markup, /<thead/);
  assert.match(markup, /<th/);
  assert.match(markup, /<strong[^>]*>Example<\/strong>/);
  assert.match(markup, /First line<br\s*\/>\s*Second line/);
  assert.doesNotMatch(markup, /&lt;br/);
});

test('preserves real ordered and nested list markup', () => {
  const markup = render('1. First step\n2. Second step\n   - A nested option');
  assert.match(markup, /<ol[^>]*list-decimal/);
  assert.match(markup, /<ul[^>]*list-disc/);
  assert.equal((markup.match(/<li /g) || []).length, 3);
  assert.doesNotMatch(markup, /class="flex gap-2 items-start"/);
});

test('renders descriptive links while rejecting unsafe URLs and raw HTML', () => {
  const markup = render('[Official source](https://example.org/source)\n\n[Unsafe](javascript:alert%281%29)\n\n<script>alert("bad")</script>');
  assert.match(markup, /href="https:\/\/example.org\/source"/);
  assert.match(markup, /rel="noopener noreferrer"/);
  assert.doesNotMatch(markup, /href="javascript:|<script/);
});

test('keeps literal HTML inside fenced code instead of interpreting it', () => {
  const markup = render('```html\n<br>\n```');
  assert.match(markup, /<pre/);
  assert.match(markup, /&lt;br&gt;/);
});
