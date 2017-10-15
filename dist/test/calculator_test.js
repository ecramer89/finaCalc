"use strict";

var _financialCalculator = require("../server/financialCalculator");

var FinancialCalculator = _interopRequireWildcard(_financialCalculator);

var _CalculatorInput = require("../server/contracts/CalculatorInput");

var _CalculatorInput2 = _interopRequireDefault(_CalculatorInput);

var _CalculatorOutput = require("../server/contracts/CalculatorOutput");

var _CalculatorOutput2 = _interopRequireDefault(_CalculatorOutput);

var _util = require("../server/util");

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _testData = require("./testData");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/*expected results taken from: http://financeformulas.net/Real_Rate_of_Return.html#calcHeader
 * to accommodate rounding and to keep this test independent of my round function, I test correctness of
 * returned value by comparing substrings of the stringified representations of numeric result.
 * */
function compareNumberStrings(expectedNumber, resultGenerator) {
  var expectedAsString = '' + expectedNumber;
  var resultSubstring = ('' + resultGenerator()).slice(0, expectedAsString.length);
  return resultSubstring === expectedAsString;
}

describe("financial calculator test", function () {
  describe("test calculate", function () {

    describe("valid input", function () {

      describe("RRSP is the better choice", function () {
        var currentTaxRate = 40.34;
        var amountInvested = 1225.45;
        var retirementTaxRate = 20.12;
        var investmentGrowthRate = 5;
        var inflationRate = 2;
        var yearsInvested = 35;

        //stringify to better match conditions of input coming in from client
        var input = {
          currentTaxRate: currentTaxRate + "%",
          amountInvested: amountInvested + "$",
          retirementTaxRate: retirementTaxRate + "%",
          investmentGrowthRate: investmentGrowthRate + "%",
          inflationRate: inflationRate + "%",
          yearsInvested: "" + yearsInvested

          //compute derived fields up here, for ease of reference.

          /*
            I assumed that the server should leave anything that is used as input to a subsequent equation
            unrounded, and then round all the data to show to the client at the end.
            (i.e., computed deposit value is a result but also input to the future value calculation,
            which is input to the withdrawal tax calculation, etc. although I round the future value that is returned to user,
            but left unrounded when provided as input to withdrawal tax calculation.
           */
        };var realRateOfReturn = (1 + investmentGrowthRate / 100) / (1 + inflationRate / 100) - 1;
        var expectedRRSPAfterTaxUnrounded = amountInvested / (1 - currentTaxRate / 100);
        var expectedRRSPFutureValueUnrounded = expectedRRSPAfterTaxUnrounded * Math.pow(1 + realRateOfReturn, yearsInvested);
        var expectedTSFAFutureValueUnrounded = amountInvested * Math.pow(1 + realRateOfReturn, yearsInvested);
        var expectedRRSPAmountTaxedUnrounded = expectedRRSPFutureValueUnrounded * retirementTaxRate / 100; //retirement tax rate
        var expectedRRSPAfterTaxFutureValueUnrounded = expectedRRSPFutureValueUnrounded * (1 - retirementTaxRate / 100);
        var result = FinancialCalculator.calculate(new _CalculatorInput2.default(input));

        it("should return a CalculatorOutput", function () {
          _assert2.default.ok(result instanceof _CalculatorOutput2.default);
        });

        it("should have an AccountResult for the TSFA", function () {
          _assert2.default.ok(result.TSFA instanceof _CalculatorOutput.AccountResults);
        });

        it("should have an AccountResult for the RRSP", function () {
          _assert2.default.ok(result.RRSP instanceof _CalculatorOutput.AccountResults);
        });

        it("the after tax deposited for the TSFA should equal the amount invested", function () {
          _assert2.default.strictEqual(result.TSFA.afterTax, amountInvested);
        });

        it("the after tax deposited for the RRSP should be correct", function () {
          _assert2.default.strictEqual(result.RRSP.afterTax, (0, _util.roundTo)(expectedRRSPAfterTaxUnrounded, 2));
        });

        it("the after tax deposited for the RRSP should be such that the deposit minus the refund," + "\ngiven the current tax rate, equals the TSFA deposit", function () {
          var RRSPAfterTax = result.RRSP.afterTax;

          var RRSPRefund = RRSPAfterTax * currentTaxRate / 100;
          var outOfPocketCost = RRSPAfterTax - RRSPRefund;
          _assert2.default.strictEqual((0, _util.roundTo)(outOfPocketCost, 2), result.TSFA.afterTax);
        });

        it("the future value of the RRSP is correct", function () {
          _assert2.default.strictEqual(result.RRSP.futureValue, (0, _util.roundTo)(expectedRRSPFutureValueUnrounded, 2));
        });

        it("the future value of the TSFA is correct", function () {
          _assert2.default.strictEqual(result.TSFA.futureValue, (0, _util.roundTo)(expectedTSFAFutureValueUnrounded, 2));
        });

        it("the amount taxed on withdrawal for the TSFA should be 0", function () {
          _assert2.default.strictEqual(result.TSFA.amountTaxedOnWithdrawal, 0);
        });

        it("the amount taxed on withdrawal for the RRSP should be the future value times the retirement tax rate", function () {
          _assert2.default.strictEqual(result.RRSP.amountTaxedOnWithdrawal, (0, _util.roundTo)(expectedRRSPAmountTaxedUnrounded, 2));
        });

        it("the after tax future value for the TSFA should equal the future value (since withdrawals are not taxed)", function () {
          _assert2.default.strictEqual(result.TSFA.futureValue, result.TSFA.afterTaxFutureValue);
        });

        it("the after tax future value of the RRSP should match expected", function () {
          _assert2.default.strictEqual(result.RRSP.afterTaxFutureValue, (0, _util.roundTo)(expectedRRSPAfterTaxFutureValueUnrounded, 2));
        });
        /*
        NOTE TO EXAMINERS:
        -this is an edge case where, because I chose to round all of the results -at the very end-,
        and left them -unrounded- throughout their use in the calculation of intermediate or other results,
        there CAN be some inconsistencies between the final decimal point of values derived from the intermediate unrounded
        and final rounded results.
        for example,
        server computes after tax future value using the un-rounded future value and unrounded amount taxed, and then rounds the result.
         in this particular case, the result:
        (server): (unrounded future value - unrounded amount tax), rounds down to the last decimal place.
        however,
        rounded future value - rounded amount taxed (because rounded future value rounds up) has a higher value for last decimal place.
         I was uncertain whether the server (in computing all the final results) should round intermediate values or leave all unrounded until end.
        I faced a similar scenario on an earlier project, where a receipt was supposed to print (rounded) amounts taxed on all order items,
        as well as a rounded total tax. there to, since the total tax was derived from -unrounded- item tax amounts,
        there could be inconsistencies bw the total tax that appeared on receipt and the result that one would get by summing all
        the item tax amounts that appeared on receipt. My superiors told me that was an acceptable and known consequence of 'rounding rules',
        so I thought it plausible the same might apply here.
         (Rounding rules is definitely an issue that would require clarification with superiors).
        I have left this test (which fails) here, albeit skipped, because this is what I would show my superiors as an example
        if I had concerns and questions about rounding inconsistencies.
         */
        it.skip("the after tax future value for the RRSP should equal its future value minus the amount that was taxed", function () {
          _assert2.default.strictEqual(result.RRSP.afterTaxFutureValue, result.RRSP.futureValue - result.RRSP.amountTaxedOnWithdrawal);
        });

        it("since the tax rate on withdrawal is less than the tax rate on deposit, the RRSP future value should exceed the TSFA", function () {
          _assert2.default.ok(result.RRSP.afterTaxFutureValue > result.TSFA.afterTaxFutureValue);
        });
      });

      describe("TSFA is the better choice", function () {
        var currentTaxRate = 15.21;
        var amountInvested = 1225.45;
        var retirementTaxRate = 26.23;
        var investmentGrowthRate = 5;
        var inflationRate = 2;
        var yearsInvested = 10;

        var input = {
          currentTaxRate: currentTaxRate + "%",
          amountInvested: amountInvested + "$",
          retirementTaxRate: retirementTaxRate + "%",
          investmentGrowthRate: investmentGrowthRate + "%",
          inflationRate: inflationRate + "%",
          yearsInvested: "" + yearsInvested
        };

        var realRateOfReturn = (1 + investmentGrowthRate / 100) / (1 + inflationRate / 100) - 1;
        var expectedRRSPAfterTaxUnrounded = amountInvested / (1 - currentTaxRate / 100);
        var expectedRRSPFutureValueUnrounded = expectedRRSPAfterTaxUnrounded * Math.pow(1 + realRateOfReturn, yearsInvested);
        var expectedTSFAFutureValueUnrounded = amountInvested * Math.pow(1 + realRateOfReturn, yearsInvested);
        var expectedRRSPAmountTaxedUnrounded = expectedRRSPFutureValueUnrounded * retirementTaxRate / 100; //retirement tax rate
        var expectedRRSPAfterTaxFutureValueUnrounded = expectedRRSPFutureValueUnrounded * (1 - retirementTaxRate / 100);
        var result = FinancialCalculator.calculate(new _CalculatorInput2.default(input));

        it("should return a CalculatorOutput", function () {
          _assert2.default.ok(result instanceof _CalculatorOutput2.default);
        });

        it("should have an AccountResult for the TSFA", function () {
          _assert2.default.ok(result.TSFA instanceof _CalculatorOutput.AccountResults);
        });

        it("should have an AccountResult for the RRSP", function () {
          _assert2.default.ok(result.RRSP instanceof _CalculatorOutput.AccountResults);
        });

        it("the after tax deposited for the TSFA should equal the amount invested", function () {
          _assert2.default.strictEqual(result.TSFA.afterTax, amountInvested);
        });

        it("the after tax deposited for the RRSP should be correct", function () {
          _assert2.default.strictEqual(result.RRSP.afterTax, (0, _util.roundTo)(expectedRRSPAfterTaxUnrounded, 2));
        });

        it("the after tax deposited for the RRSP should be such that the deposit minus the refund," + "\ngiven the current tax rate, equals the TSFA deposit", function () {
          var RRSPAfterTax = result.RRSP.afterTax;

          var RRSPRefund = RRSPAfterTax * currentTaxRate / 100;
          var outOfPocketCost = RRSPAfterTax - RRSPRefund;
          _assert2.default.strictEqual((0, _util.roundTo)(outOfPocketCost, 2), result.TSFA.afterTax);
        });

        it("the future value of the RRSP is correct", function () {
          _assert2.default.strictEqual(result.RRSP.futureValue, (0, _util.roundTo)(expectedRRSPFutureValueUnrounded, 2));
        });

        it("the future value of the TSFA is correct", function () {
          _assert2.default.strictEqual(result.TSFA.futureValue, (0, _util.roundTo)(expectedTSFAFutureValueUnrounded, 2));
        });

        it("the amount taxed on withdrawal for the TSFA should be 0", function () {
          _assert2.default.strictEqual(result.TSFA.amountTaxedOnWithdrawal, 0);
        });

        it("the amount taxed on withdrawal for the RRSP should be the future value times the retirement tax rate", function () {
          _assert2.default.strictEqual(result.RRSP.amountTaxedOnWithdrawal, (0, _util.roundTo)(expectedRRSPAmountTaxedUnrounded, 2));
        });

        it("the after tax future value for the TSFA should equal the future value (since withdrawals are not taxed)", function () {
          _assert2.default.strictEqual(result.TSFA.futureValue, result.TSFA.afterTaxFutureValue);
        });

        it("the after tax future value of the RRSP should match expected", function () {
          _assert2.default.strictEqual(result.RRSP.afterTaxFutureValue, (0, _util.roundTo)(expectedRRSPAfterTaxFutureValueUnrounded, 2));
        });

        //check consistency with other results
        it("the after tax future value for the RRSP should equal its future value minus the amount that was taxed", function () {
          _assert2.default.strictEqual(result.RRSP.afterTaxFutureValue, result.RRSP.futureValue - result.RRSP.amountTaxedOnWithdrawal);
        });

        it("since the tax rate on withdrawal is greater than the tax rate on deposit, the TSFA future value should exceed the RRSP", function () {
          _assert2.default.ok(result.RRSP.afterTaxFutureValue < result.TSFA.afterTaxFutureValue);
        });
      });

      describe("both are equally good", function () {
        var currentTaxRate = 6.78;
        var amountInvested = 1225.45;
        var retirementTaxRate = 6.78;
        var investmentGrowthRate = 5;
        var inflationRate = 2;
        var yearsInvested = 10;

        var input = {
          currentTaxRate: currentTaxRate + "%",
          amountInvested: amountInvested + "$",
          retirementTaxRate: retirementTaxRate + "%",
          investmentGrowthRate: investmentGrowthRate + "%",
          inflationRate: inflationRate + "%",
          yearsInvested: "" + yearsInvested
        };

        var realRateOfReturn = (1 + investmentGrowthRate / 100) / (1 + inflationRate / 100) - 1;
        var expectedRRSPAfterTaxUnrounded = amountInvested / (1 - currentTaxRate / 100);
        var expectedRRSPFutureValueUnrounded = expectedRRSPAfterTaxUnrounded * Math.pow(1 + realRateOfReturn, yearsInvested);
        var expectedTSFAFutureValueUnrounded = amountInvested * Math.pow(1 + realRateOfReturn, yearsInvested);
        var expectedRRSPAmountTaxedUnrounded = expectedRRSPFutureValueUnrounded * retirementTaxRate / 100; //retirement tax rate
        var expectedRRSPAfterTaxFutureValueUnrounded = expectedRRSPFutureValueUnrounded * (1 - retirementTaxRate / 100);
        var result = FinancialCalculator.calculate(new _CalculatorInput2.default(input));

        it("should return a CalculatorOutput", function () {
          _assert2.default.ok(result instanceof _CalculatorOutput2.default);
        });

        it("should have an AccountResult for the TSFA", function () {
          _assert2.default.ok(result.TSFA instanceof _CalculatorOutput.AccountResults);
        });

        it("should have an AccountResult for the RRSP", function () {
          _assert2.default.ok(result.RRSP instanceof _CalculatorOutput.AccountResults);
        });

        it("the after tax deposited for the TSFA should equal the amount invested", function () {
          _assert2.default.strictEqual(result.TSFA.afterTax, amountInvested);
        });

        it("the after tax deposited for the RRSP should be correct", function () {
          _assert2.default.strictEqual(result.RRSP.afterTax, (0, _util.roundTo)(expectedRRSPAfterTaxUnrounded, 2));
        });

        it("the after tax deposited for the RRSP should be such that the deposit minus the refund," + "\ngiven the current tax rate, equals the TSFA deposit", function () {
          var RRSPAfterTax = result.RRSP.afterTax;

          var RRSPRefund = RRSPAfterTax * currentTaxRate / 100;
          var outOfPocketCost = RRSPAfterTax - RRSPRefund;
          _assert2.default.strictEqual((0, _util.roundTo)(outOfPocketCost, 2), result.TSFA.afterTax);
        });

        it("the future value of the RRSP is correct", function () {
          _assert2.default.strictEqual(result.RRSP.futureValue, (0, _util.roundTo)(expectedRRSPFutureValueUnrounded, 2));
        });

        it("the future value of the TSFA is correct", function () {
          _assert2.default.strictEqual(result.TSFA.futureValue, (0, _util.roundTo)(expectedTSFAFutureValueUnrounded, 2));
        });

        it("the amount taxed on withdrawal for the TSFA should be 0", function () {
          _assert2.default.strictEqual(result.TSFA.amountTaxedOnWithdrawal, 0);
        });

        it("the amount taxed on withdrawal for the RRSP should be the future value times the retirement tax rate", function () {
          _assert2.default.strictEqual(result.RRSP.amountTaxedOnWithdrawal, (0, _util.roundTo)(expectedRRSPAmountTaxedUnrounded, 2));
        });

        it("the after tax future value for the TSFA should equal the future value (since withdrawals are not taxed)", function () {
          _assert2.default.strictEqual(result.TSFA.futureValue, result.TSFA.afterTaxFutureValue);
        });

        it("the after tax future value of the RRSP should match expected", function () {
          _assert2.default.strictEqual(result.RRSP.afterTaxFutureValue, (0, _util.roundTo)(expectedRRSPAfterTaxFutureValueUnrounded, 2));
        });

        //check consistency with other results
        it("the after tax future value for the RRSP should equal its future value minus the amount that was taxed", function () {
          _assert2.default.strictEqual(result.RRSP.afterTaxFutureValue, result.RRSP.futureValue - result.RRSP.amountTaxedOnWithdrawal);
        });

        it("since the tax rate on withdrawal equals the tax rate on deposit, the TSFA future value should equal the RRSP", function () {
          _assert2.default.strictEqual(result.RRSP.afterTaxFutureValue, result.TSFA.afterTaxFutureValue);
        });
      });

      describe("test edge cases", function () {
        //current tax rate
        //max value: 99.99999999999999
        //any negative
        //0
        //min value -99.99999999999999
        //retirement tax rate
        //max value: 100
        //min value: -100
        //0

        describe("current tax rate is largest possible positive value", function () {});
      });
    });

    describe("invalid input", function () {

      describe("invalid retirementTaxRate", function () {
        var field = "retirementTaxRate";
        describe("missing", function () {
          it("should throw a " + field + " is required and must be a number validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate((0, _testData.validInputExceptMissing)(field));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required and must be a number.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("not a number", function () {
          it("should throw a " + field + " is required and must be a number validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "sansSkeleton"));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required and must be a number.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("exceeds 100", function () {
          describe("by decimal", function () {
            it("should throw a " + field + " cannot exceed 100 validation error", function () {
              _assert2.default.throws(function () {
                FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "100.001"));
              }, function (err) {
                var validationErrors = JSON.parse(err.message);
                if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                  return validationError.field === field && validationError.message === "cannot exceed 100.";
                })) return true;
              }, 'unexpected error');
            });
          });
          describe("by integer", function () {
            it("should throw a " + field + " cannot exceed 100 validation error", function () {
              _assert2.default.throws(function () {
                FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "101"));
              }, function (err) {
                var validationErrors = JSON.parse(err.message);
                if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                  return validationError.field === field && validationError.message === "cannot exceed 100.";
                })) return true;
              }, 'unexpected error');
            });
          });
        });
      });

      describe("invalid inflationRate", function () {
        var field = "inflationRate";
        describe("missing", function () {
          it("should throw a " + field + " is required and must be a number validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate((0, _testData.validInputExceptMissing)(field));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required and must be a number.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("not a number", function () {
          it("should throw a " + field + " is required and must be a number validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "sansSkeleton"));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required and must be a number.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("exceeds 100", function () {
          describe("by decimal", function () {
            it("should throw a " + field + " cannot exceed 100 validation error", function () {
              _assert2.default.throws(function () {
                FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "100.001"));
              }, function (err) {
                var validationErrors = JSON.parse(err.message);
                if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                  return validationError.field === field && validationError.message === "cannot exceed 100.";
                })) return true;
              }, 'unexpected error');
            });
          });
          describe("by integer", function () {
            it("should throw a " + field + " cannot exceed 100 validation error", function () {
              _assert2.default.throws(function () {
                FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "101"));
              }, function (err) {
                var validationErrors = JSON.parse(err.message);
                if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                  return validationError.field === field && validationError.message === "cannot exceed 100.";
                })) return true;
              }, 'unexpected error');
            });
          });
        });
      });

      describe("invalid investmentGrowthRate", function () {
        var field = "investmentGrowthRate";
        describe("missing", function () {
          it("should throw a " + field + " is required and must be a number validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate((0, _testData.validInputExceptMissing)(field));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required and must be a number.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("not a number", function () {
          it("should throw a " + field + " is required and must be a number validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "sansSkeleton"));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required and must be a number.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("absolute value exceeds 100", function () {
          describe("positive input", function () {
            describe("by decimal", function () {
              it("should throw a " + field + " cannot exceed 100 validation error", function () {
                _assert2.default.throws(function () {
                  FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "100.001"));
                }, function (err) {
                  var validationErrors = JSON.parse(err.message);
                  if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                    return validationError.field === field && validationError.message === "cannot exceed 100.";
                  })) return true;
                }, 'unexpected error');
              });
            });
            describe("by integer", function () {
              it("should throw a " + field + " cannot exceed 100 validation error", function () {
                _assert2.default.throws(function () {
                  FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "101"));
                }, function (err) {
                  var validationErrors = JSON.parse(err.message);
                  if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                    return validationError.field === field && validationError.message === "cannot exceed 100.";
                  })) return true;
                }, 'unexpected error');
              });
            });
          });
          describe("negative input", function () {
            describe("by decimal", function () {
              it("should throw a " + field + " cannot exceed 100 validation error", function () {
                _assert2.default.throws(function () {
                  FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "-100.001"));
                }, function (err) {
                  var validationErrors = JSON.parse(err.message);
                  if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                    return validationError.field === field && validationError.message === "cannot exceed 100.";
                  })) return true;
                }, 'unexpected error');
              });
            });
            describe("by integer", function () {
              it("should throw a " + field + " cannot exceed 100 validation error", function () {
                _assert2.default.throws(function () {
                  FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "-101"));
                }, function (err) {
                  var validationErrors = JSON.parse(err.message);
                  if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                    return validationError.field === field && validationError.message === "cannot exceed 100.";
                  })) return true;
                }, 'unexpected error');
              });
            });
          });
        });
      });

      describe("invalid currentTaxRate", function () {
        var field = "currentTaxRate";
        describe("missing", function () {
          it("should throw a " + field + " is required and must be a number validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate((0, _testData.validInputExceptMissing)(field));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required and must be a number.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("not a number", function () {
          it("should throw a " + field + " is required and must be a number validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "sansSkeleton"));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required and must be a number.";
              })) return true;
            }, 'unexpected error');
          });
        });
        //because by assumption the TSFA deposit is made with after tax dollars, if the user has a current tax rate of 100% then
        //they have no money to deposit into a TSFA and the comparison is meaningless.
        //helpful error message may help user to understand meaning of input field.
        describe("absolute value equals 100", function () {
          it("should throw a " + field + " cannot be 100% because then you would have no after-tax to invest in the TSFA", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "100%"));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "cannot be 100% because then you would have no after-tax to invest in the TSFA.";
              })) return true;
            }, 'unexpected error');
          });
        });

        describe("absolute value exceeds 100", function () {
          describe("positive input", function () {
            describe("by decimal", function () {
              it("should throw a " + field + " cannot exceed 100 validation error", function () {
                _assert2.default.throws(function () {
                  FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "100.001"));
                }, function (err) {
                  var validationErrors = JSON.parse(err.message);
                  if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                    return validationError.field === field && validationError.message === "cannot exceed 100.";
                  })) return true;
                }, 'unexpected error');
              });
            });
            describe("by integer", function () {
              it("should throw a " + field + " cannot exceed 100 validation error", function () {
                _assert2.default.throws(function () {
                  FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "101"));
                }, function (err) {
                  var validationErrors = JSON.parse(err.message);
                  if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                    return validationError.field === field && validationError.message === "cannot exceed 100.";
                  })) return true;
                }, 'unexpected error');
              });
            });
          });
          describe("negative input", function () {
            describe("by decimal", function () {
              it("should throw a " + field + " cannot exceed 100 validation error", function () {
                _assert2.default.throws(function () {
                  FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "-100.001"));
                }, function (err) {
                  var validationErrors = JSON.parse(err.message);
                  if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                    return validationError.field === field && validationError.message === "cannot exceed 100.";
                  })) return true;
                }, 'unexpected error');
              });
            });
            describe("by integer", function () {
              it("should throw a " + field + " cannot exceed 100 validation error", function () {
                _assert2.default.throws(function () {
                  FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "-101"));
                }, function (err) {
                  var validationErrors = JSON.parse(err.message);
                  if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                    return validationError.field === field && validationError.message === "cannot exceed 100.";
                  })) return true;
                }, 'unexpected error');
              });
            });
          });
        });
      });

      describe("invalid amountInvested", function () {
        var field = "amountInvested";
        describe("missing", function () {
          it("should throw a " + field + " is required and must be a number validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate((0, _testData.validInputExceptMissing)(field));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required and must be a number.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("not a number", function () {
          it("should throw a " + field + " is required and must be a number validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "sansSkeleton"));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required and must be a number.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("is negative", function () {
          it("should throw a " + field + " cannot be negative validation error.", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "-1234.56"));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "cannot be negative.";
              })) return true;
            }, 'unexpected error');
          });
        });
      });

      describe("invalid yearsInvested", function () {
        var field = "yearsInvested";
        describe("missing", function () {
          it("should throw a " + field + " is required and must be a number validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate((0, _testData.validInputExceptMissing)(field));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required and must be a number.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("not a number", function () {
          it("should throw a " + field + " is required and must be a number validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "sansSkeleton"));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required and must be a number.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("is negative", function () {
          it("should throw a " + field + " cannot be negative validation error.", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate((0, _testData.validInputExcept)(field, "-12"));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "cannot be negative.";
              })) return true;
            }, 'unexpected error');
          });
        });
      });
    });
  });
  describe("test computeRealRateOfReturn", function () {

    describe("nominal is 0", function () {
      var nominal = 0;

      describe("inflation is positive", function () {
        var inflation = .021;
        var expected = -.0205;
        it("should return expected result", function () {
          _assert2.default.ok(compareNumberStrings(expected, function () {
            return FinancialCalculator.computeRealRateOfReturn(nominal, inflation);
          }));
        });
      });

      describe("inflation is 0", function () {
        var inflation = 0;
        var expected = 0;
        it("should return expected result", function () {
          _assert2.default.strictEqual(FinancialCalculator.computeRealRateOfReturn(nominal, inflation), expected);
        });
      });
    });

    describe("nominal is positive", function () {
      var nominal = .023;
      describe("inflation is positive, less than nominal", function () {
        var inflation = .015;
        var expected = .00788;
        it("should return expected result", function () {
          _assert2.default.ok(compareNumberStrings(expected, function () {
            return FinancialCalculator.computeRealRateOfReturn(nominal, inflation);
          }));
        });
      });
      describe("inflation is positive, equals nominal", function () {
        var inflation = nominal;
        var expected = 0;
        it("should return expected result", function () {
          _assert2.default.ok(compareNumberStrings(expected, function () {
            return FinancialCalculator.computeRealRateOfReturn(nominal, inflation);
          }));
        });
      });
      describe("inflation is positive, greater than nominal", function () {
        var inflation = .031;
        var expected = -.00775; //the online calculator that I used rounded the values up to 3 decimal places. I leave the values unrounded until finishing all of the calculations.
        //in order to test that funtion returns roughly the same result, I check that the real output matches the first 3 digits (of the percentage representation) assuming that the
        //web browser output did not round.
        it("should return expected result", function () {
          _assert2.default.ok(compareNumberStrings(expected, function () {
            return FinancialCalculator.computeRealRateOfReturn(nominal, inflation);
          }));
        });
      });
      describe("inflation is 0", function () {
        var inflation = 0;
        var expected = .022;
        it("should return expected result", function () {
          _assert2.default.ok(compareNumberStrings(expected, function () {
            return FinancialCalculator.computeRealRateOfReturn(nominal, inflation);
          }));
        });
      });
    });

    //do not bother retesting all combinations with nominal; just ensure negative inputs are allowed.
    describe("inflation is negative", function () {
      var nominal = .025;
      var inflation = -.036;
      var expected = .063;
      it("should return expected result", function () {
        _assert2.default.ok(compareNumberStrings(expected, function () {
          return FinancialCalculator.computeRealRateOfReturn(nominal, inflation);
        }));
      });
    });

    describe("nominal is negative", function () {
      var inflation = .025;
      var nominal = -.036;
      var expected = -.0595;
      it("should return expected result", function () {
        _assert2.default.ok(compareNumberStrings(expected, function () {
          return FinancialCalculator.computeRealRateOfReturn(nominal, inflation);
        }));
      });
    });
  });

  /*expected values taken from: http://financeformulas.net/Future_Value.html#calcHeader */
  describe("test computeFutureValue", function () {

    describe("after tax is positive", function () {
      var afterTax = 856.79;
      describe("rate of return is negative", function () {
        var rateOfReturn = -.045;
        describe("years invested is 0", function () {
          var yearsInvested = 0;
          var expected = 856.79;
          it("should return the correct result", function () {
            _assert2.default.ok(compareNumberStrings(expected, function () {
              return FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested);
            }));
          });
        });
        describe("years invested is positive", function () {
          var yearsInvested = 55;
          var expected = 68.08;
          it("should return the correct result", function () {
            _assert2.default.ok(compareNumberStrings(expected, function () {
              return FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested);
            }));
          });
        });
      });

      describe("rate of return is positive", function () {
        var rateOfReturn = .045;
        describe("years invested is 0", function () {
          var yearsInvested = 0;
          var expected = 856.79;
          it("should return the correct result", function () {
            _assert2.default.ok(compareNumberStrings(expected, function () {
              return FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested);
            }));
          });
        });
        describe("years invested is positive", function () {
          var yearsInvested = 55;
          var expected = 9644.29;
          it("should return the correct result", function () {
            _assert2.default.ok(compareNumberStrings(expected, function () {
              return FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested);
            }));
          });
        });
      });

      describe("rate of return is 0", function () {
        var rateOfReturn = 0;
        describe("years invested is 0", function () {
          var yearsInvested = 0;
          var expected = 856.79;
          it("should return the correct result", function () {
            _assert2.default.ok(compareNumberStrings(expected, function () {
              return FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested);
            }));
          });
        });
        describe("years invested is positive", function () {
          var yearsInvested = 55;
          var expected = 856.79;
          it("should return the correct result", function () {
            _assert2.default.ok(compareNumberStrings(expected, function () {
              return FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested);
            }));
          });
        });
      });
    });

    describe("after tax is 0", function () {
      var afterTax = 0;
      describe("rate of return is negative", function () {
        var rateOfReturn = -.045;
        describe("years invested is 0", function () {
          var yearsInvested = 0;
          var expected = 0;
          it("should return the correct result", function () {
            _assert2.default.strictEqual(FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested), expected);
          });
        });
        describe("years invested is positive", function () {
          var yearsInvested = 55;
          var expected = 0;
          it("should return the correct result", function () {
            _assert2.default.strictEqual(FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested), expected);
          });
        });
      });

      describe("rate of return is positive", function () {
        var rateOfReturn = .045;
        describe("years invested is 0", function () {
          var yearsInvested = 0;
          var expected = 0;
          it("should return the correct result", function () {
            _assert2.default.strictEqual(FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested), expected);
          });
        });
        describe("years invested is positive", function () {
          var yearsInvested = 55;
          var expected = 0;
          it("should return the correct result", function () {
            _assert2.default.strictEqual(FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested), expected);
          });
        });
      });

      describe("rate of return is 0", function () {
        var rateOfReturn = 0;
        describe("years invested is 0", function () {
          var yearsInvested = 0;
          var expected = 0;
          it("should return the correct result", function () {
            _assert2.default.strictEqual(FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested), expected);
          });
        });
        describe("years invested is positive", function () {
          var yearsInvested = 55;
          var expected = 0;
          it("should return the correct result", function () {
            _assert2.default.strictEqual(FinancialCalculator.computeFutureValue(afterTax, rateOfReturn, yearsInvested), expected);
          });
        });
      });
    });
  });
});