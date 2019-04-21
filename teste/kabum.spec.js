const assert = require('chai').assert
const kabum = require('../crawlers/kabum')


describe('Kabum Query', () => {

  it('Tamanho do retorno da Kabum', () => {
    getKabum = async () => {
      const kabum_retorno = await kabum.kabumGetter('ssd')
      assert.lengthOf(kabum_retorno.data, 10);
    }
  });
  it('Requisição válida retorno True', () => {
    const VALUE = 'memoria';

    kabum.kabumGetter(VALUE)
      .then((retorno) => {
        return assert.equal(retorno.retorno, true);
      });
  });
});