const uuid = require('uuid/v1');
const moment = require('moment');
const cerberus = require('../../main')
moment.locale('pt-BR');

exports.get = (req, res, next) => {
  console.log("Get All Master");
  res.status(200).send({
    result: 'Ok bb'
  });
};
exports.busca = async (req, res, next) => {
  console.log("Get Busca");
  console.log(req.body.query);
  let request = req.body.query;
  
  const resultado = await Promise.all([
    cerberus.getAmazon(request),
    cerberus.getKabum(request),
    cerberus.getPichau(request),
    cerberus.getTerabyte(request)
  ]);
  res.status(200).send(resultado);
};