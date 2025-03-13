<script lang="ts" setup>
defineProps<{
  isCollapsed: boolean
}>()

type NAVIGATION = {
  name: string,
  link: string,
  icon: string
}

const navigation = ref<NAVIGATION[]>([
  { name: 'Главная', link: '/', icon: 'ic:baseline-home' },
  { name: 'Статистика', link: '/statistic', icon: 'ic:baseline-bar-chart' },
  { name: 'Виджет', link: '/widget', icon: 'ic:baseline-widgets' },
  { name: 'Платежи', link: '/payments', icon: 'ic:baseline-payment' },
  { name: 'Настройки', link: '/settings', icon: 'ic:baseline-settings' }
])

const route = useRoute()
</script>

<template>
  <aside
    class="bg-slate-800 border-r border-border transition-all duration-300 ease-in-out overflow-hidden"
    :class="isCollapsed ? 'w-24' : 'w-64'"
  >
    <nav class="flex flex-col gap-4 p-4">
      <NuxtLink
        v-for="item in navigation"
        :key="item.name"
        :to="item.link"
        class="p-4 rounded-xl text-white hover:bg-slate-700 transition-all duration-300 ease-in-out flex items-center"
        :class="[route.path === item.link ? 'bg-slate-700' : '']"
      >
        <Icon :name="item.icon" class="size-8 shrink-0" />
        <span v-if="!isCollapsed" class="ml-2 text-xl">{{ item.name }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<style>

</style>
