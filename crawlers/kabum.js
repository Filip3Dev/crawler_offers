const puppeteer = require('puppeteer')
const Sentry = require('@sentry/node');

exports.kabumGetter = async (parame) => {
  console.time('kabumGetter');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet' || request.resourceType() === 'font' || request.resourceType() === 'script')
      request.abort();
    else
      request.continue();
  });
  await page.setViewport({ width: 1376, height: 780 })
  await page.goto(`https://www.kabum.com.br/`, { waitUntil: 'networkidle2' })
  await page.waitForSelector(".sprocura");
  const BUSCA_ID = '.sprocura'
  const BUSCA_BUTTON = '#bt-busca'
  await page.click(BUSCA_ID);
  await page.keyboard.type(parame);
  await page.click(BUSCA_BUTTON);
  await page.waitForSelector("#adicionais");
  try {
    const news = await page.evaluate(() => {
      const titleNodeList = document.querySelectorAll('.listagem-box');
      const titleLinkArray = [];

      for (var i = 0; i < titleNodeList.length; i++) {
        titleLinkArray[i] = {
          title: titleNodeList[i].querySelector('.H-titulo a').innerText.trim(),
          link: titleNodeList[i].querySelector('.H-titulo a').href,
          img: titleNodeList[i].querySelector('.listagem-img a img').src,
          value: titleNodeList[i].querySelector('.listagem-precoavista b').innerText.trim()
        };
      }
      return titleLinkArray;
    });
    await browser.close()
    console.timeEnd('kabumGetter');
    return { retorno: true, data: news, size: news.length };
  } catch (error) {
    Sentry.captureException(error);
    await browser.close()
    console.timeEnd('kabumGetter');
    return { retorno: false, mensage: 'Não foi possivel encontrar um retorno!'};
  }
  await browser.close()
}