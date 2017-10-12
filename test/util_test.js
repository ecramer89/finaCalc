import * as Util from "../server/util"
import assert from "assert"

describe("toNumber", ()=>{

  describe("handles null, empty or undefined", ()=>{
    describe("null", ()=>{
      it("should return null", ()=> {
        assert.equal(Util.toNumber(null), null)
      })
    })
    describe("undefined", ()=>{

    })
    describe("empty", ()=>{

    })
  })

  describe("handles numeric strings", ()=>{

  })

  describe("handles numbers", ()=>{

  })

  describe("handles other data types", ()=>{
    describe("object", ()=>{

    })

    describe("boolean", ()=>{

    })

    describe("array", ()=>{

    })
  })
})


