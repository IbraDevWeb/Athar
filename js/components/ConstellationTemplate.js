// Athar Pro — interface de la Constellation coranique
window.ConstellationApp.template = `
<section class="constellation-shell">
  <div class="constellation-stars"></div>
  <div class="constellation-container">
    <header class="constellation-hero">
      <div>
        <span class="constellation-eyebrow"><i data-lucide="orbit"></i> Lecture thématique du Coran</span>
        <h1>La <em>Constellation</em> coranique</h1>
        <p>Explorez les liens entre foi, adoration, éthique, vie collective et destinée. Chaque nœud ouvre des références, des connexions et une piste d’application.</p>
        <div class="constellation-actions">
          <button class="constellation-primary" @click="random"><i data-lucide="shuffle"></i> Découverte aléatoire</button>
          <button class="constellation-secondary" @click="startQuiz"><i data-lucide="brain-circuit"></i> Défi des concepts</button>
          <button class="constellation-ghost" @click="methodology=true"><i data-lucide="info"></i> Méthodologie</button>
        </div>
      </div>
      <aside class="constellation-progress-card">
        <div class="constellation-progress-head"><div><span>Exploration personnelle</span><strong>{{ studied.length }} / {{ stats.concepts }} concepts ouverts</strong></div><b>{{ progress }}%</b></div>
        <div class="constellation-progress-track"><span :style="{width:progress+'%'}"></span></div>
        <div class="constellation-stat-grid">
          <div><strong>{{ stats.concepts }}</strong><span>concepts</span></div>
          <div><strong>{{ stats.refs }}</strong><span>repères</span></div>
          <div><strong>{{ stats.links }}</strong><span>relations</span></div>
          <div><strong>{{ stats.paths }}</strong><span>parcours</span></div>
        </div>
      </aside>
    </header>

    <nav class="constellation-modebar">
      <button :class="{active:mode==='network'}" @click="setMode('network')"><i data-lucide="network"></i> Réseau</button>
      <button :class="{active:mode==='catalogue'}" @click="setMode('catalogue')"><i data-lucide="layout-grid"></i> Concepts</button>
      <button :class="{active:mode==='paths'}" @click="setMode('paths')"><i data-lucide="route"></i> Parcours</button>
    </nav>

    <div class="constellation-filterbar">
      <label class="constellation-search"><i data-lucide="search"></i><input v-model="search" type="search" placeholder="Concept, mot-clé ou référence…"></label>
      <select v-model="category"><option value="all">Toutes les familles</option><option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.label }}</option></select>
      <button class="constellation-favorite-filter" :class="{active:favoritesOnly}" @click="favoritesOnly=!favoritesOnly"><i data-lucide="heart"></i> Favoris</button>
      <button v-if="search||category!=='all'||favoritesOnly" class="constellation-reset" @click="resetFilters"><i data-lucide="rotate-ccw"></i> Réinitialiser</button>
    </div>

    <div v-show="mode==='network'" class="constellation-network-layout">
      <aside class="constellation-sidebar">
        <header class="constellation-sidebar-head"><div><span>Concepts visibles</span><strong>{{ filtered.length }} nœuds</strong></div><button @click="random"><i data-lucide="sparkles"></i></button></header>
        <div v-if="activePath" class="constellation-active-path" :style="{'--path-color':activePath.color}">
          <i :data-lucide="activePath.icon"></i><span><small>Parcours actif</small><strong>{{ activePath.title }}</strong><b>Étape {{ pathStep+1 }} / {{ activePath.concepts.length }}</b></span><button @click="stopPath"><i data-lucide="x"></i></button>
        </div>
        <div class="constellation-sidebar-scroll">
          <button v-for="item in filtered" :key="item.id" class="constellation-list-row" :class="{active:selected?.id===item.id}" @click="open(item)">
            <span class="constellation-list-orb" :style="{'--concept-color':color(item)}">{{ item.arabic.slice(0,1) }}</span>
            <span><strong>{{ item.title }}</strong><small>{{ dataSet.categories[item.category].label }} · {{ item.verses.slice(0,2).join(' · ') }}</small></span>
            <i v-if="isFavorite(item.id)" data-lucide="heart" class="constellation-row-heart"></i><i data-lucide="chevron-right"></i>
          </button>
          <div v-if="!filtered.length" class="constellation-empty"><i data-lucide="search-x"></i><strong>Aucun concept</strong><button @click="resetFilters">Effacer les filtres</button></div>
        </div>
      </aside>
      <div class="constellation-network-card">
        <div ref="network" class="constellation-network"></div>
        <div class="constellation-legend"><span v-for="cat in categories" :key="cat.id"><i :style="{background:cat.color}"></i>{{ cat.label }}</span></div>
        <div v-if="activePath&&pathConcept" class="constellation-path-controller">
          <button @click="previousPath" :disabled="pathStep===0"><i data-lucide="chevron-left"></i></button>
          <div><span>Étape {{ pathStep+1 }} / {{ activePath.concepts.length }}</span><strong>{{ pathConcept.title }}</strong><small>{{ pathConcept.arabic }}</small></div>
          <button @click="nextPath" :disabled="pathStep>=activePath.concepts.length-1"><i data-lucide="chevron-right"></i></button>
        </div>
      </div>
    </div>

    <section v-if="mode==='catalogue'" class="constellation-catalogue">
      <header class="constellation-section-heading"><div><span>Répertoire thématique</span><h2>{{ filtered.length }} concepts</h2></div><p>Ouvrez une fiche pour étudier ses repères, ses relations et une piste d’application.</p></header>
      <div class="constellation-card-grid">
        <article v-for="item in filtered" :key="item.id" class="constellation-card" :class="{studied:isStudied(item.id)}" :style="{'--concept-color':color(item)}">
          <button class="constellation-card-favorite" :class="{active:isFavorite(item.id)}" @click.stop="toggleFavorite(item.id)"><i data-lucide="heart"></i></button>
          <button class="constellation-card-body" @click="open(item)">
            <div class="constellation-card-top"><span class="constellation-card-orb">{{ item.arabic.slice(0,1) }}</span><span v-if="isStudied(item.id)"><i data-lucide="check"></i> Exploré</span></div>
            <p class="constellation-card-arabic">{{ item.arabic }}</p><h3>{{ item.title }}</h3><small>{{ dataSet.categories[item.category].label }}</small><p>{{ item.summary }}</p>
            <div class="constellation-card-refs"><span v-for="ref in item.verses" :key="ref">{{ ref }}</span></div>
            <footer><span><i data-lucide="git-branch"></i>{{ item.tags.slice(0,2).join(' · ') }}</span><i data-lucide="arrow-up-right"></i></footer>
          </button>
        </article>
      </div>
    </section>

    <section v-if="mode==='paths'" class="constellation-paths">
      <header class="constellation-section-heading"><div><span>Parcours guidés</span><h2>Relier les concepts pas à pas</h2></div><p>Une progression éditoriale pour apprendre, sans imposer un ordre unique de lecture.</p></header>
      <div class="constellation-path-grid">
        <article v-for="path in dataSet.paths" :key="path.id" class="constellation-path-card" :style="{'--path-color':path.color}">
          <div class="constellation-path-icon"><i :data-lucide="path.icon"></i></div><span>{{ path.concepts.length }} étapes</span><h3>{{ path.title }}</h3><p>{{ path.summary }}</p>
          <div class="constellation-path-steps"><span v-for="(id,i) in path.concepts" :key="id"><b>{{ i+1 }}</b>{{ conceptMap.get(id)?.title }}</span></div>
          <button @click="startPath(path)"><i data-lucide="play"></i> Commencer</button>
        </article>
      </div>
    </section>
  </div>

  <div v-if="drawer&&selected" class="constellation-backdrop" @click.self="closeDrawer">
    <article class="constellation-drawer" :style="{'--concept-color':color(selected)}">
      <header class="constellation-drawer-head">
        <span class="constellation-drawer-orb">{{ selected.arabic.slice(0,1) }}</span><div><small>{{ dataSet.categories[selected.category].label }}</small><h2>{{ selected.title }}</h2><p>{{ selected.arabic }}</p></div>
        <button class="constellation-drawer-favorite" :class="{active:isFavorite(selected.id)}" @click="toggleFavorite(selected.id)"><i data-lucide="heart"></i></button><button class="constellation-drawer-close" @click="closeDrawer"><i data-lucide="x"></i></button>
      </header>
      <nav class="constellation-drawer-tabs"><button :class="{active:tab==='overview'}" @click="tab='overview'">Vue d’ensemble</button><button :class="{active:tab==='verses'}" @click="tab='verses'">Repères</button><button :class="{active:tab==='relations'}" @click="tab='relations'">Relations</button><button :class="{active:tab==='practice'}" @click="tab='practice'">Pratique</button></nav>
      <div class="constellation-drawer-scroll">
        <section v-if="tab==='overview'" class="constellation-tab">
          <p class="constellation-lead">{{ selected.summary }}</p><div class="constellation-key-card"><i data-lucide="key-round"></i><div><span>Idée centrale</span><strong>{{ selected.key }}</strong></div></div>
          <div class="constellation-chip-row"><span v-for="tag in selected.tags" :key="tag">{{ tag }}</span></div>
          <div class="constellation-method-card"><i data-lucide="book-open-check"></i><p>Cette fiche est une entrée thématique. Le sens complet demande le contexte, la langue, les passages liés et les commentaires savants.</p></div>
        </section>
        <section v-if="tab==='verses'" class="constellation-tab">
          <div class="constellation-verse-list"><button v-for="ref in selected.verses" :key="ref" @click="copyRef(ref)"><b>{{ ref }}</b><span>Ouvrir le passage complet dans un muṣḥaf ou un tafsīr reconnu.</span><i data-lucide="copy"></i></button></div>
          <p class="constellation-source-note">Les références sont des portes d’entrée et non une liste exhaustive des occurrences du thème.</p>
        </section>
        <section v-if="tab==='relations'" class="constellation-tab">
          <div class="constellation-related-grid"><button v-for="entry in related" :key="entry.item.id" @click="open(entry.item)"><span :style="{'--related-color':color(entry.item)}">{{ entry.item.arabic.slice(0,1) }}</span><div><small>{{ entry.label }}</small><strong>{{ entry.item.title }}</strong><p>{{ entry.item.summary }}</p></div><i data-lucide="arrow-right"></i></button></div>
        </section>
        <section v-if="tab==='practice'" class="constellation-tab"><div class="constellation-practice-card"><i data-lucide="footprints"></i><span>Une étape concrète</span><h3>{{ selected.practice }}</h3></div><p class="constellation-source-note">Proposition pédagogique générale, à adapter à la situation réelle.</p></section>
      </div>
    </article>
  </div>

  <div v-if="quiz" class="constellation-modal-backdrop">
    <article class="constellation-quiz"><button class="constellation-modal-close" @click="closeQuiz"><i data-lucide="x"></i></button><span>{{ quiz.eyebrow }}</span><h2>{{ quiz.prompt }}</h2>
      <div class="constellation-quiz-options"><button v-for="option in quiz.options" :key="option.id" :disabled="!!quizAnswer" :class="{correct:quizAnswer&&option.id===quiz.answer.id,wrong:quizAnswer?.id===option.id&&option.id!==quiz.answer.id}" @click="answerQuiz(option)">{{ option.title }}</button></div>
      <div v-if="quizAnswer" class="constellation-quiz-result" :class="{success:quizAnswer.id===quiz.answer.id}"><i :data-lucide="quizAnswer.id===quiz.answer.id?'circle-check':'circle-x'"></i><div><strong>{{ quizAnswer.id===quiz.answer.id?'Bonne réponse':'À revoir' }}</strong><p>{{ quiz.answer.title }} — {{ quiz.answer.summary }}</p></div></div>
      <footer><span>Score : {{ quizScore.correct }} / {{ quizScore.total }}</span><button v-if="quizAnswer" @click="startQuiz">Question suivante</button></footer>
    </article>
  </div>

  <div v-if="methodology" class="constellation-modal-backdrop">
    <article class="constellation-methodology"><button class="constellation-modal-close" @click="methodology=false"><i data-lucide="x"></i></button><span>Méthodologie éditoriale</span><h2>Comment lire cette constellation ?</h2><p>{{ dataSet.meta.methodology }}</p>
      <div><section><i data-lucide="check-circle-2"></i><h3>Ce que montre le réseau</h3><p>Des rapprochements utiles pour naviguer et mémoriser.</p></section><section><i data-lucide="circle-dashed"></i><h3>Ses limites</h3><p>Il ne constitue ni une traduction ni une exégèse exhaustive.</p></section><section><i data-lucide="library"></i><h3>Bonne pratique</h3><p>Lire le texte complet, son contexte et un tafsīr reconnu.</p></section></div>
    </article>
  </div>

  <transition name="constellation-toast"><div v-if="toast" class="constellation-toast"><i data-lucide="check-circle"></i>{{ toast }}</div></transition>
</section>`;
