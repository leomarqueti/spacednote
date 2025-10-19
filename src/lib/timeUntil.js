import { format, isToday, isTomorrow, formatDistanceToNowStrict } from "date-fns"
import { ptBR } from "date-fns/locale"

export function timeUntil(nextReview) {
  if (!nextReview) return "sem data"
  
  const date = nextReview.toDate ? nextReview.toDate() : new Date(nextReview)
  const now = new Date()
  const diffMs = date - now

  // Caso já esteja atrasada
  if (diffMs <= 0) return "agora"

  // Se for hoje e dentro de 12 horas → mostra "daqui a Xh Ym"
  if (isToday(date) && diffMs < 12 * 60 * 60 * 1000) {
    return "daqui a " + formatDistanceToNowStrict(date, { locale: ptBR })
  }

  // Se for hoje → mostra horário
  if (isToday(date)) {
    return "hoje às " + format(date, "HH:mm", { locale: ptBR })
  }

  // Se for amanhã → mostra horário
  if (isTomorrow(date)) {
    return "amanhã às " + format(date, "HH:mm", { locale: ptBR })
  }

  // Se for outro dia → mostra dia e hora
  return format(date, "dd/MM 'às' HH:mm", { locale: ptBR })
}
