<script lang="ts" setup>
import type { WidgetIcon } from '~/types/widgets'

defineProps<{
  baseIcons: WidgetIcon[]
  selectedIcon: WidgetIcon | null
  hasBaseIcons: boolean
}>()

const emit = defineEmits(['select-icon'])

function selectIcon (icon: WidgetIcon, type: 'base_icon' | 'icon') {
  emit('select-icon', { type, icon })
}
</script>

<template>
  <div class="flex flex-col gap-4 mb-10">
    <div class="text-lg font-medium">Выбрать стандартные иконки</div>
    <div>
      <div v-if="baseIcons">
        <div v-if="hasBaseIcons" class="flex gap-4 flex-wrap">
          <div
            v-for="icon in baseIcons"
            :key="icon.id"
            class="flex items-center gap-4 p-2 rounded-lg border-2 transition-all duration-300 cursor-pointer"
            :class="{
              'border-slate-800 opacity-100': selectedIcon?.id === icon.id,
              'border-slate-200 opacity-80 hover:border-slate-800 hover:opacity-100': selectedIcon?.id !== icon.id,
            }"
            @click="selectIcon(icon, 'base_icon')"
          >
            <div>
              <img :src="icon.url" :alt="icon.name" class="size-14 object-contain" />
            </div>
            <div>{{ icon.name }}</div>
          </div>
        </div>
        <div v-else>Список иконок пуст</div>
      </div>
      <div v-else>Загрузка стандартных иконок...</div>
    </div>
  </div>
</template>

<style>

</style>
