"use strict";

var CalculatorInput = require("./contracts/CalculatorInput");

var _require = require("./util"),
    roundTo = _require.roundTo,
    percentageToDecimal = _require.percentageToDecimal;

function calculate(req, res) {
  var input = new CalculatorInput(req.body);
  try {
    validate(input);
    var result = {
      TSFA: computeTSFA(input),
      RRSP: computeRRSP(input)
    };
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

function computeRealRateOfReturn(nominalRateOfReturn, inflationRate) {
  return (1 + nominalRateOfReturn) / (1 + inflationRate) - 1;
}

function computeFutureValue(afterTax, rateOfReturn, yearsInvested) {
  return afterTax * Math.pow(1 + rateOfReturn, yearsInvested);
}

function compute(input, computeAfterTax, computeAmountTaxedOnWithdrawal) {
  var nominalRateOfReturn = percentageToDecimal(input.investmentGrowthRate);
  var inflationRate = percentageToDecimal(input.inflationRate);
  var yearsInvested = input.yearsInvested;

  var afterTax = computeAfterTax(input.amountInvested, percentageToDecimal(input.currentTaxRate));

  var rateOfReturn = computeRealRateOfReturn(nominalRateOfReturn, inflationRate);

  var futureValue = computeFutureValue(afterTax, rateOfReturn, yearsInvested);

  var amountTaxedOnWithdrawal = computeAmountTaxedOnWithdrawal(futureValue, percentageToDecimal(input.retirementTaxRate));

  var afterTaxFutureValue = futureValue - amountTaxedOnWithdrawal;

  return {
    afterTax: roundTo(afterTax, 2),
    futureValue: roundTo(futureValue, 2),
    amountTaxedOnWithdrawal: roundTo(amountTaxedOnWithdrawal, 2),
    afterTaxFutureValue: roundTo(afterTaxFutureValue, 2)
  };
}

function deductTaxFromAmount(amount, taxRate) {
  return amount * (1 - taxRate);
}

function computeTaxDeducted(amount, taxRate) {
  return amount * taxRate;
}

function computeTSFA(input) {
  return compute(input, deductTaxFromAmount, function () {
    return 0;
  });
}

function computeRRSP(input) {
  return compute(input, function (amountInvested) {
    return amountInvested;
  }, computeTaxDeducted);
}

function validate(input) {
  var validationErrors = [];
  for (var field in input) {
    var value = input[field];
    if (value === null) {
      //strict check on null because 0 is allowed.
      validationErrors.push({ field: field, message: "is required." });
    } else {
      switch (field) {
        case "currentTaxRate":
        case "retirementTaxRate":
        case "inflationRate":
        case "investmentGrowthRate":
          if (value < 0 || value > 100) {
            validationErrors.push({ field: field, message: "must be a valid percentage (between 0 and 100)" });
          }
          break;
        case "amountInvested":
        case "yearsInvested":
          if (value < 0) {
            validationErrors.push({ field: field, message: "cannot be negative." });
          }
      }
    }
  }

  if (validationErrors.length > 0) throw new Error(JSON.stringify(validationErrors));
}

module.exports = {
  calculate: calculate,
  //these are exported for testing purposes; not because they should be generally shared.
  validate: validate,
  computeRRSP: computeRRSP,
  computeTSFA: computeTSFA
};