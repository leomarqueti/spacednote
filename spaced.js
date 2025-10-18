// Intervalos de repetição (em dias) — estilo Anki básico
export const STAGES = [1, 3, 7, 14, 30]

export function nextReviewDate(stageIdx){
  const days = STAGES[Math.min(stageIdx, STAGES.length - 1)]
  const dt = new Date()
  dt.setDate(dt.getDate() + days)
  return dt
}