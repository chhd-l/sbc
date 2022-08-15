import {checkAuth} from "../checkAuth"

describe("checkAuth 函数测试", () => {
    it('checkAuth',()=>{
        console.log(123,checkAuth('s2b-supplier@functions'))
        expect(checkAuth('s2b-supplier@functions')).not.toBe('')
        expect(checkAuth('')).toBeFalsy()
    })
})