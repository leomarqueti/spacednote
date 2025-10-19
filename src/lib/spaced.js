import { Timestamp } from "firebase/firestore"

// Intervalos de repetição (em dias) — estilo Anki básico
export const STAGES = [1, 3, 7, 14, 30]

// Calcula a próxima data de revisão com base no estágio atual
export function nextReviewDate(stageIdx) {
  const days = STAGES[Math.min(stageIdx, STAGES.length - 1)]
  const dt = new Date()
  dt.setDate(dt.getDate() + days)
  
  // Retorna no formato Timestamp para funcionar bem no Firestore
  return Timestamp.fromDate(dt)
}
