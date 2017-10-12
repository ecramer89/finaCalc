"use strict";

var _util = require("../server/util");

var Util = _interopRequireWildcard(_util);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe("test roundTo", function () {
  describe("value is 0", function () {
    it("should return 0", function () {
      _assert2.default.equal(Util.roundTo(0, 1), 0);
    });
  });
  describe("value is positive", function () {
    describe("integer", function () {
      describe("places is 0", function () {
        it("should return the integer value", function () {
          _assert2.default.strictEqual(Util.roundTo(123, 0), 123);
        });
      });
      describe("places is non-zero", function () {
        it("should return the integer value", function () {
          _assert2.default.strictEqual(Util.roundTo(123, 2), 123);
        });
      });
    });
    describe("mixed number", function () {

      describe("positive integer portion", function () {
        describe("places is 0", function () {
          it("should return the integer", function () {
            _assert2.default.strictEqual(Util.roundTo(123.45678, 0), 123);
          });
        });
        describe("places > 0", function () {
          describe("places exceeds length of mantessa", function () {
            it("should return input", function () {
              _assert2.default.strictEqual(Util.roundTo(123.45678, 6), 123.45678);
            });
          });
          describe("places equals length of mantessa", function () {
            it("should return input", function () {
              _assert2.default.strictEqual(Util.roundTo(123.45678, 5), 123.45678);
            });
          });
          describe("last removed digit < 5", function () {
            describe("places one less than length of mantessa", function () {
              it("should remove last digit from mantessa", function () {
                _assert2.default.strictEqual(Util.roundTo(123.45674, 4), 123.4567);
              });
            });
            describe("places is one", function () {
              it("should retain only first digit of mantessa", function () {
                _assert2.default.strictEqual(Util.roundTo(123.45678, 1), 123.5);
              });
            });
            describe("places is midway through mantessa", function () {
              it("should remove first half of digits of mantessa", function () {
                _assert2.default.strictEqual(Util.roundTo(123.45628, 3), 123.456);
              });
            });
          });
          describe("last removed digit is 5 (roundup boundary)", function () {

            describe("places is midway through mantessa", function () {
              it("should increase last digit by 1", function () {
                _assert2.default.strictEqual(Util.roundTo(123.45658, 3), 123.457);
              });
            });
          });
          describe("last removed digit is > 5", function () {
            describe("places is midway through mantessa", function () {
              it("should increase last digit by 1", function () {
                _assert2.default.strictEqual(Util.roundTo(123.45688, 3), 123.457);
              });
            });
          });
          describe("last remaining digit is 9", function () {
            it("should remove and promote next digit by 1", function () {
              _assert2.default.strictEqual(Util.roundTo(123.498, 2), 123.5);
            });
          });
          describe("round promotes integer", function () {
            it("should increase integer by 1", function () {
              _assert2.default.strictEqual(Util.roundTo(123.995, 2), 124);
            });
          });
        });
      });
      //test only a subset of cases to ensure it treats mixed numbers w/o integer portion the same
      describe("integer portion is 0", function () {
        describe("places is midway through mantessa", function () {

          describe("removed digit < 5", function () {
            it("should remove first half of digits of mantessa", function () {
              _assert2.default.strictEqual(Util.roundTo(.45628, 3), .456);
            });
          });
          describe("removed digit == 5", function () {
            it("should remove first half of digits of mantessa, promote last", function () {
              _assert2.default.strictEqual(Util.roundTo(.45658, 3), .457);
            });
          });
          describe("removed digit > 5", function () {
            it("should remove first half of digits of mantessa, promote last", function () {
              _assert2.default.strictEqual(Util.roundTo(.45678, 3), .457);
            });
          });
          describe("last digit rounds up to next place", function () {
            it("should remove first half of digits of mantessa", function () {
              _assert2.default.strictEqual(Util.roundTo(.4598, 3), .46);
            });
          });
          describe("all digits round to next place", function () {
            it("should promote the integer", function () {
              _assert2.default.strictEqual(Util.roundTo(.9998, 3), 1);
            });
          });
        });
      });
    });
  });
  //don't bother re-testing all combinations of places and input; just verify that it doesn't strip the sign of input in its operations.
  describe("value is negative", function () {
    it("should retain the sign of the input", function () {
      _assert2.default.strictEqual(Util.roundTo(-566.45678, 3), -566.457);
    });
  });

  describe("places is negative", function () {
    it("should return value", function () {
      _assert2.default.strictEqual(Util.roundTo(566.45678, -1), 566.45678);
    });
  });
});

describe("toNumber", function () {

  describe("handles null, empty or undefined", function () {
    describe("null", function () {
      it("should return null", function () {
        _assert2.default.equal(Util.toNumber(null), null);
      });
    });
    describe("undefined", function () {
      it("should return null", function () {
        _assert2.default.equal(Util.toNumber(undefined), null);
      });
    });
    describe("empty", function () {
      it("should return null", function () {
        _assert2.default.equal(Util.toNumber(""), null);
      });
    });
  });

  describe("handles numeric strings", function () {
    describe("positive integer", function () {
      it("should return the parsed integer as number", function () {
        _assert2.default.ok(Util.toNumber("12334") === 12334); //apply strict equality. basic assert. equal returns true for 12334="12334"
      });
    });
    describe("negative integer", function () {
      it("should return the parsed integer as number", function () {
        _assert2.default.ok(Util.toNumber("-12334") === -12334);
      });
    });
    describe("0", function () {
      it("should return the parsed integer as number", function () {
        _assert2.default.ok(Util.toNumber("0") === 0);
      });
    });
    describe("mixed number", function () {
      describe("one digit mantessa", function () {
        it("should return the parsed number as number", function () {
          _assert2.default.ok(Util.toNumber("12.3") === 12.3);
        });
      });
      describe("many digit mantessa", function () {
        it("should return the parsed number as number", function () {
          _assert2.default.ok(Util.toNumber("12.323456766") === 12.323456766);
        });
      });
      describe("one digit integer", function () {
        it("should return the parsed number as number", function () {
          _assert2.default.ok(Util.toNumber("2.323456766") === 2.323456766);
        });
      });
    });
    describe("0 < number < 1", function () {
      describe("one digit mantessa", function () {
        it("should return the parsed number as number", function () {
          _assert2.default.ok(Util.toNumber(".3") === .3);
        });
      });
      describe("many digit mantessa", function () {
        it("should return the parsed number as number", function () {
          _assert2.default.ok(Util.toNumber(".323456766") === .323456766);
        });
      });
      describe("mantessa leads with 0", function () {
        it("should return the parsed number as number", function () {
          _assert2.default.ok(Util.toNumber(".0323456766") === .0323456766);
        });
      });
    });
    describe("contains dollar sign", function () {
      it("should return the parsed number as number", function () {
        _assert2.default.ok(Util.toNumber("1233.45$") === 1233.45);
      });
    });
    describe("contains percent sign", function () {
      it("should return the parsed number as number", function () {
        _assert2.default.ok(Util.toNumber("89.45%") === 89.45);
      });
    });
  });

  describe("handles numbers", function () {
    describe("positive integer", function () {
      it("should return the integer", function () {
        _assert2.default.ok(Util.toNumber(12334) === 12334); //apply strict equality. basic assert. equal returns true for 12334="12334"
      });
    });
    describe("negative integer", function () {
      it("should return the number", function () {
        _assert2.default.ok(Util.toNumber(-12334) === -12334);
      });
    });
    describe("0", function () {
      it("should return the number", function () {
        _assert2.default.ok(Util.toNumber(0) === 0);
      });
    });
    describe("mixed number", function () {
      describe("one digit mantessa", function () {
        it("should return the number", function () {
          _assert2.default.ok(Util.toNumber(12.3) === 12.3);
        });
      });
      describe("many digit mantessa", function () {
        it("should return the number", function () {
          _assert2.default.ok(Util.toNumber(12.323456766) === 12.323456766);
        });
      });
      describe("one digit integer", function () {
        it("should return the number", function () {
          _assert2.default.ok(Util.toNumber(2.323456766) === 2.323456766);
        });
      });
    });
    describe("0 < number < 1", function () {
      describe("one digit mantessa", function () {
        it("should return the number", function () {
          _assert2.default.ok(Util.toNumber(.3) === .3);
        });
      });
      describe("many digit mantessa", function () {
        it("should return the number", function () {
          _assert2.default.ok(Util.toNumber(.323456766) === .323456766);
        });
      });
      describe("mantessa leads with 0", function () {
        it("should return the number", function () {
          _assert2.default.ok(Util.toNumber(.0323456766) === .0323456766);
        });
      });
    });
  });

  describe("handles strings that are not numbers", function () {
    describe("string contains no numbers", function () {
      it("should return null", function () {
        _assert2.default.equal(Util.toNumber("asbdss"), null);
      });
    });
  });

  describe("handles other data types", function () {
    describe("object", function () {
      it("should return null", function () {
        _assert2.default.equal(Util.toNumber({}), null);
      });
    });

    describe("boolean", function () {
      describe("true", function () {
        it("should return null", function () {
          _assert2.default.equal(Util.toNumber(true), null);
        });
      });
      describe("false", function () {
        it("should return null", function () {
          _assert2.default.equal(Util.toNumber(false), null);
        });
      });
    });

    describe("array", function () {
      it("should return null", function () {
        _assert2.default.equal(Util.toNumber([]), null);
      });
    });
  });
});