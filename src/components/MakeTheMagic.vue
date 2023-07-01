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

  const on_data_performed = (result) => {
    message.value = ``
  }

  const on_data_performing = (coords) => {
    message.value = `processando ${coords.length} coordenadas.. aguarde`
  }

  const redirectPage = async (name = 'login', next = 'dashboard') => {
    router.replace({ name, query : { next }})
  }

  const performController = new PerformController(apiService, bioApi, route.query.auth as string, {on_data_performing, on_data_performed, redirectPage})
</script>

<template>
  <button @click="performController.find_good_path" class="bg-blue-500 text-white py-2 px-2 rounded ml-2 mr-2 mu-5 md-2">Performar resultado</button>
  <div v-if="message" class="bg-blue-100 border border-blue-400 text-blue-700 px-6 py-3 rounded absolute" role="alert">
    <span class="block sm:inline">{{ message }}</span>
  </div>
</template>