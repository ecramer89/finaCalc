"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = handler;
exports.calculate = calculate;
exports.computeTSFA = computeTSFA;
exports.computeRRSP = computeRRSP;
exports.composeResults = composeResults;
exports.computeRealRateOfReturn = computeRealRateOfReturn;
exports.computeFutureValue = computeFutureValue;
exports.deductTaxFromAmount = deductTaxFromAmount;
exports.computeTaxDeducted = computeTaxDeducted;

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

function validate(input) {
  var validationErrors = [];
  for (var field in input) {
    if (!input.hasOwnProperty(field)) continue; //only interested in fields defined on CalculatorInput class.
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
          if (Math.abs(value) > 100) {
            validationErrors.push({ field: field, message: "cannot exceed 100." });
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

function computeTSFA(input) {
  return composeResults(input, deductTaxFromAmount, function () {
    return 0;
  });
}

function computeRRSP(input) {
  return composeResults(input, function (amountInvested) {
    return amountInvested;
  }, computeTaxDeducted);
}

function composeResults(input, computeAfterTax, computeAmountTaxedOnWithdrawal) {
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
/*
 * @param {number} nominalRateOfReturn expressed as a decimal.
 * @param {number} inflationRate expressed as a decimal.
 * */
function computeRealRateOfReturn(nominalRateOfReturn, inflationRate) {
  return (1 + nominalRateOfReturn) / (1 + inflationRate) - 1;
}

/*
 * @param {number} taxRate expressed as a decimal.
 * @param {number} rateOfReturn expressed as a decimal
 * @param {number} years investment period in years.
 * */
function computeFutureValue(afterTax, rateOfReturn, yearsInvested) {
  return afterTax * Math.pow(1 + rateOfReturn, yearsInvested);
}

/*returns the 'afterTax' value of amount, applying given tax rate
* @param {number} amount amout of money
* @param {number} taxRate expressed as a decimal.
* */
function deductTaxFromAmount(amount, taxRate) {
  return amount * (1 - taxRate);
}

/*return the amount of tax that would have to be paid on amount, given taxRate
 * @param {number} amount amount of money
 * @param {number} taxRate expressed as a decimal.
 * */
function computeTaxDeducted(amount, taxRate) {
  return amount * taxRate;
}