<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">PrimeVue Organization Chart Showcase</h1>

    <!-- Corporate Hierarchy Chart -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Corporate Leadership Hierarchy</h2>
      <div class="card">
        <OrganizationChart :value="corporateHierarchy">
          <template #person="slotProps">
            <div class="flex items-center p-2 bg-white shadow-md rounded-lg">
              <Avatar 
                :image="slotProps.node.data.avatar" 
                size="large" 
                shape="circle" 
                class="mr-4" 
              />
              <div>
                <h3 class="font-bold text-lg">{{ slotProps.node.data.name }}</h3>
                <p class="text-sm text-gray-500">{{ slotProps.node.data.title }}</p>
              </div>
            </div>
          </template>
        </OrganizationChart>
      </div>
    </div>

    <!-- Interactive Team Structure -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Engineering Team Structure</h2>
      <div class="card">
        <OrganizationChart 
          :value="engineeringTeam" 
          selectionMode="multiple" 
          v-model:selection="selectedTeamMembers"
        >
          <template #person="slotProps">
            <div 
              class="p-2 rounded-lg transition-all duration-200 ease-in-out"
              :class="{
                'bg-primary-100': slotProps.node.selected,
                'bg-white': !slotProps.node.selected
              }"
            >
              <div class="flex items-center">
                <Avatar 
                  :image="slotProps.node.data.avatar" 
                  size="large" 
                  shape="circle" 
                  class="mr-3" 
                />
                <div>
                  <h3 class="font-bold">{{ slotProps.node.data.name }}</h3>
                  <p class="text-sm text-gray-500">{{ slotProps.node.data.role }}</p>
                </div>
                <Badge 
                  v-if="slotProps.node.data.performance" 
                  :value="slotProps.node.data.performance" 
                  class="ml-auto"
                  :severity="getPerformanceSeverity(slotProps.node.data.performance)"
                />
              </div>
            </div>
          </template>
        </OrganizationChart>
      </div>

      <!-- Selected Team Members Display -->
      <div v-if="selectedTeamMembers.length" class="mt-4 p-4 bg-gray-100 rounded-lg">
        <h3 class="font-semibold mb-2">Selected Team Members:</h3>
        <ul class="list-disc pl-5">
          <li v-for="member in selectedTeamMembers" :key="member.key">
            {{ member.data.name }} - {{ member.data.role }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Expandable Project Team Chart -->
    <div>
      <h2 class="text-2xl font-semibold mb-4">Project Team Collaboration</h2>
      <div class="card">
        <OrganizationChart 
          :value="projectTeam" 
          :collapsible="true"
        >
          <template #person="slotProps">
            <div class="flex items-center p-2 bg-white rounded-lg shadow-sm">
              <Avatar 
                :image="slotProps.node.data.avatar" 
                size="large" 
                shape="circle" 
                class="mr-3" 
              />
              <div class="flex-grow">
                <h3 class="font-bold">{{ slotProps.node.data.name }}</h3>
                <p class="text-sm text-gray-500">{{ slotProps.node.data.role }}</p>
              </div>
              <div class="ml-auto">
                <Tag 
                  :value="slotProps.node.data.status" 
                  :severity="getStatusSeverity(slotProps.node.data.status)"
                />
              </div>
            </div>
          </template>
        </OrganizationChart>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Corporate Hierarchy
const corporateHierarchy = ref({
  key: 'ceo',
  data: { 
    name: 'Sarah Johnson', 
    title: 'CEO', 
    avatar: 'https://picsum.photos/200/200?random=1' 
  },
  children: [
    {
      key: 'cto',
      data: { 
        name: 'Mike Chen', 
        title: 'CTO', 
        avatar: 'https://picsum.photos/200/200?random=2' 
      },
      children: [
        {
          key: 'head-engineering',
          data: { 
            name: 'Emily Rodriguez', 
            title: 'Head of Engineering', 
            avatar: 'https://picsum.photos/200/200?random=3' 
          }
        }
      ]
    },
    {
      key: 'cfo',
      data: { 
        name: 'David Kim', 
        title: 'CFO', 
        avatar: 'https://picsum.photos/200/200?random=4' 
      }
    }
  ]
})

// Engineering Team with Selection
const engineeringTeam = ref({
  key: 'engineering-lead',
  data: { 
    name: 'Emily Rodriguez', 
    role: 'Engineering Lead', 
    avatar: 'https://picsum.photos/200/200?random=5',
    performance: 'Excellent'
  },
  children: [
    {
      key: 'frontend-manager',
      data: { 
        name: 'Alex Wong', 
        role: 'Frontend Manager', 
        avatar: 'https://picsum.photos/200/200?random=6',
        performance: 'Very Good'
      },
      children: [
        {
          key: 'react-dev',
          data: { 
            name: 'Jessica Lee', 
            role: 'React Developer', 
            avatar: 'https://picsum.photos/200/200?random=7',
            performance: 'Good'
          }
        }
      ]
    },
    {
      key: 'backend-manager',
      data: { 
        name: 'Carlos Mendez', 
        role: 'Backend Manager', 
        avatar: 'https://picsum.photos/200/200?random=8',
        performance: 'Excellent'
      }
    }
  ]
})

// Selected Team Members
const selectedTeamMembers = ref([])

// Project Team with Collapsible Nodes
const projectTeam = ref({
  key: 'project-manager',
  data: { 
    name: 'Lisa Anderson', 
    role: 'Project Manager', 
    avatar: 'https://picsum.photos/200/200?random=9',
    status: 'Active'
  },
  children: [
    {
      key: 'design-lead',
      data: { 
        name: 'Tom Harris', 
        role: 'Design Lead', 
        avatar: 'https://picsum.photos/200/200?random=10',
        status: 'Active'
      },
      children: [
        {
          key: 'ux-designer',
          data: { 
            name: 'Emma Clark', 
            role: 'UX Designer', 
            avatar: 'https://picsum.photos/200/200?random=11',
            status: 'Busy'
          }
        }
      ]
    },
    {
      key: 'qa-lead',
      data: { 
        name: 'Ryan Thompson', 
        role: 'QA Lead', 
        avatar: 'https://picsum.photos/200/200?random=12',
        status: 'Available'
      }
    }
  ]
})

// Helper methods for styling
const getPerformanceSeverity = (performance: string) => {
  switch(performance) {
    case 'Excellent': return 'success'
    case 'Very Good': return 'info'
    case 'Good': return 'warning'
    default: return 'danger'
  }
}

const getStatusSeverity = (status: string) => {
  switch(status) {
    case 'Active': return 'success'
    case 'Available': return 'info'
    case 'Busy': return 'warning'
    default: return 'danger'
  }
}
</script>

<style scoped>
.card {
  @apply shadow-md rounded-lg p-4 bg-white;
}
</style>
