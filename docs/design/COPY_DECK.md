# Copy deck (DS2) — E1 note, guest-first sign-in states, offline and reminders

Source of truth in code: `src/app/i18n/strings.ts` (tested by `strings.test.ts`: every key in EN, FR and ES with matching placeholders). English is final for beta. FR and ES are drafts that need reviewed copy before real customers (tracked in the release checklist). A missing string falls back to English with a visible marker.

## E1 private note
| Key | EN | FR (draft) | ES (draft) |
|---|---|---|---|
| note.prompt | Something stay with you? Leave the creator a private note. | Quelque chose vous a marqué ? Laissez une note privée à la personne créatrice. | ¿Algo se quedó contigo? Deja una nota privada a la persona creadora. |
| note.title | Write a private note | Écrire une note privée | Escribe una nota privada |
| note.placeholder | What did this story bring up for you? | Qu'est-ce que cette histoire a fait naître en vous ? | ¿Qué despertó en ti esta historia? |
| note.counter | {n} / 500 | {n} / 500 | {n} / 500 |
| note.named | Include my name | Inclure mon nom | Incluir mi nombre |
| note.privacy | Only the creator can read this. It is never shown publicly. | Seule la personne créatrice peut la lire. Elle n'est jamais publique. | Solo la persona creadora puede leerla. Nunca es pública. |
| note.send | Send note | Envoyer la note | Enviar nota |
| note.sent | Note sent. | Note envoyée. | Nota enviada. |
| note.requiresAccount | Sign in to send a note. | Connectez-vous pour envoyer une note. | Inicia sesión para enviar una nota. |
| note.limit | You already sent a note on this story. Try again in an hour. | Vous avez déjà envoyé une note sur cette histoire. Réessayez dans une heure. | Ya enviaste una nota sobre esta historia. Inténtalo en una hora. |
| note.error | Couldn't send your note. Try again. | Impossible d'envoyer votre note. Réessayez. | No se pudo enviar tu nota. Inténtalo de nuevo. |
| inbox.title | Notes | Notes | Notas |
| inbox.empty | No notes yet. When someone writes to you, it appears here. | Aucune note pour l'instant. | Aún no hay notas. |
| inbox.anonymous | Someone who read your story | Une personne qui a lu votre histoire | Alguien que leyó tu historia |
| inbox.delete | Delete note | Supprimer la note | Eliminar nota |
| inbox.deleteConfirm | Delete this note? This can't be undone. | Supprimer cette note ? Action irréversible. | ¿Eliminar esta nota? No se puede deshacer. |
| inbox.error | Couldn't load your notes. | Impossible de charger vos notes. | No se pudieron cargar tus notas. |

## Sign-in states (G1, guest-first)
| State | EN message |
|---|---|
| requires account | Sign in to {action}. You'll come back to this story. |
| wrong credentials | That email or password doesn't match. Check and try again. |
| auth failed | We couldn't sign you in. Try again in a moment. |
| offline | You're offline. Connect to sign in. Reading saved stories still works. |
| session expired | Your session ended. Sign in again to continue. |
| rate limited | Too many attempts. Wait a minute and try again. |
| email taken | An account with this email exists. Sign in instead. |
| reset sent | If that email has an account, a reset link is on its way. |

## Offline (E6) and reminders (E5)
| Key | EN |
|---|---|
| offline.save | Save for offline |
| offline.saved | Saved offline |
| offline.limit | You can keep 20 stories offline. Remove one to add another. |
| offline.expired | Reconnect to refresh this story. |
| offline.gone | No longer available offline. |
| offline.full | Your device is full. Free some space and try again. |
| reminder.toggle | Remind me before deadlines |
| reminder.item | {funder} closes in {days} days. |
