<template>
  <div class="container mx-auto p-6 dark:bg-gray-900 dark:text-white transition-colors duration-300">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">PrimeVue Chart Examples</h1>

    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Chart containers with dark/light background -->
      <div
        v-if="mounted"
        v-for="(chart, index) in chartConfigurations"
        :key="index"
        class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 transition-colors duration-300"
      >
        <h2 class="text-xl font-semibold mb-4 dark:text-white">{{ chart.title }}</h2>
        <Chart
          :type="chart.type"
          :data="chart.data"
          :options="getChartOptions(chart.type)"
          class="h-64"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Chart from 'primevue/chart'
import InputSwitch from 'primevue/inputswitch'

// Theme management
const isDarkMode = ref(false)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value

  // Update document class for Tailwind dark mode
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

// Ensure client-side rendering
const mounted = ref(false)
onMounted(() => {
  mounted.value = true

  // Check system preference on initial load
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    toggleTheme()
  }
})

// Dynamic chart color generation based on theme
const getThemeColors = computed(() => ({
  primary: isDarkMode.value ? '#3B82F6' : '#42A5F5',
  secondary: isDarkMode.value ? '#F97316' : '#FFA726',
  background: isDarkMode.value ? '#1F2937' : '#FFFFFF',
  text: isDarkMode.value ? '#E5E7EB' : '#000000',
  gridLines: isDarkMode.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  chartBackground: isDarkMode.value ? '#2D3748' : '#F3F4F6', // Softer background for light mode
  chartBorder: isDarkMode.value ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
}))

// Shared chart options with theme-aware configuration
const getChartOptions = (type: string) => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        color: isDarkMode.value ? '#E5E7EB' : '#000000',
        font: {
          weight: 'bold',
          size: 16
        }
      },
      legend: {
        labels: {
          color: isDarkMode.value ? '#E5E7EB' : '#000000',
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode.value 
            ? 'rgba(255,255,255,0.1)' 
            : 'rgba(0,0,0,0.2)'
        },
        ticks: {
          color: isDarkMode.value ? '#E5E7EB' : '#000000',
          font: {
            size: 10
          }
        }
      },
      y: {
        grid: {
          color: isDarkMode.value 
            ? 'rgba(255,255,255,0.1)' 
            : 'rgba(0,0,0,0.2)'
        },
        ticks: {
          color: isDarkMode.value ? '#E5E7EB' : '#000000',
          font: {
            size: 10
          }
        }
      }
    },
    // Add hover and interaction effects
    hover: {
      mode: 'nearest',
      intersect: true
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  }

  // Special handling for pie and doughnut charts
  if (type === 'pie' || type === 'doughnut' || type === 'polarArea') {
    delete baseOptions.scales
    baseOptions.plugins.legend = {
      ...baseOptions.plugins.legend,
      labels: {
        color: isDarkMode.value ? '#E5E7EB' : '#000000',
        font: {
          size: 12
        }
      },
      position: 'bottom'
    }
  }

  // Specific options for stacked bar
  if (type === 'bar') {
    baseOptions.scales.x = {
      ...baseOptions.scales.x,
      stacked: true
    }
    baseOptions.scales.y = {
      ...baseOptions.scales.y,
      stacked: true
    }
  }

  return baseOptions
}

// Chart Configurations
const chartConfigurations = [
  {
    type: 'line',
    title: 'Line Chart',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: '#FFA726',
          tension: 0.4
        }
      ]
    }
  },
  {
    type: 'bar',
    title: 'Bar Chart',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Sales',
          backgroundColor: '#42A5F5',
          data: [65, 59, 80, 81]
        },
        {
          label: 'Profit',
          backgroundColor: '#FFA726',
          data: [28, 48, 40, 19]
        }
      ]
    }
  },
  {
    type: 'pie',
    title: 'Pie Chart',
    data: {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }
      ]
    }
  },
  {
    type: 'doughnut',
    title: 'Doughnut Chart',
    data: {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }
      ]
    }
  },
  {
    type: 'polarArea',
    title: 'Polar Area Chart',
    data: {
      labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
      datasets: [
        {
          data: [300, 50, 100, 40, 120],
          backgroundColor: [
            '#FF6384',
            '#4BC0C0',
            '#FFCE56',
            '#E7E9ED',
            '#36A2EB'
          ]
        }
      ]
    }
  },
  {
    type: 'radar',
    title: 'Radar Chart',
    data: {
      labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
      datasets: [
        {
          label: 'My First Dataset',
          data: [65, 59, 90, 81, 56, 55, 40],
          fill: true,
          backgroundColor: 'rgba(179,181,198,0.2)',
          borderColor: '#42A5F5',
          pointBackgroundColor: '#42A5F5',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#42A5F5'
        },
        {
          label: 'My Second Dataset',
          data: [28, 48, 40, 19, 96, 27, 100],
          fill: true,
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: '#FFA726',
          pointBackgroundColor: '#FFA726',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#FFA726'
        }
      ]
    }
  },
  {
    type: 'bar',
    title: 'Stacked Bar Chart',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          type: 'bar',
          label: 'Dataset 1',
          backgroundColor: '#42A5F5',
          data: [50, 25, 12, 48, 90, 76, 42]
        },
        {
          type: 'bar',
          label: 'Dataset 2',
          backgroundColor: '#FFA726',
          data: [21, 84, 24, 75, 37, 65, 34]
        },
        {
          type: 'bar',
          label: 'Dataset 3',
          backgroundColor: '#66BB6A',
          data: [41, 52, 24, 74, 23, 21, 32]
        }
      ]
    }
  },
  {
    type: 'bar',
    title: 'Horizontal Bar Chart',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: '#42A5F5'
        },
        {
          label: 'My Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          backgroundColor: '#FFA726'
        }
      ]
    }
  }
]
</script>

<style scoped>
/* Smooth transition for theme changes */
.dark\:bg-gray-900 {
  transition: background-color 0.3s ease;
}
.dark\:text-white {
  transition: color 0.3s ease;
}
</style>
