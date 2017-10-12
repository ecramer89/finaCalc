import * as Util from "../server/util"
import assert from "assert"

describe("toNumber", ()=>{

  describe("handles null, empty or undefined", ()=> {
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


