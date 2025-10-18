// Configure seu Firebase aqui
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// ⚠️ Troque pelos dados do seu projeto (Firebase Console > Configurações do projeto > Seus apps > Web)
const firebaseConfig = {
  apiKey: "SUA_apiKey",
  authDomain: "SEU_authDomain",
  projectId: "SEU_projectId",
  storageBucket: "SEU_storageBucket",
  messagingSenderId: "SEU_senderId",
  appId: "SEU_appId"
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export const db = getFirestore(app)