<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import MoldemeService from '@/services/MoldemeService';
import DashboardController from '../controllers/DashboardController'
import useSwitch from "../hooks/useSwitch"
import { type CoordsType as Coords } from '@/types/Interfaces';

const route = useRoute()
const router = useRouter()

let coordinates: Ref<Array<{ x: number, y: number, id?: number }>> = ref(new Array<{ x: number, y: number, id?: number }>());

const { redirectPage } = useSwitch()

const switchPage = (coords: { data: Array<Coords> }) => {
  coordinates.value = coords.data
}

const onCoordsDeleted = (coords: { x: number, y: number }) => { }

// [method] utilizando callbacks
const apiService = new MoldemeService('https://recrutamento.molde.me');
const dashboardController = new DashboardController(apiService, route.query.auth as string, { redirectPage, switchPage })

onMounted(async () => {
  await dashboardController.paginateData(0);
});
</script>

<template>
  <div class="flex flex-col justify-center mb-3 mt-3 pb-3">
    <ul v-if="coordinates" role='list' class="divide-y divide-gray-100">
      <li v-for="coordinate in coordinates" :key="coordinate.id" class="flex justify-between gap-x-6 py-5">
        <div class='flex justify-left'>
          <h2>(x: {{ coordinate.x }}, y: {{ coordinate.y }})</h2>
        </div>
        <div class='flex flex-row justify-right'>
          <button class="bg-blue-500 rounded px-2 py-4 text-white ml-2"
            @click="() => dashboardController.deleteCoordinate(coordinate.id)">
            Apagar coordenada
          </button>
        </div>
      </li>
    </ul>
    <div class="flex justify-center">
      <button :disabled="dashboardController.using_first_page()" @click="() => dashboardController.paginateData(-1)"
        class="bg-blue-500 text-white py-2 px-4 rounded mr-2">Página anterior</button>
      <button :disabled="dashboardController.using_last_page()" @click="() => dashboardController.paginateData(+1)"
        class="bg-blue-500 text-white py-2 px-4 rounded ml-2">Próxima página</button>
    </div>
  </div>
</template>
