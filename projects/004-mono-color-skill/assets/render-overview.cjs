// Render this original HTML overview to a GitHub-compatible PNG.
// Supply an installed Playwright module path via PLAYWRIGHT_MODULE when needed.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{const browser=await chromium.launch({headless:true});try{const page=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1});await page.goto(pathToFileURL(path.join(__dirname,'overview.html')).href);await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});await page.screenshot({path:path.join(__dirname,'overview.png')});}finally{await browser.close();}})();
