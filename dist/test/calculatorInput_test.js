"use strict";

var _CalculatorInput = require("../server/contracts/CalculatorInput");

var _CalculatorInput2 = _interopRequireDefault(_CalculatorInput);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("test Calculator input", function () {
  describe("test constructor", function () {
    describe("given valid arguments representing monetary amounts and percentages", function () {
      var currentTaxRate = "40.43%";
      var amountInvested = "1245.56$";
      var retirementTaxRate = "20.2556%";
      var investmentGrowthRate = "3.2%";
      var inflationRate = "2%";
      var yearsInvested = "55";

      var testInput = {
        currentTaxRate: currentTaxRate,
        amountInvested: amountInvested,
        retirementTaxRate: retirementTaxRate,
        investmentGrowthRate: investmentGrowthRate,
        inflationRate: inflationRate,
        yearsInvested: yearsInvested
      };

      var result = new _CalculatorInput2.default(testInput);
      it("should have the currentTaxRate", function () {
        _assert2.default.strictEqual(result.currentTaxRate, 40.43);
      });
      it("should have the amountInvested", function () {
        _assert2.default.strictEqual(result.amountInvested, 1245.56);
      });
      it("should have the retirementTaxRate", function () {
        _assert2.default.strictEqual(result.retirementTaxRate, 20.2556);
      });
      it("should have the investmentGrowthRate", function () {
        _assert2.default.strictEqual(result.investmentGrowthRate, 3.2);
      });
      it("should have the inflationRate", function () {
        _assert2.default.strictEqual(result.inflationRate, 2);
      });
      it("should have the yearsInvested", function () {
        _assert2.default.strictEqual(result.yearsInvested, 55);
      });
    });
    describe("given invalid arguments", function () {
      var testInput = {
        currentTaxRate: "nonsense",
        amountInvested: "ghssjsf",
        retirementTaxRate: "dsds",
        investmentGrowthRate: "fsjfjsca",
        inflationRate: "fdjjavvsd",
        yearsInvested: "fkffknddd"
      };

      var result = new _CalculatorInput2.default(testInput);
      it("should have null currentTaxRate", function () {
        _assert2.default.strictEqual(result.currentTaxRate, null);
      });
      it("should have null amountInvested", function () {
        _assert2.default.strictEqual(result.amountInvested, null);
      });
      it("should have null retirementTaxRate", function () {
        _assert2.default.strictEqual(result.retirementTaxRate, null);
      });
      it("should have null investmentGrowthRate", function () {
        _assert2.default.strictEqual(result.investmentGrowthRate, null);
      });
      it("should have null inflationRate", function () {
        _assert2.default.strictEqual(result.inflationRate, null);
      });
      it("should have null yearsInvested", function () {
        _assert2.default.strictEqual(result.yearsInvested, null);
      });
    });

    describe("given missing arguments", function () {
      describe("fields empty", function () {
        var testInput = {
          currentTaxRate: "",
          amountInvested: "",
          retirementTaxRate: "",
          investmentGrowthRate: "",
          inflationRate: "",
          yearsInvested: ""
        };

        var result = new _CalculatorInput2.default(testInput);
        it("should have null currentTaxRate", function () {
          _assert2.default.strictEqual(result.currentTaxRate, null);
        });
        it("should have null amountInvested", function () {
          _assert2.default.strictEqual(result.amountInvested, null);
        });
        it("should have null retirementTaxRate", function () {
          _assert2.default.strictEqual(result.retirementTaxRate, null);
        });
        it("should have null investmentGrowthRate", function () {
          _assert2.default.strictEqual(result.investmentGrowthRate, null);
        });
        it("should have null inflationRate", function () {
          _assert2.default.strictEqual(result.inflationRate, null);
        });
        it("should have null yearsInvested", function () {
          _assert2.default.strictEqual(result.yearsInvested, null);
        });
      });

      describe("fields undefined", function () {
        var result = new _CalculatorInput2.default({});
        it("should have null currentTaxRate", function () {
          _assert2.default.strictEqual(result.currentTaxRate, null);
        });
        it("should have null amountInvested", function () {
          _assert2.default.strictEqual(result.amountInvested, null);
        });
        it("should have null retirementTaxRate", function () {
          _assert2.default.strictEqual(result.retirementTaxRate, null);
        });
        it("should have null investmentGrowthRate", function () {
          _assert2.default.strictEqual(result.investmentGrowthRate, null);
        });
        it("should have null inflationRate", function () {
          _assert2.default.strictEqual(result.inflationRate, null);
        });
        it("should have null yearsInvested", function () {
          _assert2.default.strictEqual(result.yearsInvested, null);
        });
      });
    });
  });
});