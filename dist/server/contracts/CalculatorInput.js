"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require("../util");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * constructor
 * @param {number} (or string representation of number) currentTaxRate tax rate expressed as percentage. % okay but not necessary. - values accepted.
 * @param {number} (or string representation of number) amountInvested. Must be positive. $ ok but not necessary.
 * @param {number} (or string representation of number) retirementTaxRate tax rate expressed as percentage. % okay but not necessary. - values accepted.
 * @param {number} (or string representation of number) investmentGrowthRate expressed as percentage. % okay but not necessary. - values accepted.
 * @param {number} (or string representation of number) inflationRate expressed as percentage. % okay but not necessary. - values accepted.
 * @param {number} (or string representation of number) yearsInvested. Must be positive.
 */
var CalculatorInput = function CalculatorInput(_ref) {
  var currentTaxRate = _ref.currentTaxRate,
      amountInvested = _ref.amountInvested,
      retirementTaxRate = _ref.retirementTaxRate,
      investmentGrowthRate = _ref.investmentGrowthRate,
      inflationRate = _ref.inflationRate,
      yearsInvested = _ref.yearsInvested;

  _classCallCheck(this, CalculatorInput);

  this.currentTaxRate = (0, _util.toNumber)(currentTaxRate);
  this.amountInvested = (0, _util.toNumber)(amountInvested);
  this.retirementTaxRate = (0, _util.toNumber)(retirementTaxRate);
  this.investmentGrowthRate = (0, _util.toNumber)(investmentGrowthRate);
  this.inflationRate = (0, _util.toNumber)(inflationRate);
  this.yearsInvested = (0, _util.toNumber)(yearsInvested);
};

exports.default = CalculatorInput;