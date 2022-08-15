import {checkAuth} from "../checkAuth"

describe("checkAuth 函数测试", () => {
    it('checkAuth',()=>{
        expect(checkAuth('s2b-supplier@functions')).not.toBe('')
        expect(checkAuth('')).toBeFalsy()
    })
})