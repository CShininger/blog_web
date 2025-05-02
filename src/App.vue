<script setup lang="ts">
import { unref } from 'vue'
import { loadLocaleMessages, i18n } from './locales'
const handleClick = () => {
  const lang = unref(i18n.global.locale) === 'zh-CN' ? 'en-US' : 'zh-CN'
  loadLocaleMessages(lang)
}

const intl = (options: { id: string; def: string; obj?: string }) => {
  const { id, def } = options
  return 'text' + id + def
}
//单行注释

/**
 * 注释三行
 */
</script>

<template>
  <!-- div注释  -->
  <div>{{ $t('test.test1.title', { name: '123' }, '测试标题') }}</div>
  <button @click="handleClick">更换语言</button>
  <button @click="handleClick">default: 更11换语言</button>
  <button @click="handleClick">default: 更111换语言</button>
  <span>{{ intl({ id: '笋干', def: '笋干def' }) }}</span>
  <span>{{ intl({ id: '测试', def: '测试def', obj: '测试obj' }) }}</span>
</template>

<style scoped></style>
