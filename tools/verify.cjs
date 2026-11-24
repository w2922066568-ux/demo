const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ||
  path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const base = process.env.DEMO_URL || 'http://127.0.0.1:4194/demo/';
const root = path.resolve(__dirname, '..');

async function main() {
  const browser = await chromium.launch({channel:'chrome',headless:true,
    args:['--enable-unsafe-swiftshader','--disable-background-networking']});
  const result = [];
  const cases = [
    ['',null],
    ['pop-up-atlas',null],
    ['cape-meridian','[data-action="enter"]'],
    ['abyssal','#launch'],
    ['cinderline','#deploy'],
    ['forma-index',null],
    ['huazhao','[data-ui="practice"]'],
    ['tidebound',null],
    ['concepts',null],
    ['valley-chapel',null],
    ['sunless-belfry',null],
  ];
  try {
    for (const [slug,button] of cases) {
      const page = await browser.newPage({viewport:{width:1280,height:800}});
      const errors = [], failures = [], messages = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => {if(response.status()>=400)failures.push([response.status(),response.url()]);});
      page.on('console', message => {if(['error','warning'].includes(message.type()))messages.push(message.text().slice(0,450));});
      const entry = base + (slug ? slug+'/' : '');
      try {
        await page.goto(entry, {waitUntil:'load',timeout:30000});
        if (button && await page.locator(button).count()) await page.locator(button).first().click({timeout:5000});
        if (slug === 'pop-up-atlas') await page.locator('#loading.ready').waitFor({state:'attached',timeout:15000});
        if (/chapel|belfry/.test(slug)) {
          await page.waitForFunction(() => {
            const status = document.querySelector('#status');
            return !status || status.style.visibility === 'hidden' || status.style.display === 'none' ||
              document.querySelector('#status-notice')?.textContent.trim();
          },null,{timeout:35000});
          const notice = await page.locator('#status-notice').allTextContents();
          if (notice[0]?.trim()) throw Error(notice[0].trim());
          await page.waitForTimeout(1700);
        } else {
          await page.waitForTimeout(900);
        }
        if (slug === 'huazhao') {
          await page.screenshot({path:path.join(root,'.local','huazhao.png')});
          await page.locator('.ht-hand').waitFor({state:'visible',timeout:10000});
          if (!(await page.locator('.ht-hand button').count())) throw Error('Practice hand did not render');
          if (await page.locator('img').evaluateAll(images => images.some(img => img.complete && !img.naturalWidth))) throw Error('Practice portrait failed to load');
        }
        const state = await page.evaluate(() => ({
          title:document.title,canvases:[...document.querySelectorAll('canvas')].filter(c=>c.offsetWidth>0).length,
          loaderNotice:document.querySelector('#status-notice')?.textContent.trim(),
          assetCount:performance.getEntriesByType('resource').length,
          practice:!!document.querySelector('.ht-hand')
        }));
        if (/chapel|belfry/.test(slug) || !slug) {
          await page.screenshot({path:path.join(root,'.local',(slug||'home')+'.png')});
        }
        result.push({slug,status:'parsed',...state,errors,failures,messages});
      } catch(error) {
        result.push({slug,status:'failed',error:error.message,errors,failures,messages});
      } finally {
        await page.close();
      }
      const row=result.at(-1);
      console.log(row.slug||'home',row.status,row.error||'',row.errors.length,row.failures.length);
    }
  } finally {
    await browser.close();
    const output = process.argv[2] || 'verification';
    fs.writeFileSync(path.join(root,'.local',output+'.json'),JSON.stringify(result,null,2));
  }
  if (result.some(row=>row.status==='failed'||row.errors.length||row.failures.length)) process.exitCode=1;
}
main().catch(error=>{console.error(error);process.exitCode=1;});
