"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = handler;
exports.calculate = calculate;
exports.computeRealRateOfReturn = computeRealRateOfReturn;
exports.computeFutureValue = computeFutureValue;
exports.composeComputations = composeComputations;
exports.deductTaxFromAmount = deductTaxFromAmount;
exports.computeTaxDeducted = computeTaxDeducted;
exports.computeTSFA = computeTSFA;
exports.computeRRSP = computeRRSP;
exports.validate = validate;

var _CalculatorInput = require("./contracts/CalculatorInput");

var _CalculatorInput2 = _interopRequireDefault(_CalculatorInput);

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handler(req, res) {
  try {
    var result = calculate(new _CalculatorInput2.default(req.body));
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

function calculate(calculatorInput) {
  validate(calculatorInput);
  return {
    TSFA: computeTSFA(calculatorInput),
    RRSP: computeRRSP(calculatorInput)
  };
}

function computeRealRateOfReturn(nominalRateOfReturn, inflationRate) {
  return (1 + nominalRateOfReturn) / (1 + inflationRate) - 1;
}

function computeFutureValue(afterTax, rateOfReturn, yearsInvested) {
  return afterTax * Math.pow(1 + rateOfReturn, yearsInvested);
}

function composeComputations(input, computeAfterTax, computeAmountTaxedOnWithdrawal) {
  var nominalRateOfReturn = (0, _util.percentageToDecimal)(input.investmentGrowthRate);
  var inflationRate = (0, _util.percentageToDecimal)(input.inflationRate);
  var yearsInvested = input.yearsInvested;

  var afterTax = computeAfterTax(input.amountInvested, (0, _util.percentageToDecimal)(input.currentTaxRate));

  var rateOfReturn = computeRealRateOfReturn(nominalRateOfReturn, inflationRate);

  var futureValue = computeFutureValue(afterTax, rateOfReturn, yearsInvested);

  var amountTaxedOnWithdrawal = computeAmountTaxedOnWithdrawal(futureValue, (0, _util.percentageToDecimal)(input.retirementTaxRate));

  var afterTaxFutureValue = futureValue - amountTaxedOnWithdrawal;

  return {
    afterTax: (0, _util.roundTo)(afterTax, 2),
    futureValue: (0, _util.roundTo)(futureValue, 2),
    amountTaxedOnWithdrawal: (0, _util.roundTo)(amountTaxedOnWithdrawal, 2),
    afterTaxFutureValue: (0, _util.roundTo)(afterTaxFutureValue, 2)
  };
}

function deductTaxFromAmount(amount, taxRate) {
  return amount * (1 - taxRate);
}

function computeTaxDeducted(amount, taxRate) {
  return amount * taxRate;
}

function computeTSFA(input) {
  return composeComputations(input, deductTaxFromAmount, function () {
    return 0;
  });
}

function computeRRSP(input) {
  return composeComputations(input, function (amountInvested) {
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