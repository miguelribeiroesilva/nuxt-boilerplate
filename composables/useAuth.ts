import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth'
import { ref } from 'vue'
import { useFirebase } from './useFirebase'

export const useAuth = () => {
  const { auth } = useFirebase()
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Initialize auth state
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
  })

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null
    try {
      await signOut(auth)
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const googleLogin = async () => {
    loading.value = true
    error.value = null
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email: string) => {
    loading.value = true
    error.value = null
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!auth.currentUser) throw new Error('No user logged in')
    loading.value = true
    error.value = null
    try {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: photoURL || null,
      })
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    googleLogin,
    resetPassword,
    updateUserProfile,
  }
}
