<template>
  <div>
    <Card class="first-card">
    <BackButton />
    <Button label="Firebase Authentication Demo" severity="info" disabled class="flex-1" />
    <!-- User Profile -->
    <div v-if="currentUser" class="mb-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Avatar :image="currentUser.photoURL || undefined" :label="getUserInitials" size="large" shape="circle" />
          <div>
            <h2 class="text-xl font-semibold">{{ currentUser.displayName || 'Anonymous User' }}</h2>
            <p class="text-sm opacity-75">{{ currentUser.email }}</p>
          </div>
        </div>
        <Button @click="signOut" class="p-button p-component p-button-primary mr-2" severity="danger" text>
          <i class="pi pi-sign-out mr-2"></i>
          Sign Out
        </Button>
      </div>

      <!-- User Details -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
          <h3 class="font-medium mb-2">Email Verification</h3>
          <div class="flex items-center justify-between">
            <span>Status</span>
            <Tag :severity="currentUser.emailVerified ? 'success' : 'warning'">
              {{ currentUser.emailVerified ? 'Verified' : 'Not Verified' }}
            </Tag>
          </div>
          <Button
            v-if="!currentUser.emailVerified"
            @click="sendVerificationEmail"
            class="p-button p-component p-button-primary mr-2 mt-3"
            severity="info"
            text
          >
            Send Verification Email
          </Button>
        </div>

        <div class="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
          <h3 class="font-medium mb-2">Account Created</h3>
          <p>{{ formatTimestampString(currentUser.metadata.creationTime) }}</p>
          <p class="text-sm opacity-75 mt-1">Last Sign In: {{ formatTimestampString(currentUser.metadata.lastSignInTime) }}</p>
        </div>
      </div>

      <!-- Profile Update -->
      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-4">Update Profile</h3>
        <div class="flex gap-4">
          <div class="flex-1">
            <span class="p-float-label">
              <InputText
                id="displayName"
                v-model="profile.displayName"
                class="w-full"
              />
              <label for="displayName">Display Name</label>
            </span>
          </div>
          <Button
            @click="updateProfile"
            :loading="updating"
            class="p-button p-component p-button-primary mr-2"
            severity="success"
          >
            Update Profile
          </Button>
        </div>
      </div>
    </div>

    <!-- Authentication Methods -->
    <div v-else>
      <!-- Auth Tabs -->
      <TabView>
        <!-- Sign In Tab -->
        <TabPanel header="Sign In">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Email/Password Sign In -->
            <div class="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
              <Button severity="info" disabled class="flex-1"/>
              <form @submit.prevent="handleEmailSignIn" class="space-y-4">
                <div class="p-float-label">
                  <InputText
                    id="email"
                    v-model="emailAuth.email"
                    type="email"
                    class="w-full"
                    :class="{ 'p-invalid': submitted && !emailAuth.email }"
                  />
                  <label for="email">Email</label>
                </div>
                <div class="p-float-label">
                  <Password
                    id="password"
                    v-model="emailAuth.password"
                    :feedback="false"
                    class="w-full"
                    :class="{ 'p-invalid': submitted && !emailAuth.password }"
                    toggleMask
                  />
                  <label for="password">Password</label>
                </div>
                <div class="flex items-center justify-between">
                  <Button
                    type="submit"
                    :loading="loading"
                    class="p-button p-component p-button-primary mr-2"
                    severity="primary"
                  >
                    Sign In
                  </Button>
                  <Button
                    type="button"
                    @click="showForgotPassword = true"
                    class="p-button p-component p-button-primary mr-2"
                    text
                    size="small"
                  >
                    Forgot Password?
                  </Button>
                </div>
              </form>
            </div>

            <!-- Social Sign In -->
            <div class="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
              <h3>Social Sign In</h3>
              <div class="space-y-3">
                <Button
                  @click="signInWithGoogle"
                  class="p-button p-component p-button-primary mr-2 w-full justify-center"
                  severity="secondary"
                >
                  <i class="pi pi-google mr-2"></i>
                  Continue with Google
                </Button>
                <Button
                  @click="signInWithGithub"
                  class="p-button p-component p-button-primary mr-2 w-full justify-center"
                  severity="secondary"
                >
                  <i class="pi pi-github mr-2"></i>
                  Continue with GitHub
                </Button>
                <Button
                  @click="signInAnonymously"
                  class="p-button p-component p-button-primary mr-2 w-full justify-center"
                  severity="info"
                  text
                >
                  <i class="pi pi-user mr-2"></i>
                  Continue Anonymously
                </Button>
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- Sign Up Tab -->
        <TabPanel header="Sign Up">
          <div class="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <h3>Create Account</h3>
            <form @submit.prevent="handleSignUp" class="space-y-4">
              <div class="p-float-label">
                <InputText
                  id="signupName"
                  v-model="signupForm.name"
                  class="w-full"
                  :class="{ 'p-invalid': signupSubmitted && !signupForm.name }"
                />
                <label for="signupName">Full Name</label>
              </div>
              <div class="p-float-label">
                <InputText
                  id="signupEmail"
                  v-model="signupForm.email"
                  type="email"
                  class="w-full"
                  :class="{ 'p-invalid': signupSubmitted && !signupForm.email }"
                />
                <label for="signupEmail">Email</label>
              </div>
              <div class="p-float-label">
                <Password
                  id="signupPassword"
                  v-model="signupForm.password"
                  class="w-full"
                  :class="{ 'p-invalid': signupSubmitted && !signupForm.password }"
                  :feedback="true"
                  toggleMask
                />
                <label for="signupPassword">Password</label>
              </div>
              <div class="p-float-label">
                <Password
                  id="confirmPassword"
                  v-model="signupForm.confirmPassword"
                  class="w-full"
                  :class="{ 'p-invalid': signupSubmitted && !passwordsMatch }"
                  :feedback="false"
                  toggleMask
                />
                <label for="confirmPassword">Confirm Password</label>
              </div>
              <small class="text-red-500" v-if="signupSubmitted && !passwordsMatch">
                Passwords do not match
              </small>
              <Button
                type="submit"
                :loading="loading"
                class="p-button p-component p-button-primary mr-2 w-full"
                severity="primary"
              >
                Create Account
              </Button>
            </form>
          </div>
        </TabPanel>
      </TabView>
    </div>
  </Card>
  </div>
</template>

<script setup lang="ts">
import '@/assets/css/component-title.css';
import { Card } from 'primevue/card';
import { Avatar } from 'primevue/avatar';
import { Password } from 'primevue/password';
import { TabView, TabPanel } from 'primevue/tabview';
import {
  GithubAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  type User
} from 'firebase/auth';

const { auth, formatTimestampString } = useFirebase();
const {
  user: currentUser,
  loading: authLoading,
  error: authError,
  login,
  register,
  logout,
  googleLogin,
  resetPassword,
  updateUserProfile,
  signInAnon
} = useAuth();
const toast = useToast();

// State
const loading = ref(false);
const updating = ref(false);
const submitted = ref(false);
const signupSubmitted = ref(false);
const resetSubmitted = ref(false);
const showForgotPassword = ref(false);
const resetting = ref(false);

// Form state
const emailAuth = ref({
  email: '',
  password: ''
});

const signupForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const resetEmail = ref('');

const profile = ref({
  displayName: ''
});

// Computed
const passwordsMatch = computed(() =>
  signupForm.value.password === signupForm.value.confirmPassword
);

const getUserInitials = computed(() => {
  if (!currentUser.value?.displayName) return 'A';
  return currentUser.value.displayName
    .split(' ')
    .map((n: any[]) => n[0])
    .join('')
    .toUpperCase();
});

// Methods
const handleEmailSignIn = async () => {
  submitted.value = true;
  if (!emailAuth.value.email || !emailAuth.value.password) return;

  try {
    await login(emailAuth.value.email, emailAuth.value.password);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Signed in successfully',
      life: 3000
    });
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    });
  }
};

const handleSignUp = async () => {
  signupSubmitted.value = true;

  if (!signupForm.value.name ||
      !signupForm.value.email ||
      !signupForm.value.password ||
      !passwordsMatch.value) {
    return;
  }

  try {
    loading.value = true;
    // Register the user
    const user = await register(signupForm.value.email, signupForm.value.password);

    // Update profile with name
    await updateUserProfile(signupForm.value.name);

    // Send verification email
    if (user) {
      await sendEmailVerification(user);
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Account created successfully. Please check your email for verification.',
      life: 5000
    });

    // Reset form
    signupForm.value = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    signupSubmitted.value = false;
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const handleResetPassword = async () => {
  resetSubmitted.value = true;
  if (!resetEmail.value) return;

  try {
    resetting.value = true;
    await resetPassword(resetEmail.value);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Password reset link has been sent to your email',
      life: 3000
    });
    showForgotPassword.value = false;
    resetEmail.value = '';
    resetSubmitted.value = false;
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    });
  } finally {
    resetting.value = false;
  }
};

const signInWithGoogle = async () => {
  try {
    await googleLogin();
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Signed in with Google',
      life: 3000
    });
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    });
  }
};

const signInWithGithub = async () => {
  try {
    const provider = new GithubAuthProvider();
    await signInWithPopup(auth, provider);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Signed in with GitHub',
      life: 3000
    });
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    });
  }
};

const signInAnonymously = async () => {
  try {
    await signInAnon();
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Signed in anonymously',
      life: 3000
    });
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    });
  }
};

const signOut = async () => {
  try {
    await logout();
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Signed out successfully',
      life: 3000
    });
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    });
  }
};

// Watch for auth errors
watch(authError, (error: any) => {
  if (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error,
      life: 3000
    });
  }
});

// Set page metadata

</script>

<style scoped>
</style>
