import {checkAuth} from "../checkAuth"
import { cache } from 'qmkit';

describe("checkAuth 函数测试", () => {
    sessionStorage.setItem(cache.LOGIN_FUNCTIONS,'["s2b-supplier@functions"]')
    it('checkAuth',()=>{
        expect(checkAuth('s2b-supplier@functions')).not.toBe('')
        expect(checkAuth('')).toBeFalsy()
    })
})