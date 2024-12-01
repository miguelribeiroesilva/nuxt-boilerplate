<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center p-4 dark:bg-gray-900 dark:text-white bg-white text-gray-900">
    <div class="w-full max-w-md">
      <header class="flex items-center gap-2 w-full mb-6">
        <BackButton />
        <Button label="Firebase Authentication" severity="info" disabled class="flex-1" />
      </header>

      <!-- User Profile -->
      <div v-if="currentUser" class="space-y-6 ">
        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <Avatar :image="currentUser.photoURL || undefined" :label="getUserInitials" size="large" shape="circle"
                class="border-2 border-primary-500" />
              <div>
                <h2 class="text-xl font-semibold">{{ currentUser.displayName || 'Anonymous User' }}</h2>
                <p class="text-sm opacity-75">{{ currentUser.email }}</p>
              </div>
            </div>
            <Button @click="signOut" class="p-button-danger" severity="danger" text>
              <i class="pi pi-sign-out mr-2"></i>
              Sign Out
            </Button>
          </div>
        </div>

        <!-- User Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 dark:bg-gray-800">
          <div class="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 class="font-medium mb-3">Email Verification</h3>
            <div class="flex items-center justify-between">
              <span>Status</span>
              <Tag :severity="currentUser.emailVerified ? 'success' : 'warning'" class="px-3 py-1">
                {{ currentUser.emailVerified ? 'Verified' : 'Not Verified' }}
              </Tag>
            </div>
            <Button v-if="!currentUser.emailVerified" @click="sendVerificationEmail" class="mt-3 w-full" severity="info"
              text>
              Send Verification Email
            </Button>
          </div>

          <div class="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 class="font-medium mb-2">Account Created</h3>
            <p>{{ formatTimestampString(currentUser.metadata.creationTime) }}</p>
            <p class="text-sm opacity-75 mt-1">
              Last Sign In: {{ formatTimestampString(currentUser.metadata.lastSignInTime) }}
            </p>
          </div>
        </div>

        <!-- Profile Update -->
        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 class="text-lg font-semibold mb-4">Update Profile</h3>
          <div class="flex gap-4">
            <div class="flex-1">
              <span class="p-float-label">
                <InputText id="displayName" v-model="profile.displayName" class="w-full" />
                <label for="displayName">Display Name</label>
              </span>
            </div>
            <Button @click="updateProfile" :loading="updating" severity="success">
              Update Profile
            </Button>
          </div>
        </div>
      </div>

      <!-- Authentication Methods -->
      <div v-else>
        <TabView>
          <!-- Sign In Tab -->
          <TabPanel header="Sign In">
            <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <!-- Email/Password Sign In -->
              <div class="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-4">
                <Button label="Email/Password Sign In" severity="info" disabled class="flex-1 mb-4 w-full" />
                <form @submit.prevent="handleEmailSignIn" class="space-y-4">
                  <div>
                    <label for="email" class="text-xs">Email</label>
                    <InputText id="email" v-model="emailAuth.email" type="email" class="w-full"
                      :class="{ 'p-invalid': submitted && !emailAuth.email }" />
                  </div>
                  <div>
                    <label for="password" class="text-xs">Password</label>
                    <Password id="password" v-model="emailAuth.password" :feedback="false" class="w-full"
                      :class="{ 'p-invalid': submitted && !emailAuth.password }" toggleMask />
                  </div>
                  <div class="flex items-center justify-between">
                    <Button type="submit" :loading="loading" severity="primary" class="w-full">
                      Sign In
                    </Button>
                  </div>
                  <div class="text-center">
                    <Button type="button" @click="showForgotPassword = true" text size="small">
                      Forgot Password?
                    </Button>
                  </div>
                </form>
              </div>

              <!-- Social Sign In -->
              <div class="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-4">
                <Button label="Social Sign with" severity="info" disabled class="flex-1 mb-4 w-full" />
                <div class="space-y-3">
                  <Button @click="signInWithGoogle" class="w-full justify-center" severity="secondary">
                    <i class="pi pi-google mr-2"></i>
                    Google
                  </Button>
                  <Button @click="signInWithGithub" class="w-full justify-center" severity="secondary">
                    <i class="pi pi-github mr-2"></i>
                    GitHub
                  </Button>
                  <Button @click="signInAnonymously" class="w-full justify-center" severity="info" text>
                    <i class="pi pi-user mr-2"></i>
                    Continue Anonymously
                  </Button>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- Sign Up Tab -->
          <TabPanel header="Sign Up">
            <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <Button label="Create Account" severity="info" disabled class="flex-1 mb-4 w-full" />
              <form @submit.prevent="handleSignUp" class="space-y-4">
                <div>
                  <label for="signupName" class="text-xs">Full Name</label>
                  <InputText id="signupName" v-model="signupForm.name" class="w-full"
                    :class="{ 'p-invalid': signupSubmitted && !signupForm.name }" />
                </div>
                <div>
                  <label for="signupEmail" class="text-xs">Email</label>
                  <InputText id="signupEmail" v-model="signupForm.email" type="email" class="w-full"
                    :class="{ 'p-invalid': signupSubmitted && !signupForm.email }" />
                </div>
                <div>
                  <label for="signupPassword" class="text-xs">Password</label>
                  <Password id="signupPassword" v-model="signupForm.password" class="w-full"
                    :class="{ 'p-invalid': signupSubmitted && !signupForm.password }" :feedback="true" toggleMask />
                </div>
                <div>
                  <label for="confirmPassword" class="text-xs">Confirm Password</label>
                  <Password id="confirmPassword" v-model="signupForm.confirmPassword" class="w-full"
                    :class="{ 'p-invalid': signupSubmitted && !passwordsMatch }" :feedback="false" toggleMask />
                </div>
                <small v-if="signupSubmitted && !passwordsMatch" class="text-red-500 block text-center">
                  Passwords do not match
                </small>
                <Button type="submit" :loading="loading" severity="primary" class="w-full mt-4">
                  Create Account
                </Button>
              </form>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import 'primevue/resources/themes/aura-light-green/theme.css'
// import 'primevue/resources/primevue.min.css'
// import 'primeicons/primeicons.css'
import Avatar from 'primevue/avatar';
import Password from 'primevue/password';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
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

// Profile update state
const profile = ref({
  displayName: currentUser.value?.displayName || ''
});

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

const sendVerificationEmail = async () => {
  if (!currentUser.value) return;
  try {
    loading.value = true;
    await sendEmailVerification(currentUser.value);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Verification email sent', life: 3000 });
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
  } finally {
    loading.value = false;
  }
};

const updateProfile = async () => {
  if (!currentUser.value) return;
  try {
    updating.value = true;
    await updateUserProfile({ displayName: profile.value.displayName });
    toast.add({ severity: 'success', summary: 'Success', detail: 'Profile updated', life: 3000 });
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
  } finally {
    updating.value = false;
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

// Watch currentUser to update profile state
watch(currentUser, (user) => {
  if (user) {
    profile.value.displayName = user.displayName || '';
  }
});

// Set page metadata

</script>
