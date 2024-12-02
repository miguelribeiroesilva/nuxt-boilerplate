<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">PrimeVue Stepper Showcase</h1>

    <!-- Basic Linear Stepper -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Basic Linear Stepper</h2>
      <Stepper>
        <StepperPanel header="Personal Details">
          <template #content="{ nextCallback }">
            <div class="flex flex-col gap-4 p-4">
              <div class="flex flex-col gap-2">
                <label for="name">Name</label>
                <InputText id="name" v-model="personalDetails.name" placeholder="Enter your name" />
              </div>
              <div class="flex flex-col gap-2">
                <label for="email">Email</label>
                <InputText id="email" v-model="personalDetails.email" placeholder="Enter your email" />
              </div>
              <div class="flex justify-end mt-4">
                <Button label="Next" @click="nextCallback" />
              </div>
            </div>
          </template>
        </StepperPanel>
        
        <StepperPanel header="Address">
          <template #content="{ nextCallback, prevCallback }">
            <div class="flex flex-col gap-4 p-4">
              <div class="flex flex-col gap-2">
                <label for="address">Address</label>
                <InputText id="address" v-model="addressDetails.address" placeholder="Enter your address" />
              </div>
              <div class="flex flex-col gap-2">
                <label for="city">City</label>
                <InputText id="city" v-model="addressDetails.city" placeholder="Enter your city" />
              </div>
              <div class="flex justify-between mt-4">
                <Button label="Previous" severity="secondary" @click="prevCallback" />
                <Button label="Next" @click="nextCallback" />
              </div>
            </div>
          </template>
        </StepperPanel>
        
        <StepperPanel header="Confirmation">
          <template #content="{ prevCallback }">
            <div class="p-4">
              <h3 class="text-xl font-semibold mb-4">Review Your Details</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <strong>Name:</strong>
                  <p>{{ personalDetails.name }}</p>
                </div>
                <div>
                  <strong>Email:</strong>
                  <p>{{ personalDetails.email }}</p>
                </div>
                <div class="col-span-2">
                  <strong>Address:</strong>
                  <p>{{ addressDetails.address }}, {{ addressDetails.city }}</p>
                </div>
              </div>
              <div class="flex justify-between mt-4">
                <Button label="Previous" severity="secondary" @click="prevCallback" />
                <Button label="Submit" severity="success" @click="submitForm" />
              </div>
            </div>
          </template>
        </StepperPanel>
      </Stepper>
    </div>

    <!-- Non-Linear Stepper -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Non-Linear Stepper</h2>
      <Stepper :linear="false">
        <StepperPanel header="Account Setup">
          <template #content="{ nextCallback }">
            <div class="p-4 flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <label>Username</label>
                <InputText v-model="nonLinearForm.username" placeholder="Choose a username" />
              </div>
              <Button label="Continue" @click="nextCallback" />
            </div>
          </template>
        </StepperPanel>
        
        <StepperPanel header="Preferences">
          <template #content="{ nextCallback }">
            <div class="p-4 flex flex-col gap-4">
              <div class="flex items-center gap-2">
                <Checkbox v-model="nonLinearForm.newsletter" :binary="true" />
                <label>Subscribe to newsletter</label>
              </div>
              <div class="flex flex-col gap-2">
                <label>Theme Preference</label>
                <Dropdown 
                  v-model="nonLinearForm.theme" 
                  :options="['Light', 'Dark', 'System']" 
                  placeholder="Select Theme" 
                />
              </div>
              <Button label="Continue" @click="nextCallback" />
            </div>
          </template>
        </StepperPanel>
        
        <StepperPanel header="Confirmation">
          <template #content>
            <div class="p-4 text-center">
              <i class="pi pi-check-circle text-6xl text-green-500 mb-4"></i>
              <h3 class="text-xl font-semibold mb-2">Account Created Successfully!</h3>
              <p>Your account has been set up with the provided details.</p>
            </div>
          </template>
        </StepperPanel>
      </Stepper>
    </div>

    <!-- Vertical Stepper -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Vertical Stepper</h2>
      <Stepper orientation="vertical">
        <StepperPanel header="Personal Information">
          <template #content="{ nextCallback }">
            <div class="p-4 flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <label>First Name</label>
                <InputText v-model="verticalForm.firstName" placeholder="Enter first name" />
              </div>
              <div class="flex flex-col gap-2">
                <label>Last Name</label>
                <InputText v-model="verticalForm.lastName" placeholder="Enter last name" />
              </div>
              <Button label="Next" @click="nextCallback" class="self-start" />
            </div>
          </template>
        </StepperPanel>
        
        <StepperPanel header="Contact Details">
          <template #content="{ nextCallback, prevCallback }">
            <div class="p-4 flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <label>Phone Number</label>
                <InputText v-model="verticalForm.phone" placeholder="Enter phone number" />
              </div>
              <div class="flex gap-2">
                <Button label="Previous" severity="secondary" @click="prevCallback" />
                <Button label="Next" @click="nextCallback" />
              </div>
            </div>
          </template>
        </StepperPanel>
        
        <StepperPanel header="Final Review">
          <template #content="{ prevCallback }">
            <div class="p-4">
              <h3 class="text-xl font-semibold mb-4">Confirm Details</h3>
              <div class="grid gap-2">
                <p><strong>Name:</strong> {{ verticalForm.firstName }} {{ verticalForm.lastName }}</p>
                <p><strong>Phone:</strong> {{ verticalForm.phone }}</p>
              </div>
              <div class="flex gap-2 mt-4">
                <Button label="Previous" severity="secondary" @click="prevCallback" />
                <Button label="Submit" severity="success" @click="submitVerticalForm" />
              </div>
            </div>
          </template>
        </StepperPanel>
      </Stepper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Form data for different steppers
const personalDetails = ref({
  name: '',
  email: ''
})

const addressDetails = ref({
  address: '',
  city: ''
})

const nonLinearForm = ref({
  username: '',
  newsletter: false,
  theme: null
})

const verticalForm = ref({
  firstName: '',
  lastName: '',
  phone: ''
})

// Form submission methods
const submitForm = () => {
  toast.add({ 
    severity: 'success', 
    summary: 'Form Submitted', 
    detail: 'Personal and Address details have been submitted' 
  })
}

const submitVerticalForm = () => {
  toast.add({ 
    severity: 'success', 
    summary: 'Form Submitted', 
    detail: 'Vertical form details have been submitted' 
  })
}
</script>

<style scoped>
.p-stepper-panel {
  @apply mb-4;
}
</style>
