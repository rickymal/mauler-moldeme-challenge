<script setup lang="ts">
  import axios, { AxiosHeaders } from 'axios'
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { onMounted } from 'vue';
  
  const route = useRoute()
  let page = 1
  let limit = 2
  let pages_info = new Map<string, number>()
  let pages_cache = new Map<number, {id : number, x : number, y : number, created_at : string, updated_at : string}>()
  let coordinates = ref({ data: [] });
  pages_info.set('pages', Number.POSITIVE_INFINITY)

  const deleteCoords = async (id : number) => {
    const response = await axios.delete(`https://recrutamento.molde.me/location/${id}`, {
      headers : {
        Authorization: route.query.auth as string
      }
    })

    if(response.status == 200) {
      // coordinates.value.data = coordinates.value.data.filter(e => e.id != id)
      paginate_location(0)
    }
  }

  const paginate_location = async (paginate : number) => {
    page += paginate
    if(page < 1) {
      page = 1
      return
    }
    
    // casting necessário porque o typescript não enxerga que só será obtido o pages caso exista devido ao 'if'
    if(page > (pages_info.get('pages') as number)) {
      page = pages_info.get('pages') as number
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
      <button :disabled="pages_info.get('pages') && page == (pages_info.get('pages') as number)" @click="() => paginate_location(1)" class="bg-blue-500 text-white py-2 px-4 rounded ml-2">Próxima página</button>
    </div>
  </div>
</template>
