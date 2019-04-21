const puppeteer = require('puppeteer')
const Sentry = require('@sentry/node');

exports.amazonGetter = async (parame) => {
  console.time('amazonGetter');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet' || request.resourceType() === 'font')
      request.abort();
    else
      request.continue();
  });
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto(`https://www.amazon.com.br/s?k=${parame}`, { waitUntil: 'networkidle2' })
  await page.waitForSelector(".s-result-item");
  try {
    const news = await page.evaluate(() => {
      const titleNodeList = document.querySelectorAll(`.s-result-item`);
      const titleLinkArray = [];

      for (var i = 0; i < titleNodeList.length; i++) {
        titleLinkArray[i] = {
          title: titleNodeList[i].querySelector('.s-line-clamp-2 .a-link-normal span').innerText.trim(),
          link: titleNodeList[i].querySelector('.s-line-clamp-2 .a-link-normal').href,
          img: titleNodeList[i].querySelector('img').src
        };
        try {
          titleLinkArray[i].value = titleNodeList[i].querySelector('.a-offscreen').innerText ? titleNodeList[i].querySelector('.a-offscreen').innerText : null
        } catch (error) {
          titleLinkArray[i].value = 0
        }
      }
      return titleLinkArray;
    });
    await browser.close()
    console.timeEnd('amazonGetter');
    return { retorno: true, data: news, size: news.length };
  } catch (error) {
    Sentry.captureException(error);
    await browser.close()
    console.timeEnd('amazonGetter');
    return { retorno: false, mensage: 'Não foi possivel encontrar um retorno!' };
  }
  await browser.close()
}