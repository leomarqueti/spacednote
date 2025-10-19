import { formatDistanceToNow, format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Retorna frase tipo "em 5 horas" ou "amanhã às 09:00"
export function timeUntil(nextReview) {
  if (!nextReview) return "sem data"
  const date = nextReview.toDate ? nextReview.toDate() : new Date(nextReview)
  const diff = date - new Date()

  // Se já passou, mostra "agora"
  if (diff <= 0) return "agora"

  // Se for menos de 24h, mostra tempo relativo
  if (diff < 24 * 60 * 60 * 1000) {
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
  }

  // Se for pra amanhã ou mais, mostra data e hora
  return "em " + format(date, "dd/MM 'às' HH:mm", { locale: ptBR })
}