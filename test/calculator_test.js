import * as FinancialCalculator from "../server/financialCalculator"
import assert from 'assert'
import * as TestData from "./testData"

describe("financial calculator test", ()=>{
  describe("test calculate", ()=>{


    //each of these should result in the expected outcomes
    describe("valid input", ()=>{

    })



    //each of these should throw a validation error.
    /*
    test: negative inputs for rates are okay
    but no rate can exceed 100
    years and amount invested cant be negative


     currentTaxRate,amountInvested,retirementTaxRate,investmentGrowthRate,inflationRate,yearsInvested
     */
    function validInputExceptMissing(field){
      const input = {
        ...TestData.validInputBreaksEven,
        field: null
      }

      return input

    }


    describe.only("invalid input", ()=>{

      describe("invalid currentTaxRate", ()=>{
        const field = "currentTaxRate"
        describe("missing", ()=>{
          it("should throw a currentTaxRate is required validation error", ()=>{
            assert.throws(()=>{
              FinancialCalculator.calculate(validInputExceptMissing(field))
            }, err=>{
              const message = JSON.parse(err)
              if(message && message.find(validationError=>validationError.field === field && validationError.message === "is required.")) return true;
            }, 'unexpected error')
          })
        })
        describe("not a number", ()=>{

        })

      })

    })

  })

  describe("test computeTSFA", ()=>{

    const expectedResult = {

    }

  })

  describe("test computeRRSP", ()=>{

  })

  /*expected results taken from: http://financeformulas.net/Real_Rate_of_Return.html#calcHeader
   * to accommodate rounding and to keep this test independent of my round function, I test correctness of
   * returned value by comparing substrings of the stringified representations of numeric result.
   * */
  function compareNumberStrings(expectedNumber, resultGenerator){
      const expectedAsString = (''+expectedNumber)
      const resultSubstring = (''+resultGenerator()).slice(0,expectedAsString.length)
      return resultSubstring === expectedAsString
  }


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