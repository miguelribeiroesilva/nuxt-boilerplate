<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">PrimeVue Timeline Showcase</h1>

    <!-- Product Development Timeline -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Product Development Lifecycle</h2>
      <Timeline 
        :value="productDevTimeline" 
        align="alternate"
      >
        <template #content="slotProps">
          <Card>
            <template #title>
              <div class="flex items-center">
                <i 
                  :class="getDevStageIcon(slotProps.item.stage)" 
                  class="mr-3 text-xl"
                ></i>
                {{ slotProps.item.title }}
              </div>
            </template>
            <template #subtitle>
              <span class="text-sm text-gray-500">
                {{ slotProps.item.date }}
              </span>
            </template>
            <template #content>
              <p>{{ slotProps.item.description }}</p>
              <div class="mt-3">
                <Tag 
                  :value="slotProps.item.stage" 
                  :severity="getDevStageSeverity(slotProps.item.stage)" 
                />
              </div>
            </template>
          </Card>
        </template>
      </Timeline>
    </div>

    <!-- Company Milestone Timeline -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Company Milestones</h2>
      <Timeline 
        :value="companyMilestones" 
        align="left"
      >
        <template #content="slotProps">
          <div class="bg-white shadow-md rounded-lg p-4">
            <div class="flex items-center mb-2">
              <Avatar 
                :image="slotProps.item.image" 
                size="large" 
                shape="circle" 
                class="mr-4"
              />
              <div>
                <h3 class="font-bold text-lg">{{ slotProps.item.title }}</h3>
                <p class="text-sm text-gray-500">{{ slotProps.item.date }}</p>
              </div>
            </div>
            <p class="mb-3">{{ slotProps.item.description }}</p>
            <div class="flex justify-between items-center">
              <Tag 
                :value="slotProps.item.type" 
                :severity="getMilestoneSeverity(slotProps.item.type)" 
              />
              <Button 
                :label="slotProps.item.actionLabel" 
                severity="secondary" 
                size="small" 
                outlined
              />
            </div>
          </div>
        </template>
      </Timeline>
    </div>

    <!-- Personal Career Journey -->
    <div>
      <h2 class="text-2xl font-semibold mb-4">Career Journey</h2>
      <Timeline 
        :value="careerTimeline" 
        align="right"
      >
        <template #content="slotProps">
          <div class="bg-white shadow-md rounded-lg p-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-bold text-lg">{{ slotProps.item.position }}</h3>
              <span class="text-sm text-gray-500">
                {{ slotProps.item.period }}
              </span>
            </div>
            <div class="flex items-center mb-2">
              <img 
                :src="slotProps.item.companyLogo" 
                :alt="slotProps.item.company" 
                class="w-12 h-12 object-contain mr-4 rounded"
              />
              <div>
                <h4 class="font-semibold">{{ slotProps.item.company }}</h4>
                <p class="text-sm text-gray-500">{{ slotProps.item.location }}</p>
              </div>
            </div>
            <ul class="list-disc pl-5 text-sm mb-3">
              <li v-for="(achievement, index) in slotProps.item.achievements" 
                  :key="index"
              >
                {{ achievement }}
              </li>
            </ul>
            <div class="flex space-x-2">
              <Tag 
                :value="slotProps.item.status" 
                :severity="getCareerStatusSeverity(slotProps.item.status)" 
              />
            </div>
          </div>
        </template>
      </Timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Product Development Timeline
const productDevTimeline = ref([
  {
    title: 'Concept Ideation',
    date: 'January 2023',
    description: 'Initial brainstorming and market research for the new product.',
    stage: 'Planning'
  },
  {
    title: 'Design Prototype',
    date: 'March 2023',
    description: 'Created initial design mockups and user experience flows.',
    stage: 'Design'
  },
  {
    title: 'MVP Development',
    date: 'June 2023',
    description: 'Developed minimum viable product with core functionalities.',
    stage: 'Development'
  },
  {
    title: 'Beta Testing',
    date: 'September 2023',
    description: 'Conducted closed beta testing with select user group.',
    stage: 'Testing'
  },
  {
    title: 'Product Launch',
    date: 'December 2023',
    description: 'Official product launch and public release.',
    stage: 'Launch'
  }
])

// Company Milestones
const companyMilestones = ref([
  {
    title: 'Company Founding',
    date: 'January 2015',
    description: 'Started the company with a vision to revolutionize technology.',
    type: 'Foundation',
    image: 'https://picsum.photos/200/200?random=1',
    actionLabel: 'Read Our Story'
  },
  {
    title: 'First Funding Round',
    date: 'May 2017',
    description: 'Secured $5M in seed funding from top venture capitalists.',
    type: 'Funding',
    image: 'https://picsum.photos/200/200?random=2',
    actionLabel: 'Investor Details'
  },
  {
    title: 'International Expansion',
    date: 'September 2020',
    description: 'Opened new offices in London and Singapore.',
    type: 'Expansion',
    image: 'https://picsum.photos/200/200?random=3',
    actionLabel: 'Global Presence'
  }
])

// Career Journey Timeline
const careerTimeline = ref([
  {
    position: 'Junior Software Engineer',
    company: 'TechStart Inc.',
    companyLogo: 'https://picsum.photos/200/200?random=4',
    location: 'San Francisco, CA',
    period: '2018 - 2020',
    achievements: [
      'Developed responsive web applications',
      'Collaborated with cross-functional teams'
    ],
    status: 'Completed'
  },
  {
    position: 'Senior Frontend Developer',
    company: 'InnovateCorp',
    companyLogo: 'https://picsum.photos/200/200?random=5',
    location: 'New York, NY',
    period: '2020 - 2022',
    achievements: [
      'Led frontend architecture redesign',
      'Implemented performance optimization strategies'
    ],
    status: 'Completed'
  },
  {
    position: 'Lead Software Architect',
    company: 'GlobalTech Solutions',
    companyLogo: 'https://picsum.photos/200/200?random=6',
    location: 'Remote',
    period: '2022 - Present',
    achievements: [
      'Driving digital transformation initiatives',
      'Mentoring junior development team'
    ],
    status: 'Current'
  }
])

// Helper Methods for Styling
const getDevStageIcon = (stage: string) => {
  switch(stage) {
    case 'Planning': return 'pi pi-lightbulb text-blue-500'
    case 'Design': return 'pi pi-palette text-purple-500'
    case 'Development': return 'pi pi-code text-green-500'
    case 'Testing': return 'pi pi-check-circle text-yellow-500'
    case 'Launch': return 'pi pi-rocket text-red-500'
    default: return 'pi pi-circle text-gray-500'
  }
}

const getDevStageSeverity = (stage: string) => {
  switch(stage) {
    case 'Planning': return 'info'
    case 'Design': return 'warning'
    case 'Development': return 'success'
    case 'Testing': return 'primary'
    case 'Launch': return 'danger'
    default: return 'secondary'
  }
}

const getMilestoneSeverity = (type: string) => {
  switch(type) {
    case 'Foundation': return 'info'
    case 'Funding': return 'success'
    case 'Expansion': return 'warning'
    default: return 'secondary'
  }
}

const getCareerStatusSeverity = (status: string) => {
  switch(status) {
    case 'Current': return 'success'
    case 'Completed': return 'info'
    default: return 'secondary'
  }
}
</script>

<style scoped>
.card {
  @apply shadow-md rounded-lg p-4 bg-white;
}
</style>
