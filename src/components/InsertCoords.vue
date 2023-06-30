<script setup lang="ts">
  import axios from 'axios'
  import { ref, type Ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { onMounted } from 'vue';

  const x_coords : Ref<number> = ref(0)
  const y_coords : Ref<number> = ref(0)
  let errorMessage = ref("")
  let successMessage = ref("")
  let coordsMessage = ref("")
  const route = useRoute()

  onMounted(() => {
    successMessage.value = "Insira os valores de 'x' e 'y'"
  })

  const submitCoordinates = async (event : Event) => {
    event.preventDefault()
    try {
      const response = await axios.post('https://recrutamento.molde.me/location', { x: x_coords.value, y: y_coords.value }, {
        headers : {
          Authorization: route.query.auth as string
        }
      });
      
      if(response.status == 200) {
        successMessage.value = `Coordenada (${x_coords.value}, ${y_coords.value}) cadastrada!`
        x_coords.value = 0
        y_coords.value = 0

        setTimeout(() => {
          successMessage.value = ""
        }, 3000)
      }
    } catch(error : any) {
      if(error.response) {
        const response = error.response
        if(response.status == 400) {
          coordsMessage.value = "Coordenadas devem ser entre 0 e 1000"
        }
      }
      else if (error.request) {
      }
      else {
      }
    }
  }
</script>

<template>
  <div class = 'flex justify-center'>
    <form @submit="submitCoordinates" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          eixo 'x'
        </label>
        <input v-model="x_coords" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" name="uname" placeholder="" required>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          eixo 'y'
        </label>
        <input v-model="y_coords" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" name="uname" placeholder="" required>
      </div>
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>
      <div v-if="successMessage" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ successMessage }}</span>
      </div>
      <div v-if="coordsMessage" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ coordsMessage }}</span>
      </div>
      <div class="flex items-center justify-between">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Inserir
        </button>
      </div>
    </form>
  </div>
</template>
