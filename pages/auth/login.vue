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
            <Input v-model="form.username" id="username" placeholder="Введите логин" />
          </div>
          <div class="grid gap-2">
            <Label for="password">Пароль</Label>
            <Input v-model="form.password" id="password" type="password" placeholder="Введите пароль" />
          </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-4">
          <Button class="w-full">
            Войти
          </Button>

          <div
            v-if="errorMessage"
            class="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded"
          >
            {{ errorMessage }}
          </div>
        </CardFooter>
      </Card>

    </form>

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

const authStore = useAuthStore()
const router = useRouter()

const errorMessage = ref<string | null>(null)

const onSubmit = async () => {
  errorMessage.value = null

  try {
    await authStore.login(form.value.username, form.value.password)
    await router.push('/')
  } catch(err) {
    errorMessage.value = err instanceof Error ? err.message : 'Ошибка авторизации'
  }
}

</script>

<style>

</style>
