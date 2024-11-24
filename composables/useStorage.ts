import type {
  StorageReference} from 'firebase/storage';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage'
import { ref } from 'vue'
import { useFirebase } from './useFirebase'

export const useStorage = () => {
  const { storage } = useFirebase()
  const uploadProgress = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const uploadFile = async (
    path: string,
    file: File,
    metadata?: { [key: string]: string }
  ) => {
    loading.value = true
    error.value = null
    try {
      const fileRef = storageRef(storage, path)
      const snapshot = await uploadBytes(fileRef, file, { customMetadata: metadata })
      const downloadURL = await getDownloadURL(snapshot.ref)
      return {
        downloadURL,
        path,
        metadata: snapshot.metadata,
      }
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteFile = async (path: string) => {
    loading.value = true
    error.value = null
    try {
      const fileRef = storageRef(storage, path)
      await deleteObject(fileRef)
      return true
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const getFileURL = async (path: string) => {
    loading.value = true
    error.value = null
    try {
      const fileRef = storageRef(storage, path)
      return await getDownloadURL(fileRef)
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  const listFiles = async (path: string) => {
    loading.value = true
    error.value = null
    try {
      const folderRef = storageRef(storage, path)
      const result = await listAll(folderRef)
      const files = await Promise.all(
        result.items.map(async (itemRef: StorageReference) => {
          const downloadURL = await getDownloadURL(itemRef)
          return {
            name: itemRef.name,
            fullPath: itemRef.fullPath,
            downloadURL,
          }
        })
      )
      return files
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    uploadFile,
    deleteFile,
    getFileURL,
    listFiles,
    uploadProgress,
    loading,
    error,
  }
}
