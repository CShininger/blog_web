import type { App } from 'vue'
import { unref } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: '',
  messages: {},
})
const $t = i18n.global.t

const modules = import.meta.glob('./langs/**/*.json')
const localesMap = loadLocalesMapFromDir(/\.\/langs\/([^/]+)\/(.*)\.json$/, modules)

/**
 * 将符合正则的json文件，处理成map结构：语言->返回json文件的方法
 */
function loadLocalesMapFromDir(regexp: RegExp, modules: Record<string, () => Promise<unknown>>) {
  const localesRaw: Record<string, Record<string, () => Promise<unknown>>> = {}
  const localesMap: Record<string, () => Promise<{ default: Record<string, string> }>> = {}
  for (const path in modules) {
    const match = path.match(regexp)
    if (match) {
      const [_, locale, fileName] = match
      if (locale && fileName) {
        if (!localesRaw[locale]) {
          localesRaw[locale] = {}
        }
        if (modules[path]) {
          localesRaw[locale][fileName] = modules[path]
        }
      }
    }
  }
  for (const [locale, files] of Object.entries(localesRaw)) {
    localesMap[locale] = async () => {
      const messages: Record<string, any> = {}
      for (const [fileName, importFn] of Object.entries(files)) {
        messages[fileName] = ((await importFn()) as any)?.default
      }
      return { default: messages }
    }
  }
  return localesMap
}

/**
 *  初始化i18n，绑定app
 */
async function setupI18n(app: App, options: { locale?: string }) {
  const { locale = 'zh-CN' } = options
  app.use(i18n)
  await loadLocaleMessages(locale)
  i18n.global.setMissingHandler((locale, key) => {
    console.warn(`[intlify] Not found '${key}' key in '${locale}' locale messages.`)
  })
}

/**
 * 更改语言
 */
function setI18nLanguage(locale: string) {
  i18n.global.locale.value = locale
}

/**
 * 根据语言执行对应方法，将json写入i18n
 */
async function loadLocaleMessages(lang: string) {
  if (unref(i18n.global.locale) === lang) {
    return setI18nLanguage(lang)
  }
  const message = await localesMap[lang]?.()
  if (message?.default) {
    i18n.global.setLocaleMessage(lang, message.default)
  }
  return setI18nLanguage(lang)
}

export { $t, i18n, setupI18n, loadLocaleMessages }
