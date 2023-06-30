<script setup lang="ts">
  import { onBeforeMount, onMounted, ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import MoldemeService from '../services/MoldemeService'
  import UserController from '../controllers/UserController'

  const router = useRouter()
  const route = useRoute()
  const email = ref('henriquemauler@gmail.com')
  const password = ref('052NEGk=')
  const errorMessage = ref('')

  // Se comporta como um controller também, porém irei específica o controller para aplicar liskov e inversão de controle (p/ SOLID)
  const submitForm = async (e: Event) => {
    e.preventDefault()
    const apiService = new MoldemeService('https://recrutamento.molde.me/login');
    const userController = new UserController(apiService)
    
    const next_router = route.query.next as string
    
    if(!next_router) {
      errorMessage.value = ""
    }


    userController.login(email.value, password.value).then(user_auth => {
      router.push({
        name: next_router || 'dashboard',
        query : { auth: user_auth.auth, name: user_auth.name},
      })

      // A aprimorar: Um tratamento genérico como esse não permite verificar se o erro foi de login, senha ou mesmo um erro interno na api (status 500)
    }).catch(error => {      
      console.log("DASHBOARD")
      errorMessage.value = error.message
      console.error(error)
    })
  }

  onMounted(() => {
    if(route.query.next) {
      errorMessage.value = "Ops! Parece que o seu token expirou. Por favor, faça o login novamente"
    }

    onMounted(() => {
      console.log("MONTANDO O LOGIN")
    })
  })
</script>

<style> 
</style>

<template>
  <main>
    <div class="w-full max-w-xs">
      <form @submit="submitForm" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input v-model="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" name="uname" placeholder="Username" required>
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Senha
          </label>
          <input v-model="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" name="psw" placeholder="****" required>
        </div>        
        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{{ errorMessage }}</span>
        </div>
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Entrar
          </button>
        </div>
      </form>
    </div>
  </main>
</template>