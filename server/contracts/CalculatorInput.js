import {toNumber} from "../util"

export default class CalculatorInput{
  constructor({currentTaxRate,amountInvested,retirementTaxRate,investmentGrowthRate,inflationRate,yearsInvested}){
    this.currentTaxRate = toNumber(currentTaxRate);
    this.amountInvested = toNumber(amountInvested)
    this.retirementTaxRate = toNumber(retirementTaxRate);
    this.investmentGrowthRate = toNumber(investmentGrowthRate);
    this.inflationRate = toNumber(inflationRate);
    this.yearsInvested = toNumber(yearsInvested)

  }
}

