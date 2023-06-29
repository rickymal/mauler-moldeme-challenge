<script setup lang="ts">
  import axios from 'axios'
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { onMounted } from 'vue';
  
  const route = useRoute()
  let page = 1
  let limit = 2
  let pages_info = new Map<string, number>()
  let pages_cache = new Map<number, {id : number, x : number, y : number, created_at : string, updated_at : string}>()
  let coordinates = ref({ data: [] });

  const deleteCoords = async () => {}

  const paginate_location = async (paginate : number) => {
    page += paginate
    if(page < 1) {
      page = 1
      return
    }
    
    // casting necessário porque o typescript não enxerga que só será obtido o pages caso exista devido ao 'if'
    if(pages_info.get('pages') && page > (pages_info.get('pages') as number)) {

      page = pages_info.get('pages') || Number.POSITIVE_INFINITY
      return
    }

    const response = await axios.get('https://recrutamento.molde.me/location', {
      headers : {
        Authorization: route.query.auth as string
      },
      params : { limit, page }
    })

    pages_info.set('pages', response.data.pages)
    coordinates.value = response.data.data
  }

  onMounted(async () => {
    await paginate_location(0);
  });
</script>

<template>
  <div class="flex flex-col justify-center">
    <ul v-if="coordinates" role='list' class="divide-y divide-gray-100">
      <li v-for="coordinate in coordinates" :key="coordinate.id" class="flex justify-between gap-x-6 py-5">
        <div class = 'flex justify-left'>
          <h2>(x: {{ coordinate.x }}, y: {{ coordinate.y }})</h2>
        </div>
        <div class = 'flex justify-right'>
          <button class="bg-blue-500 rounded px-2 py-4 text-white" @click="() => deleteCoords(coordinate.id)">
            Apagar coordenada
          </button>
        </div>
      </li>
    </ul>
    <div class="flex justify-center">
      <button :disabled="page === 1" @click="() => paginate_location(-1)" class="bg-blue-500 text-white py-2 px-4 rounded mr-2">Página anterior</button>
      <button :disabled="page === pages_info.get('page')" @click="() => paginate_location(1)" class="bg-blue-500 text-white py-2 px-4 rounded ml-2">Próxima página</button>
    </div>
  </div>

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

      <div class="flex items-center justify-between">
        <RouterView to="/">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Inserir
          </button>
        </RouterView>
      </div>
    </form>
  </div>
</template>
