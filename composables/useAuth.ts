import type {
  User} from 'firebase/auth';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  signInAnonymously,
  sendEmailVerification,
} from 'firebase/auth'
import { serverTimestamp } from 'firebase/firestore'

export const useAuth = () => {
  const { auth } = useFirebase()
  const { setDocument, updateDocument, getDocument } = useFirestore()
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Sync user data with Firestore
  const syncUserWithFirestore = async (user: User) => {
    try {
      // Get existing user data
      const existingUser = await getDocument('users', user.uid)

      // Base user data
      const userData = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        lastLoginAt: serverTimestamp(),
      }

      if (!existingUser) {
        // Create new user document
        await setDocument('users', user.uid, {
          ...userData,
          createdAt: serverTimestamp(),
          role: 'user', // Default role
          status: 'active',
        })
      } else {
        // Update existing user
        await updateDocument('users', user.uid, {
          ...userData,
          updatedAt: serverTimestamp(),
        })
      }
    } catch (e) {
      console.error('Error syncing user with Firestore:', e)
      // Don't throw error to prevent auth flow interruption
    }
  }

  // Initialize auth state
  onAuthStateChanged(auth, async (currentUser) => {
    user.value = currentUser
    if (currentUser) {
      await syncUserWithFirestore(currentUser)
    }
  })

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      await syncUserWithFirestore(userCredential.user)
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
      await syncUserWithFirestore(userCredential.user)
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
      // Update last seen before logout
      if (user.value) {
        await updateDocument('users', user.value.uid, {
          lastSeenAt: serverTimestamp(),
        })
      }
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
      await syncUserWithFirestore(result.user)
      return result.user
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const githubLogin = async () => {
    loading.value = true
    error.value = null
    try {
      const provider = new GithubAuthProvider()
      const result = await signInWithPopup(auth, provider)
      await syncUserWithFirestore(result.user)
      return result.user
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const anonymousLogin = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await signInAnonymously(auth)
      await syncUserWithFirestore(result.user)
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
      // Sync profile update with Firestore
      await updateDocument('users', auth.currentUser.uid, {
        displayName,
        photoURL: photoURL || null,
        updatedAt: serverTimestamp(),
      })
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const verifyEmail = async () => {
    if (!auth.currentUser) throw new Error('No user logged in')
    loading.value = true
    error.value = null
    try {
      await sendEmailVerification(auth.currentUser)
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const signInAnon = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await signInAnonymously(auth)
      if (result.user) {
        await syncUserWithFirestore(result.user)
      }
      return result
    } catch (e: any) {
      error.value = e.code === 'auth/admin-restricted-operation' 
        ? 'Anonymous authentication is not enabled in Firebase Console. Please enable it in Authentication > Sign-in methods.'
        : e.message
      throw new Error(error.value)
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
    githubLogin,
    anonymousLogin,
    resetPassword,
    updateUserProfile,
    verifyEmail,
    signInAnon,
  }
}
