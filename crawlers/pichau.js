const puppeteer = require('puppeteer')
const Sentry = require('@sentry/node');

exports.pichauGetter = async (parame) => {
  console.time('pichauGetter');
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
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto(`https://www.pichau.com.br/catalogsearch/result/index/?product_list_limit=32&q=${parame}`, { waitUntil: 'networkidle2' })
  await page.waitForSelector(".item.product.product-item");
  try {
    const news = await page.evaluate(() => {
      const titleNodeList = document.querySelectorAll(`.item.product.product-item`);
      const titleLinkArray = [];

      for (var i = 0; i < titleNodeList.length; i++) {
        if (titleNodeList[i].querySelector(`.price-boleto`) ) {
          titleLinkArray[i] = {
            title: titleNodeList[i].querySelector('.product-item-photo img').alt.trim(),
            link: titleNodeList[i].querySelector('.product-item-details .product-item-name a').href,
            img: titleNodeList[i].querySelector('.product-item-photo img').src,
            value: titleNodeList[i].querySelector('.price-boleto span').innerText.trim()
          };
        }
      }
      return titleLinkArray;
    });
    await browser.close()
    console.timeEnd('pichauGetter');
    return { retorno: true, data: news, size: news.length };
  } catch (error) {
    Sentry.captureException(error);
    await browser.close()
    console.timeEnd('pichauGetter');
    return { retorno: false, mensage: 'Não foi possivel encontrar um retorno!' };
  }
  await browser.close()
}