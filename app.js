import { curriculum, lessons, phraseStudies } from "./curriculum.js";

const STORAGE_KEY = "bonjour-academy-progress-v1";
const PAGE_TITLES = {
  dashboard: "Panoramica",
  course: "Il percorso",
  review: "Ripasso",
  vocabulary: "Vocabolario",
  practice: "Allenamento libero",
};

const emptyProgress = {
  completedLessons: [],
  visitedLessons: [],
  words: {},
  reviewItems: {},
  answers: 0,
  correctAnswers: 0,
  studyMinutes: 0,
};

function readProgress() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored && typeof stored === "object") return { ...emptyProgress, ...stored };
  } catch {
    // A corrupted or unavailable local save should not prevent studying.
  }
  return { ...emptyProgress };
}

const progress = readProgress();
const app = document.querySelector("#app");
const announcements = document.querySelector("#announcements");
let lessonStartedAt = Date.now();

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    announce("Impossibile salvare i progressi su questo dispositivo.");
  }
}

function announce(message) {
  announcements.textContent = message;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function getAllWords() {
  const entries = new Map();
  const seenLessons = new Set([...(progress.visitedLessons || []), ...progress.completedLessons]);
  Object.values(lessons).filter((lesson) => seenLessons.has(lesson.id)).forEach((lesson) => {
    lesson.vocabulary.forEach((word) => entries.set(word.word, word));
  });
  return [...entries.values()];
}

function dueReviewItems() {
  const now = Date.now();
  return Object.values(progress.reviewItems).filter((item) => item.dueAt <= now);
}

function getNextLesson() {
  const currentLevel = curriculum.find((level) => level.level === "A0") || curriculum[0];
  return currentLevel.lessons.find((lesson) => lessons[lesson.id] && !progress.completedLessons.includes(lesson.id))
    || currentLevel.lessons.find((lesson) => lessons[lesson.id]);
}

function updateNavigation(view, lessonId) {
  document.querySelectorAll(".nav-link[data-view]").forEach((link) => {
    const active = link.dataset.view === view;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.querySelector("#page-name").textContent = view === "lesson" ? lessons[lessonId]?.title || "Lezione" : PAGE_TITLES[view];
  document.querySelector("#review-count").textContent = dueReviewItems().length;
}

function routeFromHash() {
  const route = window.location.hash.slice(1);
  if (route.startsWith("lezione/")) return { view: "lesson", lessonId: route.split("/")[1] };
  const routeToView = {
    dashboard: "dashboard",
    percorso: "course",
    ripasso: "review",
    vocabolario: "vocabulary",
    allenamento: "practice",
  };
  return { view: routeToView[route] || "dashboard" };
}

function navigate(view, lessonId) {
  const hash = lessonId ? `#lezione/${lessonId}` : `#${view === "course" ? "percorso" : view === "review" ? "ripasso" : view === "vocabulary" ? "vocabolario" : view === "practice" ? "allenamento" : "dashboard"}`;
  if (window.location.hash === hash) render();
  else window.location.hash = hash;
}

function renderDashboard() {
  const totalLessons = curriculum.reduce((sum, level) => sum + level.lessons.length, 0);
  const completed = progress.completedLessons.length;
  const percent = Math.round((completed / totalLessons) * 100);
  const knownWords = Object.values(progress.words).filter((status) => status === "known").length;
  const dueItems = dueReviewItems().length;
  const accuracy = progress.answers ? Math.round((progress.correctAnswers / progress.answers) * 100) : 0;
  const lastLesson = lessons[progress.completedLessons.at(-1)];
  const nextLesson = getNextLesson() || lessons[progress.completedLessons.at(-1)] || lessons.saluti;
  const nextLessonContent = lessons[nextLesson.id] || nextLesson;
  const nextLessonLevel = curriculum.find((level) => level.lessons.some((lesson) => lesson.id === nextLesson.id))?.level || nextLesson.level;
  const today = new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

  app.innerHTML = `
    <section class="page dashboard-page" aria-labelledby="welcome-title">
      <div class="welcome-row">
        <div>
          <p class="eyebrow">${escapeHtml(today.toLocaleUpperCase("it-IT"))}</p>
          <h1 id="welcome-title">Bonjour <span aria-hidden="true">☀</span></h1>
          <p class="page-intro">Ogni nuova frase è un passo verso una conversazione vera.</p>
        </div>
        <button class="button button-primary" data-action="start-lesson" type="button">
          Continua il percorso <span aria-hidden="true">→</span>
        </button>
      </div>

      <section class="hero-card" aria-label="Il tuo percorso">
        <div class="hero-copy">
          <span class="hero-tag"><span aria-hidden="true">✦</span> IL TUO PERCORSO · A0</span>
          <h2>Le prime parole,<br />le tue prime <em>conversazioni.</em></h2>
          <p>${lastLesson ? `Hai completato ${escapeHtml(lastLesson.title)}. Ora prosegui con ${escapeHtml(nextLesson.title)}.` : "Partiamo dalle basi, con calma. In pochi minuti saprai salutare e presentarti in francese."}</p>
          <button class="button button-light" data-action="start-lesson" type="button">
          ${progress.completedLessons.length ? `Continua con ${escapeHtml(nextLesson.title)}` : "Inizia la prima lezione"} <span aria-hidden="true">→</span>
          </button>
        </div>
        <div class="hero-art" aria-hidden="true">
          <div class="art-sun"></div><div class="art-arch"></div>
          <span class="art-word">bonjour</span>
          <span class="art-note art-note-one">ça va ?</span>
          <span class="art-note art-note-two">✳</span>
        </div>
      </section>

      <section class="stats-grid" aria-label="I tuoi progressi">
        <article class="stat-card">
          <span class="stat-icon mint" aria-hidden="true">↗</span>
          <p>Progresso del percorso</p>
          <strong>${percent}<small>%</small></strong>
          <div class="mini-progress"><span style="width:${percent}%"></span></div>
          <span class="stat-caption">${completed} di ${totalLessons} lezioni completate</span>
        </article>
        <article class="stat-card">
          <span class="stat-icon lavender" aria-hidden="true">▤</span>
          <p>Parole conosciute</p>
          <strong>${knownWords}<small> parole</small></strong>
          <span class="stat-caption">Il tuo vocabolario personale</span>
        </article>
        <article class="stat-card">
          <span class="stat-icon peach" aria-hidden="true">◷</span>
          <p>Tempo di studio</p>
          <strong>${progress.studyMinutes}<small> min</small></strong>
          <span class="stat-caption">Ogni minuto conta</span>
        </article>
        <article class="stat-card">
          <span class="stat-icon butter" aria-hidden="true">✓</span>
          <p>Risposte corrette</p>
          <strong>${accuracy}<small>%</small></strong>
          <span class="stat-caption">${progress.correctAnswers} di ${progress.answers} risposte corrette</span>
        </article>
      </section>

      <div class="dashboard-columns">
        <section class="panel next-lesson">
          <div class="section-heading">
            <div><p class="eyebrow">IL PROSSIMO PASSO</p><h2>Una lezione per te</h2></div>
            <a href="#percorso" class="text-link">Vedi il percorso <span aria-hidden="true">→</span></a>
          </div>
          <button class="lesson-preview" data-action="open-lesson" data-lesson="${nextLesson.id}" type="button">
            <span class="lesson-play" aria-hidden="true">▶</span>
            <span class="lesson-preview-copy"><span class="lesson-meta">${nextLessonLevel} · ${escapeHtml((nextLesson.duration || nextLessonContent.duration).toUpperCase())}</span><strong>${escapeHtml(nextLesson.title)}</strong><span>${escapeHtml(nextLessonContent.subtitle || nextLesson.detail || "Riprendi una lezione già completata")}</span></span>
            <span class="preview-arrow" aria-hidden="true">↗</span>
          </button>
          <div class="last-lesson"><span class="check-circle" aria-hidden="true">✓</span><span><strong>${lastLesson ? `Ultima lezione · ${escapeHtml(lastLesson.level)}` : "Si parte da qui"}</strong><small>${lastLesson ? escapeHtml(lastLesson.title) : "Ancora nessuna lezione completata"}</small></span></div>
        </section>
        <section class="review-card">
          <div class="review-icon" aria-hidden="true">↻</div>
          <p class="eyebrow">UN PICCOLO RIPASSO</p>
          <h2>${dueItems ? `${dueItems} ${dueItems === 1 ? "concetto" : "concetti"} da rivedere` : "Fissa ciò che impari"}</h2>
          <p>${dueItems ? "Riprendi gli argomenti che hai incontrato e consolida i tuoi progressi." : "Gli argomenti da ripassare compariranno qui in base alle tue risposte."}</p>
          <a class="button button-outline" href="#ripasso">Vai al ripasso <span aria-hidden="true">→</span></a>
        </section>
      </div>

      <section class="path-strip">
        <div><p class="eyebrow">IL CAMMINO DAVANTI A TE</p><h2>Un percorso, tante piccole conquiste</h2></div>
        <div class="path-levels">${curriculum.map((level, index) => `
          <div class="path-level ${index === 0 ? "current" : ""}">
            <span class="path-node">${index === 0 ? "✦" : level.level}</span>
            <span><strong>${level.level}</strong><small>${escapeHtml(level.name)}</small></span>
          </div>`).join("")}
        </div>
      </section>
    </section>`;
}

function renderCourse() {
  app.innerHTML = `
    <section class="page" aria-labelledby="course-title">
      <div class="page-heading"><p class="eyebrow">DALLE BASI ALLA CONVERSAZIONE</p><h1 id="course-title">Il tuo percorso</h1><p class="page-intro">Un passo dopo l’altro. Ogni livello costruisce sulle conoscenze precedenti.</p></div>
      <div class="course-levels">${curriculum.map((level, index) => {
        const done = level.lessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;
        const progressPercent = Math.round((done / level.lessons.length) * 100);
        return `<section class="course-level panel ${index === 0 ? "level-current" : ""}">
          <div class="course-level-header">
            <div class="course-badge ${index === 0 ? "badge-active" : ""}">${level.level}</div>
            <div class="course-level-copy"><span class="eyebrow">${index === 0 ? "IL TUO LIVELLO" : `LIVELLO ${index + 1}`}</span><h2>${escapeHtml(level.name)}</h2><p>${escapeHtml(level.description)}</p></div>
            <div class="course-completion"><strong>${progressPercent}%</strong><span>${done}/${level.lessons.length} lezioni</span></div>
          </div>
          <div class="course-lesson-list">${level.lessons.map((lesson, lessonIndex) => {
            const isDone = progress.completedLessons.includes(lesson.id);
            const isLocked = index > 0 || !lessons[lesson.id];
            const previousAvailableLessons = level.lessons.slice(0, lessonIndex).filter((previousLesson) => lessons[previousLesson.id]);
            const isSequentiallyLocked = previousAvailableLessons.some((previousLesson) => !progress.completedLessons.includes(previousLesson.id));
            const canOpen = !isLocked && !isSequentiallyLocked;
            return `<button type="button" class="course-lesson ${isDone ? "is-done" : ""} ${!canOpen ? "is-locked" : ""}" ${!canOpen ? "disabled aria-disabled=\"true\"" : `data-action=\"open-lesson\" data-lesson=\"${lesson.id}\"`}>
              <span class="course-lesson-state" aria-hidden="true">${isDone ? "✓" : isLocked ? "·" : String(lessonIndex + 1).padStart(2, "0")}</span>
              <span class="course-lesson-text"><strong>${escapeHtml(lesson.title)}</strong><small>${escapeHtml(lesson.detail)}</small></span>
              <span class="course-lesson-time">${lessons[lesson.id] ? lesson.duration : "In preparazione"}</span><span class="course-lesson-arrow" aria-hidden="true">${canOpen ? "→" : "⌑"}</span>
            </button>`;
          }).join("")}</div>
        </section>`;
      }).join("")}
      <p class="course-note"><span aria-hidden="true">✦</span> Il completamento di una lezione non significa padroneggiare già l’argomento: per questo il percorso include ripassi e pratica.</p>
      </div>
    </section>`;
}

function phraseMarkup(phrase) {
  return `<article class="phrase-card">
    <div class="phrase-main">
      <div><p class="eyebrow">UNA FRASE, MOLTE SCOPERTE</p><h3 lang="fr">${escapeHtml(phrase.text)}</h3><p class="phrase-translation">${escapeHtml(phrase.meaning)}</p></div>
      <div class="audio-control"><span lang="fr">${escapeHtml(phrase.ipa)}</span><button type="button" class="audio-unavailable" disabled aria-label="Audio madrelingua non ancora disponibile">♫ <span>Audio in arrivo</span></button></div>
    </div>
    <div class="phrase-breakdown">${phrase.parts.map((part) => `<div class="phrase-part"><strong lang="fr">${escapeHtml(part.french)}</strong><span>${escapeHtml(part.italian)}</span><small>${escapeHtml(part.note)}</small></div>`).join("")}</div>
    <div class="phrase-notes"><div><strong>Grammatica in contesto</strong><p>${escapeHtml(phrase.grammar)}</p></div><div><strong>Prova a riutilizzarla</strong><ul>${phrase.alternatives.map((alternative) => `<li>${escapeHtml(alternative)}</li>`).join("")}</ul></div></div>
    <p class="context-note"><span aria-hidden="true">↳</span> ${escapeHtml(phrase.context)}</p>
  </article>`;
}

function renderLesson(lessonId, mode = "lesson") {
  const lesson = lessons[lessonId];
  if (!lesson) {
    navigate("course");
    return;
  }
  const backLabel = mode === "review" ? "Torna al ripasso" : mode === "practice" ? "Torna all’allenamento" : mode === "dashboard" ? "Torna alla panoramica" : "Torna al percorso";
  app.innerHTML = `
    <section class="page lesson-page" aria-labelledby="lesson-title">
      <button class="back-link" type="button" data-action="back" data-back="${mode}"><span aria-hidden="true">←</span> ${backLabel}</button>
      <div class="lesson-layout">
        <article class="lesson-content">
          <div class="lesson-header">
            <div class="lesson-meta">${lesson.level} <span aria-hidden="true">·</span> ${lesson.duration}</div>
            <h1 id="lesson-title">${escapeHtml(lesson.title)}</h1><p class="page-intro">${escapeHtml(lesson.subtitle)}</p>
            <div class="objective"><span aria-hidden="true">◎</span><div><strong>Alla fine saprai…</strong><p>${escapeHtml(lesson.objective)}</p></div></div>
          </div>
          <section class="lesson-section"><span class="lesson-step">01</span><div><h2>Partiamo dal significato</h2><p>${escapeHtml(lesson.explanation)}</p></div></section>
          <section class="lesson-section"><span class="lesson-step">02</span><div><h2>Parole e concetti nuovi</h2><p class="section-intro">Non solo traduzioni: scopri come funziona ogni parola.</p>
            <div class="vocab-lesson-list">${lesson.vocabulary.map((word) => {
              const status = progress.words[word.word] || "learning";
              return `<article class="vocab-lesson-item">
                <div class="vocab-word-title"><strong lang="fr">${escapeHtml(word.word)}</strong><span>${escapeHtml(word.category)}${word.gender ? ` · ${escapeHtml(word.gender)}` : ""}</span></div>
                <div class="vocab-word-definition"><span>${escapeHtml(word.translation)}</span><span lang="fr" class="ipa">${escapeHtml(word.ipa)}</span>${word.plural ? `<small>Plurale: <span lang="fr">${escapeHtml(word.plural)}</span></small>` : ""}${word.example ? `<small><span lang="fr">${escapeHtml(word.example)}</span> — ${escapeHtml(word.exampleTranslation)}</small>` : ""}${word.note ? `<small>${escapeHtml(word.note)}</small>` : ""}</div>
                <div class="word-status-actions" role="group" aria-label="Stato di ${escapeHtml(word.word)}">
                  ${[["learning", "Da imparare"], ["known", "La conosco"], ["difficult", "Difficile"]].map(([value, label]) => `<button type="button" data-action="word-status" data-word="${escapeHtml(word.word)}" data-status="${value}" class="${status === value ? "selected" : ""}" aria-pressed="${status === value}">${label}</button>`).join("")}
                </div>
              </article>`;
            }).join("")}</div>
          </div></section>
          <section class="lesson-section"><span class="lesson-step">03</span><div><h2>Frasi che puoi costruire</h2><p class="section-intro">Osserva il significato, scomponi la frase e riusa la stessa struttura.</p>${lesson.phrases.map(phraseMarkup).join("")}</div></section>
          <section class="lesson-section"><span class="lesson-step">04</span><div><h2>Ascolta e ripeti</h2><div class="audio-notice"><span aria-hidden="true">♫</span><p><strong>Pronuncia audio non ancora disponibile</strong><br />Le trascrizioni IPA sono mostrate come riferimento; aggiungeremo registrazioni madrelingua verificate, senza voci sintetiche.</p></div></div></section>
          <section class="lesson-section"><span class="lesson-step">05</span><div><h2>Ora tocca a te</h2><p class="section-intro">Scegli la risposta migliore. Se sbagli, vedrai anche il perché.</p>${exerciseMarkup(lesson, mode)}</div></section>
        </article>
        <aside class="lesson-aside" aria-label="Riepilogo lezione">
          <div class="lesson-aside-card"><span class="aside-icon" aria-hidden="true">✦</span><p class="eyebrow">IL TUO OBIETTIVO</p><strong>Imparare facendo</strong><p>Una lezione breve, parole in contesto e un esercizio per mettere alla prova ciò che hai appena scoperto.</p><div class="aside-duration">◷ <span>${lesson.duration}</span></div></div>
          <div class="lesson-aside-card aside-tip"><p class="eyebrow">UN CONSIGLIO</p><p>Prova a dire la frase ad alta voce. Capire come si costruisce ti aiuterà a crearne di nuove.</p></div>
        </aside>
      </div>
    </section>`;
}

function exerciseMarkup(lesson, mode = "lesson") {
  const review = mode === "review";
  return `<form class="exercise-card" data-exercise="${lesson.id}" data-mode="${review ? "review" : "lesson"}">
    <div class="exercise-number">${review ? "RIPASSO" : "VERIFICA FINALE"}</div><h3>${escapeHtml(lesson.exercise.prompt)}</h3>
    <fieldset><legend class="sr-only">${escapeHtml(lesson.exercise.prompt)}</legend>
      ${lesson.exercise.choices.map((choice, index) => `<label class="choice-option"><input type="radio" name="answer" value="${index}" /><span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(choice)}</span></label>`).join("")}
    </fieldset>
    <div class="exercise-feedback" id="exercise-feedback" role="status" aria-live="polite"></div>
    <button class="button button-primary exercise-submit" type="submit">Controlla la risposta <span aria-hidden="true">→</span></button>
  </form>`;
}

function renderReview() {
  const items = Object.values(progress.reviewItems);
  const due = dueReviewItems();
  const deferred = items.length - due.length;
  app.innerHTML = `
    <section class="page" aria-labelledby="review-title">
      <div class="page-heading"><p class="eyebrow">RIPETIZIONE INTELLIGENTE</p><h1 id="review-title">Ripassa per ricordare</h1><p class="page-intro">Gli argomenti su cui hai avuto qualche incertezza tornano al momento giusto.</p></div>
      ${due.length ? `<div class="review-overview panel"><span class="review-icon" aria-hidden="true">↻</span><div><strong>${due.length} ${due.length === 1 ? "concetto pronto" : "concetti pronti"} per il ripasso</strong><p>Il ripasso non cancella l’errore: ti aiuta a capire e a consolidare.</p></div><button type="button" class="button button-primary" data-action="review-start">Inizia il ripasso <span aria-hidden="true">→</span></button></div>` : `<div class="empty-state panel"><span class="empty-icon" aria-hidden="true">✿</span><h2>Nessun ripasso urgente</h2><p>Quando una risposta sarà incerta, terremo da parte l’argomento e te lo riproporremo qui.</p><button class="button button-outline" data-action="start-lesson" type="button">Fai una lezione <span aria-hidden="true">→</span></button></div>`}
      <section class="review-history panel"><div class="section-heading"><div><p class="eyebrow">IL TUO RIPASSO</p><h2>Argomenti da consolidare</h2></div><span class="review-total">${items.length} in totale</span></div>
      ${items.length ? `<div class="review-item-list">${items.map((item) => `<div class="review-item"><span class="review-item-icon" aria-hidden="true">↻</span><div><strong>${escapeHtml(lessons[item.lessonId]?.title || "Lezione")}</strong><small>${item.attempts} ${item.attempts === 1 ? "risposta da ripassare" : "risposte da ripassare"} · ${item.dueAt <= Date.now() ? "Pronto ora" : `Prossimo ripasso: ${new Date(item.dueAt).toLocaleDateString("it-IT")}`}</small></div><span class="review-status">${item.dueAt <= Date.now() ? "Da rivedere" : "In programma"}</span></div>`).join("")}</div>` : `<p class="review-history-note">Nessun argomento registrato per ora. La tua prima lezione è un buon inizio.</p>`}
      ${deferred ? `<p class="review-deferred">${deferred} ${deferred === 1 ? "concetto tornerà" : "concetti torneranno"} tra qualche giorno in base ai tuoi progressi.</p>` : ""}
      </section>
    </section>`;
}

function renderVocabulary() {
  const words = getAllWords();
  const known = words.filter((word) => progress.words[word.word] === "known").length;
  const availablePhrases = progress.visitedLessons.includes("bar") || progress.completedLessons.includes("bar") ? phraseStudies : [];
  app.innerHTML = `
    <section class="page" aria-labelledby="vocabulary-title">
      <div class="page-heading"><p class="eyebrow">LE PAROLE CHE HAI INCONTRATO</p><h1 id="vocabulary-title">Il tuo vocabolario</h1><p class="page-intro">Le parole delle lezioni si raccolgono qui. Segna quelle che già conosci e quelle su cui vuoi tornare.</p></div>
      <div class="vocabulary-summary panel"><span class="vocabulary-summary-icon" aria-hidden="true">▤</span><div><strong>${words.length} parole incontrate</strong><p>${known} ${known === 1 ? "segnata come conosciuta" : "segnate come conosciute"}</p></div><a href="#percorso" class="text-link">Scopri parole nel percorso <span aria-hidden="true">→</span></a></div>
      ${words.length ? `<div class="vocabulary-grid">${words.map((word) => {
        const status = progress.words[word.word] || "learning";
        const labels = { learning: "Da imparare", known: "La conosco", difficult: "Difficile" };
        return `<article class="vocabulary-card panel"><div class="vocab-card-heading"><div><h2 lang="fr">${escapeHtml(word.word)}</h2><span class="vocab-category">${escapeHtml(word.category)}${word.gender ? ` · ${escapeHtml(word.gender)}` : ""}</span></div><span class="vocab-status-tag status-${status}">${labels[status]}</span></div>
          <p class="vocab-translation">${escapeHtml(word.translation)}</p><p class="ipa" lang="fr">${escapeHtml(word.ipa)}</p>
          ${word.plural ? `<p class="vocab-detail">Plurale: <span lang="fr">${escapeHtml(word.plural)}</span></p>` : ""}
          ${word.example ? `<p class="vocab-example"><span lang="fr">${escapeHtml(word.example)}</span><br /><small>${escapeHtml(word.exampleTranslation)}</small></p>` : ""}
          ${word.note ? `<p class="vocab-detail">${escapeHtml(word.note)}</p>` : ""}
          <div class="word-status-actions" role="group" aria-label="Stato di ${escapeHtml(word.word)}">${[["learning", "Da imparare"], ["known", "La conosco"], ["difficult", "Difficile"]].map(([value, label]) => `<button type="button" data-action="word-status" data-word="${escapeHtml(word.word)}" data-status="${value}" class="${status === value ? "selected" : ""}" aria-pressed="${status === value}">${label}</button>`).join("")}</div>
        </article>`;
      }).join("")}</div>` : `<div class="empty-state panel"><span class="empty-icon" aria-hidden="true">▤</span><h2>Il tuo vocabolario inizia qui</h2><p>Le parole delle lezioni si aggiungeranno a questa raccolta man mano che le incontri.</p><button class="button button-outline" data-action="start-lesson" type="button">Inizia una lezione <span aria-hidden="true">→</span></button></div>`}
      ${availablePhrases.length ? `<section class="phrase-library"><div class="section-heading"><div><p class="eyebrow">OLTRE LE PAROLE</p><h2>Frasi da scomporre e riutilizzare</h2></div></div>${availablePhrases.map(phraseMarkup).join("")}</section>` : ""}
    </section>`;
}

function renderPractice() {
  app.innerHTML = `
    <section class="page" aria-labelledby="practice-title">
      <div class="page-heading"><p class="eyebrow">STUDIA COME PREFERISCI</p><h1 id="practice-title">Allenamento libero</h1><p class="page-intro">Scegli una modalità e riprendi da parole e strutture già incontrate.</p></div>
      <div class="practice-grid">
        <button class="practice-mode panel" type="button" data-action="practice-start" data-lesson="saluti"><span class="practice-icon mint" aria-hidden="true">⇄</span><span class="eyebrow">PAROLE E SIGNIFICATI</span><strong>Allenati con le parole</strong><span>Riconosci vocaboli e costruzioni che hai già incontrato.</span><span class="practice-cta">Inizia <span aria-hidden="true">→</span></span></button>
        <button class="practice-mode panel" type="button" data-action="practice-start" data-lesson="saluti"><span class="practice-icon lavender" aria-hidden="true">✎</span><span class="eyebrow">COSTRUISCI UNA FRASE</span><strong>Metti alla prova le basi</strong><span>Controlla come si uniscono parole e grammatica.</span><span class="practice-cta">Inizia <span aria-hidden="true">→</span></span></button>
        <article class="practice-mode panel mode-unavailable"><span class="practice-icon peach" aria-hidden="true">♫</span><span class="eyebrow">ASCOLTO MADRELINGUA</span><strong>Ascolta e riconosci</strong><span>Gli esercizi audio saranno disponibili con registrazioni verificate.</span><span class="coming-soon">In arrivo</span></article>
        <button class="practice-mode panel" type="button" data-action="practice-start" data-lesson="bar"><span class="practice-icon butter" aria-hidden="true">☕</span><span class="eyebrow">SITUAZIONI REALI</span><strong>Al bar, con cortesia</strong><span>Esplora vouloir e impara a ordinare in modo naturale.</span><span class="practice-cta">Inizia <span aria-hidden="true">→</span></span></button>
      </div>
    </section>`;
}

function render() {
  const { view, lessonId } = routeFromHash();
  updateNavigation(view, lessonId);
  if (view === "dashboard") renderDashboard();
  else if (view === "course") renderCourse();
  else if (view === "lesson") {
    lessonStartedAt = Date.now();
    if (lessons[lessonId] && !progress.visitedLessons.includes(lessonId)) {
      progress.visitedLessons.push(lessonId);
      saveProgress();
    }
    renderLesson(lessonId, sessionStorage.getItem("bonjour-return-view") || "lesson");
  }
  else if (view === "review") renderReview();
  else if (view === "vocabulary") renderVocabulary();
  else if (view === "practice") renderPractice();
}

function showLessonFromAction(lessonId, mode) {
  if (!lessonId || !lessons[lessonId]) return;
  sessionStorage.setItem("bonjour-return-view", mode);
  navigate("lesson", lessonId);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, lesson, word, status, back } = button.dataset;

  if (action === "start-lesson") showLessonFromAction(getNextLesson()?.id || progress.completedLessons.at(-1) || "saluti", "dashboard");
  if (action === "open-lesson") showLessonFromAction(lesson, "course");
  if (action === "practice-start") showLessonFromAction(lesson, "practice");
  if (action === "review-start") showLessonFromAction(dueReviewItems()[0]?.lessonId || "saluti", "review");
  if (action === "word-status" && word && ["learning", "known", "difficult"].includes(status)) {
    progress.words[word] = status;
    saveProgress();
    announce(`${word}: ${status === "known" ? "segnata come conosciuta" : status === "difficult" ? "segnata come difficile" : "da imparare"}.`);
    render();
  }
  if (action === "back") navigate(back === "review" ? "review" : back === "practice" ? "practice" : back === "dashboard" ? "dashboard" : "course");
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-exercise]");
  if (!form) return;
  event.preventDefault();
  const lesson = lessons[form.dataset.exercise];
  const selected = form.querySelector('input[name="answer"]:checked');
  const feedback = form.querySelector("#exercise-feedback");
  if (!selected) {
    feedback.innerHTML = `<span class="feedback-message feedback-hint">Scegli una risposta prima di continuare.</span>`;
    announce("Scegli una risposta prima di continuare.");
    return;
  }

  const isCorrect = Number(selected.value) === lesson.exercise.answer;
  progress.answers += 1;
  if (isCorrect) progress.correctAnswers += 1;
  progress.studyMinutes += Math.max(1, Math.ceil((Date.now() - lessonStartedAt) / 60000));

  const review = progress.reviewItems[lesson.id] || { lessonId: lesson.id, attempts: 0, correctStreak: 0, dueAt: 0 };
  if (isCorrect) {
    review.correctStreak += 1;
    review.dueAt = review.correctStreak === 1 ? Date.now() + 3 * 86400000 : Date.now() + 7 * 86400000;
    if (review.correctStreak >= 2) delete progress.reviewItems[lesson.id];
    else progress.reviewItems[lesson.id] = review;
    if (!progress.completedLessons.includes(lesson.id)) progress.completedLessons.push(lesson.id);
  } else {
    review.attempts += 1;
    review.correctStreak = 0;
    review.dueAt = Date.now() + 86400000;
    progress.reviewItems[lesson.id] = review;
  }
  saveProgress();

  form.querySelectorAll("input").forEach((input) => { input.disabled = true; });
  form.querySelectorAll(".choice-option").forEach((option, index) => {
    if (index === lesson.exercise.answer) option.classList.add("is-correct");
    else if (Number(selected.value) === index) option.classList.add("is-wrong");
  });
  feedback.innerHTML = `<div class="feedback-panel ${isCorrect ? "feedback-correct" : "feedback-incorrect"}">
    <strong>${isCorrect ? "Esatto, bien joué !" : "Quasi: vediamo insieme."}</strong>
    <p>${escapeHtml(lesson.exercise.explanation)}</p>
    ${!isCorrect ? `<p class="feedback-example">Un altro esempio: <span lang="fr">${escapeHtml(lesson.exercise.example)}</span></p><p class="review-added">✦ Aggiunto al ripasso di domani</p>` : `<p class="feedback-example">Per esempio: <span lang="fr">${escapeHtml(lesson.exercise.example)}</span></p>`}
  </div>`;
  form.querySelector(".exercise-submit").remove();
  if (isCorrect) {
    const returnView = sessionStorage.getItem("bonjour-return-view");
    const completionView = form.dataset.mode === "review" ? "review" : form.dataset.mode === "lesson" && returnView === "dashboard" ? "dashboard" : form.dataset.mode === "lesson" && returnView === "practice" ? "practice" : "course";
    feedback.insertAdjacentHTML("beforeend", `<button type="button" class="button button-outline lesson-finished" data-action="back" data-back="${completionView}">Lezione completata <span aria-hidden="true">✓</span></button>`);
  } else {
    feedback.insertAdjacentHTML("beforeend", `<button type="button" class="button button-outline lesson-finished" data-action="try-again">Riprova l’esercizio <span aria-hidden="true">↻</span></button>`);
  }
  announce(isCorrect ? "Risposta corretta. Lezione completata." : "Risposta non corretta. La spiegazione è stata aggiunta al ripasso.");
  document.querySelector("#review-count").textContent = dueReviewItems().length;
});

document.addEventListener("click", (event) => {
  const retryButton = event.target.closest('[data-action="try-again"]');
  if (retryButton) {
    const lessonId = routeFromHash().lessonId;
    if (lessonId) renderLesson(lessonId);
  }
});

window.addEventListener("hashchange", render);

const themeToggle = document.querySelector("#theme-toggle");
const savedTheme = localStorage.getItem("bonjour-theme");
if (savedTheme === "dark") document.documentElement.dataset.theme = "dark";
function syncThemeToggle() {
  const isDark = document.documentElement.dataset.theme === "dark";
  document.querySelector("#theme-icon").textContent = isDark ? "☀" : "☾";
  document.querySelector("#theme-label").textContent = isDark ? "Tema chiaro" : "Tema scuro";
  document.querySelector('meta[name="theme-color"]').content = isDark ? "#171b19" : "#f7f8f6";
}
themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("bonjour-theme", nextTheme);
  syncThemeToggle();
});

syncThemeToggle();
render();
