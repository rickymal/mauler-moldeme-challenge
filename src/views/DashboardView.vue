<script setup lang="ts">
  import ListBox from '../components/ListBox.vue'
  import InsertCoords from '../components/InsertCoords.vue'
import { useRoute, useRouter } from 'vue-router';

  const route = useRoute()
  const router = useRouter()

  const switchToPerform = () => {
    console.log({query : route.query.auth})
    
    router.push({
      name: 'perform',
      query : { auth: route.query.auth},
    })
  }
</script>

<template>
  <main>
    <ListBox/>
    <InsertCoords/>
    <button @click="switchToPerform" class="bg-blue-500 text-white py-2 px-2 rounded ml-2 mr-2 mu-5 md-2" type="submit">ir para tela de performace</button>
  </main>
</template>