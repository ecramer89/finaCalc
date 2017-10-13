import {toNumber} from "../util"
/**
 * constructor
 * @param {number} (or string representation of number) currentTaxRate tax rate expressed as percentage. % okay but not necessary. - values accepted.
 * @param {number} (or string representation of number) amountInvested. Must be positive. $ ok but not necessary.
 * @param {number} (or string representation of number) retirementTaxRate tax rate expressed as percentage. % okay but not necessary. - values accepted.
 * @param {number} (or string representation of number) investmentGrowthRate expressed as percentage. % okay but not necessary. - values accepted.
 * @param {number} (or string representation of number) inflationRate expressed as percentage. % okay but not necessary. - values accepted.
 * @param {number} (or string representation of number) yearsInvested. Must be positive.
 */
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

