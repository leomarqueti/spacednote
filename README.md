# SpacedNotes (React + Firebase + Quill)

Notion‑style, simples e rápido, com repetição espaçada: **1, 3, 7, 14, 30 dias**.

## Como usar no StackBlitz
1. Faça upload deste projeto (ZIP) em https://stackblitz.com → New Project → Upload Project
2. No terminal, rode:
   ```bash
   npm install
   npm run dev
   ```
3. Configure o Firebase em `src/store/firebase.js` com as credenciais do seu app Web.
4. No Firebase Console → Firestore Database → Habilite o banco (modo Production).

### Regras básicas de segurança (Firestore)
No menu **Rules**, você pode começar com algo simples para uso pessoal (ajuste depois):
```
// NÃO use em produção real sem autenticação! Uso pessoal apenas.
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
**Dica:** para travar, ative Firebase Auth e troque as regras para somente usuário logado.

## Scripts
- `npm run dev` → inicia o Vite
- `npm run build` → build de produção
- `npm run preview` → pré-visualiza o build

## Onde mudar os intervalos de repetição
Edite `src/lib/spaced.js` (array `STAGES`).

Bom estudo! 🧠🚀
