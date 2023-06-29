<script setup lang="ts">
  import axios from 'axios'
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { onMounted } from 'vue';
  
  const route = useRoute()
  
</script>

<template>
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
