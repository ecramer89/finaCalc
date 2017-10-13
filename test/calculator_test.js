import * as FinancialCalculator from "../server/financialCalculator"
import assert from 'assert'
import * as TestData from "./testData"

describe("financial calculator test", ()=>{
  describe("test calculate", ()=>{


    //each of these should result in the expected outcomes
    describe("valid input", ()=>{

    })



    //each of these should throw a validation error.
    describe("invalid input", ()=>{

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
  describe("test computeRealRateOfReturn", ()=>{

    describe("nominal is 0", ()=>{
      const nominal = 0

      describe("inflation is positive", ()=>{
       const inflation = .021
        const expected = -.0205
        it("should return expected result", ()=>{
          const expectedAsString = (''+expected)
          const resultSubstring = (''+FinancialCalculator.computeRealRateOfReturn(nominal,inflation)).slice(0,expectedAsString.length)
          assert.equal(resultSubstring,expectedAsString)
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
          const expectedAsString = (''+expected)
          const resultSubstring = (''+FinancialCalculator.computeRealRateOfReturn(nominal,inflation)).slice(0,expectedAsString.length)
          assert.equal(resultSubstring,expectedAsString)
        })
      })
      describe("inflation is positive, equals nominal", ()=>{
        const inflation = nominal
        const expected = 0
        it("should return expected result", ()=>{
          const expectedAsString = (''+expected)
          const resultSubstring = (''+FinancialCalculator.computeRealRateOfReturn(nominal,inflation)).slice(0,expectedAsString.length)
          assert.equal(resultSubstring,expectedAsString)
        })
      })
      describe("inflation is positive, greater than nominal", ()=>{
        const inflation = .031
        const expected = -.00775 //the online calculator that I used rounded the values up to 3 decimal places. I leave the values unrounded until finishing all of the calculations.
        //in order to test that funtion returns roughly the same result, I check that the real output matches the first 3 digits (of the percentage representation) assuming that the
        //web browser output did not round.
        it("should return expected result", ()=>{
          const expectedAsString = (''+expected)
          const resultSubstring = (''+FinancialCalculator.computeRealRateOfReturn(nominal,inflation)).slice(0,expectedAsString.length)
          assert.equal(resultSubstring,expectedAsString)
        })
      })
      describe("inflation is 0", ()=>{
        const inflation = 0
        const expected = .022
        it("should return expected result", ()=>{
          const expectedAsString = (''+expected)
          const resultSubstring = (''+FinancialCalculator.computeRealRateOfReturn(nominal,inflation)).slice(0,expectedAsString.length)
          assert.equal(resultSubstring,expectedAsString)
        })

      })
    })

      //do not bother retesting all combinations with nominal; just ensure negative inputs are allowed.
      describe("inflation is negative", ()=>{
        const nominal = .025
        const inflation = -.036
        const expected = .063
        it("should return expected result", ()=>{
          const expectedAsString = (''+expected)
          const resultSubstring = (''+FinancialCalculator.computeRealRateOfReturn(nominal,inflation)).slice(0,expectedAsString.length)
          assert.equal(resultSubstring,expectedAsString)
        })

      })

      describe("nominal is negative", ()=>{
        const inflation = .025
        const nominal = -.036
        const expected = -.0595
        it("should return expected result", ()=>{
          const expectedAsString = (''+expected)
          const resultSubstring = (''+FinancialCalculator.computeRealRateOfReturn(nominal,inflation)).slice(0,expectedAsString.length)
          assert.equal(resultSubstring,expectedAsString)
        })
      })

  })

  describe("test computeFutureValue", ()=>{
//afterTax,rateOfReturn,yearsInvested

  })





})