function calculate(req, res){
    const input = new CalculatorInput(req.body)
  try {
    validate(input)
    const result = {
      TSFA: computeTSFA(input),
      RRSP: computeRRSP(input)
    }
    res.send(result)
  }catch(validationError){
      res.status().send(validationError)
  }
}

function computeTSFA(input){
  return 5
}

function computeRRSP(input){
 return 6
}

function validate(){
  //check iffields null; if fields are numeric values, if fields are decimals within expected rate, etc.
  var validationErrors = []
  //validate each field
}

class CalculatorInput{
  constructor(data){
    this.currRate = data.currRate || null
    this.amount = data.amount || null
    this.retireRate = data.retireRate || null
    this.growthRate = data.growthRate || null
    this.inflationRate = data.inflationRate || null
  }
}


module.exports = calculate;
