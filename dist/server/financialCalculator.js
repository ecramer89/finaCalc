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
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

/*
  @param {CalculatorInput} input
  @return {CalculatorOutput}
  throws error if validation on calculatorInput fails.
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
 throws error if validation on calculatorInput fails.
 */
function validate(input) {
  var validationErrors = [];
  for (var field in input) {
    if (!input.hasOwnProperty(field)) continue; //only interested in fields defined on CalculatorInput class.
    var value = input[field];
    if (value === null) {
      //strict check on null because 0 is acceptable value.
      validationErrors.push({ field: field, message: "is required and must be a number." });
    } else {
      switch (field) {
        case "currentTaxRate":
          if (value === 100) {
            validationErrors.push({ field: field, message: "cannot be 100% because then you would have no after-tax to invest in the TSFA." });
          }
          if (Math.abs(value) > 100) {
            validationErrors.push({ field: field, message: "cannot exceed 100." });
          }
          break;
        case "retirementTaxRate":
        case "inflationRate":
        case "investmentGrowthRate":
          if (Math.abs(value) > 100) {
            //since 'deflation', tax benefits, can result in negative rates, negatives are permissable and must check that abs. value doesn't exceed 100.
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
 @return {AccountResults}
 */
function computeTSFA(input) {
  return composeResults(input, function (amountInvested) {
    return amountInvested;
  }, //TSFA deposits made with after-tax dollars, so net cost is just the amount the user invests
  function () {
    return 0;
  } //TSFA withdrawals are not taxed, so the tax on withdrawal is just 0.
  );
}

/*
 @param {CalculatorInput} input
 @return {AccountResults}
 */
function computeRRSP(input) {
  return composeResults(input, function (amountInvested, taxRate) {
    return amountInvested / (1 - taxRate);
  }, //for the comparison to work, need to equate the -net cost to user- of depositing to the TSFA and RRSP. Because the net cost to user for the TSFA deposit equals the amount invested,
  //need to adjust amount deposited into RRSP so that (taking the deducted refund into account) the net out of pocket cost to user equals the TSFA deposit.
  /*
  (small justification for why this value- the required after tax RRSP deposit- equals amountInvested/(1-taxRate))
   RRSPNetCost(amountInvested) = afterTaxDeposit - taxRate*afterTaxDeposit (since they receive the refund on the deposit)
   want RRSPNetCost(amountInvested) = TSFANetCost(amountInvested) = amountInvested (from the input field)
   substituting "afterTaxDeposit" for amountInvested/(1-taxRate):
    amountInvested/(1-taxRate) - amountInvested/(1-taxRate)*taxRate =
   amountInvested - amountInvested*taxRate/(1-taxRate) =
   amountInvested(1-taxRate)/(1-taxRate) =
   amountInvested =
   TSFANetCost(amountInvested)
   */
  function (amount, taxRate) {
    return amount * taxRate;
  }); //RRSP withdrawals are taxed according to the retirement tax rate
}

/*
 @param {CalculatorInput} input
 @param {function(number, number)=>number} computeAfterTax -> a function that returns the 'after tax' deposited into account given the net cost of investment to user and the user's current tax rate.
 @param {function(number, number)=>number} computeAmountTaxedOnWithdrawal -> a function that computes the amount taxed on the withdrawn investment given the investment future value and estimated tax rate on withdrawal
 @return {AccountResults}
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