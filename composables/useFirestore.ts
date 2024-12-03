import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type DocumentData,
  type QueryConstraint,
  addDoc,
} from 'firebase/firestore'
import { useFirebase } from './useFirebase'

export const useFirestore = () => {
  const { firestore } = useFirebase()

  const getCollection = async (collectionName: string) => {
    try {
      const querySnapshot = await getDocs(collection(firestore, collectionName))
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    } catch (error) {
      console.error('Error getting collection:', error)
      throw error
    }
  }

  const getDocument = async (collectionName: string, documentId: string) => {
    try {
      const docRef = doc(firestore, collectionName, documentId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        }
      }
      return null
    } catch (error) {
      console.error('Error getting document:', error)
      throw error
    }
  }

  const setDocument = async (
    collectionName: string,
    documentId: string,
    data: DocumentData
  ) => {
    try {
      if (documentId) {
        const docRef = doc(firestore, collectionName, documentId)
        await setDoc(docRef, data)
        return { id: documentId, ...data }
      } else {
        const collectionRef = collection(firestore, collectionName)
        const docRef = await addDoc(collectionRef, data)
        return { id: docRef.id, ...data }
      }
    } catch (error) {
      console.error('Error setting document:', error)
      throw error
    }
  }

  const updateDocument = async (
    collectionName: string,
    documentId: string,
    data: Partial<DocumentData>
  ) => {
    try {
      const docRef = doc(firestore, collectionName, documentId)
      await updateDoc(docRef, data)
      return { id: documentId, ...data }
    } catch (error) {
      console.error('Error updating document:', error)
      throw error
    }
  }

  const deleteDocument = async (collectionName: string, documentId: string) => {
    try {
      const docRef = doc(firestore, collectionName, documentId)
      await deleteDoc(docRef)
      return true
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  }

  const queryCollection = async (
    collectionName: string,
    constraints: QueryConstraint[]
  ) => {
    try {
      const q = query(collection(firestore, collectionName), ...constraints)
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    } catch (error) {
      console.error('Error querying collection:', error)
      throw error
    }
  }

  const checkCollectionExists = async (collectionName: string): Promise<boolean> => {
    try {
      const collectionRef = collection(firestore, collectionName)
      const querySnapshot = await getDocs(collectionRef)
      
      if (querySnapshot.empty) {
        throw new Error(`Collection "${collectionName}" exists but is empty.`)
      }
      
      return true
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        throw new Error(`Permission denied: Unable to access collection "${collectionName}". Check your Firestore security rules.`)
      }
      
      if (error.message.includes('no-such-collection')) {
        throw new Error(`Collection "${collectionName}" does not exist in the Firestore database.`)
      }
      
      if (error.code === 'unavailable') {
        throw new Error(`Firestore service is currently unavailable. Please check your network connection.`)
      }
      
      console.error('Unexpected error checking collection:', error)
      throw new Error(`Unexpected error checking collection "${collectionName}": ${error.message}`)
    }
  }

  return {
    getCollection,
    getDocument,
    setDocument,
    updateDocument,
    deleteDocument,
    queryCollection,
    checkCollectionExists,
    where,
    orderBy,
    limit,
  }
}
