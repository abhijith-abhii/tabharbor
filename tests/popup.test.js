// Contract tests with explicit Chrome API doubles, not a real extension installation.
import test from 'node:test';
import assert from 'node:assert/strict';
class Element {
  constructor(){this.children=[];this.textContent='';this.value=''}
  replaceChildren(...items){this.children=[...items];this.textContent=''}
  append(...items){this.children.push(...items)}
}
let sequence=0;
async function setup(){
 const nodes=new Map();const node=s=>{if(!nodes.has(s))nodes.set(s,new Element());return nodes.get(s)};
 const calls=[];const state={tabs:[{id:1,url:'https://example.org/a'},{id:2,url:'https://example.org/a'},{id:3,url:'https://example.org/b',pinned:true}],store:{}};
 globalThis.document={querySelector:node,createElement:()=>new Element()};globalThis.confirm=()=>true;
 globalThis.chrome={
  tabs:{query:async()=>state.tabs,group:async x=>{calls.push(['group',x]);return 10},remove:async ids=>{calls.push(['remove',ids]);state.tabs=state.tabs.filter(t=>!ids.includes(t.id))}},
  tabGroups:{update:async(id,data)=>calls.push(['groupTitle',id,data])},windows:{create:async x=>calls.push(['window',x])},
  storage:{local:{get:async()=>structuredClone(state.store),set:async x=>Object.assign(state.store,structuredClone(x)),remove:async x=>{delete state.store[x]}}},
  alarms:{create:async(...x)=>calls.push(['alarm',...x]),clear:async x=>calls.push(['clear',x])},
  action:{setBadgeText:async x=>calls.push(['badge',x]),setBadgeBackgroundColor:async()=>{}}
 };
 await import(`../popup.js?case=${++sequence}`);await new Promise(setImmediate);
 return {node,calls,state};
}
test('popup domain grouping calls Chrome with unpinned tab IDs',async()=>{const {node,calls}=await setup();await node('#group').onclick();assert.deepEqual(calls[0],['group',{tabIds:[1,2]}]);assert.equal(node('#status').textContent,'Created 1 domain groups')});
test('duplicate preview cannot close tabs until explicit confirmation action',async()=>{const {node,calls}=await setup();await node('#dedupe').onclick();assert.equal(calls.length,0);await node('#duplicates').children[1].onclick();assert.deepEqual(calls[0],['remove',[2]])});
test('duplicate closure rechecks tabs that became pinned',async()=>{const {node,calls,state}=await setup();await node('#dedupe').onclick();state.tabs[1].pinned=true;await node('#duplicates').children[1].onclick();assert.deepEqual(calls[0],['remove',[]])});
test('saved workspace is persisted and restored in a new window',async()=>{const {node,calls,state}=await setup();node('#name').value='Research';await node('#save').onclick();assert.equal(state.store.workspaces.length,1);await node('#spaces').children[0].children[1].onclick();assert.deepEqual(calls[0],['window',{url:['https://example.org/a','https://example.org/b']}])});
test('storage failure produces a visible error',async()=>{const {node}=await setup();chrome.storage.local.set=async()=>{throw Error('Storage unavailable')};node('#name').value='Study';await node('#save').onclick();assert.equal(node('#status').textContent,'Storage unavailable')});
test('focus timer is scheduled and cancellation clears its state',async()=>{const {node,state,calls}=await setup();node('#minutes').value='25';await node('#focus').onclick();assert.ok(state.store.focusEnds>Date.now());assert.equal(calls[0][0],'alarm');await node('#cancel').onclick();assert.equal(state.store.focusEnds,undefined);assert.equal(node('#timer').textContent,'No timer running')});
test('invalid timer cannot schedule an alarm',async()=>{const {node,calls}=await setup();node('#minutes').value='0';await node('#focus').onclick();assert.equal(calls.length,0);assert.match(node('#status').textContent,/1–180/)});
