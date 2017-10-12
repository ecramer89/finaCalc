const {toNumber} = require("../util")

class CalculatorInput{
  constructor(data){
    this.currentTaxRate = toNumber(data.currentTaxRate);
    this.amountInvested = toNumber(data.amountInvested)
    this.retirementTaxRate = toNumber(data.retirementTaxRate);
    this.investmentGrowthRate = toNumber(data.investmentGrowthRate);
    this.inflationRate = toNumber(data.inflationRate);
    this.yearsInvested = toNumber(data.yearsInvested)

  }
}

module.exports = CalculatorInput