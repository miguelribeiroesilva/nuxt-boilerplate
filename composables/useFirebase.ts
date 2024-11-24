import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

export const useFirebase = () => {
  const firebaseConfig = {
    apiKey: process.env.NUXT_FIREBASE_API_KEY,
    authDomain: process.env.NUXT_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NUXT_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NUXT_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NUXT_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NUXT_FIREBASE_APP_ID,
  }

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
  const auth = getAuth(app)
  const firestore = getFirestore(app)
  const storage = getStorage(app)

  return {
    app,
    auth,
    firestore,
    storage,
  }
}
