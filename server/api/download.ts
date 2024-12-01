import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import { initializeApp, getApps } from 'firebase/app'
import path from 'path'

// Singleton Firebase initialization
const initFirebase = () => {
  // Check if Firebase is already initialized
  if (getApps().length > 0) {
    return getApps()[0]
  }

  // Firebase configuration
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  }

  console.log('Firebase Config:', firebaseConfig)

  // Initialize Firebase
  return initializeApp(firebaseConfig)
}

export default defineEventHandler(async (event) => {
  try {
    // Get the file path from query parameters
    const { filePath } = getQuery(event)

    if (!filePath) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File path is required'
      })
    }

    // Initialize Firebase (using singleton pattern)
    const firebaseApp = initFirebase()
    
    // Get Firebase Storage
    const storage = getStorage(firebaseApp)
    
    // Create a reference to the file
    const fileRef = ref(storage, filePath as string)
    
    // Get download URL
    const downloadURL = await getDownloadURL(fileRef)
    
    // Fetch the file
    const response = await fetch(downloadURL)
    
    if (!response.ok) {
      throw createError({
        statusCode: 404,
        statusMessage: `File not found. Response status: ${response.status}`
      })
    }

    const fileBlob = await response.blob()
    
    // Set headers to force download
    setHeaders(event, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${path.basename(filePath as string)}"`
    })
    
    // Return the file blob
    return fileBlob
  } catch (error) {
    console.error('Download error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
})
