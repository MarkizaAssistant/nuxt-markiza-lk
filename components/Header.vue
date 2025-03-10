<template>
  <header class="w-full h-28 flex justify-between bg-slate-800 px-4 items-center">
    <div class="flex items-center gap-4 text-white">
      <Button variant="ghost" class="hover:bg-slate-700 hover:text-white" @click="$emit('toggle')">
        <Icon :name="isCollapsed ? 'ic:baseline-menu' : 'ic:baseline-menu-open'" class="size-8" />
      </Button>
      <h1 class="text-4xl uppercase">
        <span class="text-blue-300">Я</span>Маркиза
      </h1>
    </div>

    <div class="flex gap-4 items-center text-white">
      <div class="flex flex-col">
        <div class="flex gap-4 items-center">
          Вы вошли как
          <div v-if="userData">
            <strong v-if="userData?.email !== ''">{{ userData?.email }}</strong>
            <strong v-else>{{ userData?.username }}</strong>
          </div>
          <div v-else>
            <strong>Загрузка...</strong>
          </div>
          <Button variant="ghost" class="hover:bg-slate-700 hover:text-white">
            Профиль
          </Button>
          <span>|</span>
          <Button variant="ghost" class="hover:bg-slate-700 hover:text-white" @click="onLogout">
            Выйти
          </Button>
        </div>
        <div class="flex gap-4 items-center">
          Ваш тариф <strong>Business (trial)</strong> 
          <Button variant="ghost" class="hover:bg-slate-700 hover:text-white">
            Сменить
          </Button>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
defineProps({
  isCollapsed: {
    type: Boolean,
    required: true
  },
})

const authStore = useAuthStore()

const { data: userData } = await useAsyncData('user', async () => {
  const userProfile = await authStore.profile()
  return userProfile || null
}, { server: true })

const onLogout = async () => {
  const response = await authStore.logout()
  useRouter().push('/auth/login')
}
</script>

<style>

</style>
