const amazon = require('./crawlers/amazon')
const kabum = require('./crawlers/kabum')
const pichau = require('./crawlers/pichau')
const terabyte = require('./crawlers/terabyte')

exports.getAmazon = async (search) => {
  const amazon_retorno = await amazon.amazonGetter(search)
  return amazon_retorno;
}

exports.getKabum = async (search) => {
  const kabum_retorno = await kabum.kabumGetter(search)
  return  kabum_retorno;
}

exports.getPichau = async (search) => {
  const pichau_retorno = await pichau.pichauGetter(search)
  return  pichau_retorno;
}
exports.getTerabyte = async (search) => {
  const terabyte_retorno = await terabyte.teraByteGetter(search)
  return  terabyte_retorno;
}