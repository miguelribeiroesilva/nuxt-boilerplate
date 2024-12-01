import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { 
  getStorage, 
  ref as storageRef, 
  getDownloadURL, 
  uploadBytes, 
  deleteObject, 
  listAll,
  getBlob 
} from 'firebase/storage'
import { useRuntimeConfig } from 'nuxt/app'
import { Timestamp } from 'firebase/firestore';
import { useToast } from 'primevue/usetoast';

export const useFirebase = () => {
  const config = useRuntimeConfig()
  const testing = ref(false);
  const testResult = ref<{ success: boolean; message: string } | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

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

  // Configuration status
  const configStatus = computed(() => ({
    apiKey: !!config.public.firebaseApiKey,
    authDomain: !!config.public.firebaseAuthDomain,
    projectId: !!config.public.firebaseProjectId,
    storageBucket: !!config.public.firebaseStorageBucket,
    messagingSenderId: !!config.public.firebaseMessagingSenderId,
    appId: !!config.public.firebaseAppId
  }));

  // Masked configuration
  const maskedConfig = computed(() => {
    const masked = {
      apiKey: maskValue(config.public.firebaseApiKey),
      authDomain: config.public.firebaseAuthDomain,
      projectId: config.public.firebaseProjectId,
      storageBucket: config.public.firebaseStorageBucket,
      messagingSenderId: config.public.firebaseMessagingSenderId,
      appId: maskValue(config.public.firebaseAppId)
    };
    return JSON.stringify(masked, null, 2);
  });

  // Format configuration key
  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Mask sensitive values
  const maskValue = (value: string) => {
    if (!value) return '';
    return value.slice(0, 4) + '*'.repeat(Math.max(0, value.length - 8)) + value.slice(-4);
  };

  const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        unsubscribe()
        resolve(user)
      }, reject)
    })
  }

  const formatTimestamp = (timestamp: Date | Timestamp | null): Date | null => {
    if (!timestamp) return null;
    return timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
  };

  const formatTimestampString = (timestamp: Date | Timestamp | string | null): string => {
    if (!timestamp) return 'Just now';

    // Convert to Date object if it's a Timestamp
    const date = timestamp instanceof Timestamp
      ? timestamp.toDate()
      : (timestamp instanceof Date
        ? timestamp
        : new Date(timestamp));

    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid Date';

    // Format date as yyyy-mm-dd
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // Test Firebase connection
  const testConnection = async () => {
    testing.value = true;
    testResult.value = null;

    try {
      // Test authentication
      await signInAnonymously(auth);

      testResult.value = {
        success: true,
        message: 'Successfully connected to Firebase!'
      };

      return {
        success: true,
        message: 'Firebase connection test passed'
      };
    } catch (error: any) {
      testResult.value = {
        success: false,
        message: `Connection failed: ${error.message}`
      };

      return {
        success: false,
        message: 'Firebase connection test failed'
      };
    } finally {
      testing.value = false;
    }
  };

  const downloadFile = async (
    filePath: string, 
    fileName?: string, 
    toastCallback?: (severity: 'success' | 'error', summary: string, detail: string) => void
  ) => {
    try {
      loading.value = true;
      error.value = null;

      // Use Nuxt server route to download the file
      const downloadResponse = await $fetch(`/api/download?filePath=${encodeURIComponent(filePath)}`, {
        method: 'GET',
        responseType: 'blob'
      });

      // Show success toast if callback is provided
      if (toastCallback) {
        toastCallback('success', 'File Download', `${fileName || 'File'} download initiated`);
      }

      return downloadResponse;
    } catch (err: any) {
      error.value = err.message || 'Download failed';
      console.error('Download error:', err);
      
      // Show error toast if callback is provided
      if (toastCallback) {
        toastCallback('error', 'Download Failed', err.message);
      }
      
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const uploadFile = async (file: File, path: string) => {
    try {
      loading.value = true;
      error.value = null;
      const storageReference = storageRef(storage, path);
      const snapshot = await uploadBytes(storageReference, file);
      return snapshot;
    } catch (err: any) {
      error.value = err.message || 'Upload failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteFile = async (filePath: string) => {
    try {
      loading.value = true;
      error.value = null;
      const fileReference = storageRef(storage, filePath);
      await deleteObject(fileReference);
    } catch (err: any) {
      error.value = err.message || 'Delete failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const listFiles = async (path: string) => {
    try {
      loading.value = true;
      error.value = null;
      const listReference = storageRef(storage, path);
      const fileList = await listAll(listReference);
      
      // Enrich file list with additional metadata
      const enrichedFiles = await Promise.all(fileList.items.map(async (fileRef) => {
        try {
          const downloadURL = await getDownloadURL(fileRef);
          return {
            name: fileRef.name,
            fullPath: fileRef.fullPath,
            downloadURL,
          };
        } catch (err) {
          console.error(`Error getting download URL for ${fileRef.name}:`, err);
          return {
            name: fileRef.name,
            fullPath: fileRef.fullPath,
            downloadURL: null,
          };
        }
      }));

      return enrichedFiles;
    } catch (err: any) {
      error.value = err.message || 'List files failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    app,
    auth,
    firestore,
    storage,
    getCurrentUser,
    formatTimestamp,
    formatTimestampString,
    Timestamp,
    configStatus,
    maskedConfig,
    formatKey,
    maskValue,
    testing,
    testResult,
    testConnection,
    downloadFile,
    uploadFile,
    deleteFile,
    listFiles,
    loading,
    error,
  }
}
