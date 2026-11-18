export const curriculum = [
  {
    level: "A0",
    name: "Le fondamenta",
    description: "I primi suoni, le prime parole e le strutture essenziali.",
    progress: 0,
    lessons: [
      { id: "saluti", title: "Salut, je m’appelle…", detail: "Saluti e presentazioni", duration: "8 min", complete: false },
      { id: "pronuncia", title: "I suoni del francese", detail: "Alfabeto e pronuncia", duration: "10 min", complete: false },
      { id: "pronomi", title: "Je suis, tu es", detail: "Pronomi personali e être", duration: "12 min", complete: false },
      { id: "avoir", title: "J’ai, tu as", detail: "Il verbo avoir", duration: "10 min", complete: false },
      { id: "articoli", title: "Un café, une idée", detail: "Articoli e genere", duration: "12 min", complete: false },
      { id: "numeri", title: "Contare e salutare", detail: "Numeri e formule quotidiane", duration: "8 min", complete: false },
    ],
  },
  {
    level: "A1",
    name: "Le prime conversazioni",
    description: "Costruisci frasi e comincia a cavartela nelle situazioni di tutti i giorni.",
    progress: 0,
    lessons: [
      { id: "presente", title: "Parler de soi", detail: "Presente e verbi in -ER", duration: "12 min", complete: false },
      { id: "domande", title: "Et toi ?", detail: "Domande e negazione", duration: "10 min", complete: false },
      { id: "famiglia", title: "Ma famille", detail: "Persone e possessivi", duration: "10 min", complete: false },
      { id: "quotidiano", title: "Une journée ordinaire", detail: "Routine e orari", duration: "12 min", complete: false },
      { id: "bar", title: "Au café", detail: "Ordinare con cortesia", duration: "10 min", complete: false },
      { id: "citta", title: "Dans la ville", detail: "Luoghi e indicazioni", duration: "12 min", complete: false },
    ],
  },
  {
    level: "A2",
    name: "Più autonomia",
    description: "Racconta esperienze, progetti e preferenze con maggiore sicurezza.",
    progress: 0,
    lessons: [
      { id: "passato", title: "Qu’est-ce que tu as fait ?", detail: "Il passé composé", duration: "14 min", complete: false },
      { id: "progetti", title: "On va voyager", detail: "Parlare di progetti", duration: "12 min", complete: false },
      { id: "raccontare", title: "Quand j’étais petit…", detail: "Descrivere il passato", duration: "14 min", complete: false },
      { id: "opinioni", title: "À mon avis…", detail: "Opinioni e comparativi", duration: "12 min", complete: false },
    ],
  },
];

export const lessons = {
  saluti: {
    id: "saluti",
    level: "A0",
    title: "Salut, je m’appelle…",
    subtitle: "Saluta e presentati in francese",
    duration: "8 minuti",
    objective: "Presentarti e chiedere il nome di una persona usando due espressioni semplici e naturali.",
    explanation: "In francese puoi iniziare con bonjour (buongiorno) o salut (ciao, informale). Per dire il tuo nome, usa je m’appelle, letteralmente “mi chiamo”. La stessa struttura funziona in una conversazione reale, non solo in una lista di frasi da memorizzare.",
    vocabulary: [
      { word: "bonjour", translation: "buongiorno, salve", ipa: "/bɔ̃.ʒuʁ/", category: "interiezione", example: "Bonjour, Madame !", exampleTranslation: "Buongiorno, signora!" },
      { word: "salut", translation: "ciao", ipa: "/sa.ly/", category: "interiezione", note: "Informale: si usa con amici e persone che si conoscono." },
      { word: "s’appeler", translation: "chiamarsi", ipa: "/sa.ple/", category: "verbo pronominale", note: "Con je diventa je m’appelle. Me si elide davanti alla vocale di appelle." },
    ],
    phrases: [
      {
        text: "Bonjour, je m’appelle Luca.",
        meaning: "Buongiorno, mi chiamo Luca.",
        ipa: "/bɔ̃.ʒuʁ ʒə ma.pɛl ly.ka/",
        parts: [
          { french: "Bonjour", italian: "buongiorno", note: "Formula di saluto, adatta anche a un contesto formale." },
          { french: "je", italian: "io", note: "Pronome personale soggetto." },
          { french: "m’appelle", italian: "mi chiamo", note: "Me + appelle: il pronome si elide davanti alla vocale." },
          { french: "Luca", italian: "Luca", note: "Il nome della persona." },
        ],
        grammar: "S’appeler è un verbo pronominale: je m’appelle. L’apostrofo in m’appelle segnala che me perde la vocale davanti ad appelle.",
        alternatives: ["Salut, moi c’est Luca. — Ciao, io sono Luca.", "Et vous, comment vous appelez-vous ? — E lei, come si chiama?"],
        context: "Puoi usare questa presentazione quando incontri qualcuno per la prima volta. Salut è informale; bonjour è una scelta cortese e versatile.",
      },
    ],
    exercise: {
      prompt: "Come si dice «Mi chiamo Luca» in francese?",
      choices: ["Je suis Luca.", "Je m’appelle Luca.", "Moi appelle Luca."],
      answer: 1,
      explanation: "La forma corretta è je m’appelle. Il verbo s’appeler è pronominale: davanti alla vocale di appelle, me si accorcia in m’.",
      example: "Je m’appelle Anna. — Mi chiamo Anna.",
    },
  },
  pronuncia: {
    id: "pronuncia",
    level: "A0",
    title: "I suoni del francese",
    subtitle: "Riconosci la differenza tra u e ou",
    duration: "10 minuti",
    objective: "Riconoscere due suoni francesi diversi e notare quando una consonante finale non si pronuncia.",
    explanation: "La u francese, come in tu, non ha un suono identico in italiano: si trascrive /y/. La sequenza ou, come in tout, si pronuncia invece /u/. In tout la t finale non si sente. Le trascrizioni IPA qui sotto sono un riferimento, non un audio.",
    vocabulary: [
      { word: "tu", translation: "tu", ipa: "/ty/", category: "pronome personale", example: "tu", exampleTranslation: "tu" },
      { word: "tout", translation: "tutto", ipa: "/tu/", category: "aggettivo", gender: "maschile singolare", note: "La sequenza ou si pronuncia /u/; la t finale è muta in questa parola." },
      { word: "rue", translation: "via, strada", ipa: "/ʁy/", category: "nome femminile", gender: "femminile", note: "La u si pronuncia /y/." },
    ],
    phrases: [
      {
        text: "tu / tout",
        meaning: "tu / tutto",
        ipa: "/ty/ · /tu/",
        parts: [
          { french: "tu", italian: "tu", note: "La u si pronuncia /y/, un suono arrotondato che non ha un equivalente esatto in italiano." },
          { french: "tout", italian: "tutto", note: "La sequenza ou si pronuncia /u/; la t finale non si sente." },
        ],
        grammar: "La lettera u e il gruppo ou rappresentano suoni diversi: /y/ in tu e /u/ in tout. In francese molte consonanti finali non si pronunciano, ma ci sono eccezioni: è meglio imparare la pronuncia con ogni parola.",
        alternatives: ["rue /ʁy/ — via, strada", "roue /ʁu/ — ruota"],
        context: "Confrontare parole brevi ti aiuta a sentire la differenza tra suoni nuovi prima di incontrarli in frasi più lunghe.",
      },
    ],
    exercise: {
      prompt: "Quale suono rappresenta la u francese in tu?",
      choices: ["/u/", "/y/", "/e/"],
      answer: 1,
      explanation: "In tu, la u francese si trascrive /y/. È diversa da ou, che si pronuncia /u/, come in tout.",
      example: "rue /ʁy/ — via, strada.",
    },
  },
  bar: {
    id: "bar",
    level: "A1",
    title: "Au café",
    subtitle: "Una frase, tante cose da imparare",
    duration: "10 minuti",
    objective: "Usare una formula cortese per ordinare e riutilizzarla con parole diverse.",
    explanation: "Una frase utile può insegnarti molto più della sua traduzione: osserviamo il verbo, la forma di cortesia e la struttura, poi proviamo a cambiare la bevanda.",
    vocabulary: [
      { word: "vouloir", translation: "volere", ipa: "/vu.lwaʁ/", category: "verbo irregolare", note: "Verbo irregolare; voudrais è il condizionale presente di je." },
      { word: "un café", translation: "un caffè", ipa: "/œ̃ ka.fe/", category: "nome maschile", gender: "maschile", plural: "des cafés", example: "un café, s’il vous plaît", exampleTranslation: "un caffè, per favore" },
      { word: "s’il vous plaît", translation: "per favore", ipa: "/sil vu plɛ/", category: "formula di cortesia", note: "Vous è la forma di cortesia e il plurale di tu." },
    ],
    phrases: [
      {
        text: "Je voudrais un café, s’il vous plaît.",
        meaning: "Vorrei un caffè, per favore.",
        ipa: "/ʒə vu.dʁɛ œ̃ ka.fe sil vu plɛ/",
        parts: [
          { french: "je", italian: "io", note: "Pronome soggetto." },
          { french: "voudrais", italian: "vorrei", note: "Condizionale presente di vouloir (volere), usato per una richiesta cortese." },
          { french: "un café", italian: "un caffè", note: "Articolo indeterminativo maschile + nome." },
          { french: "s’il vous plaît", italian: "per favore", note: "Formula di cortesia adatta a un contesto formale." },
        ],
        grammar: "Je voudrais + nome è una struttura cortese per chiedere qualcosa. Voudrais è la forma di je al condizionale presente di vouloir. Puoi imparare questa formula come unità, collegandola però al verbo e alle sue parti.",
        alternatives: ["Je voudrais un thé, s’il vous plaît. — Vorrei un tè, per favore.", "Je voudrais de l’eau, s’il vous plaît. — Vorrei dell’acqua, per favore."],
        context: "Al bar o al ristorante puoi sostituire un café con un thé (un tè) o de l’eau (dell’acqua).",
      },
    ],
    exercise: {
      prompt: "Quale verbo significa «volere»?",
      choices: ["aller", "avoir", "vouloir"],
      answer: 2,
      explanation: "Vouloir significa volere. Nella frase, voudrais è la sua forma al condizionale presente per je.",
      example: "Je voudrais un thé. — Vorrei un tè.",
    },
  },
};

export const phraseStudies = [lessons.bar.phrases[0]];
