const puppeteer = require('puppeteer');
const srcToImg = require('./srcToImg');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://image.baidu.com');
  console.log('go to https://image.baidu.com');

  await page.setViewport({
      width: 1920,
      height: 2080
  });
  console.log('reset viewport');

  await page.focus('#kw');
  await page.keyboard.sendCharacter('星际牛仔');
  await page.click('.s_search');
  console.log('go to search list');

  page.on('load', async () => {
    console.log('page loading done, start fetch...');
    const srcs = await page.$$eval('img.main_img', imgs => {
        return imgs.map(img => img.src);
    });
    console.log(`get ${srcs.length} images, start download`);
    
    for(let i = 0; i < srcs.length; i++) {
        await page.waitFor(200);
        await srcToImg(srcs[i], path.resolve(__dirname, './imgs'));
    }
    await browser.close();
  });

})();
