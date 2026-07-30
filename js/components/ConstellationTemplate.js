// Athar Pro — interface calme et textuelle de la Constellation coranique
window.ConstellationApp.template = `
<section class="quran-study-shell">
  <div class="quran-study-container">
    <header class="quran-study-hero">
      <div class="quran-study-hero-copy">
        <span class="quran-study-eyebrow"><i data-lucide="book-open-check"></i> Étude thématique du Coran</span>
        <p class="quran-study-hero-ayah" dir="rtl" lang="ar">وَقُل رَّبِّ زِدْنِي عِلْمًا</p>
        <small>« Et dis : Seigneur, augmente-moi en savoir. » — 20:114</small>
        <h1>Comprendre les thèmes du Coran <em>sans perdre le texte</em></h1>
        <p>Une lecture posée, organisée par thèmes, qui place les versets arabes au centre et distingue clairement le texte coranique, la piste pédagogique et l’application personnelle.</p>
        <div class="quran-study-actions">
          <button class="quran-study-primary" @click="random"><i data-lucide="shuffle"></i> Ouvrir un thème</button>
          <button class="quran-study-secondary" @click="methodology=true"><i data-lucide="shield-check"></i> Méthodologie</button>
        </div>
      </div>
      <aside class="quran-study-progress-card">
        <div><span>Votre progression</span><strong>{{ studied.length }} / {{ stats.concepts }} thèmes étudiés</strong><b>{{ progress }}%</b></div>
        <div class="quran-study-progress-track"><span :style="{width:progress+'%'}"></span></div>
        <div class="quran-study-stat-grid">
          <div><strong>{{ stats.concepts }}</strong><span>thèmes</span></div>
          <div><strong>{{ stats.refs }}</strong><span>références</span></div>
          <div><strong>{{ stats.categories }}</strong><span>familles</span></div>
          <div><strong>{{ stats.paths }}</strong><span>parcours</span></div>
        </div>
      </aside>
    </header>

    <nav class="quran-study-modebar" aria-label="Modes de consultation">
      <button :class="{active:mode==='study'}" @click="setMode('study')"><i data-lucide="book-open"></i> Étudier</button>
      <button :class="{active:mode==='themes'}" @click="setMode('themes')"><i data-lucide="library-big"></i> Tous les thèmes</button>
      <button :class="{active:mode==='paths'}" @click="setMode('paths')"><i data-lucide="route"></i> Parcours guidés</button>
    </nav>

    <div class="quran-study-filterbar">
      <label><i data-lucide="search"></i><input v-model="search" type="search" placeholder="Rechercher un thème, un mot-clé ou une référence…" aria-label="Rechercher dans la Constellation"></label>
      <select v-model="category" aria-label="Filtrer par famille"><option value="all">Toutes les familles</option><option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.label }}</option></select>
      <button :class="{active:favoritesOnly}" @click="favoritesOnly=!favoritesOnly"><i data-lucide="heart"></i> Favoris</button>
      <button v-if="search||category!=='all'||favoritesOnly" class="quran-study-reset" @click="resetFilters"><i data-lucide="rotate-ccw"></i> Réinitialiser</button>
    </div>

    <div v-if="mode==='study'" class="quran-study-layout">
      <aside class="quran-study-sidebar">
        <header><div><span>Sommaire</span><strong>{{ filtered.length }} thèmes visibles</strong></div><button @click="random" title="Découverte aléatoire"><i data-lucide="sparkles"></i></button></header>
        <div v-if="activePath" class="quran-study-active-path" :style="{'--path-color':activePath.color}">
          <i :data-lucide="activePath.icon"></i><div><small>Parcours actif</small><strong>{{ activePath.title }}</strong><span>Étape {{ pathStep+1 }} / {{ activePath.concepts.length }}</span></div><button @click="stopPath"><i data-lucide="x"></i></button>
        </div>
        <div class="quran-study-sidebar-scroll">
          <section v-for="group in groupedConcepts" :key="group.id" class="quran-study-sidebar-group">
            <h2 :style="{'--family-color':group.color}"><i></i>{{ group.label }}</h2>
            <button v-for="item in group.concepts" :key="item.id" :class="{active:selected?.id===item.id}" @click="selectConcept(item.id)">
              <span class="quran-study-mini-arabic" lang="ar" dir="rtl">{{ item.arabic }}</span>
              <span><strong>{{ item.title }}</strong><small>{{ item.verses.slice(0,2).join(' · ') }}</small></span>
              <i v-if="isFavorite(item.id)" data-lucide="heart" class="quran-study-heart"></i>
              <i data-lucide="chevron-right"></i>
            </button>
          </section>
          <div v-if="!filtered.length" class="quran-study-empty"><i data-lucide="search-x"></i><strong>Aucun thème trouvé</strong><button @click="resetFilters">Effacer les filtres</button></div>
        </div>
      </aside>

      <main v-if="selected" ref="reader" class="quran-study-reader">
        <div v-if="activePath" class="quran-study-path-controller">
          <button @click="previousPath" :disabled="pathStep===0"><i data-lucide="chevron-left"></i></button>
          <div><span>{{ activePath.title }}</span><strong>Étape {{ pathStep+1 }} / {{ activePath.concepts.length }}</strong></div>
          <button @click="nextPath" :disabled="pathStep>=activePath.concepts.length-1"><i data-lucide="chevron-right"></i></button>
        </div>

        <article class="quran-study-concept-head" :style="{'--concept-color':color(selected)}">
          <div class="quran-study-concept-meta"><span>{{ selectedCategory?.label }}</span><button :class="{active:isFavorite(selected.id)}" @click="toggleFavorite(selected.id)"><i data-lucide="heart"></i>{{ isFavorite(selected.id)?'En favori':'Ajouter aux favoris' }}</button></div>
          <p class="quran-study-concept-arabic" dir="rtl" lang="ar">{{ selected.arabic }}</p>
          <h2>{{ selected.title }}</h2>
          <p>{{ selected.summary }}</p>
          <div class="quran-study-tags"><span v-for="tag in selected.tags" :key="tag">{{ tag }}</span></div>
        </article>

        <section class="quran-study-intro-grid">
          <article><span><i data-lucide="compass"></i> Idée directrice</span><p>{{ selected.key }}</p></article>
          <article><span><i data-lucide="layers-3"></i> Cadre de lecture</span><p>{{ guide?.context }}</p></article>
        </section>

        <section class="quran-study-section">
          <header><div><span>Le texte au centre</span><h3>Repères coraniques en arabe</h3></div><p>Chaque carte affiche le verset complet lorsqu’il est disponible. La note française est une piste de lecture, pas une traduction.</p></header>
          <div class="quran-study-verse-list">
            <article v-for="(reference,index) in selected.verses" :key="reference" class="quran-study-verse-card">
              <div class="quran-study-verse-top"><strong>{{ reference }}</strong><button @click="copyRef(reference)" title="Copier la référence"><i data-lucide="copy"></i></button></div>
              <p v-if="verseText(reference)" class="quran-study-arabic-verse" dir="rtl" lang="ar">{{ verseText(reference) }}</p>
              <div v-else-if="verseLoading[reference]" class="quran-study-verse-loading"><span></span><span></span><span></span></div>
              <div v-else class="quran-study-verse-unavailable"><i data-lucide="wifi-off"></i><p>Le texte arabe n’a pas pu être chargé. La référence reste disponible pour consultation dans un muṣḥaf.</p><button @click="fetchArabicVerse(reference)">Réessayer</button></div>
              <div class="quran-study-reading-note"><span>Piste de lecture</span><p>{{ verseNote(index) }}</p></div>
            </article>
          </div>
          <p class="quran-study-attribution"><i data-lucide="badge-check"></i> Texte arabe fourni par l’édition Uthmani d’Al Quran Cloud, issue notamment du corpus Tanzil. Vérifier le passage dans un muṣḥaf pour l’étude approfondie.</p>
        </section>

        <section class="quran-study-section">
          <header><div><span>Approfondissement</span><h3>Trois axes pour étudier le thème</h3></div><p>Une méthode simple pour passer de la définition à la comparaison des passages.</p></header>
          <div class="quran-study-axis-grid"><article v-for="(axis,index) in studyAxes" :key="axis.title"><b>{{ String(index+1).padStart(2,'0') }}</b><h4>{{ axis.title }}</h4><p>{{ axis.text }}</p></article></div>
        </section>

        <section class="quran-study-section quran-study-relations-section">
          <header><div><span>Lecture transversale</span><h3>Thèmes associés</h3></div><p>Les relations sont proposées pour comparer les passages, sans prétendre résumer toute l’architecture du Coran.</p></header>
          <div class="quran-study-related-grid"><button v-for="entry in related" :key="entry.item.id" @click="openConcept(entry.item)"><span class="quran-study-related-arabic" dir="rtl" lang="ar">{{ entry.item.arabic }}</span><div><small>{{ entry.label }}</small><strong>{{ entry.item.title }}</strong><p>{{ entry.item.summary }}</p></div><i data-lucide="arrow-right"></i></button></div>
        </section>

        <section class="quran-study-reflection-grid">
          <article class="quran-study-practice"><span><i data-lucide="footprints"></i> Mise en pratique</span><h3>{{ selected.practice }}</h3><p>Cette proposition reste générale : elle doit être adaptée à la situation, aux droits d’autrui et aux règles applicables.</p></article>
          <article class="quran-study-caution"><span><i data-lucide="triangle-alert"></i> Point de vigilance</span><p>{{ guide?.caution }}</p></article>
        </section>

        <section class="quran-study-section">
          <header><div><span>Tadabbur guidé</span><h3>Questions à garder ouvertes</h3></div><p>Ces questions servent à relire les passages, prendre des notes et consulter un tafsīr.</p></header>
          <ol class="quran-study-question-list"><li v-for="question in studyQuestions" :key="question"><i data-lucide="circle-help"></i><p>{{ question }}</p></li></ol>
        </section>
      </main>
    </div>

    <section v-if="mode==='themes'" class="quran-study-themes">
      <header class="quran-study-section-heading"><div><span>Bibliothèque thématique</span><h2>Une structure claire par familles</h2></div><p>Les thèmes sont regroupés pour permettre une lecture progressive, sans carte mouvante ni surcharge visuelle.</p></header>
      <section v-for="group in groupedConcepts" :key="group.id" class="quran-study-family-section" :style="{'--family-color':group.color}">
        <header><div><i :data-lucide="group.icon"></i><span><small>Famille thématique</small><h3>{{ group.label }}</h3></span></div><p>{{ group.description }}</p></header>
        <div class="quran-study-theme-grid"><article v-for="item in group.concepts" :key="item.id"><button class="quran-study-theme-favorite" :class="{active:isFavorite(item.id)}" @click.stop="toggleFavorite(item.id)"><i data-lucide="heart"></i></button><button @click="openConcept(item)"><p dir="rtl" lang="ar">{{ item.arabic }}</p><h4>{{ item.title }}</h4><span>{{ item.summary }}</span><footer><small>{{ item.verses.join(' · ') }}</small><i data-lucide="arrow-up-right"></i></footer></button></article></div>
      </section>
    </section>

    <section v-if="mode==='paths'" class="quran-study-paths">
      <header class="quran-study-section-heading"><div><span>Parcours d’étude</span><h2>Avancer par étapes cohérentes</h2></div><p>Chaque parcours ordonne plusieurs thèmes et permet de les étudier successivement dans le lecteur principal.</p></header>
      <div class="quran-study-path-grid"><article v-for="path in dataSet.paths" :key="path.id" :style="{'--path-color':path.color}"><div class="quran-study-path-icon"><i :data-lucide="path.icon"></i></div><span>{{ path.concepts.length }} étapes</span><h3>{{ path.title }}</h3><p>{{ path.summary }}</p><ol><li v-for="(id,index) in path.concepts" :key="id"><b>{{ index+1 }}</b><span><strong>{{ conceptMap.get(id)?.title }}</strong><small dir="rtl" lang="ar">{{ conceptMap.get(id)?.arabic }}</small></span></li></ol><button @click="startPath(path)"><i data-lucide="play"></i> Commencer le parcours</button></article></div>
    </section>
  </div>

  <div v-if="methodology" class="quran-study-modal-backdrop" @click.self="methodology=false">
    <article class="quran-study-methodology"><button class="quran-study-modal-close" @click="methodology=false"><i data-lucide="x"></i></button><span>Méthodologie éditoriale</span><h2>Comment utiliser cette section ?</h2><p>{{ dataSet.meta.methodology }}</p><div><section><i data-lucide="languages"></i><h3>Le texte arabe d’abord</h3><p>Les versets sont affichés en arabe et identifiés par leur référence. La note française ne se présente pas comme une traduction.</p></section><section><i data-lucide="book-copy"></i><h3>Lire le passage complet</h3><p>Un verset doit être replacé dans sa sourate, son enchaînement et les commentaires reconnus.</p></section><section><i data-lucide="shield-alert"></i><h3>Éviter les conclusions rapides</h3><p>Une fiche thématique n’établit pas seule une croyance détaillée, une règle juridique ou un jugement sur une personne.</p></section></div><footer><p>Source du texte arabe : Al Quran Cloud / Tanzil Project. Le corpus Tanzil autorise la reproduction fidèle avec attribution et interdit la modification du texte.</p></footer></article>
  </div>

  <transition name="quran-study-toast"><div v-if="toast" class="quran-study-toast"><i data-lucide="check-circle"></i>{{ toast }}</div></transition>
</section>`;