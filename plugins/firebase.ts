import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    // Your Firebase configuration here
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  return {
    provide: {
      db
    }
  }
})
