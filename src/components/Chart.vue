<template>
  <div>
    <canvas ref="chartRef" class="min-w-[600px] min-h-[400px]"></canvas>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Legend, type Point } from 'chart.js';

  const props = defineProps({
    graphicData: Object
  });
  Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Legend);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
      },
    },
  };

  const chartRef = ref(null);
  let chart: Chart<"line", (number | Point | null)[], unknown> | null = null;  // Referência do gráfico a ser atualizada

  watchEffect(() => {
    // Isso aqui é para permitir que o gráfico atualize quanto o usuário refaça a busca
    if (!chartRef.value) return;

    /*
      by chatGPT
    */
    let pixelRatio = window.devicePixelRatio || 1;
    chartRef.value.width = chartRef.value.offsetWidth * pixelRatio;
    chartRef.value.height = chartRef.value.offsetHeight * pixelRatio;
    const ctx = chartRef.value.getContext('2d');
    // Se o gráfico já existe, destrua-o antes de recriá-lo
    if (chart) {
      chart.destroy();
    }
    // Crie um novo gráfico
    chart = new Chart(ctx, {
      type: 'line',
      data: props.graphicData,
      options,
    });
  });
</script>