<template>
  <div class="flex flex-col justify-center items-center min-h-svh">

    <form action="" @submit.prevent="onSubmit">
      
      <Card class="w-full max-w-md">
        <CardHeader class="flex flex-col gap-2">
          <CardTitle class="text-2xl">
            Авторизация
          </CardTitle>
          <CardDescription>
            Введите логин и пароль, чтобы войти в аккаунт
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="username">Логин</Label>
            <Input v-model="form.username" id="username" placeholder="Введите логин" :disabled="authStore.isLoading" />
          </div>
          <div class="grid gap-2">
            <Label for="password">Пароль</Label>
            <Input v-model="form.password" id="password" type="password" placeholder="Введите пароль" :disabled="authStore.isLoading" />
          </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-4">
          <Button class="w-full" :disabled="authStore.isLoading">
            {{ authStore.isLoading ? 'Загрузка...' : 'Войти' }}
          </Button>

          <div
            v-if="authStore.errorMessage"
            class="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded"
          >
            {{ authStore.errorMessage }}
          </div>
        </CardFooter>
      </Card>

    </form>

    <Notification
      v-if="notification.show"
      :type="notification.type"
      :message="notification.message"
      @close="notification.show = false"
    />

  </div>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Авторизация',
  description: 'Страница авторизации'
})

type PAYLOAD = {
  password: string,
  username: string
}

const form = ref<PAYLOAD>({
  username: '',
  password: ''
})

const authStore = useAuthStoreBff()
const router = useRouter()

const notification = ref({
  show: false,
  type: 'success' as 'success' | 'warning' | 'error',
  message: '',
})

const showNotification = (type: 'success' | 'warning' | 'error', message: string) => {
  notification.value = { show: true, type, message };
}

const onSubmit = async () => {
  try {
    const response = await authStore.login(form.value.username, form.value.password)
    showNotification('success', 'Успешная авторизация')
    await router.push('/')
  } catch(error) {
    showNotification('error', 'Ошибка авторизации')
  }
}

</script>

<style>

</style>
