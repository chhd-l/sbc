import {checkAuth,checkMenu} from "../checkAuth"
import { cache } from 'qmkit';

describe("checkAuth 函数测试", () => {
    sessionStorage.setItem(cache.LOGIN_FUNCTIONS,'["s2b-supplier@functions"]')
    it('checkAuth',()=>{
        expect(checkAuth('s2b-supplier@functions')).not.toBe('')
        expect(checkAuth('')).toBeFalsy()
    })

    it('checkMenu',()=>{
        sessionStorage.setItem(cache.LOGIN_FUNCTIONS,'["s2b-supplier@functions"]')
        expect(checkMenu('none')).toBeTruthy()
        expect(checkMenu('s2b-supplier@functions')).not.toBe("")
    })
})