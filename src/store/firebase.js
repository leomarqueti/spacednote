// Configure seu Firebase aqui
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// ⚠️ Troque pelos dados do seu projeto (Firebase Console > Configurações do projeto > Seus apps > Web)
const firebaseConfig = {
  apiKey: "AIzaSyD3h2eh_Wt0U3cADGbZAbx8w2ibmdRX8F4",
  authDomain: "spacednotes-b5993.firebaseapp.com",
  projectId: "spacednotes-b5993",
  storageBucket: "spacednotes-b5993.firebasestorage.app",
  messagingSenderId: "306673698599",
  appId: "1:306673698599:web:0cbe76e92c8955bbd84b02"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export const db = getFirestore(app)