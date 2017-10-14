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

var _CalculatorInput = require("./contracts/CalculatorInput");

var _CalculatorInput2 = _interopRequireDefault(_CalculatorInput);

var _CalculatorOutput = require("./contracts/CalculatorOutput");

var _CalculatorOutput2 = _interopRequireDefault(_CalculatorOutput);

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handler(req, res) {
  try {
    var result = calculate(new _CalculatorInput2.default(req.body));
    res.send(result); //may cause an error if we iterate over-- a class?
  } catch (error) {
    res.status(400).send(error.message);
  }
}

/*
  @param {CalculatorInput} input
 */
function calculate(calculatorInput) {
  validate(calculatorInput);
  return new _CalculatorOutput2.default({
    TSFA: computeTSFA(calculatorInput),
    RRSP: computeRRSP(calculatorInput)
  });
}

/*
@param {CalculatorInput} input
 */
function validate(input) {
  var validationErrors = [];
  for (var field in input) {
    if (!input.hasOwnProperty(field)) continue; //only interested in fields defined on CalculatorInput class.
    var value = input[field];
    if (value === null) {
      //strict check on null because 0 is allowed.
      validationErrors.push({ field: field, message: "is required and must be a number." });
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

/*
 @param {CalculatorInput} input
 */
function computeTSFA(input) {
  return composeResults(input, function (amountInvested) {
    return amountInvested;
  }, function () {
    return 0;
  });
}

/*
 @param {CalculatorInput} input
 */
function computeRRSP(input) {
  return composeResults(input, function (amountInvested, taxRate) {
    return amountInvested / (1 - taxRate);
  }, function (amount, taxRate) {
    return amount * taxRate;
  });
}

/*
 @param {CalculatorInput} input
 @param {function(number, number)=>number} computeAfterTax
 @param {function(number, number)=>number} computeAmountTaxedOnWithdrawal
 */
function composeResults(input, computeAfterTax, computeAmountTaxedOnWithdrawal) {
  var nominalRateOfReturn = input.investmentGrowthRate / 100;
  var inflationRate = input.inflationRate / 100;

  var afterTax = computeAfterTax(input.amountInvested, input.currentTaxRate / 100);

  var rateOfReturn = computeRealRateOfReturn(nominalRateOfReturn, inflationRate);

  var futureValue = computeFutureValue(afterTax, rateOfReturn, input.yearsInvested);

  var amountTaxedOnWithdrawal = computeAmountTaxedOnWithdrawal(futureValue, input.retirementTaxRate / 100);

  var afterTaxFutureValue = futureValue - amountTaxedOnWithdrawal;

  //all computations done internally on unrounded values; results rounded at end for reporting to user at end of investment period.
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