// Firebase service for data operations
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../config/firebase'

/**
 * Save chat message to Firestore
 */
export const saveChatMessage = async (userId, message) => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured, skipping save')
    return null
  }

  try {
    const messagesRef = collection(db, 'chatMessages')
    const docRef = await addDoc(messagesRef, {
      userId,
      role: message.role,
      content: message.content,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error saving chat message:', error)
    throw error
  }
}

/**
 * Get chat history for a user
 */
export const getChatHistory = async (userId, limitCount = 50) => {
  if (!isFirebaseConfigured()) {
    return []
  }

  try {
    const messagesRef = collection(db, 'chatMessages')
    const q = query(
      messagesRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const messages = []
    
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    
    // Reverse to get chronological order
    return messages.reverse()
  } catch (error) {
    console.error('Error getting chat history:', error)
    return []
  }
}

/**
 * Save contract analysis result
 */
export const saveContractAnalysis = async (userId, contractCode, analysis) => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured, skipping save')
    return null
  }

  try {
    const analysesRef = collection(db, 'contractAnalyses')
    const docRef = await addDoc(analysesRef, {
      userId,
      contractCode: contractCode.substring(0, 1000), // Limit code length
      analysis,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error saving contract analysis:', error)
    throw error
  }
}

/**
 * Get user's contract analyses
 */
export const getUserContractAnalyses = async (userId, limitCount = 20) => {
  if (!isFirebaseConfigured()) {
    return []
  }

  try {
    const analysesRef = collection(db, 'contractAnalyses')
    const q = query(
      analysesRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const analyses = []
    
    querySnapshot.forEach((doc) => {
      analyses.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    
    return analyses
  } catch (error) {
    console.error('Error getting contract analyses:', error)
    return []
  }
}

/**
 * Save transaction risk assessment
 */
export const saveRiskAssessment = async (userId, transactionData, assessment) => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured, skipping save')
    return null
  }

  try {
    const assessmentsRef = collection(db, 'riskAssessments')
    const docRef = await addDoc(assessmentsRef, {
      userId,
      transactionData,
      assessment,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error saving risk assessment:', error)
    throw error
  }
}

/**
 * Get user's risk assessments
 */
export const getUserRiskAssessments = async (userId, limitCount = 20) => {
  if (!isFirebaseConfigured()) {
    return []
  }

  try {
    const assessmentsRef = collection(db, 'riskAssessments')
    const q = query(
      assessmentsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const assessments = []
    
    querySnapshot.forEach((doc) => {
      assessments.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    
    return assessments
  } catch (error) {
    console.error('Error getting risk assessments:', error)
    return []
  }
}

/**
 * Save user preferences
 */
export const saveUserPreferences = async (userId, preferences) => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured, skipping save')
    return null
  }

  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      preferences,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    // If document doesn't exist, create it
    if (error.code === 'not-found') {
      try {
        const userRef = doc(db, 'users', userId)
        await updateDoc(userRef, {
          preferences,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        return true
      } catch (createError) {
        console.error('Error creating user preferences:', createError)
        throw createError
      }
    }
    console.error('Error saving user preferences:', error)
    throw error
  }
}

/**
 * Get user preferences
 */
export const getUserPreferences = async (userId) => {
  if (!isFirebaseConfigured()) {
    return null
  }

  try {
    const userRef = doc(db, 'users', userId)
    const docSnap = await getDoc(userRef)
    
    if (docSnap.exists()) {
      return docSnap.data().preferences || null
    }
    return null
  } catch (error) {
    console.error('Error getting user preferences:', error)
    return null
  }
}

/**
 * Delete a document by ID and collection
 */
export const deleteDocument = async (collectionName, docId) => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured, skipping delete')
    return false
  }

  try {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error('Error deleting document:', error)
    throw error
  }
}
