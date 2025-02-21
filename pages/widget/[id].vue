<template>
  <div v-if="widget" class="flex flex-col">
    <div>
      ID: {{ widget.id }}
    </div>
    <div>
      Name: {{ widget.name }}
    </div>
    <div>
      isActive: {{ widget.isActive ? 'Активен' : 'Неактивен' }}
    </div>
    <div>
      Created_by: {{ widget.created_by }}
    </div>
    <div v-for="manager in widget.manager_tg_id">
      Manager: {{ manager }}
    </div>
    <div>
      DOMAIN: {{ widget.domain }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const widgetStore = useWidgetStore()
const widget = ref<WidgetInfo>()

onMounted(async () => {
  await widgetStore.getWidgetInfo(Number(route.params.id))
  widget.value = widgetStore.widgetInfo
})
</script>

<style>

</style>
