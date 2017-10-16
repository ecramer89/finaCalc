export default class CalculatorOutput{
  /*
   @param {AccountResults} TSFA
   @param {AccountResults} RRSP
   @param {string} betterAccount name (TSFA or RRSP) of account with greater future value; either if have the same future value.
   */
  constructor({TSFA, RRSP, betterAccount}){
     this.TSFA = TSFA ? new AccountResults(TSFA) : null,
     this.RRSP = RRSP ? new AccountResults(RRSP) : null
     this.betterAccount = betterAccount
  }
}

const BIG_NUMBER="Too big to count"

export class AccountResults{
  /*
   @param {number} afterTax
   @param {number} futureValue
   @param {number} amountTaxedOnWithdrawal
   @param {number} afterTaxFutureValue
   */
  constructor({afterTax,futureValue,amountTaxedOnWithdrawal,afterTaxFutureValue}){
      //arguments come from server, so don't require input checking.
      //substitute Number.POSITIVE_INFINITY for string "Infinity" because
      //Number.POSITIVE_INFINITY becomes 'null' when it hits the client.
      this.afterTax = Number.isFinite(afterTax)? afterTax : BIG_NUMBER
      this.futureValue = Number.isFinite(futureValue) ? futureValue : BIG_NUMBER
      this.amountTaxedOnWithdrawal = Number.isFinite(amountTaxedOnWithdrawal) ? amountTaxedOnWithdrawal : BIG_NUMBER
      this.afterTaxFutureValue = Number.isFinite(afterTaxFutureValue) ? afterTaxFutureValue : BIG_NUMBER
  }
}

