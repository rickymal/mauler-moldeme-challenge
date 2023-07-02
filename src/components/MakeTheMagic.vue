<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MoldemeService from '@/services/MoldemeService';
import AiApiService from '@/services/AiApiService';
import PerformController from '../controllers/PerformController'
import type { CoordsType } from '@/types/Request';
const route = useRoute()
const router = useRouter()
const message = ref('')
const moldemeService = new MoldemeService('https://recrutamento.molde.me');
const aiApiService = new AiApiService('')
const perfomedCoords: Ref<Array<{ x: number, y: number, id: number }>> = ref(new Array<{ x: number, y: number, id: number }>());
const totalDistance = ref('')
const trainingTime = ref('50')
const iterationTime = ref('50')

const onDataPerformed = (result: { pathChoosed: Array<{ x: number, y: number }>, length: string | number }) => {
  message.value = ``
  perfomedCoords.value = result.pathChoosed.map((element, idx) => ({ id: idx, ...element }))
  totalDistance.value = result.length as string
}

const onDataPerforming = (coords: Array<CoordsType>, params: { trainingTime: string, iterationTime: string }) => {
  message.value = `processando ${coords.length} coordenadas.. aguarde`
}

const redirectPage = async (name = 'login', next = 'dashboard') => {
  router.replace({ name, query: { next } })
}

const performController = new PerformController(moldemeService, aiApiService, route.query.auth as string, { onDataPerforming, onDataPerformed, redirectPage })

const makePerform = async (e: Event) => {
  e.preventDefault()
  performController.findGoodPath(trainingTime.value, iterationTime.value)
}


const preventDefaultAction = (e: Event) => { e.preventDefault() }

</script>

<template>
  <form @submit="preventDefaultAction" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="trainingTime">
        Tempo máximo de treinamento (em segundos)
      </label>
      <input v-model="trainingTime"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="trainingTime" type="text" name="uname" placeholder="">
    </div>
    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
        Quantidade máxima de gerações
      </label>
      <input v-model="iterationTime"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        id="iterationTime" type="text" name="psw" placeholder="">
    </div>
    <button @click="makePerform" class="bg-blue-500 text-white py-2 px-2 rounded ml-2 mr-2 mu-5 md-2"
      type="submit">Performar resultado</button>
  </form>
  <div v-if="message" class="bg-blue-100 border border-blue-400 text-blue-700 px-6 py-3 rounded absolute" role="alert">
    <span class="block sm:inline">{{ message }}</span>
  </div>
  <h1 v-if="totalDistance">Distância a ser percorrida : {{ totalDistance }}</h1>
  <table v-if="perfomedCoords.length" class="border-collapse border border-slate-400 ...">
    <thead>
      <tr class="pl-3 pr-3">
        <th class="border border-slate-300 ...">Direção</th>
        <th class="border border-slate-300 ...">Eixo x</th>
        <th class="border border-slate-300 ...">Eixo y</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="perf in perfomedCoords" :key="perf.id">
        <td class="border border-slate-300 ...">{{ perf.id }}</td>
        <td class="border border-slate-300 ...">{{ perf.x }}</td>
        <td class="border border-slate-300 ...">{{ perf.y }}</td>
      </tr>
    </tbody>
  </table>
</template>