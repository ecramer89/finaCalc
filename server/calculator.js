function calculate(req, res){
    const input = req.body
  try {
    validate(input)
    res.send({TSFA: 1234.45, RRSP: 2345.23})
  }catch(validationError){
      res.status().send(validationError)
  }
}

function validate(){
  var validationErrors = []
  //validate each field
}


module.exports = calculate;
