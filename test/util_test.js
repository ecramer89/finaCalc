import * as Util from "../server/util"
import assert from "assert"



describe("test roundTo", ()=> {
    describe("value is 0", () => {
       it("should return 0", ()=>{
         assert.equal(Util.roundTo(0, 1), 0)
       })
    })
    describe("value is positive", () => {
      describe("integer", () => {
        describe("places is 0", () => {
          it("should return the integer value", () => {
            assert.strictEqual(Util.roundTo(123, 0), 123)
          })
        })
        describe("places is non-zero", () => {
          it("should return the integer value", () => {
            assert.strictEqual(Util.roundTo(123, 2), 123)
          })
        })
      })
      describe("mixed number", () => {

        describe("positive integer portion", () => {
          describe("places is 0", () => {
            it("should return the integer", () => {
              assert.strictEqual(Util.roundTo(123.45678, 0), 123)
            })
          })
          describe("places > 0", () => {
            describe("places exceeds length of mantessa", () => {
              it("should return input", () => {
                assert.strictEqual(Util.roundTo(123.45678, 6), 123.45678)
              })
            })
            describe("places equals length of mantessa", () => {
              it("should return input", () => {
                assert.strictEqual(Util.roundTo(123.45678, 5), 123.45678)
              })
            })
            describe("last removed digit < 5", () => {
              describe("places one less than length of mantessa", () => {
                it("should remove last digit from mantessa", () => {
                  assert.strictEqual(Util.roundTo(123.45674, 4), 123.4567)
                })
              })
              describe("places is one", () => {
                it("should retain only first digit of mantessa", () => {
                  assert.strictEqual(Util.roundTo(123.45678, 1), 123.5)
                })
              })
              describe("places is midway through mantessa", () => {
                it("should remove first half of digits of mantessa", () => {
                  assert.strictEqual(Util.roundTo(123.45628, 3), 123.456)
                })
              })
            })
            describe("last removed digit is 5 (roundup boundary)", () => {

              describe("places is midway through mantessa", () => {
                it("should increase last digit by 1", () => {
                  assert.strictEqual(Util.roundTo(123.45658, 3), 123.457)
                })
              })
            })
            describe("last removed digit is > 5", () => {
              describe("places is midway through mantessa", () => {
                it("should increase last digit by 1", () => {
                  assert.strictEqual(Util.roundTo(123.45688, 3), 123.457)
                })
              })
            })
            describe("last remaining digit is 9", () => {
              it("should remove and promote next digit by 1", () => {
                assert.strictEqual(Util.roundTo(123.498, 2), 123.5)
              })
            })
            describe("round promotes integer", () => {
              it("should increase integer by 1", () => {
                assert.strictEqual(Util.roundTo(123.995, 2), 124)
              })
            })
          })
        })
        //test only a subset of cases to ensure it treats mixed numbers w/o integer portion the same
        describe("integer portion is 0", () => {
          describe("places is midway through mantessa", () => {

            describe("removed digit < 5", () => {
              it("should remove first half of digits of mantessa", () => {
                assert.strictEqual(Util.roundTo(.45628, 3), .456)
              })
            })
            describe("removed digit == 5", () => {
              it("should remove first half of digits of mantessa, promote last", () => {
                assert.strictEqual(Util.roundTo(.45658, 3), .457)
              })
            })
            describe("removed digit > 5", () => {
              it("should remove first half of digits of mantessa, promote last", () => {
                assert.strictEqual(Util.roundTo(.45678, 3), .457)
              })
            })
            describe("last digit rounds up to next place", () => {
              it("should remove first half of digits of mantessa", () => {
                assert.strictEqual(Util.roundTo(.4598, 3), .46)
              })
            })
            describe("all digits round to next place", () => {
              it("should promote the integer", () => {
                assert.strictEqual(Util.roundTo(.9998, 3), 1)
              })
            })
          })
        })
      })
    })
    //don't bother re-testing all combinations of places and input; just verify that it doesn't strip the sign of input in its operations.
    describe("value is negative", () => {
       it("should retain the sign of the input", ()=>{
         assert.strictEqual(Util.roundTo(-566.45678, 3), -566.457)
       })
    })

    describe("places is negative", ()=>{
        it("should return value", () => {
          assert.strictEqual(Util.roundTo(566.45678, -1), 566.45678)
        })
    })
})

describe("toNumber", ()=> {

  describe("handles null, empty or undefined", () => {
    describe("null", () => {
      it("should return null", () => {
        assert.equal(Util.toNumber(null), null)
      })
    })
    describe("undefined", () => {
      it("should return null", () => {
        assert.equal(Util.toNumber(undefined), null)
      })
    })
    describe("empty", () => {
      it("should return null", () => {
        assert.equal(Util.toNumber(""), null)
      })
    })
  })



  describe("handles numeric strings", ()=>{
    describe("positive integer", () => {
      it("should return the parsed integer as number", () => {
        assert.ok(Util.toNumber("12334") === 12334) //apply strict equality. basic assert. equal returns true for 12334="12334"
      })
    })
    describe("negative integer", () => {
      it("should return the parsed integer as number", () => {
        assert.ok(Util.toNumber("-12334") === -12334)
      })
    })
    describe("0", () => {
      it("should return the parsed integer as number", () => {
        assert.ok(Util.toNumber("0") === 0)
      })
    })
    describe("mixed number", () => {
      describe("one digit mantessa", ()=> {
        it("should return the parsed number as number", () => {
          assert.ok(Util.toNumber("12.3") === 12.3)
        })
      })
      describe("many digit mantessa", ()=> {
        it("should return the parsed number as number", () => {
          assert.ok(Util.toNumber("12.323456766") === 12.323456766)
        })
      })
      describe("one digit integer", ()=> {
        it("should return the parsed number as number", () => {
          assert.ok(Util.toNumber("2.323456766") === 2.323456766)
        })
      })
    })
    describe("0 < number < 1", () => {
      describe("one digit mantessa", ()=> {
        it("should return the parsed number as number", () => {
          assert.ok(Util.toNumber(".3") === .3)
        })
      })
      describe("many digit mantessa", ()=> {
        it("should return the parsed number as number", () => {
          assert.ok(Util.toNumber(".323456766") === .323456766)
        })
      })
      describe("mantessa leads with 0", ()=> {
        it("should return the parsed number as number", () => {
          assert.ok(Util.toNumber(".0323456766") === .0323456766)
        })
      })
    })
    describe("contains dollar sign", ()=>{
      it("should return the parsed number as number", () => {
        assert.ok(Util.toNumber("1233.45$") === 1233.45)
      })
    })
    describe("contains percent sign", ()=>{
      it("should return the parsed number as number", () => {
        assert.ok(Util.toNumber("89.45%") === 89.45)
      })
    })
  })

  describe("handles numbers", ()=>{
    describe("positive integer", () => {
      it("should return the integer", () => {
        assert.ok(Util.toNumber(12334) === 12334) //apply strict equality. basic assert. equal returns true for 12334="12334"
      })
    })
    describe("negative integer", () => {
      it("should return the number", () => {
        assert.ok(Util.toNumber(-12334) === -12334)
      })
    })
    describe("0", () => {
      it("should return the number", () => {
        assert.ok(Util.toNumber(0) === 0)
      })
    })
    describe("mixed number", () => {
      describe("one digit mantessa", ()=> {
        it("should return the number", () => {
          assert.ok(Util.toNumber(12.3) === 12.3)
        })
      })
      describe("many digit mantessa", ()=> {
        it("should return the number", () => {
          assert.ok(Util.toNumber(12.323456766) === 12.323456766)
        })
      })
      describe("one digit integer", ()=> {
        it("should return the number", () => {
          assert.ok(Util.toNumber(2.323456766) === 2.323456766)
        })
      })
    })
    describe("0 < number < 1", () => {
      describe("one digit mantessa", ()=> {
        it("should return the number", () => {
          assert.ok(Util.toNumber(.3) === .3)
        })
      })
      describe("many digit mantessa", ()=> {
        it("should return the number", () => {
          assert.ok(Util.toNumber(.323456766) === .323456766)
        })
      })
      describe("mantessa leads with 0", ()=> {
        it("should return the number", () => {
          assert.ok(Util.toNumber(.0323456766) === .0323456766)
        })
      })
    })
  })

  describe("handles strings that are not numbers", ()=>{
    describe("string contains no numbers", ()=>{
      it("should return null", () => {
        assert.equal(Util.toNumber("asbdss"), null)
      })
    })
  })

  describe("handles other data types", ()=>{
    describe("object", ()=>{
      it("should return null", () => {
        assert.equal(Util.toNumber({}), null)
      })
    })

    describe("boolean", ()=>{
      describe("true", ()=> {
        it("should return null", () => {
          assert.equal(Util.toNumber(true), null)
        })
      })
      describe("false", ()=> {
        it("should return null", () => {
          assert.equal(Util.toNumber(false), null)
        })
      })
    })

    describe("array", ()=>{
      it("should return null", () => {
        assert.equal(Util.toNumber([]), null)
      })
    })
  })
})


