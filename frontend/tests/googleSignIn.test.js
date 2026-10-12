import {test} from 'node:test';
import assert from 'node:assert/strict';
import {completeGoogleSignIn} from '../lib/googleSignIn.js';

test('successful authentication remains successful when optional profile storage is unavailable',async()=>{
  const result={user:{uid:'test-owner'}};const failure={code:'permission-denied'};const warnings=[];
  assert.equal(await completeGoogleSignIn(async()=>result,async()=>{throw failure;},error=>warnings.push(error)),result);
  assert.deepEqual(warnings,[failure]);
});

test('a rejected Google sign-in propagates and never writes a profile',async()=>{
  const failure={code:'auth/unauthorized-domain'};let writes=0;
  await assert.rejects(completeGoogleSignIn(async()=>{throw failure;},async()=>{writes++;}),error=>error===failure);
  assert.equal(writes,0);
});
