/**
 * Strings for the notes, demo notice and sign-in messages (EN final; FR and ES are drafts that need
 * native review before real customers, see docs/design/COPY_DECK.md). A missing translation falls back
 * to English, never a raw key. Placeholders look like {name}.
 */
export type Lang = "en" | "fr" | "es";

export const STRINGS = {
  "demo.label": { en: "Demo mode", fr: "Mode démo", es: "Modo demo" },
  "demo.body": {
    en: "data stays on this device, nothing is saved on a server.",
    fr: "les données restent sur cet appareil, rien n'est enregistré sur un serveur.",
    es: "los datos se quedan en este dispositivo, nada se guarda en un servidor.",
  },
  "demo.dismiss": { en: "Dismiss demo mode notice", fr: "Fermer l'avis du mode démo", es: "Cerrar el aviso del modo demo" },

  "note.open": { en: "Write a private note to the creator", fr: "Écrire une note privée à la personne créatrice", es: "Escribir una nota privada a la persona creadora" },
  "note.title": { en: "Write a private note", fr: "Écrire une note privée", es: "Escribe una nota privada" },
  "note.sentTitle": { en: "Note sent", fr: "Note envoyée", es: "Nota enviada" },
  "note.desc": {
    en: "To the creator of {title}. Only they can read it. It is never shown publicly.",
    fr: "À la personne créatrice de {title}. Elle seule peut la lire. Elle n'est jamais publique.",
    es: "A la persona creadora de {title}. Solo ella puede leerla. Nunca es pública.",
  },
  "note.label": { en: "Your note", fr: "Votre note", es: "Tu nota" },
  "note.placeholder": { en: "What did this story bring up for you?", fr: "Qu'est-ce que cette histoire a fait naître en vous ?", es: "¿Qué despertó en ti esta historia?" },
  "note.named": { en: "Include my name", fr: "Inclure mon nom", es: "Incluir mi nombre" },
  "note.namedHint": {
    en: "Off by default. The creator sees “Someone who read your story”.",
    fr: "Désactivé par défaut. La personne créatrice voit « Une personne qui a lu votre histoire ».",
    es: "Desactivado por defecto. La persona creadora ve «Alguien que leyó tu historia».",
  },
  "note.send": { en: "Send note", fr: "Envoyer la note", es: "Enviar nota" },
  "note.done": { en: "Done", fr: "Terminé", es: "Listo" },
  "note.thanks": { en: "Thank you. The creator will see your note.", fr: "Merci. La personne créatrice verra votre note.", es: "Gracias. La persona creadora verá tu nota." },
  "note.err.signin": { en: "Sign in to send a note.", fr: "Connectez-vous pour envoyer une note.", es: "Inicia sesión para enviar una nota." },
  "note.err.limit": {
    en: "You already sent a note on this story. Try again in an hour.",
    fr: "Vous avez déjà envoyé une note sur cette histoire. Réessayez dans une heure.",
    es: "Ya enviaste una nota sobre esta historia. Inténtalo en una hora.",
  },
  "note.err.invalid": { en: "Notes are 1 to 500 characters.", fr: "Les notes font de 1 à 500 caractères.", es: "Las notas tienen de 1 a 500 caracteres." },
  "note.err.generic": { en: "Couldn't send your note. Try again.", fr: "Impossible d'envoyer votre note. Réessayez.", es: "No se pudo enviar tu nota. Inténtalo de nuevo." },

  "inbox.title": { en: "Notes", fr: "Notes", es: "Notas" },
  "inbox.intro": {
    en: "Private notes from people who read your stories. Only you can see them.",
    fr: "Notes privées de personnes qui ont lu vos histoires. Vous seul(e) pouvez les voir.",
    es: "Notas privadas de personas que leyeron tus historias. Solo tú puedes verlas.",
  },
  "inbox.emptyTitle": { en: "No notes yet", fr: "Aucune note pour l'instant", es: "Aún no hay notas" },
  "inbox.emptyBody": { en: "When someone writes to you, it appears here.", fr: "Quand quelqu'un vous écrit, la note apparaît ici.", es: "Cuando alguien te escriba, aparecerá aquí." },
  "inbox.anonymous": { en: "Someone who read your story", fr: "Une personne qui a lu votre histoire", es: "Alguien que leyó tu historia" },
  "inbox.delete": { en: "Delete", fr: "Supprimer", es: "Eliminar" },
  "inbox.block": { en: "Block", fr: "Bloquer", es: "Bloquear" },
  "inbox.deleteTitle": { en: "Delete this note?", fr: "Supprimer cette note ?", es: "¿Eliminar esta nota?" },
  "inbox.deleteBody": { en: "This can't be undone.", fr: "Cette action est irréversible.", es: "No se puede deshacer." },
  "inbox.deleteConfirm": { en: "Delete note", fr: "Supprimer la note", es: "Eliminar nota" },
  "inbox.blockTitle": { en: "Block this sender?", fr: "Bloquer cette personne ?", es: "¿Bloquear a esta persona?" },
  "inbox.blockBody": {
    en: "You won't see who they are. They can't send you new notes, and earlier notes stay. You can undo this in Account and privacy.",
    fr: "Vous ne verrez pas qui elle est. Elle ne pourra plus vous envoyer de notes ; les notes déjà reçues restent. Vous pouvez annuler dans Compte et confidentialité.",
    es: "No verás quién es. No podrá enviarte nuevas notas y las anteriores se quedan. Puedes deshacerlo en Cuenta y privacidad.",
  },
  "inbox.blockConfirm": { en: "Block sender", fr: "Bloquer", es: "Bloquear" },
  "inbox.blocked": {
    en: "Blocked. They can't send you new notes. Undo in Account and privacy.",
    fr: "Bloqué. Cette personne ne peut plus vous envoyer de notes. Annulez dans Compte et confidentialité.",
    es: "Bloqueado. No puede enviarte nuevas notas. Deshaz esto en Cuenta y privacidad.",
  },
  "inbox.err.delete": { en: "Couldn't delete the note. Try again.", fr: "Impossible de supprimer la note. Réessayez.", es: "No se pudo eliminar la nota. Inténtalo de nuevo." },
  "inbox.err.block": { en: "Couldn't block this person. Try again.", fr: "Impossible de bloquer cette personne. Réessayez.", es: "No se pudo bloquear a esta persona. Inténtalo de nuevo." },

  "auth.wrong": {
    en: "That email or password doesn't match. Check and try again.",
    fr: "Ce courriel ou ce mot de passe ne correspond pas. Vérifiez et réessayez.",
    es: "Ese correo o contraseña no coincide. Revisa e inténtalo de nuevo.",
  },
  "auth.rate": {
    en: "Too many attempts. Wait a minute and try again.",
    fr: "Trop de tentatives. Attendez une minute et réessayez.",
    es: "Demasiados intentos. Espera un minuto e inténtalo de nuevo.",
  },
  "auth.exists": {
    en: "An account with this email exists. Sign in instead.",
    fr: "Un compte existe déjà avec ce courriel. Connectez-vous plutôt.",
    es: "Ya existe una cuenta con este correo. Inicia sesión.",
  },
  "auth.offline": {
    en: "You appear to be offline.",
    fr: "Vous semblez être hors ligne.",
    es: "Parece que no tienes conexión.",
  },
} as const satisfies Record<string, Record<Lang, string>>;

export type StringKey = keyof typeof STRINGS;

export function translate(key: StringKey, lang: string, vars?: Record<string, string>): string {
  const entry = STRINGS[key] as Record<Lang, string>;
  const text = entry[lang as Lang] ?? entry.en;
  return vars ? text.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m) : text;
}

const KNOWN_ERRORS: Record<string, StringKey> = {
  "That email or password doesn't match. Check and try again.": "auth.wrong",
  "Too many attempts. Wait a minute and try again.": "auth.rate",
  "An account with this email exists. Sign in instead.": "auth.exists",
  "You appear to be offline.": "auth.offline",
};

/** Translates the sign-in errors we author; any other message is shown as received. */
export function localizeError(message: string, lang: string): string {
  const key = KNOWN_ERRORS[message];
  return key ? translate(key, lang) : message;
}
