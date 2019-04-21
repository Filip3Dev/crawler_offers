const puppeteer = require('puppeteer')
const Sentry = require('@sentry/node');

exports.teraByteGetter = async (parame) => {
  console.time('teraByteGetter');
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
  await page.goto(`https://www.terabyteshop.com.br/busca?str=${parame}`, { waitUntil: 'networkidle2' })
  await page.waitForSelector(".commerce_columns_item_image img");
  try {
    const news = await page.evaluate(() => {
      const titleNodeList = document.querySelectorAll('#prodarea .pbox');
      const titleLinkArray = [];

      for (var i = 0; i < titleNodeList.length; i++) {
        if (titleNodeList[i].querySelector('.commerce_columns_item_info .prod-new-price span')) {
          titleLinkArray[i] = {
            title: titleNodeList[i].querySelector('.commerce_columns_item_image a').title.trim(),
            link: titleNodeList[i].querySelector('.commerce_columns_item_image a').href,
            img: titleNodeList[i].querySelector('.commerce_columns_item_image img').src,
            value: titleNodeList[i].querySelector('.commerce_columns_item_info .prod-new-price span').innerText.trim()
          };
        }
      }
      return titleLinkArray;
    });
    await browser.close()
    console.timeEnd('teraByteGetter');
    return { retorno: true, data: news, size: news.length };
  } catch (error) {
    Sentry.captureException(error);
    await browser.close()
    console.timeEnd('teraByteGetter');
    return { retorno: false, mensage: 'Não foi possivel encontrar um retorno!' };
  }
  await browser.close()
}