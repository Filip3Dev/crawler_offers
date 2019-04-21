const assert = require('chai').assert
const amazon = require('../crawlers/amazon')


describe('Amazon Query', () => {

  it('Tamanho do retorno da Amazon', () => {
    getAmazon = async () => {
      const amazon_retorno = await amazon.amazonGetter('xiaomi+mi+a2')
      assert.lengthOf(amazon_retorno.data, 10);
    }
  });
  it('Requisição válida e título do livro', () => {
    const VALUE = 'galaxy+s9';

    amazon.amazonGetter(VALUE)
    .then((retorno) => {
      return assert.equal(retorno.retorno, true);
    });
  });
});