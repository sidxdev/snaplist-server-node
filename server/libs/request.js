// Check for required parameters else display generic return message
// param: String[]
// mes: String
exports.parametersExist = function(params, mes, req, res) {
  var errMes = [];
  for(index in params) {
    if(!req.body.hasOwnProperty(params[index])) {
      errMes.push(params[index]);
    }
  }
  if(errMes.length != 0) {
      var err = JSON.stringify(errMes).replace(/\"/g,"");
      res.json({"err" : mes + err});
      return false;
  }
  return true;
}

module.exports = exports;
