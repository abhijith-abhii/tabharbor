// Runs in an isolated, disposable Chromium profile on GitHub Actions.
// Browser APIs are real; the test web pages are intentionally intercepted fixtures.
import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile, mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
const root=process.cwd(), profile=await mkdtemp(path.join(os.tmpdir(),'tabharbor-ci-'));
const context=await chromium.launchPersistentContext(profile,{channel:'chromium',headless:true,args:[`--disable-extensions-except=${root}`,`--load-extension=${root}`]});
const checks=[];
try {
 await context.route('https://portfolio.test/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<h1>Synthetic TabHarbor test page</h1>'}));
 let worker=context.serviceWorkers()[0];if(!worker)worker=await context.waitForEvent('serviceworker');
 const id=worker.url().split('/')[2];
 for(const url of ['https://portfolio.test/a','https://portfolio.test/a','https://portfolio.test/b']){const p=await context.newPage();await p.goto(url)}
 const popup=await context.newPage();await popup.goto(`chrome-extension://${id}/popup.html`);await expect(popup.locator('#status')).toContainText('tabs in this window');checks.push('Manifest V3 extension and popup loaded');
 await popup.getByRole('button',{name:'Group current window by domain',exact:true}).click();await expect(popup.locator('#status')).toHaveText('Created 1 domain groups');
 const groups=await popup.evaluate(()=>chrome.tabGroups.query({}));expect(groups).toHaveLength(1);expect(groups[0].title).toBe('portfolio.test');checks.push('Actual Chrome tab group created with domain title');
 await popup.getByRole('button',{name:'Preview duplicate tabs',exact:true}).click();await expect(popup.locator('#duplicates')).toContainText('1 exact duplicate');
 const before=await popup.evaluate(()=>chrome.tabs.query({currentWindow:true}));await popup.getByRole('button',{name:'Close 1 duplicates',exact:true}).click();await expect(popup.locator('#duplicates')).toBeEmpty();
 const after=await popup.evaluate(()=>chrome.tabs.query({currentWindow:true}));expect(after.length).toBe(before.length-1);checks.push('Duplicate preview and explicit closure removed one actual tab');
 await popup.getByLabel('Workspace name').fill('CI research');await popup.getByRole('button',{name:'Save current workspace',exact:true}).click();await expect(popup.locator('#spaces')).toContainText('CI research · 2 tabs');
 const stored=await popup.evaluate(()=>chrome.storage.local.get('workspaces'));expect(stored.workspaces[0].urls).toEqual(['https://portfolio.test/a','https://portfolio.test/b']);
 await popup.getByRole('button',{name:'Restore in new window',exact:true}).click();await expect.poll(async()=>(await popup.evaluate(()=>chrome.windows.getAll({populate:true}))).length).toBe(2);checks.push('Workspace persisted via storage API and restored to an actual new window');
 await popup.getByLabel('Minutes',{exact:true}).fill('1');await popup.getByRole('button',{name:'Start focus timer',exact:true}).click();await expect(popup.locator('#timer')).toContainText('Ends');expect((await popup.evaluate(()=>chrome.alarms.get('focus'))).name).toBe('focus');
 await popup.getByRole('button',{name:'Cancel timer',exact:true}).click();await expect(popup.locator('#timer')).toHaveText('No timer running');expect(await popup.evaluate(()=>chrome.alarms.get('focus'))).toBeUndefined();checks.push('Actual timer alarm scheduled, badge set, and timer cancelled');
 await mkdir('reports/screenshots',{recursive:true});await popup.locator('body').screenshot({path:'reports/screenshots/extension.png'});
 await writeFile('reports/browser-integration.json',JSON.stringify({passed:true,browser:'Playwright bundled Chromium, isolated Linux CI profile',network:'Synthetic fixture pages; no personal tabs or browser data',checks},null,2));
 console.log(JSON.stringify({passed:true,checks},null,2));
} finally {await context.close();await rm(profile,{recursive:true,force:true})}
