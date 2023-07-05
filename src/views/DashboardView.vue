<script setup lang="ts">
  import ListBox from '../components/ListBox.vue'
  import CoordsForm from '../components/CoordsForm.vue'
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute()
  const router = useRouter()

  const switchToPerform = () => {
    router.push({
      name: 'perform',
      query : { auth: route.query.auth},
    })
  }
</script>

<template>
  <main>
    <ListBox/>
    <CoordsForm/>
    <button @click="switchToPerform" class="bg-blue-500 text-white py-2 px-2 rounded ml-2 mr-2 mu-5 md-2" type="submit">ir para tela de performace</button>
  </main>
</template>