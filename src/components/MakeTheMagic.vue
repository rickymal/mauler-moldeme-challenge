<script setup lang="ts">
  import { ref, type Ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import MoldemeService from '@/services/MoldemeService';
  import BioApi from '@/services/BioApi';
  import PerformController from '../controllers/PerformController'
  const route = useRoute()
  const router = useRouter()
  const message = ref('')
  const apiService = new MoldemeService('https://recrutamento.molde.me');
  const bioApi = new BioApi()
  const perfomed_coords = ref([])
  const total_distance = ref('')
  const training_time = ref('50')
  const iteration_time = ref('50')

  const on_data_performed = (result : Array<{x : number, y : number}>) => {
    message.value = ``
    perfomed_coords.value = result.path_choosed.map((element, idx) => ({id : idx, ...element}))
    total_distance.value = result.length
  }

  const on_data_performing = (coords, metadata) => {
    message.value = `processando ${coords.length} coordenadas.. aguarde ${metadata}`
  }

  const redirectPage = async (name = 'login', next = 'dashboard') => {
    router.replace({ name, query : { next }})
  }

  const performController = new PerformController(apiService, bioApi, route.query.auth as string, {on_data_performing, on_data_performed, redirectPage})

  const make_perform = async (e : Event) => {
    e.preventDefault()
    performController.find_good_path(training_time.value, iteration_time.value)
  }

</script>

<template>
  <form @submit="submitForm" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="training_time">
        Tempo máximo de treinamento (em segundos)
      </label>
      <input v-model="training_time" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="training_time" type="text" name="uname" placeholder="">
    </div>
    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
        Quantidade máxima de gerações
      </label>
      <input v-model="iteration_time" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="iteration_time" type="text" name="psw" placeholder="">
    </div>        
    <button @click="make_perform" class="bg-blue-500 text-white py-2 px-2 rounded ml-2 mr-2 mu-5 md-2" type="submit">Performar resultado</button>
  </form>


  <div v-if="message" class="bg-blue-100 border border-blue-400 text-blue-700 px-6 py-3 rounded absolute" role="alert">
    <span class="block sm:inline">{{ message }}</span>
  </div>

  <h1 v-if="total_distance">Distância a ser percorrida : {{ total_distance }}</h1>

  <table v-if="perfomed_coords.length" class="border-collapse border border-slate-400 ...">
    <thead>
      <tr class="pl-3 pr-3">
        <th class="border border-slate-300 ...">Direção</th>
        <th class="border border-slate-300 ...">Eixo x</th>
        <th class="border border-slate-300 ...">Eixo y</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="perf in perfomed_coords" :key="perf.id">
        <td class="border border-slate-300 ...">{{ perf.id }}</td>
        <td class="border border-slate-300 ...">{{ perf.x }}</td>
        <td class="border border-slate-300 ...">{{ perf.y }}</td>
      </tr>
    </tbody>
  </table>
</template>