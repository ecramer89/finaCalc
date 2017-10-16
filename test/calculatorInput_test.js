import CalculatorInput from "../server/contracts/CalculatorInput"
import assert from 'assert'

describe("test Calculator input", ()=>{
  describe("test constructor", ()=>{
    describe("given valid arguments representing monetary amounts and percentages", ()=>{
      const currentTaxRate = "40.43%"
      const amountInvested = "1245.56$"
      const retirementTaxRate = "20.2556%"
      const investmentGrowthRate = "3.2%"
      const inflationRate = "2%"
      const yearsInvested = "55"

      const testInput = {
        currentTaxRate,
        amountInvested,
        retirementTaxRate,
        investmentGrowthRate,
        inflationRate,
        yearsInvested
      }

      const result = new CalculatorInput(testInput)
      it("should have the currentTaxRate", ()=>{
        assert.strictEqual(result.currentTaxRate, 40.43)
      })
      it("should have the amountInvested", ()=>{
        assert.strictEqual(result.amountInvested, 1245.56)
      })
      it("should have the retirementTaxRate", ()=>{
        assert.strictEqual(result.retirementTaxRate, 20.2556)
      })
      it("should have the investmentGrowthRate", ()=>{
        assert.strictEqual(result.investmentGrowthRate, 3.2)
      })
      it("should have the inflationRate", ()=>{
        assert.strictEqual(result.inflationRate, 2)
      })
      it("should have the yearsInvested", ()=>{
        assert.strictEqual(result.yearsInvested, 55)
      })
    })
    describe("given invalid arguments", ()=>{
      const testInput = {
        currentTaxRate: "nonsense",
        amountInvested: "ghssjsf",
        retirementTaxRate: "dsds",
        investmentGrowthRate: "fsjfjsca",
        inflationRate: "fdjjavvsd",
        yearsInvested: "fkffknddd"
      }

      const result = new CalculatorInput(testInput)
      it("should have null currentTaxRate", ()=>{
        assert.strictEqual(result.currentTaxRate, null)
      })
      it("should have null amountInvested", ()=>{
        assert.strictEqual(result.amountInvested, null)
      })
      it("should have null retirementTaxRate", ()=>{
        assert.strictEqual(result.retirementTaxRate, null)
      })
      it("should have null investmentGrowthRate", ()=>{
        assert.strictEqual(result.investmentGrowthRate, null)
      })
      it("should have null inflationRate", ()=>{
        assert.strictEqual(result.inflationRate, null)
      })
      it("should have null yearsInvested", ()=>{
        assert.strictEqual(result.yearsInvested, null)
      })
    })

    describe("given missing arguments", ()=>{
        describe("fields empty", ()=>{
          const testInput = {
            currentTaxRate: "",
            amountInvested: "",
            retirementTaxRate: "",
            investmentGrowthRate: "",
            inflationRate: "",
            yearsInvested: ""
          }

          const result = new CalculatorInput(testInput)
          it("should have null currentTaxRate", ()=>{
            assert.strictEqual(result.currentTaxRate, null)
          })
          it("should have null amountInvested", ()=>{
            assert.strictEqual(result.amountInvested, null)
          })
          it("should have null retirementTaxRate", ()=>{
            assert.strictEqual(result.retirementTaxRate, null)
          })
          it("should have null investmentGrowthRate", ()=>{
            assert.strictEqual(result.investmentGrowthRate, null)
          })
          it("should have null inflationRate", ()=>{
            assert.strictEqual(result.inflationRate, null)
          })
          it("should have null yearsInvested", ()=>{
            assert.strictEqual(result.yearsInvested, null)
          })
        })

      describe("fields undefined", ()=>{
        const result = new CalculatorInput({})
        it("should have null currentTaxRate", ()=>{
          assert.strictEqual(result.currentTaxRate, null)
        })
        it("should have null amountInvested", ()=>{
          assert.strictEqual(result.amountInvested, null)
        })
        it("should have null retirementTaxRate", ()=>{
          assert.strictEqual(result.retirementTaxRate, null)
        })
        it("should have null investmentGrowthRate", ()=>{
          assert.strictEqual(result.investmentGrowthRate, null)
        })
        it("should have null inflationRate", ()=>{
          assert.strictEqual(result.inflationRate, null)
        })
        it("should have null yearsInvested", ()=>{
          assert.strictEqual(result.yearsInvested, null)
        })
      })
      })
    })
  })

