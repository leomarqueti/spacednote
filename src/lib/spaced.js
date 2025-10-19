import { Timestamp } from "firebase/firestore"

// Intervalos de repetição (em dias) — estilo Anki básico
export const STAGES = [1, 3, 7, 14, 30]

// Calcula a próxima data de revisão com base no estágio atual
export function nextReviewDate(stageIdx) {
  const days = STAGES[Math.min(stageIdx, STAGES.length - 1)]
  const dt = new Date()
  dt.setDate(dt.getDate() + days)
  
  return Timestamp.fromDate(dt) // Retorna um Timestamp do Firestore
}

// Exemplo de uso:
// const nextReviewDate = nextReviewDate(0) // Próxima revisão para o estágio 0
// console.log(nextReviewDate) // 2023-04-05T00:00:00.000Z
