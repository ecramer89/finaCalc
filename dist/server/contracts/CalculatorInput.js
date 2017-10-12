"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require("../util"),
    toNumber = _require.toNumber;

var CalculatorInput = function CalculatorInput(data) {
  _classCallCheck(this, CalculatorInput);

  this.currentTaxRate = toNumber(data.currentTaxRate);
  this.amountInvested = toNumber(data.amountInvested);
  this.retirementTaxRate = toNumber(data.retirementTaxRate);
  this.investmentGrowthRate = toNumber(data.investmentGrowthRate);
  this.inflationRate = toNumber(data.inflationRate);
  this.yearsInvested = toNumber(data.yearsInvested);
};

module.exports = CalculatorInput;