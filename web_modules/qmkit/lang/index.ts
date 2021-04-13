
import { cache } from 'qmkit';
const context = (require as any).context('./files', false, /\.ts$/)
const importAll = context => {
  const map = {}
  for (const key of context.keys()) {
    const keyArr = key.split('/')
    keyArr.shift()
    map[keyArr.join('.').replace(/\.ts$/g, '')] = context(key).default||context(key)
  }
  return map
}
let key = sessionStorage.getItem(cache.LANGUAGE)
let langFile = importAll(context)
let language: any = langFile[key];
let antLanguage: any = langFile[key + '_antd'];
export {
  language,
  antLanguage
}