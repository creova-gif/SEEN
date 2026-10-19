// All website copy, EN / FR / ES. Every language must have exactly the same keys
// (site/check/site.check.mjs enforces it). FR and ES are drafts until a native speaker reviews them.

export const LANGS = ["en", "fr", "es"];

export const copy = {
  en: {
    htmlLang: "en",
    langName: "English",
    title: "SEEN: You're seen in the app",
    description:
      "SEEN is a home for community stories in English, French and Spanish. Read and listen to stories, follow creators, explore collections and find funding for storytellers.",
    skip: "Skip to content",
    navLabel: "Main",
    nav: {
      what: "What is SEEN",
      creators: "For creators",
      viewers: "For viewers",
      beta: "Beta status",
      about: "About CREOVA",
    },
    cta: "Try the demo app",
    hero: {
      eyebrow: "SEEN by CREOVA",
      h1: "You're seen in the app.",
      lead: "SEEN is a home for community stories in English, French and Spanish. Read and listen to stories, follow the people who tell them, explore collections, and find funding for storytellers.",
      secondary: "See beta status",
      note: "The demo uses sample stories and sample accounts. Nothing you do in it is shared with anyone.",
    },
    what: {
      h2: "What is SEEN?",
      cards: [
        {
          h3: "Stories in three languages",
          p: "Read or listen to story worlds in English, French and Spanish, and switch the app's language at any time.",
        },
        {
          h3: "Creators and collections",
          p: "Follow creators, save stories, and explore collections gathered around a theme.",
        },
        {
          h3: "Funding for storytellers",
          p: "Browse Canadian funding programs for storytellers, each linked to the funder's own page, and keep track of your applications.",
        },
      ],
    },
    creators: {
      h2: "For creators",
      lead: "Tell your story on your terms.",
      p: "Write and publish stories with image descriptions and content notes, so more people can take part. Your credit and your consent come first.",
      listTitle: "Before the beta opens, we are working on:",
      list: [
        "Permissions and credit for everyone who worked on a story",
        "A way to challenge a credit",
        "Privacy settings you control",
        "Reporting, and removal of content that should come down",
      ],
    },
    viewers: {
      h2: "For viewers",
      lead: "Open a story and start reading or listening.",
      p: "SEEN works on small phones and is built with access in mind.",
      list: [
        "Interface in English, French and Spanish",
        "A larger text option",
        "Playback speed controls",
        "Tools to report something that isn't right",
      ],
    },
    beta: {
      h2: "Beta status",
      todayTitle: "Today",
      today:
        "The demo app is open to try. It runs on sample stories and sample accounts, and everything you do stays in your own browser.",
      plannedTitle: "Planned: Beta 1, January 2027 (date to be confirmed)",
      plannedList: [
        "Accounts that work across your devices",
        "Browsing without an account (limited)",
        "Creator publishing",
        "Transcripts that creators can edit",
      ],
      caveat: "Dates and scope can change. We will update this page when they do.",
    },
    about: {
      h2: "About CREOVA",
      p: "SEEN is built by CREOVA, the studio behind tools for cultural workers who refuse to compromise narrative integrity for algorithmic favor.",
      link: "Visit creova.one",
    },
    footer: {
      line: "SEEN by CREOVA",
      privacy: "This site sets no cookies and has no analytics.",
      language: "Language",
    },
  },

  fr: {
    htmlLang: "fr",
    langName: "Français",
    title: "SEEN : Vous êtes vu·e dans l'app",
    description:
      "SEEN est un lieu pour les histoires communautaires en français, en anglais et en espagnol. Lisez et écoutez des histoires, suivez les créateurs, explorez des collections et trouvez du financement pour les conteurs.",
    skip: "Aller au contenu",
    navLabel: "Principale",
    nav: {
      what: "Qu'est-ce que SEEN",
      creators: "Pour les créateurs",
      viewers: "Pour les lecteurs",
      beta: "État de la bêta",
      about: "À propos de CREOVA",
    },
    cta: "Essayer la démo",
    hero: {
      eyebrow: "SEEN par CREOVA",
      h1: "Vous êtes vu·e dans l'app.",
      lead: "SEEN est un lieu pour les histoires communautaires en français, en anglais et en espagnol. Lisez et écoutez des histoires, suivez celles et ceux qui les racontent, explorez des collections et trouvez du financement pour les conteurs.",
      secondary: "Voir l'état de la bêta",
      note: "La démo utilise des histoires et des comptes d'exemple. Rien de ce que vous y faites n'est partagé avec qui que ce soit.",
    },
    what: {
      h2: "Qu'est-ce que SEEN ?",
      cards: [
        {
          h3: "Des histoires en trois langues",
          p: "Lisez ou écoutez des univers d'histoires en français, en anglais et en espagnol, et changez la langue de l'app à tout moment.",
        },
        {
          h3: "Créateurs et collections",
          p: "Suivez des créateurs, enregistrez des histoires et explorez des collections réunies autour d'un thème.",
        },
        {
          h3: "Du financement pour les conteurs",
          p: "Parcourez des programmes de financement canadiens pour les conteurs, chacun lié à la page officielle de l'organisme, et suivez vos demandes.",
        },
      ],
    },
    creators: {
      h2: "Pour les créateurs",
      lead: "Racontez votre histoire à votre façon.",
      p: "Écrivez et publiez des histoires avec des descriptions d'images et des avis de contenu, pour que plus de gens puissent y participer. Votre mention de crédit et votre consentement passent en premier.",
      listTitle: "Avant l'ouverture de la bêta, nous travaillons sur :",
      list: [
        "Les autorisations et les crédits pour toutes les personnes qui ont travaillé sur une histoire",
        "Une façon de contester un crédit",
        "Des paramètres de confidentialité que vous contrôlez",
        "Le signalement et le retrait des contenus qui doivent être retirés",
      ],
    },
    viewers: {
      h2: "Pour les lecteurs",
      lead: "Ouvrez une histoire et commencez à lire ou à écouter.",
      p: "SEEN fonctionne sur les petits téléphones et est conçu avec l'accessibilité en tête.",
      list: [
        "Interface en français, en anglais et en espagnol",
        "Une option de texte plus grand",
        "Contrôle de la vitesse de lecture",
        "Des outils pour signaler ce qui ne va pas",
      ],
    },
    beta: {
      h2: "État de la bêta",
      todayTitle: "Aujourd'hui",
      today:
        "La démo est ouverte à l'essai. Elle fonctionne avec des histoires et des comptes d'exemple, et tout ce que vous faites reste dans votre propre navigateur.",
      plannedTitle: "Prévu : bêta 1, janvier 2027 (date à confirmer)",
      plannedList: [
        "Des comptes qui fonctionnent sur tous vos appareils",
        "Navigation sans compte (limitée)",
        "Publication par les créateurs",
        "Des transcriptions que les créateurs peuvent modifier",
      ],
      caveat: "Les dates et le contenu peuvent changer. Nous mettrons cette page à jour le cas échéant.",
    },
    about: {
      h2: "À propos de CREOVA",
      p: "SEEN est conçu par CREOVA, le studio derrière des outils pour les travailleurs culturels qui refusent de sacrifier l'intégrité de leurs récits à la faveur des algorithmes.",
      link: "Visiter creova.one",
    },
    footer: {
      line: "SEEN par CREOVA",
      privacy: "Ce site n'utilise aucun témoin (cookie) et n'a pas d'outil d'analyse.",
      language: "Langue",
    },
  },

  es: {
    htmlLang: "es",
    langName: "Español",
    title: "SEEN: Te ven en la app",
    description:
      "SEEN es un lugar para historias comunitarias en español, inglés y francés. Lee y escucha historias, sigue a sus creadores, explora colecciones y encuentra financiamiento para quienes cuentan historias.",
    skip: "Saltar al contenido",
    navLabel: "Principal",
    nav: {
      what: "Qué es SEEN",
      creators: "Para creadores",
      viewers: "Para lectores",
      beta: "Estado de la beta",
      about: "Sobre CREOVA",
    },
    cta: "Probar la demo",
    hero: {
      eyebrow: "SEEN de CREOVA",
      h1: "Te ven en la app.",
      lead: "SEEN es un lugar para historias comunitarias en español, inglés y francés. Lee y escucha historias, sigue a quienes las cuentan, explora colecciones y encuentra financiamiento para quienes cuentan historias.",
      secondary: "Ver el estado de la beta",
      note: "La demo usa historias y cuentas de ejemplo. Nada de lo que hagas en ella se comparte con nadie.",
    },
    what: {
      h2: "¿Qué es SEEN?",
      cards: [
        {
          h3: "Historias en tres idiomas",
          p: "Lee o escucha mundos de historias en español, inglés y francés, y cambia el idioma de la app cuando quieras.",
        },
        {
          h3: "Creadores y colecciones",
          p: "Sigue a creadores, guarda historias y explora colecciones reunidas en torno a un tema.",
        },
        {
          h3: "Financiamiento para narradores",
          p: "Consulta programas de financiamiento canadienses para narradores, cada uno enlazado a la página oficial de la entidad, y lleva el control de tus solicitudes.",
        },
      ],
    },
    creators: {
      h2: "Para creadores",
      lead: "Cuenta tu historia a tu manera.",
      p: "Escribe y publica historias con descripciones de imágenes y avisos de contenido, para que más personas puedan participar. Tu crédito y tu consentimiento van primero.",
      listTitle: "Antes de abrir la beta, estamos trabajando en:",
      list: [
        "Permisos y créditos para todas las personas que trabajaron en una historia",
        "Una forma de impugnar un crédito",
        "Ajustes de privacidad que tú controlas",
        "Denuncias y retirada de contenido que deba retirarse",
      ],
    },
    viewers: {
      h2: "Para lectores",
      lead: "Abre una historia y empieza a leer o escuchar.",
      p: "SEEN funciona en teléfonos pequeños y está pensada con la accesibilidad en mente.",
      list: [
        "Interfaz en español, inglés y francés",
        "Una opción de texto más grande",
        "Control de la velocidad de reproducción",
        "Herramientas para denunciar algo que no está bien",
      ],
    },
    beta: {
      h2: "Estado de la beta",
      todayTitle: "Hoy",
      today:
        "La demo está abierta para probar. Funciona con historias y cuentas de ejemplo, y todo lo que haces se queda en tu propio navegador.",
      plannedTitle: "Previsto: beta 1, enero de 2027 (fecha por confirmar)",
      plannedList: [
        "Cuentas que funcionan en todos tus dispositivos",
        "Navegar sin cuenta (limitado)",
        "Publicación para creadores",
        "Transcripciones que los creadores pueden editar",
      ],
      caveat: "Las fechas y el alcance pueden cambiar. Actualizaremos esta página cuando eso ocurra.",
    },
    about: {
      h2: "Sobre CREOVA",
      p: "SEEN lo crea CREOVA, el estudio detrás de herramientas para trabajadores culturales que se niegan a sacrificar la integridad de sus relatos por el favor de los algoritmos.",
      link: "Visitar creova.one",
    },
    footer: {
      line: "SEEN de CREOVA",
      privacy: "Este sitio no usa cookies ni analítica.",
      language: "Idioma",
    },
  },
};
