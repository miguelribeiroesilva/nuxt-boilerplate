import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { useRuntimeConfig } from 'nuxt/app'
import { Timestamp } from 'firebase/firestore';

export const useFirebase = () => {
  const config = useRuntimeConfig()
  
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  }

  // Initialize Firebase only if it hasn't been initialized yet
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
  const auth = getAuth(app)
  const firestore = getFirestore(app)
  const storage = getStorage(app)

  const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        unsubscribe()
        resolve(user)
      }, reject)
    })
  }

  const formatTimestamp = (timestamp: Date | Timestamp | null): string => {
    if (!timestamp) return 'Just now';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return date.toLocaleTimeString();
  };

  return {
    app,
    auth,
    firestore,
    storage,
    getCurrentUser,
    formatTimestamp,
  }
}
