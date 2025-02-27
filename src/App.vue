<script setup lang="ts">
import { unref } from 'vue'
import { loadLocaleMessages, i18n } from './locales'
const handleClick = () => {
  const lang = unref(i18n.global.locale) === 'zh-CN' ? 'en-US' : 'zh-CN'
  loadLocaleMessages(lang)
}
</script>

<template>
  <div>{{ $t('test.test1.title', { name: '123' }, '测试标题') }}</div>
  <button @click="handleClick">更换语言</button>
  <button @click="handleClick">default: 更11换语言</button>
  <button @click="handleClick">default: 更111换语言</button>
</template>

<style scoped></style>
