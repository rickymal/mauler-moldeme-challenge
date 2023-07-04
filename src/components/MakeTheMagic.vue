<script setup lang="ts">
  import { ref, type Ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import MoldemeService from '@/services/MoldemeService';
  import AiApiService from '@/services/AiApiService';
  import PerformController from '../controllers/PerformController'
  import type { CoordsType, ModelResult } from '@/types/Request';
  import Chart from './Chart.vue'; // Caminho para o seu componente de gráfico de linha
  import type ResponseError from '@/types/GenericError';

  const route = useRoute()
  const router = useRouter()
  const moldemeService = new MoldemeService('https://recrutamento.molde.me');
  const aiApiService = new AiApiService('/api')
  const perfomedCoords: Ref<Array<{ x: number, y: number, id: number }>> = ref(new Array<{ x: number, y: number, id: number }>());
  const totalDistance = ref('')
  const trainingTime = ref('50')
  const iterationTime = ref('50')
  const message = ref('')
  const graphicConvergence = ref({})
  const graphicDivergence = ref({})

  //by ChatGPT
  function getRandomColor() {
    const r = Math.floor(Math.random() * 256);  // Random entre 0-255
    const g = Math.floor(Math.random() * 256);  // Random entre 0-255
    const b = Math.floor(Math.random() * 256);  // Random entre 0-255
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';  // Retorna uma cor no formato RGB
  }

  const onDataPerformed = (result: ModelResult) => {
    message.value = ``
    perfomedCoords.value = result.pathChoosed.map((coords, idx) => ({ id: idx, x: coords[0], y: coords[1] }))
    totalDistance.value = result.length as string


    let x_axis_convergence = Object.keys(Object.entries(result.conv)[0][1])
    let y_axis_convergence = Object.entries(result.conv).map(element => {
      return {
        label: element[0],
        data: Object.values(element[1]),
        tension: 0.1,
        backgroundColor: getRandomColor()
        // backgroundColor : '#f00979'
      }
    })

    graphicConvergence.value = {
      labels: x_axis_convergence,
      datasets: y_axis_convergence
    }

    graphicDivergence.value = {
      labels: Object.keys(result.div['quantidade de rotas divergentes']),
      datasets: [
        {
          label: 'Quantidade de rotas divergentes',
          backgroundColor: '#f87979',
          data: Object.values(result.div['quantidade de rotas divergentes'])
        }
      ]
    }
  }

  const onPerformCoordsFailed = (data: ResponseError) => {
    message.value = data.message
  }

  const onDataPerforming = (coords: { data: { data: Array<CoordsType> } }, params: { trainingTime: string, iterationTime: string }) => {
    message.value = `processando ${coords.data.data.length} coordenadas.. aguarde`
  }

  const redirectPage = async (name = 'login', next = 'dashboard') => {
    router.replace({ name, query: { next } })
  }

  const performController = new PerformController(moldemeService, aiApiService, route.query.auth as string, { onDataPerforming, onDataPerformed, redirectPage, onPerformCoordsFailed })

  const makePerform = async (e: Event) => {
    e.preventDefault()
    message.value = ''
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
  <div v-if="message" class="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded absolute" role="alert">
    <span class="block sm:inline">{{ message }}</span>
  </div>
  <h1 v-if="totalDistance">Distância a ser percorrida : {{ totalDistance }} U.C</h1>
  <table v-if="perfomedCoords.length" class="border-collapse border border-slate-400 mb-4 mu-4 ...">
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
  <h1>Gráfico de Convergência</h1>
  <Chart v-if="graphicConvergence" :graphicData="graphicConvergence" />

  <h1>Gráfico de diversidade</h1>
  <Chart v-if="graphicDivergence" :graphicData="graphicDivergence" />
</template>
