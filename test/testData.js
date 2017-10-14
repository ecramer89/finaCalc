import CalculatorInput from "../server/contracts/CalculatorInput"

const validInputBreaksEven = {
  currentTaxRate: "44.50",
  amountInvested: "1500.50",
  retirementTaxRate: "45.50",
  investmentGrowthRate: ".05",
  inflationRate: "2",
  yearsInvested: "50"
}

export function validInputExceptMissing(field){
  return validInputExcept(field, null)
}

export function validInputExcept(field, badValue){
  const input = {
    ...validInputBreaksEven,
    [field]: badValue
  }
  return new CalculatorInput(input)
}

