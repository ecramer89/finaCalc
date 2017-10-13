"use strict";

var _financialCalculator = require("../server/financialCalculator");

var FinancialCalculator = _interopRequireWildcard(_financialCalculator);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _testData = require("./testData");

var TestData = _interopRequireWildcard(_testData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe("financial calculator test", function () {
  describe("test calculate", function () {

    //each of these should result in the expected outcomes
    describe("valid input", function () {});

    //each of these should throw a validation error.
    describe("invalid input", function () {});
  });

  describe("test computeTSFA", function () {

    var expectedResult = {};
  });

  describe("test computeRRSP", function () {});

  /*expected results taken from: http://financeformulas.net/Real_Rate_of_Return.html#calcHeader
  * to accommodate rounding and to keep this test independent of my round function, I test correctness of
  * returned value by comparing substrings of the stringified representations of numeric result.
  * */
  describe("test computeRealRateOfReturn", function () {

    describe("nominal is 0", function () {
      var nominal = 0;

      describe("inflation is positive", function () {
        var inflation = .021;
        var expected = -.0205;
        it("should return expected result", function () {
          var expectedAsString = '' + expected;
          var resultSubstring = ('' + FinancialCalculator.computeRealRateOfReturn(nominal, inflation)).slice(0, expectedAsString.length);
          _assert2.default.equal(resultSubstring, expectedAsString);
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
          var expectedAsString = '' + expected;
          var resultSubstring = ('' + FinancialCalculator.computeRealRateOfReturn(nominal, inflation)).slice(0, expectedAsString.length);
          _assert2.default.equal(resultSubstring, expectedAsString);
        });
      });
      describe("inflation is positive, equals nominal", function () {
        var inflation = nominal;
        var expected = 0;
        it("should return expected result", function () {
          var expectedAsString = '' + expected;
          var resultSubstring = ('' + FinancialCalculator.computeRealRateOfReturn(nominal, inflation)).slice(0, expectedAsString.length);
          _assert2.default.equal(resultSubstring, expectedAsString);
        });
      });
      describe("inflation is positive, greater than nominal", function () {
        var inflation = .031;
        var expected = -.00775; //the online calculator that I used rounded the values up to 3 decimal places. I leave the values unrounded until finishing all of the calculations.
        //in order to test that funtion returns roughly the same result, I check that the real output matches the first 3 digits (of the percentage representation) assuming that the
        //web browser output did not round.
        it("should return expected result", function () {
          var expectedAsString = '' + expected;
          var resultSubstring = ('' + FinancialCalculator.computeRealRateOfReturn(nominal, inflation)).slice(0, expectedAsString.length);
          _assert2.default.equal(resultSubstring, expectedAsString);
        });
      });
      describe("inflation is 0", function () {
        var inflation = 0;
        var expected = .022;
        it("should return expected result", function () {
          var expectedAsString = '' + expected;
          var resultSubstring = ('' + FinancialCalculator.computeRealRateOfReturn(nominal, inflation)).slice(0, expectedAsString.length);
          _assert2.default.equal(resultSubstring, expectedAsString);
        });
      });
    });

    //do not bother retesting all combinations with nominal; just ensure negative inputs are allowed.
    describe("inflation is negative", function () {
      var nominal = .025;
      var inflation = -.036;
      var expected = .063;
      it("should return expected result", function () {
        var expectedAsString = '' + expected;
        var resultSubstring = ('' + FinancialCalculator.computeRealRateOfReturn(nominal, inflation)).slice(0, expectedAsString.length);
        _assert2.default.equal(resultSubstring, expectedAsString);
      });
    });

    describe("nominal is negative", function () {
      var inflation = .025;
      var nominal = -.036;
      var expected = -.0595;
      it("should return expected result", function () {
        var expectedAsString = '' + expected;
        var resultSubstring = ('' + FinancialCalculator.computeRealRateOfReturn(nominal, inflation)).slice(0, expectedAsString.length);
        _assert2.default.equal(resultSubstring, expectedAsString);
      });
    });
  });

  /*expected values taken from: http://financeformulas.net/Future_Value.html#calcHeader */
  describe("test computeFutureValue", function () {
    //afterTax,rateOfReturn,yearsInvested

  });
});