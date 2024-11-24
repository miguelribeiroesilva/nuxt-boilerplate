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

  return {
    getCollection,
    getDocument,
    setDocument,
    updateDocument,
    deleteDocument,
    queryCollection,
    where,
    orderBy,
    limit,
  }
}
