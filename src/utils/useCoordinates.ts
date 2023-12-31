import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

function useCoordinates() {
  const route = useRoute()
  const coordinates = ref([]);
  
  const loadCoordinates = async (page = 1, limit = 2) => {
    const response = await axios.get('https://recrutamento.molde.me/location', {
      headers : {
        Authorization: route.query.auth as string
      },
      params : { limit, page }
    });
    coordinates.value = response.data.data;
  };

  const addCoordinates = async (xCoords: number, yCoords: number) => {
    // API call to add the coordinates...
    await axios.post('https://recrutamento.molde.me/location', { x: xCoords, y: yCoords }, {
      headers : {
        Authorization: route.query.auth as string
      }
    });
    await loadCoordinates(); // Carregando as coordenadas.
  };

  onMounted(loadCoordinates);

  return {
    coordinates,
    loadCoordinates,
    addCoordinates
  };
}
