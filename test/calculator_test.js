import * as FinancialCalculator from "../server/financialCalculator"
import CalculatorInput from "../server/contracts/CalculatorInput"
import CalculatorOutput, {AccountResults} from "../server/contracts/CalculatorOutput"
import {roundTo} from "../server/util"

import assert from 'assert'
import * as TestData from "./testData"

/*expected results taken from: http://financeformulas.net/Real_Rate_of_Return.html#calcHeader
 * to accommodate rounding and to keep this test independent of my round function, I test correctness of
 * returned value by comparing substrings of the stringified representations of numeric result.
 * */
function compareNumberStrings(expectedNumber, resultGenerator){
  const expectedAsString = (''+expectedNumber)
  const resultSubstring = (''+resultGenerator()).slice(0,expectedAsString.length)
  return resultSubstring === expectedAsString
}

describe("financial calculator test", ()=>{
  describe("test calculate", ()=>{

    describe.only("valid input", ()=>{

      describe("RRSP is the better choice", ()=>{
        const currentTaxRate = 40.34
        const amountInvested = 1225.45
        const retirementTaxRate = 20.12
        const investmentGrowthRate = 5
        const inflationRate = 2
        const yearsInvested = 35

        //stringify to better atch conditions of input coming in from server
        const input = {
          currentTaxRate: `${currentTaxRate}%`,
          amountInvested: `${amountInvested}$`,
          retirementTaxRate: `${retirementTaxRate}%`,
          investmentGrowthRate: `${investmentGrowthRate}%`,
          inflationRate: `${inflationRate}%`,
          yearsInvested: `${yearsInvested}`
        }

        //compute derived fields up here, for ease of reference.

        /*
          I assumed that the server should leave anything that is used as input to a subsequent equation
          unrounded, and then round all the data to show to the client at the end.
          (i.e., computed deposit value is a result but also input to the future value calculation,
          which is input to the withdrawal tax calculation, etc. although I round the future value that is returned to user,
          but left unrounded when provided as input to withdrawal tax calculation.
         */
        const realRateOfReturn = (1+(investmentGrowthRate/100))/(1+(inflationRate/100)) - 1;
        const expectedRRSPAfterTaxUnrounded = amountInvested/(1 - (currentTaxRate/100))
        const expectedRRSPFutureValueUnrounded = expectedRRSPAfterTaxUnrounded * Math.pow(1 + realRateOfReturn, yearsInvested)
        const expectedTSFAFutureValueUnrounded = amountInvested * Math.pow(1 + realRateOfReturn, yearsInvested)
        const expectedRRSPAmountTaxedUnrounded = expectedRRSPFutureValueUnrounded * retirementTaxRate/100 //retirement tax rate
        const expectedRRSPAfterTaxFutureValueUnrounded = expectedRRSPFutureValueUnrounded * (1 - retirementTaxRate/100)
        const result = FinancialCalculator.calculate(new CalculatorInput(input))


        it("should return a CalculatorOutput", ()=>{
          assert.ok(result instanceof CalculatorOutput)
        })

        it("should have an AccountResult for the TSFA", ()=>{
          assert.ok(result.TSFA instanceof AccountResults)
        })

        it("should have an AccountResult for the RRSP", ()=>{
          assert.ok(result.RRSP instanceof AccountResults)
        })

        it("the after tax deposited for the TSFA should equal the amount invested", ()=>{
          assert.strictEqual(result.TSFA.afterTax, amountInvested)
        })

        it("the after tax deposited for the RRSP should be correct",()=>{
            assert.strictEqual(result.RRSP.afterTax, roundTo(expectedRRSPAfterTaxUnrounded,2))
        })

        it("the after tax deposited for the RRSP should be such that the deposit minus the refund," +
          "\ngiven the current tax rate, equals the TSFA deposit", ()=>{
          const {afterTax: RRSPAfterTax} = result.RRSP
          const RRSPRefund = RRSPAfterTax * currentTaxRate/100
          const outOfPocketCost = RRSPAfterTax - RRSPRefund
          assert.strictEqual(roundTo(outOfPocketCost, 2), result.TSFA.afterTax)
        })

        it("the future value of the RRSP is correct", ()=>{
          assert.strictEqual(result.RRSP.futureValue, roundTo(expectedRRSPFutureValueUnrounded,2))
        })

        it("the future value of the TSFA is correct", ()=>{
          assert.strictEqual(result.TSFA.futureValue, roundTo(expectedTSFAFutureValueUnrounded,2))
        })

        it("the amount taxed on withdrawal for the TSFA should be 0", ()=>{
            assert.strictEqual(result.TSFA.amountTaxedOnWithdrawal, 0)
        })

        it("the amount taxed on withdrawal for the RRSP should be the future value times the retirement tax rate", ()=>{
          assert.strictEqual(result.RRSP.amountTaxedOnWithdrawal, roundTo(expectedRRSPAmountTaxedUnrounded,2))
        })

        it("the after tax future value for the TSFA should equal the future value (since withdrawals are not taxed)", ()=>{
          assert.strictEqual(result.TSFA.futureValue, result.TSFA.afterTaxFutureValue)
        })

        it("the after tax future value of the RRSP should match expected", ()=>{
          assert.strictEqual(result.RRSP.afterTaxFutureValue, roundTo(expectedRRSPAfterTaxFutureValueUnrounded,2))
        })

        //check consistency with other results
        it("the after tax future value for the RRSP should equal its future value minus the amount that was taxed", ()=>{
           assert.strictEqual(result.RRSP.afterTaxFutureValue, result.RRSP.futureValue - result.RRSP.amountTaxedOnWithdrawal)
        })

        it("since the tax rate on withdrawal is less than the tax rate on deposit, the RRSP future value should exceed the TSFA", ()=>{
           assert.ok(result.RRSP.afterTaxFutureValue > result.TSFA.afterTaxFutureValue)
        })

      })

      describe("TSFA is the better choice", ()=>{
        const currentTaxRate = 15.21
        const amountInvested = 1225.45
        const retirementTaxRate = 26.23
        const investmentGrowthRate = 5
        const inflationRate = 2
        const yearsInvested = 10

        const input = {
          currentTaxRate: `${currentTaxRate}%`,
          amountInvested: `${amountInvested}$`,
          retirementTaxRate: `${retirementTaxRate}%`,
          investmentGrowthRate: `${investmentGrowthRate}%`,
          inflationRate: `${inflationRate}%`,
          yearsInvested: `${yearsInvested}`
        }

        const realRateOfReturn = (1+(investmentGrowthRate/100))/(1+(inflationRate/100)) - 1;
        const expectedRRSPAfterTaxUnrounded = amountInvested/(1 - (currentTaxRate/100))
        const expectedRRSPFutureValueUnrounded = expectedRRSPAfterTaxUnrounded * Math.pow(1 + realRateOfReturn, yearsInvested)
        const expectedTSFAFutureValueUnrounded = amountInvested * Math.pow(1 + realRateOfReturn, yearsInvested)
        const expectedRRSPAmountTaxedUnrounded = expectedRRSPFutureValueUnrounded * retirementTaxRate/100 //retirement tax rate
        const expectedRRSPAfterTaxFutureValueUnrounded = expectedRRSPFutureValueUnrounded * (1 - retirementTaxRate/100)
        const result = FinancialCalculator.calculate(new CalculatorInput(input))


        it("should return a CalculatorOutput", ()=>{
          assert.ok(result instanceof CalculatorOutput)
        })

        it("should have an AccountResult for the TSFA", ()=>{
          assert.ok(result.TSFA instanceof AccountResults)
        })

        it("should have an AccountResult for the RRSP", ()=>{
          assert.ok(result.RRSP instanceof AccountResults)
        })

        it("the after tax deposited for the TSFA should equal the amount invested", ()=>{
          assert.strictEqual(result.TSFA.afterTax, amountInvested)
        })

        it("the after tax deposited for the RRSP should be correct",()=>{
          assert.strictEqual(result.RRSP.afterTax, roundTo(expectedRRSPAfterTaxUnrounded,2))
        })

        it("the after tax deposited for the RRSP should be such that the deposit minus the refund," +
          "\ngiven the current tax rate, equals the TSFA deposit", ()=>{
          const {afterTax: RRSPAfterTax} = result.RRSP
          const RRSPRefund = RRSPAfterTax * currentTaxRate/100
          const outOfPocketCost = RRSPAfterTax - RRSPRefund
          assert.strictEqual(roundTo(outOfPocketCost, 2), result.TSFA.afterTax)
        })

        it("the future value of the RRSP is correct", ()=>{
          assert.strictEqual(result.RRSP.futureValue, roundTo(expectedRRSPFutureValueUnrounded,2))
        })

        it("the future value of the TSFA is correct", ()=>{
          assert.strictEqual(result.TSFA.futureValue, roundTo(expectedTSFAFutureValueUnrounded,2))
        })

        it("the amount taxed on withdrawal for the TSFA should be 0", ()=>{
          assert.strictEqual(result.TSFA.amountTaxedOnWithdrawal, 0)
        })

        it("the amount taxed on withdrawal for the RRSP should be the future value times the retirement tax rate", ()=>{
          assert.strictEqual(result.RRSP.amountTaxedOnWithdrawal, roundTo(expectedRRSPAmountTaxedUnrounded,2))
        })

        it("the after tax future value for the TSFA should equal the future value (since withdrawals are not taxed)", ()=>{
          assert.strictEqual(result.TSFA.futureValue, result.TSFA.afterTaxFutureValue)
        })

        it("the after tax future value of the RRSP should match expected", ()=>{
          assert.strictEqual(result.RRSP.afterTaxFutureValue, roundTo(expectedRRSPAfterTaxFutureValueUnrounded,2))
        })

        //check consistency with other results
        it("the after tax future value for the RRSP should equal its future value minus the amount that was taxed", ()=>{
          assert.strictEqual(result.RRSP.afterTaxFutureValue, result.RRSP.futureValue - result.RRSP.amountTaxedOnWithdrawal)
        })

        it("since the tax rate on withdrawal is greater than the tax rate on deposit, the TSFA future value should exceed the RRSP", ()=>{
          assert.ok(result.RRSP.afterTaxFutureValue < result.TSFA.afterTaxFutureValue)
        })
      })


      describe("both are equally good", ()=>{
        const currentTaxRate = 6.78
        const amountInvested = 1225.45
        const retirementTaxRate = 6.78
        const investmentGrowthRate = 5
        const inflationRate = 2
        const yearsInvested = 10

        const input = {
          currentTaxRate: `${currentTaxRate}%`,
          amountInvested: `${amountInvested}$`,
          retirementTaxRate: `${retirementTaxRate}%`,
          investmentGrowthRate: `${investmentGrowthRate}%`,
          inflationRate: `${inflationRate}%`,
          yearsInvested: `${yearsInvested}`
        }

        const realRateOfReturn = (1+(investmentGrowthRate/100))/(1+(inflationRate/100)) - 1;
        const expectedRRSPAfterTaxUnrounded = amountInvested/(1 - (currentTaxRate/100))
        const expectedRRSPFutureValueUnrounded = expectedRRSPAfterTaxUnrounded * Math.pow(1 + realRateOfReturn, yearsInvested)
        const expectedTSFAFutureValueUnrounded = amountInvested * Math.pow(1 + realRateOfReturn, yearsInvested)
        const expectedRRSPAmountTaxedUnrounded = expectedRRSPFutureValueUnrounded * retirementTaxRate/100 //retirement tax rate
        const expectedRRSPAfterTaxFutureValueUnrounded = expectedRRSPFutureValueUnrounded * (1 - retirementTaxRate/100)
        const result = FinancialCalculator.calculate(new CalculatorInput(input))


        it("should return a CalculatorOutput", ()=>{
          assert.ok(result instanceof CalculatorOutput)
        })

        it("should have an AccountResult for the TSFA", ()=>{
          assert.ok(result.TSFA instanceof AccountResults)
        })

        it("should have an AccountResult for the RRSP", ()=>{
          assert.ok(result.RRSP instanceof AccountResults)
        })

        it("the after tax deposited for the TSFA should equal the amount invested", ()=>{
          assert.strictEqual(result.TSFA.afterTax, amountInvested)
        })

        it("the after tax deposited for the RRSP should be correct",()=>{
          assert.strictEqual(result.RRSP.afterTax, roundTo(expectedRRSPAfterTaxUnrounded,2))
        })

        it("the after tax deposited for the RRSP should be such that the deposit minus the refund," +
          "\ngiven the current tax rate, equals the TSFA deposit", ()=>{
          const {afterTax: RRSPAfterTax} = result.RRSP
          const RRSPRefund = RRSPAfterTax * currentTaxRate/100
          const outOfPocketCost = RRSPAfterTax - RRSPRefund
          assert.strictEqual(roundTo(outOfPocketCost, 2), result.TSFA.afterTax)
        })

        it("the future value of the RRSP is correct", ()=>{
          assert.strictEqual(result.RRSP.futureValue, roundTo(expectedRRSPFutureValueUnrounded,2))
        })

        it("the future value of the TSFA is correct", ()=>{
          assert.strictEqual(result.TSFA.futureValue, roundTo(expectedTSFAFutureValueUnrounded,2))
        })

        it("the amount taxed on withdrawal for the TSFA should be 0", ()=>{
          assert.strictEqual(result.TSFA.amountTaxedOnWithdrawal, 0)
        })

        it("the amount taxed on withdrawal for the RRSP should be the future value times the retirement tax rate", ()=>{
          assert.strictEqual(result.RRSP.amountTaxedOnWithdrawal, roundTo(expectedRRSPAmountTaxedUnrounded,2))
        })

        it("the after tax future value for the TSFA should equal the future value (since withdrawals are not taxed)", ()=>{
          assert.strictEqual(result.TSFA.futureValue, result.TSFA.afterTaxFutureValue)
        })

        it("the after tax future value of the RRSP should match expected", ()=>{
          assert.strictEqual(result.RRSP.afterTaxFutureValue, roundTo(expectedRRSPAfterTaxFutureValueUnrounded,2))
        })

        //check consistency with other results
        it("the after tax future value for the RRSP should equal its future value minus the amount that was taxed", ()=>{
          assert.strictEqual(result.RRSP.afterTaxFutureValue, result.RRSP.futureValue - result.RRSP.amountTaxedOnWithdrawal)
        })

        it("since the tax rate on withdrawal equals the tax rate on deposit, the TSFA future value should equal the RRSP", ()=>{
          assert.strictEqual(result.RRSP.afterTaxFutureValue, result.TSFA.afterTaxFutureValue)
        })
      })

    })


    function validInputExceptMissing(field){
     return validInputExcept(field, null)
    }

    function validInputExcept(field, badValue){
      const input = {
        ...TestData.validInputBreaksEven,
        [field]: badValue
      }
      return new CalculatorInput(input)
    }


    describe("invalid input", ()=>{

      describe("invalid retirementTaxRate", ()=>{
        const field = "retirementTaxRate"
        describe("missing", ()=>{
          it(`should throw a ${field} is required and must be a number validation error`, ()=>{
            assert.throws(()=>{
                FinancialCalculator.calculate(validInputExceptMissing(field))
              }, err=>{
                const validationErrors = JSON.parse(err.message)
                if(Array.isArray(validationErrors) &&
                  validationErrors.find(validationError=>validationError.field === field && validationError.message === "is required and must be a number.")) return true;
              },
              'unexpected error')
          })
        })
        describe("not a number", ()=>{
          it(`should throw a ${field} is required and must be a number validation error`, ()=>{
            assert.throws(()=>{
                FinancialCalculator.calculate(validInputExcept(field, "sansSkeleton"))
              }, err=>{
                const validationErrors = JSON.parse(err.message)
                if(Array.isArray(validationErrors) &&
                  validationErrors.find(validationError=>validationError.field === field && validationError.message === "is required and must be a number.")) return true;
              },
              'unexpected error')
          })
        })
        describe("exceeds 100", ()=> {
          describe("by decimal", () => {
            it(`should throw a ${field} cannot exceed 100 validation error`, () => {
              assert.throws(() => {
                  FinancialCalculator.calculate(validInputExcept(field, "100.001"))
                }, err => {
                  const validationErrors = JSON.parse(err.message)
                  if (Array.isArray(validationErrors) &&
                    validationErrors.find(validationError => validationError.field === field && validationError.message === "cannot exceed 100.")) return true;
                },
                'unexpected error')
            })
          })
          describe("by integer", () => {
            it(`should throw a ${field} cannot exceed 100 validation error`, () => {
              assert.throws(() => {
                  FinancialCalculator.calculate(validInputExcept(field, "101"))
                }, err => {
                  const validationErrors = JSON.parse(err.message)
                  if (Array.isArray(validationErrors) &&
                    validationErrors.find(validationError => validationError.field === field && validationError.message === "cannot exceed 100.")) return true;
                },
                'unexpected error')
            })
          })
        })
      })

      describe("invalid inflationRate", ()=>{
        const field = "inflationRate"
        describe("missing", ()=>{
          it(`should throw a ${field} is required and must be a number validation error`, ()=>{
            assert.throws(()=>{
                FinancialCalculator.calculate(validInputExceptMissing(field))
              }, err=>{
                const validationErrors = JSON.parse(err.message)
                if(Array.isArray(validationErrors) &&
                  validationErrors.find(validationError=>validationError.field === field && validationError.message === "is required and must be a number.")) return true;
              },
              'unexpected error')
          })
        })
        describe("not a number", ()=>{
          it(`should throw a ${field} is required and must be a number validation error`, ()=>{
            assert.throws(()=>{
                FinancialCalculator.calculate(validInputExcept(field, "sansSkeleton"))
              }, err=>{
                const validationErrors = JSON.parse(err.message)
                if(Array.isArray(validationErrors) &&
                  validationErrors.find(validationError=>validationError.field === field && validationError.message === "is required and must be a number.")) return true;
              },
              'unexpected error')
          })
        })
        describe("exceeds 100", ()=> {
          describe("by decimal", () => {
            it(`should throw a ${field} cannot exceed 100 validation error`, () => {
              assert.throws(() => {
                  FinancialCalculator.calculate(validInputExcept(field, "100.001"))
                }, err => {
                  const validationErrors = JSON.parse(err.message)
                  if (Array.isArray(validationErrors) &&
                    validationErrors.find(validationError => validationError.field === field && validationError.message === "cannot exceed 100.")) return true;
                },
                'unexpected error')
            })
          })
          describe("by integer", () => {
            it(`should throw a ${field} cannot exceed 100 validation error`, () => {
              assert.throws(() => {
                  FinancialCalculator.calculate(validInputExcept(field, "101"))
                }, err => {
                  const validationErrors = JSON.parse(err.message)
                  if (Array.isArray(validationErrors) &&
                    validationErrors.find(validationError => validationError.field === field && validationError.message === "cannot exceed 100.")) return true;
                },
                'unexpected error')
            })
          })
        })
      })

      describe("invalid investmentGrowthRate", ()=>{
        const field = "investmentGrowthRate"
        describe("missing", ()=>{
          it(`should throw a ${field} is required and must be a number validation error`, ()=>{
            assert.throws(()=>{
                FinancialCalculator.calculate(validInputExceptMissing(field))
              }, err=>{
                const validationErrors = JSON.parse(err.message)
                if(Array.isArray(validationErrors) &&
                  validationErrors.find(validationError=>validationError.field === field && validationError.message === "is required and must be a number.")) return true;
              },
              'unexpected error')
          })
        })
        describe("not a number", ()=>{
          it(`should throw a ${field} is required and must be a number validation error`, ()=>{
            assert.throws(()=>{
                FinancialCalculator.calculate(validInputExcept(field, "sansSkeleton"))
              }, err=>{
                const validationErrors = JSON.parse(err.message)
                if(Array.isArray(validationErrors) &&
                  validationErrors.find(validationError=>validationError.field === field && validationError.message === "is required and must be a number.")) return true;
              },
              'unexpected error')
          })
        })
        describe("absolute value exceeds 100", ()=> {
          describe("positive input", () => {
            describe("by decimal", () => {
              it(`should throw a ${field} cannot exceed 100 validation error`, () => {
                assert.throws(() => {
                    FinancialCalculator.calculate(validInputExcept(field, "100.001"))
                  }, err => {
                    const validationErrors = JSON.parse(err.message)
                    if (Array.isArray(validationErrors) &&
                      validationErrors.find(validationError => validationError.field === field && validationError.message === "cannot exceed 100.")) return true;
                  },
                  'unexpected error')
              })
            })
            describe("by integer", () => {
              it(`should throw a ${field} cannot exceed 100 validation error`, () => {
                assert.throws(() => {
                    FinancialCalculator.calculate(validInputExcept(field, "101"))
                  }, err => {
                    const validationErrors = JSON.parse(err.message)
                    if (Array.isArray(validationErrors) &&
                      validationErrors.find(validationError => validationError.field === field && validationError.message === "cannot exceed 100.")) return true;
                  },
                  'unexpected error')
              })
            })
          })
          describe("negative input", () => {
            describe("by decimal", () => {
              it(`should throw a ${field} cannot exceed 100 validation error`, () => {
                assert.throws(() => {
                    FinancialCalculator.calculate(validInputExcept(field, "-100.001"))
                  }, err => {
                    const validationErrors = JSON.parse(err.message)
                    if (Array.isArray(validationErrors) &&
                      validationErrors.find(validationError => validationError.field === field && validationError.message === "cannot exceed 100.")) return true;
                  },
                  'unexpected error')
              })
            })
            describe("by integer", () => {
              it(`should throw a ${field} cannot exceed 100 validation error`, () => {
                assert.throws(() => {
                    FinancialCalculator.calculate(validInputExcept(field, "-101"))
                  }, err => {
                    const validationErrors = JSON.parse(err.message)
                    if (Array.isArray(validationErrors) &&
                      validationErrors.find(validationError => validationError.field === field && validationError.message === "cannot exceed 100.")) return true;
                  },
                  'unexpected error')
              })
            })
          })
        })
      })

      describe("invalid currentTaxRate", ()=>{
        const field = "currentTaxRate"
        describe("missing", ()=>{
          it(`should throw a ${field} is required and must be a number validation error`, ()=>{
            assert.throws(()=>{
              FinancialCalculator.calculate(validInputExceptMissing(field))
            }, err=>{
              const validationErrors = JSON.parse(err.message)
              if(Array.isArray(validationErrors) &&
                validationErrors.find(validationError=>validationError.field === field && validationError.message === "is required and must be a number.")) return true;
            },
              'unexpected error')
          })
        })
        describe("not a number", ()=>{
          it(`should throw a ${field} is required and must be a number validation error`, ()=>{
            assert.throws(()=>{
                FinancialCalculator.calculate(validInputExcept(field, "sansSkeleton"))
              }, err=>{
                const validationErrors = JSON.parse(err.message)
                if(Array.isArray(validationErrors) &&
                  validationErrors.find(validationError=>validationError.field === field && validationError.message === "is required and must be a number.")) return true;
              },
              'unexpected error')
          })
        })
        describe("absolute value exceeds 100", ()=> {
          describe("positive input", () => {
            describe("by decimal", () => {
              it(`should throw a ${field} cannot exceed 100 validation error`, () => {
                assert.throws(() => {
                    FinancialCalculator.calculate(validInputExcept(field, "100.001"))
                  }, err => {
                    const validationErrors = JSON.parse(err.message)
                    if (Array.isArray(validationErrors) &&
                      validationErrors.find(validationError => validationError.field === field && validationError.message === "cannot exceed 100.")) return true;
                  },
                  'unexpected error')
              })
            })
            describe("by integer", () => {
              it(`should throw a ${field} cannot exceed 100 validation error`, () => {
                assert.throws(() => {
                    FinancialCalculator.calculate(validInputExcept(field, "101"))
                  }, err => {
                    const validationErrors = JSON.parse(err.message)
                    if (Array.isArray(validationErrors) &&
                      validationErrors.find(validationError => validationError.field === field && validationError.message === "cannot exceed 100.")) return true;
                  },
                  'unexpected error')
              })
            })
          })
          describe("negative input", () => {
            describe("by decimal", () => {
              it(`should throw a ${field} cannot exceed 100 validation error`, () => {
                assert.throws(() => {
                    FinancialCalculator.calculate(validInputExcept(field, "-100.001"))
                  }, err => {
                    const validationErrors = JSON.parse(err.message)
                    if (Array.isArray(validationErrors) &&
                      validationErrors.find(validationError => validationError.field === field && validationError.message === "cannot exceed 100.")) return true;
                  },
                  'unexpected error')
              })
            })
            describe("by integer", () => {
              it(`should throw a ${field} cannot exceed 100 validation error`, () => {
                assert.throws(() => {
                    FinancialCalculator.calculate(validInputExcept(field, "-101"))
                  }, err => {
                    const validationErrors = JSON.parse(err.message)
                    if (Array.isArray(validationErrors) &&
                      validationErrors.find(validationError => validationError.field === field && validationError.message === "cannot exceed 100.")) return true;
                  },
                  'unexpected error')
              })
            })
          })
        })
      })

      describe("invalid amountInvested", ()=>{
        const field = "amountInvested"
        describe("missing", ()=>{
          it(`should throw a ${field} is required and must be a number validation error`, ()=>{
            assert.throws(()=>{
                FinancialCalculator.calculate(validInputExceptMissing(field))
              }, err=>{
                const validationErrors = JSON.parse(err.message)
                if(Array.isArray(validationErrors) &&
                  validationErrors.find(validationError=>validationError.field === field && validationError.message === "is required and must be a number.")) return true;
              },
              'unexpected error')
          })
        })
        describe("not a number", ()=>{
          it(`should throw a ${field} is required and must be a number validation error`, ()=>{
            assert.throws(()=>{
                FinancialCalculator.calculate(validInputExcept(field, "sansSkeleton"))
              }, err=>{
                const validationErrors = JSON.parse(err.message)
                if(Array.isArray(validationErrors) &&
                  validationErrors.find(validationError=>validationError.field === field && validationError.message === "is required and must be a number.")) return true;
              },
              'unexpected error')
          })
        })
        describe("is negative", ()=>{
          it(`should throw a ${field} cannot be negative validation error.`, ()=>{
            assert.throws(()=>{
                FinancialCalculator.calculate(validInputExcept(field, "-1234.56"))
              }, err=>{
                const validationErrors = JSON.parse(err.message)
                if(Array.isArray(validationErrors) &&
                  validationErrors.find(validationError=>validationError.field === field && validationError.message === "cannot be negative.")) return true;
              },
              'unexpected error')
          })
        })
      })

      describe("invalid yearsInvested", ()=>{
        const field = "yearsInvested"
        describe("missing", ()=>{
          it(`should throw a ${field} is required and must be a number validation error`, ()=>{
            assert.throws(()=>{
                FinancialCalculator.calculate(validInputExceptMissing(field))
              }, err=>{
                const validationErrors = JSON.parse(err.message)
                if(Array.isArray(validationErrors) &&
                  validationErrors.find(validationError=>validationError.field === field && validationError.message === "is required and must be a number.")) return true;
              },
              'unexpected error')
          })
        })
        describe("not a number", ()=>{
          it(`should throw a ${field} is required and must be a number validation error`, ()=>{
            assert.throws(()=>{
                FinancialCalculator.calculate(validInputExcept(field, "sansSkeleton"))
              }, err=>{
                const validationErrors = JSON.parse(err.message)
                if(Array.isArray(validationErrors) &&
                  validationErrors.find(validationError=>validationError.field === field && validationError.message === "is required and must be a number.")) return true;
              },
              'unexpected error')
          })
        })
        describe("is negative", ()=>{
          it(`should throw a ${field} cannot be negative validation error.`, ()=>{
            assert.throws(()=>{
                FinancialCalculator.calculate(validInputExcept(field, "-12"))
              }, err=>{
                const validationErrors = JSON.parse(err.message)
                if(Array.isArray(validationErrors) &&
                  validationErrors.find(validationError=>validationError.field === field && validationError.message === "cannot be negative.")) return true;
              },
              'unexpected error')
          })
        })
      })

    })
  })
  describe("test computeRealRateOfReturn", ()=>{

    describe("nominal is 0", ()=>{
      const nominal = 0

      describe("inflation is positive", ()=>{
       const inflation = .021
        const expected = -.0205
        it("should return expected result", ()=>{
          assert.ok(compareNumberStrings(expected, ()=>FinancialCalculator.computeRealRateOfReturn(nominal,inflation)))
        })
      })

      describe("inflation is 0", ()=>{
        const inflation = 0
        const expected = 0
        it("should return expected result", ()=>{
          assert.strictEqual(FinancialCalculator.computeRealRateOfReturn(nominal,inflation), expected)
        })
      })
    })

    describe("nominal is positive", ()=>{
      const nominal = .023
      describe("inflation is positive, less than nominal", ()=>{
        const inflation = .015
        const expected = .00788
        it("should return expected result", ()=>{
          assert.ok(compareNumberStrings(expected, ()=>FinancialCalculator.computeRealRateOfReturn(nominal,inflation)))
        })
      })
      describe("inflation is positive, equals nominal", ()=>{
        const inflation = nominal
        const expected = 0
        it("should return expected result", ()=>{
          assert.ok(compareNumberStrings(expected, ()=>FinancialCalculator.computeRealRateOfReturn(nominal,inflation)))
        })
      })
      describe("inflation is positive, greater than nominal", ()=>{
        const inflation = .031
        const expected = -.00775 //the online calculator that I used rounded the values up to 3 decimal places. I leave the values unrounded until finishing all of the calculations.
        //in order to test that funtion returns roughly the same result, I check that the real output matches the first 3 digits (of the percentage representation) assuming that the
        //web browser output did not round.
        it("should return expected result", ()=>{
          assert.ok(compareNumberStrings(expected, ()=>FinancialCalculator.computeRealRateOfReturn(nominal,inflation)))
        })
      })
      describe("inflation is 0", ()=>{
        const inflation = 0
        const expected = .022
        it("should return expected result", ()=>{
          assert.ok(compareNumberStrings(expected, ()=>FinancialCalculator.computeRealRateOfReturn(nominal,inflation)))
        })

      })
    })

      //do not bother retesting all combinations with nominal; just ensure negative inputs are allowed.
      describe("inflation is negative", ()=>{
        const nominal = .025
        const inflation = -.036
        const expected = .063
        it("should return expected result", ()=>{
          assert.ok(compareNumberStrings(expected, ()=>FinancialCalculator.computeRealRateOfReturn(nominal,inflation)))
        })

      })

      describe("nominal is negative", ()=>{
        const inflation = .025
        const nominal = -.036
        const expected = -.0595
        it("should return expected result", ()=>{
          assert.ok(compareNumberStrings(expected, ()=>FinancialCalculator.computeRealRateOfReturn(nominal,inflation)))
        })
      })

  })

  /*expected values taken from: http://financeformulas.net/Future_Value.html#calcHeader */
  describe("test computeFutureValue", ()=>{

    describe("after tax is positive", ()=>{
      const afterTax = 856.79
      describe("rate of return is negative", ()=>{
        const rateOfReturn = -.045
        describe("years invested is 0", ()=>{
          const yearsInvested = 0
          const expected = 856.79
          it("should return the correct result", ()=>{
            assert.ok(compareNumberStrings(expected, ()=>FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested)))
          })
        })
        describe("years invested is positive", ()=>{
          const yearsInvested = 55
          const expected = 68.08
          it("should return the correct result", ()=>{
            assert.ok(compareNumberStrings(expected, ()=>FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested)))
          })
        })
      })

      describe("rate of return is positive", ()=>{
        const rateOfReturn = .045
        describe("years invested is 0", ()=>{
          const yearsInvested = 0
          const expected = 856.79
          it("should return the correct result", ()=>{
            assert.ok(compareNumberStrings(expected, ()=>FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested)))
          })
        })
        describe("years invested is positive", ()=>{
          const yearsInvested = 55
          const expected = 9644.29
          it("should return the correct result", ()=>{
            assert.ok(compareNumberStrings(expected, ()=>FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested)))
          })
        })
      })

      describe("rate of return is 0", ()=>{
        const rateOfReturn = 0
        describe("years invested is 0", ()=>{
          const yearsInvested = 0
          const expected = 856.79
          it("should return the correct result", ()=>{
            assert.ok(compareNumberStrings(expected, ()=>FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested)))
          })
        })
        describe("years invested is positive", ()=>{
          const yearsInvested = 55
          const expected = 856.79
          it("should return the correct result", ()=>{
            assert.ok(compareNumberStrings(expected, ()=>FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested)))
          })
        })
      })
    })


    describe("after tax is 0", ()=>{
      const afterTax = 0
      describe("rate of return is negative", ()=>{
         const rateOfReturn = -.045
        describe("years invested is 0", ()=>{
          const yearsInvested = 0
          const expected = 0
          it("should return the correct result", ()=>{
            assert.strictEqual(FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested), expected)
          })
        })
        describe("years invested is positive", ()=>{
          const yearsInvested = 55
          const expected = 0
          it("should return the correct result", ()=>{
            assert.strictEqual(FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested), expected)
          })
        })
      })

      describe("rate of return is positive", ()=>{
        const rateOfReturn = .045
        describe("years invested is 0", ()=>{
          const yearsInvested = 0
          const expected = 0
          it("should return the correct result", ()=>{
            assert.strictEqual(FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested), expected)
          })
        })
        describe("years invested is positive", ()=>{
          const yearsInvested = 55
          const expected = 0
          it("should return the correct result", ()=>{
            assert.strictEqual(FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested), expected)
          })
        })
      })

      describe("rate of return is 0", ()=>{
        const rateOfReturn = 0
        describe("years invested is 0", ()=>{
          const yearsInvested = 0
          const expected = 0
          it("should return the correct result", ()=>{
            assert.strictEqual(FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested), expected)
          })
        })
        describe("years invested is positive", ()=>{
          const yearsInvested = 55
          const expected = 0
          it("should return the correct result", ()=>{
            assert.strictEqual(FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested), expected)
          })
        })
      })
    })

  })

})