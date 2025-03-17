<script lang="ts" setup>
import hljs from 'highlight.js/lib/core'
import html from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/default.css'

const notificationStore = useNotificationStore()

const code = ref(`
<!-- Подключение виджета ЯМаркиза yamarkiza.ru -->
  <link rel="stylesheet" href="https://api.yamarkiza.ru/widget-static/widgetcss.css">
  <script defer src="https://api.yamarkiza.ru/widget-static/widgetjs.js"><\/script>
<!-- Подключение виджета ЯМаркиза yamarkiza.ru -->
`)

const copyCode = () => {
  navigator.clipboard.writeText(code.value).then(() => {
    notificationStore.addNotification('success', 'Код скопирован в буфер обмена!')
  })
}

hljs.registerLanguage('html', html)

onMounted(() => {
  hljs.highlightAll()
})
</script>

<template>
  <div class="border border-gray-300 rounded-lg shadow-sm p-4 flex flex-col gap-4">
    <h2 class="font-semibold text-xl">Код виджета для установки на сайт</h2>

    <div class="bg-lime-200 w-2/3 flex items-center justify-center px-10 py-4 rounded-lg mb-4">
      Внимание: установлена защита кода виджета по домену. Виджет будет работать только на указанных доменах на вкладке "Сайты"
    </div>

    <span>
      Код должен быть размещен на каждой странице вашего сайта перед тегом 
      <code class="text-slate-500 font-bold"><span>&lt;</span>/body<span>&gt;</span></code>.
    </span>

    <div class="relative w-2/3">
      <pre class="overflow-x-auto border rounded-lg bg-[#f3f3f3]">
        <code class="language-html font-mono text-sm">{{ code }}</code>
      </pre>
      <button
        @click="copyCode"
        class="absolute top-2 right-2 bg-slate-700 text-white p-2 rounded-md hover:bg-slate-600 transition-colors flex items-center"
      >
        <Icon name="ph:copy-bold" class="size-6" />
      </button>
    </div>
  </div>
</template>
