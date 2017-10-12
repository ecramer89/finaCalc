import CalculatorInput from "../server/contracts/CalculatorInput"

export const validInputBreaksEven = new CalculatorInput({
  currentTaxRate: "44.50",
  amountInvested: "1500.50",
  retirementTaxRate: "45.50",
  investmentGrowthRate: ".05",
  inflationRate: "2",
  yearsInvested: "50"
})
export const validInputRRSPBetter = new CalculatorInput({
  currentTaxRate: "44.50",
  amountInvested: "1500.50",
  retirementTaxRate: "20.50",
  investmentGrowthRate: ".05",
  inflationRate: "2",
  yearsInvested: "50"
})

export const validInputTSFABetter = new CalculatorInput({
  currentTaxRate: "20",
  amountInvested: "1500.50",
  retirementTaxRate: "40",
  investmentGrowthRate: ".05",
  inflationRate: "2",
  yearsInvested: "20"
})