"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _financialCalculator = require("../server/financialCalculator");

var FinancialCalculator = _interopRequireWildcard(_financialCalculator);

var _CalculatorInput = require("../server/contracts/CalculatorInput");

var _CalculatorInput2 = _interopRequireDefault(_CalculatorInput);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _testData = require("./testData");

var TestData = _interopRequireWildcard(_testData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

describe("financial calculator test", function () {
  describe("test calculate", function () {

    //each of these should result in the expected outcomes
    describe("valid input", function () {});

    function validInputExceptMissing(field) {
      return validInputExcept(field, null);
    }

    function validInputExcept(field, badValue) {
      var input = _extends({}, TestData.validInputBreaksEven, _defineProperty({}, field, badValue));
      return new _CalculatorInput2.default(input);
    }

    describe("invalid input", function () {

      describe("invalid retirementTaxRate", function () {
        var field = "retirementTaxRate";
        describe("missing", function () {
          it("should throw a " + field + " is required validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate(validInputExceptMissing(field));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("not a number", function () {
          it("should throw a " + field + " is required validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate(validInputExcept(field, "sansSkeleton"));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("exceeds 100", function () {
          describe("by decimal", function () {
            it("should throw a " + field + " cannot exceed 100 validation error", function () {
              _assert2.default.throws(function () {
                FinancialCalculator.calculate(validInputExcept(field, "100.001"));
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
                FinancialCalculator.calculate(validInputExcept(field, "101"));
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
          it("should throw a " + field + " is required validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate(validInputExceptMissing(field));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("not a number", function () {
          it("should throw a " + field + " is required validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate(validInputExcept(field, "sansSkeleton"));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("exceeds 100", function () {
          describe("by decimal", function () {
            it("should throw a " + field + " cannot exceed 100 validation error", function () {
              _assert2.default.throws(function () {
                FinancialCalculator.calculate(validInputExcept(field, "100.001"));
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
                FinancialCalculator.calculate(validInputExcept(field, "101"));
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
          it("should throw a " + field + " is required validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate(validInputExceptMissing(field));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("not a number", function () {
          it("should throw a " + field + " is required validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate(validInputExcept(field, "sansSkeleton"));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("absolute value exceeds 100", function () {
          describe("positive input", function () {
            describe("by decimal", function () {
              it("should throw a " + field + " cannot exceed 100 validation error", function () {
                _assert2.default.throws(function () {
                  FinancialCalculator.calculate(validInputExcept(field, "100.001"));
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
                  FinancialCalculator.calculate(validInputExcept(field, "101"));
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
                  FinancialCalculator.calculate(validInputExcept(field, "-100.001"));
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
                  FinancialCalculator.calculate(validInputExcept(field, "-101"));
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
          it("should throw a " + field + " is required validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate(validInputExceptMissing(field));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("not a number", function () {
          it("should throw a " + field + " is required validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate(validInputExcept(field, "sansSkeleton"));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("absolute value exceeds 100", function () {
          describe("positive input", function () {
            describe("by decimal", function () {
              it("should throw a " + field + " cannot exceed 100 validation error", function () {
                _assert2.default.throws(function () {
                  FinancialCalculator.calculate(validInputExcept(field, "100.001"));
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
                  FinancialCalculator.calculate(validInputExcept(field, "101"));
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
                  FinancialCalculator.calculate(validInputExcept(field, "-100.001"));
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
                  FinancialCalculator.calculate(validInputExcept(field, "-101"));
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
          it("should throw a " + field + " is required validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate(validInputExceptMissing(field));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("not a number", function () {
          it("should throw a " + field + " is required validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate(validInputExcept(field, "sansSkeleton"));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("is negative", function () {
          it("should throw a " + field + " cannot be negative validation error.", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate(validInputExcept(field, "-1234.56"));
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
          it("should throw a " + field + " is required validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate(validInputExceptMissing(field));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("not a number", function () {
          it("should throw a " + field + " is required validation error", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate(validInputExcept(field, "sansSkeleton"));
            }, function (err) {
              var validationErrors = JSON.parse(err.message);
              if (Array.isArray(validationErrors) && validationErrors.find(function (validationError) {
                return validationError.field === field && validationError.message === "is required.";
              })) return true;
            }, 'unexpected error');
          });
        });
        describe("is negative", function () {
          it("should throw a " + field + " cannot be negative validation error.", function () {
            _assert2.default.throws(function () {
              FinancialCalculator.calculate(validInputExcept(field, "-12"));
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

  describe("test deductTaxFromAmount", function () {
    describe("amount is positive", function () {
      var amount = 1234.58;
      describe("tax rate positive", function () {
        describe("all of amount", function () {
          var taxRate = 1.0;
          it("should return 0", function () {
            var expected = 0;
            _assert2.default.strictEqual(FinancialCalculator.deductTaxFromAmount(amount, taxRate), expected);
          });
        });
        describe("1% of amount", function () {
          var taxRate = .01;
          it("should return 99% of amount", function () {
            var expected = 1222.234;
            _assert2.default.ok(compareNumberStrings(expected, function () {
              return FinancialCalculator.deductTaxFromAmount(amount, taxRate);
            }));
          });
        });
        describe("half of amount", function () {
          var taxRate = .5;
          it("should return half of amount", function () {
            var expected = 617.29;
            _assert2.default.ok(compareNumberStrings(expected, function () {
              return FinancialCalculator.deductTaxFromAmount(amount, taxRate);
            }));
          });
        });
        describe("handles decimals in tax rate", function () {
          var taxRate = .402;
          it("should return ~59% of amount", function () {
            var expected = 738.27884;
            _assert2.default.ok(compareNumberStrings(expected, function () {
              return FinancialCalculator.deductTaxFromAmount(amount, taxRate);
            }));
          });
        });
      });
      describe("tax rate 0", function () {
        var taxRate = 0;
        it("should return amount", function () {
          var expected = amount;
          _assert2.default.strictEqual(expected, FinancialCalculator.deductTaxFromAmount(amount, taxRate));
        });
      });
    });
    describe("amount is 0", function () {
      var amount = 0;
      it("should return 0", function () {
        var expected = 0;
        _assert2.default.strictEqual(expected, FinancialCalculator.deductTaxFromAmount(amount, .5));
      });
    });
  });

  describe("test computeTSFA", function () {

    var expectedResult = {};
  });

  describe("test computeRRSP", function () {});

  /*expected results taken from: http://financeformulas.net/Real_Rate_of_Return.html#calcHeader
   * to accommodate rounding and to keep this test independent of my round function, I test correctness of
   * returned value by comparing substrings of the stringified representations of numeric result.
   * */
  function compareNumberStrings(expectedNumber, resultGenerator) {
    var expectedAsString = '' + expectedNumber;
    var resultSubstring = ('' + resultGenerator()).slice(0, expectedAsString.length);
    return resultSubstring === expectedAsString;
  }

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