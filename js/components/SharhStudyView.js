// Sharh — lecteur vidéo et notes, inspiré de l'ancien parcours Oussoul al-Fiqh.
// Les métadonnées et le contenu de la vidéo ne sont pas présumés vérifiés.
const SharhStudyView = {
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
      const saved=JSON.parse(localStorage.getItem('athar_sharh_abu_dawud_v1')||'{}');
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
      try { localStorage.setItem('athar_sharh_abu_dawud_v1',JSON.stringify({
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
  <section class="sharh-study" aria-label="Parcours de Sharh">
    <header class="sharh-topbar">
      <button class="sharh-back" type="button" @click="leave"><i data-lucide="arrow-left" aria-hidden="true"></i> Revenir au recueil</button>
      <span>ATHAR <span aria-hidden="true">/</span> ÉTUDE COMMENTÉE</span>
    </header>

    <div v-if="!activeLesson" class="sharh-index">
      <div class="sharh-hero">
        <div class="sharh-hero-main">
          <span class="sharh-kicker">Parcours de lecture &amp; écoute</span>
          <p class="sharh-book-arabic" lang="ar" dir="rtl">{{ course.bookArabic }}</p>
          <h1>{{ course.name }}</h1>
          <h2>{{ course.bookTitle }}</h2>
          <p>{{ course.subtitle }}</p>
          <button type="button" class="sharh-primary" @click="resume">
            <i :data-lucide="lastId?'book-open-check':'play'" aria-hidden="true"></i>
            {{ lastId?'Reprendre le parcours':'Commencer le parcours' }}
          </button>
        </div>
        <aside class="sharh-progress" aria-label="Progression du parcours">
          <span>Ma progression</span>
          <strong>{{ percent }}<small>%</small></strong>
          <div class="sharh-track" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100" aria-label="Progression"><span :style="{width:percent+'%'}"></span></div>
          <p>{{ doneCount }} / {{ lessons.length }} leçon{{ lessons.length>1?'s':'' }} terminée{{ doneCount>1?'s':'' }}</p>
          <small>Progression sauvegardée sur cet appareil</small>
        </aside>
      </div>
      <div class="sharh-program-head">
        <div><span class="sharh-kicker">Le programme</span><h2>Les leçons</h2></div>
        <label><i data-lucide="search" aria-hidden="true"></i><input v-model="query" type="search" aria-label="Rechercher une leçon" placeholder="Rechercher une leçon"></label>
      </div>
      <div class="sharh-lesson-list">
        <article v-for="lesson in filteredLessons" :key="lesson.id" class="sharh-lesson-card">
          <span class="sharh-num">{{ String(lesson.number).padStart(2,'0') }}</span>
          <div><small>{{ done.includes(lesson.id)?'Leçon terminée':'Cours vidéo' }}</small>
            <h3>{{ lesson.title }}</h3><p>{{ lesson.subtitle }}</p>
          </div>
          <button type="button" @click="choose(lesson)" :aria-label="'Ouvrir '+lesson.title">
            {{ done.includes(lesson.id)?'Revoir':'Étudier' }} <i data-lucide="arrow-right" aria-hidden="true"></i>
          </button>
        </article>
        <p v-if="!filteredLessons.length">Aucune leçon ne correspond à cette recherche.</p>
      </div>
      <p class="sharh-caution"><i data-lucide="info" aria-hidden="true"></i> {{ course.editorialNote }}</p>
    </div>

    <div v-else class="sharh-reader">
      <div class="sharh-reader-nav">
        <button type="button" @click="goIndex"><i data-lucide="arrow-left" aria-hidden="true"></i> Toutes les leçons</button>
        <button type="button" class="sharh-outline-toggle" @click="mobileOutline=!mobileOutline" :aria-expanded="mobileOutline"><i data-lucide="list" aria-hidden="true"></i> Sommaire</button>
      </div>
      <div class="sharh-reader-grid">
        <aside class="sharh-sidebar" :class="{'is-open':mobileOutline}" aria-label="Sommaire du parcours">
          <span class="sharh-kicker">Le programme</span>
          <h2>{{ course.bookTitle }}</h2>
          <p>{{ doneCount }} / {{ lessons.length }} leçons terminées</p>
          <div class="sharh-track" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100" aria-label="Progression"><span :style="{width:percent+'%'}"></span></div>
          <nav aria-label="Choisir une leçon">
            <button v-for="lesson in lessons" :key="lesson.id" type="button" :class="{'is-current':lesson.id===activeId}" :aria-current="lesson.id===activeId?'step':null" @click="choose(lesson)">
              <span>{{ String(lesson.number).padStart(2,'0') }}</span><span>{{ lesson.title }}</span>
              <i v-if="done.includes(lesson.id)" data-lucide="check" aria-label="Terminée"></i>
            </button>
          </nav>
        </aside>
        <main class="sharh-reading">
          <header class="sharh-lesson-header">
            <span class="sharh-kicker">Leçon {{ String(activeLesson.number).padStart(2,'0') }}</span>
            <h2>{{ activeLesson.title }}</h2><p>{{ activeLesson.subtitle }}</p>
          </header>
          <section aria-label="Cours en vidéo">
            <div class="sharh-section-head">
              <h3>Le cours en vidéo</h3>
              <a :href="activeLesson.videoUrl" target="_blank" rel="noopener noreferrer">Sur YouTube <i data-lucide="external-link" aria-hidden="true"></i></a>
            </div>
            <div class="sharh-video" :class="{'is-floating':floating}">
              <div v-if="floating" class="sharh-video-floatbar">
                <span>Lecture vidéo</span><button type="button" @click="toggleFloating" aria-label="Agrandir la vidéo"><i data-lucide="maximize-2"></i></button>
              </div>
              <div v-if="!videoOpen" class="sharh-video-preview">
                <small>LEÇON {{ String(activeLesson.number).padStart(2,'0') }}</small>
                <button type="button" @click="play" aria-label="Charger la vidéo YouTube"><i data-lucide="play" aria-hidden="true"></i></button>
                <p>Charger la vidéo</p>
              </div>
              <iframe v-else :src="embedUrl" :title="'Vidéo de la leçon '+activeLesson.number" loading="lazy"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
            <div class="sharh-video-actions" v-if="videoOpen">
              <button type="button" @click="toggleFloating"><i :data-lucide="floating?'maximize-2':'picture-in-picture-2'" aria-hidden="true"></i>{{ floating?'Grand format':'Fenêtre flottante' }}</button>
              <button type="button" @click="stopVideo"><i data-lucide="square" aria-hidden="true"></i>Arrêter</button>
            </div>
            <p class="sharh-caption">Lecteur externe chargé uniquement sur clic. Si l’intégration échoue, ouvrir la vidéo sur YouTube.</p>
          </section>
          <section class="sharh-notes" aria-label="Notes personnelles">
            <div class="sharh-section-head"><h3>Mes notes de cours</h3><small>Enregistrées localement</small></div>
            <textarea :value="notes[activeLesson.id]||''" @input="saveNote" rows="6"
              aria-label="Notes de cette leçon" placeholder="Notions, références, questions à approfondir…"></textarea>
            <p class="sharh-caption">Les notes restent sur cet appareil.</p>
          </section>
          <section class="sharh-method">
            <h3>Repères pour l’étude</h3>
            <ul><li>Identifier le passage du livre effectivement commenté.</li>
              <li>Relever les sources mentionnées par l’enseignant.</li>
              <li>Confronter les notes au texte original et distinguer transmission et explication.</li></ul>
            <p>Ces questions de méthode ne sont pas un résumé de la vidéo.</p>
          </section>
          <div class="sharh-complete">
            <span>{{ isDone?'Leçon terminée':'À votre rythme' }}</span>
            <button type="button" :class="{'is-done':isDone}" @click="toggleDone"><i :data-lucide="isDone?'check-circle-2':'circle-check'" aria-hidden="true"></i>{{ isDone?'Annuler la validation':'Marquer comme terminée' }}</button>
          </div>
          <nav class="sharh-prev-next" aria-label="Leçons suivantes et précédentes">
            <button v-if="previousLesson" type="button" @click="choose(previousLesson)"><i data-lucide="arrow-left"></i> Précédente</button><span v-else></span>
            <button v-if="nextLesson" type="button" @click="choose(nextLesson)">Suivante <i data-lucide="arrow-right"></i></button>
            <button v-else type="button" @click="goIndex">Retour au programme <i data-lucide="arrow-right"></i></button>
          </nav>
          <p class="sharh-caution"><i data-lucide="info" aria-hidden="true"></i>{{ course.editorialNote }}</p>
        </main>
      </div>
    </div>
  </section>
  `
};
