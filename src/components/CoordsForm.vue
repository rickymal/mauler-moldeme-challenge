<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';

import MoldemeService from '@/services/MoldemeService';
import DashboardController from '../controllers/DashboardController'
import useSwitch from "../hooks/useSwitch"


const xCoords: Ref<number> = ref(0)
const yCoords: Ref<number> = ref(0)
let errorMessage = ref("")
let successMessage = ref("")
let coordsMessage = ref("")

const route = useRoute()
const auth = route.query.auth as string
const router = useRouter()
const { redirectPage } = useSwitch()

const getCoordinates = () => {
  return {
    x: xCoords.value,
    y: yCoords.value,
  }
}

const onUpdateCoordsFailed = (reason: string) => {
  coordsMessage.value = "Coordenadas devem ser entre 0 e 1000"
}

const onCoordsUpdated = (coords: { x_axis: number, y_axis: number }) => {
  coordsMessage.value = ""
  const lastMesssage = successMessage.value
  successMessage.value = `Coordenada (${coords.x_axis}, ${coords.y_axis}) cadastrada!`
  xCoords.value = 0
  yCoords.value = 0

  setTimeout(() => {
    successMessage.value = lastMesssage
  }, 5000)
}

// [method] utilizando callbacks
const apiService = new MoldemeService('https://recrutamento.molde.me/location')
const dashboardController = new DashboardController(apiService, auth, { onCoordsUpdated, getCoordinates, redirectPage, onUpdateCoordsFailed })

onMounted(() => {
  successMessage.value = "Insira os valores de 'x' e 'y'"
})

const submitCoordinates = async (event: Event) => {
  event.preventDefault()
  dashboardController.addCoordinate(xCoords.value, yCoords.value)
}
</script>

<template>
  <div class='flex justify-center'>
    <form @submit="submitCoordinates" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          eixo 'x'
        </label>
        <input v-model="xCoords"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username" type="text" name="uname" placeholder="" required>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          eixo 'y'
        </label>
        <input v-model="yCoords"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username" type="text" name="uname" placeholder="" required>
      </div>
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-3 mb-3 rounded relative"
        role="alert">
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>
      <div v-if="successMessage" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 mt-3 mb-3 rounded relative"
        role="alert">
        <span class="block sm:inline">{{ successMessage }}</span>
      </div>
      <div v-if="coordsMessage" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 mt-3 mb-3 rounded relative"
        role="alert">
        <span class="block sm:inline">{{ coordsMessage }}</span>
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit">
        Inserir
      </button>
    </div>
    </form>
  </div>
</template>