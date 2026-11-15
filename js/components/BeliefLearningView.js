// Croyance — lecteur vidéo et notes, inspiré de l'ancien parcours Oussoul al-Fiqh.
// Les métadonnées et le contenu de la vidéo ne sont pas présumés vérifiés.
const BeliefLearningView = {
  props: ['course', 'closeStudy'],
  data() {
    return {
      activeId: null, query: '', done: [], notes: {}, lastId: null,
      videoOpen: false, floating: false, mobileOutline: false
    };
  },
  computed: {
    lessons() { return Array.isArray(this.course?.lessons) ? this.course.lessons : []; },
    filteredLessons() {
      const term=this.query.trim().toLocaleLowerCase('fr');
      return this.lessons.filter(x=>!term||[x.title,x.subtitle,x.number].join(' ').toLocaleLowerCase('fr').includes(term));
    },
    activeLesson() { return this.lessons.find(x=>x.id===this.activeId)||null; },
    currentIndex() { return this.lessons.findIndex(x=>x.id===this.activeId); },
    previousLesson() { return this.lessons[this.currentIndex-1]||null; },
    nextLesson() { return this.lessons[this.currentIndex+1]||null; },
    doneCount() { return this.lessons.filter(x=>this.done.includes(x.id)).length; },
    percent() { return this.lessons.length?Math.round(this.doneCount*100/this.lessons.length):0; },
    isDone() { return !!this.activeLesson&&this.done.includes(this.activeLesson.id); },
    videoId() {
      const id=String(this.activeLesson?.videoId||'');
      return /^[A-Za-z0-9_-]{11}$/.test(id)?id:'';
    },
    embedUrl() {
      return this.videoId?'https://www.youtube-nocookie.com/embed/'+this.videoId+'?rel=0&playsinline=1':'';
    }
  },
  mounted() {
    try {
      const saved=JSON.parse(localStorage.getItem('athar_belief_learning_v1')||'{}');
      const ids=new Set(this.lessons.map(x=>x.id));
      this.done=Array.isArray(saved.done)?saved.done.filter(x=>ids.has(x)):[];
      this.lastId=ids.has(saved.lastId)?saved.lastId:null;
      this.notes=saved.notes&&typeof saved.notes==='object'&&!Array.isArray(saved.notes)
        ?Object.fromEntries(Object.entries(saved.notes).filter(([k,v])=>ids.has(k)&&typeof v==='string')):{};
    } catch(_) {}
    window.addEventListener('keydown',this.onKey);
    this.icons();
  },
  beforeUnmount() { window.removeEventListener('keydown',this.onKey); },
  methods: {
    icons() { this.$nextTick(()=>window.lucide?.createIcons()); },
    persist() {
      try { localStorage.setItem('athar_belief_learning_v1',JSON.stringify({
        done:this.done,notes:this.notes,lastId:this.lastId
      })); } catch(_) {}
    },
    stopVideo() { this.videoOpen=false;this.floating=false; },
    choose(lesson) {
      if(!lesson||!this.lessons.some(x=>x.id===lesson.id))return;
      this.stopVideo();this.activeId=lesson.id;this.lastId=lesson.id;
      this.mobileOutline=false;this.persist();this.icons();
    },
    resume() { this.choose(this.lessons.find(x=>x.id===this.lastId)||this.lessons[0]); },
    goIndex() { this.stopVideo();this.activeId=null;this.mobileOutline=false;this.icons(); },
    leave() { this.stopVideo();this.closeStudy(); },
    toggleDone() {
      if(!this.activeLesson)return;
      const id=this.activeLesson.id;
      this.done=this.done.includes(id)?this.done.filter(x=>x!==id):[...this.done,id];
      this.persist();
    },
    saveNote(event) {
      if(!this.activeLesson)return;
      this.notes={...this.notes,[this.activeLesson.id]:event.target.value};
      this.persist();
    },
    play() { if(this.videoId)this.videoOpen=true; },
    toggleFloating() { if(this.videoOpen)this.floating=!this.floating; },
    onKey(event) {
      if(event.key==='Escape'){
        if(this.floating)this.floating=false;
        else if(this.mobileOutline)this.mobileOutline=false;
      }
    }
  },
  template: `
  <section class="belief-study" aria-label="Apprentissage de la croyance">
    <header class="belief-topbar">
      <button class="belief-back" type="button" @click="leave"><i data-lucide="arrow-left" aria-hidden="true"></i> Retour à l’accueil</button>
      <span>ATHAR <span aria-hidden="true">/</span> CROYANCE</span>
    </header>

    <div v-if="!activeLesson" class="belief-index">
      <div class="belief-hero">
        <div class="belief-hero-main">
          <span class="belief-kicker">Cours &amp; formation</span>
          <p class="belief-book-arabic" lang="ar" dir="rtl">{{ course.arabicTitle }}</p>
          <h1>{{ course.title }}</h1>
          <h2>{{ course.title }}</h2>
          <p>{{ course.subtitle }}</p>
          <button type="button" class="belief-primary" @click="resume">
            <i :data-lucide="lastId?'book-open-check':'play'" aria-hidden="true"></i>
            {{ lastId?'Reprendre le parcours':'Commencer le parcours' }}
          </button>
        </div>
        <aside class="belief-progress" aria-label="Progression du parcours">
          <span>Ma progression</span>
          <strong>{{ percent }}<small>%</small></strong>
          <div class="belief-track" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100" aria-label="Progression"><span :style="{width:percent+'%'}"></span></div>
          <p>{{ doneCount }} / {{ lessons.length }} leçon{{ lessons.length>1?'s':'' }} terminée{{ doneCount>1?'s':'' }}</p>
          <small>Progression sauvegardée sur cet appareil</small>
        </aside>
      </div>
      <div class="belief-program-head">
        <div><span class="belief-kicker">Parcours</span><h2>Les cours</h2></div>
        <label><i data-lucide="search" aria-hidden="true"></i><input v-model="query" type="search" aria-label="Rechercher une leçon" placeholder="Rechercher une leçon"></label>
      </div>
      <div class="belief-lesson-list">
        <article v-for="lesson in filteredLessons" :key="lesson.id" class="belief-lesson-card">
          <span class="belief-num">{{ String(lesson.number).padStart(2,'0') }}</span>
          <div><small>{{ done.includes(lesson.id)?'Leçon terminée':'Cours vidéo' }}</small>
            <h3>{{ lesson.title }}</h3><p>{{ lesson.subtitle }}</p>
          </div>
          <button type="button" @click="choose(lesson)" :aria-label="'Ouvrir '+lesson.title">
            {{ done.includes(lesson.id)?'Revoir':'Étudier' }} <i data-lucide="arrow-right" aria-hidden="true"></i>
          </button>
        </article>
        <p v-if="!filteredLessons.length">Aucune leçon ne correspond à cette recherche.</p>
      </div>
      <p class="belief-caution"><i data-lucide="info" aria-hidden="true"></i> {{ course.editorialNote }}</p>
    </div>

    <div v-else class="belief-reader">
      <div class="belief-reader-nav">
        <button type="button" @click="goIndex"><i data-lucide="arrow-left" aria-hidden="true"></i> Toutes les leçons</button>
        <button type="button" class="belief-outline-toggle" @click="mobileOutline=!mobileOutline" :aria-expanded="mobileOutline"><i data-lucide="list" aria-hidden="true"></i> Sommaire</button>
      </div>
      <div class="belief-reader-grid">
        <aside class="belief-sidebar" :class="{'is-open':mobileOutline}" aria-label="Sommaire du parcours">
          <span class="belief-kicker">Le programme</span>
          <h2>{{ course.title }}</h2>
          <p>{{ doneCount }} / {{ lessons.length }} leçons terminées</p>
          <div class="belief-track" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100" aria-label="Progression"><span :style="{width:percent+'%'}"></span></div>
          <nav aria-label="Choisir une leçon">
            <button v-for="lesson in lessons" :key="lesson.id" type="button" :class="{'is-current':lesson.id===activeId}" :aria-current="lesson.id===activeId?'step':null" @click="choose(lesson)">
              <span>{{ String(lesson.number).padStart(2,'0') }}</span><span>{{ lesson.title }}</span>
              <i v-if="done.includes(lesson.id)" data-lucide="check" aria-label="Terminée"></i>
            </button>
          </nav>
        </aside>
        <main class="belief-reading">
          <header class="belief-lesson-header">
            <span class="belief-kicker">Leçon {{ String(activeLesson.number).padStart(2,'0') }}</span>
            <h2>{{ activeLesson.title }}</h2><p>{{ activeLesson.subtitle }}</p>
          </header>
          <section aria-label="Cours en vidéo">
            <div class="belief-section-head">
              <h3>L’enregistrement de la leçon</h3>
              <a :href="activeLesson.videoUrl" target="_blank" rel="noopener noreferrer">Sur YouTube <i data-lucide="external-link" aria-hidden="true"></i></a>
            </div>
            <div class="belief-video" :class="{'is-floating':floating}">
              <div v-if="floating" class="belief-video-floatbar">
                <span>Lecture vidéo</span><button type="button" @click="toggleFloating" aria-label="Agrandir la vidéo"><i data-lucide="maximize-2"></i></button>
              </div>
              <div v-if="!videoOpen" class="belief-video-preview">
                <small>LEÇON {{ String(activeLesson.number).padStart(2,'0') }}</small>
                <button type="button" @click="play" aria-label="Charger la vidéo YouTube"><i data-lucide="play" aria-hidden="true"></i></button>
                <p>Charger la vidéo</p>
              </div>
              <iframe v-else :src="embedUrl" :title="'Vidéo de la leçon '+activeLesson.number" loading="lazy"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
            <div class="belief-video-actions" v-if="videoOpen">
              <button type="button" @click="toggleFloating"><i :data-lucide="floating?'maximize-2':'picture-in-picture-2'" aria-hidden="true"></i>{{ floating?'Grand format':'Fenêtre flottante' }}</button>
              <button type="button" @click="stopVideo"><i data-lucide="square" aria-hidden="true"></i>Arrêter</button>
            </div>
            <p class="belief-caption">Lecteur externe chargé uniquement sur clic. Si l’intégration échoue, ouvrir la vidéo sur YouTube.</p>
          </section>
          <section class="belief-transcript" aria-label="Cours écrit">
            <div class="belief-section-head"><h3>Le cours écrit</h3><small>Transcription fidèle</small></div>
            <template v-if="activeLesson.sections && activeLesson.sections.length">
              <article v-for="(section,index) in activeLesson.sections" :key="index" class="belief-written-section">
                <span>Partie {{ index+1 }}</span>
                <h4>{{ section.heading }}</h4>
                <p v-for="(paragraph,i) in section.paragraphs" :key="i">{{ paragraph }}</p>
              </article>
            </template>
            <div v-else class="belief-transcript-empty">
              <i data-lucide="book-text" aria-hidden="true"></i>
              <div><strong>Transcription non encore vérifiée</strong>
                <p>Aucun propos de l’enregistrement n’est reconstitué ou attribué sans transcription fiable. Le contenu écrit et ses références seront ajoutés après vérification.</p>
              </div>
            </div>
          </section>
          <section class="belief-glossary" aria-label="Lexique">
            <div class="belief-section-head"><h3>Lexique pour commencer</h3><small>{{ course.glossary?.length || 0 }} notions</small></div>
            <p class="belief-caption">{{ course.glossaryNotice }}</p>
            <dl class="belief-glossary-grid">
              <div v-for="entry in course.glossary" :key="entry.id">
                <dt><span lang="ar" dir="rtl">{{ entry.arabic }}</span><strong>{{ entry.term }}</strong></dt>
                <dd>{{ entry.definition }}</dd>
              </div>
            </dl>
          </section>
          <section class="belief-notes" aria-label="Notes personnelles">
            <div class="belief-section-head"><h3>Mes notes de cours</h3><small>Enregistrées localement</small></div>
            <textarea :value="notes[activeLesson.id]||''" @input="saveNote" rows="6"
              aria-label="Notes de cette leçon" placeholder="Notions, références, questions à approfondir…"></textarea>
            <p class="belief-caption">Les notes restent sur cet appareil.</p>
          </section>
          <section class="belief-method">
            <h3>Étudier avec méthode</h3>
            <ul><li>Identifier les notions réellement abordées dans l’enregistrement.</li>
              <li>Relever les sources mentionnées par l’enseignant.</li>
              <li>Distinguer les propos de l’enseignant, les textes cités et les explications personnelles.</li></ul>
            <p>Ces repères sont généraux et ne constituent pas un résumé de l’audio.</p>
          </section>
          <div class="belief-complete">
            <span>{{ isDone?'Leçon terminée':'À votre rythme' }}</span>
            <button type="button" :class="{'is-done':isDone}" @click="toggleDone"><i :data-lucide="isDone?'check-circle-2':'circle-check'" aria-hidden="true"></i>{{ isDone?'Annuler la validation':'Marquer comme terminée' }}</button>
          </div>
          <nav class="belief-prev-next" aria-label="Leçons suivantes et précédentes">
            <button v-if="previousLesson" type="button" @click="choose(previousLesson)"><i data-lucide="arrow-left"></i> Précédente</button><span v-else></span>
            <button v-if="nextLesson" type="button" @click="choose(nextLesson)">Suivante <i data-lucide="arrow-right"></i></button>
            <button v-else type="button" @click="goIndex">Retour au programme <i data-lucide="arrow-right"></i></button>
          </nav>
          <p class="belief-caution"><i data-lucide="info" aria-hidden="true"></i>{{ course.editorialNote }}</p>
        </main>
      </div>
    </div>
  </section>
  `
};
