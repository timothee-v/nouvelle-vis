/* ===== Utilitaires ===== */
const $ = (s, el = document) => el.querySelector(s);
const prix = n => n.toFixed(2).replace('.', ',') + ' ' + CONFIG.devise;
const reduction = p => Math.round(100 * (1 - p.prix / p.prixNeuf));
const trouver = id => PRODUITS.find(p => p.id === id);
const imgProduit = p => p.photo ? `<img src="${p.photo}" alt="${esc(p.nom)}" loading="lazy" onerror="this.remove()">` : '';
const ETATS = ['', 'Abîmé', 'Bon', 'Très bon'];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const etoiles = n => `<span class="etoiles" title="État : ${ETATS[n]}">${'★'.repeat(n)}<span>${'★'.repeat(3 - n)}</span></span>`;

/* ===== Réservations : les articles réservés sortent du stock (mémorisé dans le navigateur) ===== */
const Reservations = (() => {
  const CLE = 'rebatir-reserves';
  const lire = () => { try { return JSON.parse(localStorage.getItem(CLE)) || {}; } catch (e) { return {}; } };
  const r = lire();
  PRODUITS.forEach(p => { p.stock = Math.max(0, p.stock - (r[p.id] || 0)); });
  return {
    ajouter(panier) {
      const res = lire();
      Object.entries(panier).forEach(([id, q]) => {
        res[id] = (res[id] || 0) + q;
        const p = PRODUITS.find(x => x.id === id); if (p) p.stock = Math.max(0, p.stock - q);
      });
      try { localStorage.setItem(CLE, JSON.stringify(res)); } catch (e) {}
    },
    reset() { try { localStorage.removeItem(CLE); localStorage.removeItem('rebatir-panier'); } catch (e) {} location.reload(); }
  };
})();

/* ===== Icônes ===== */
const ICONES = {
  loupe: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  user: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3.2"/><path d="M6.2 18.6c1.3-2.3 3.4-3.4 5.8-3.4s4.5 1.1 5.8 3.4"/></svg>',
  sac: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="m9.5 14 2 2 3.5-3.5"/></svg>',
  poubelle: '<svg width="34" height="38" viewBox="0 0 24 26" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M9 6V3h6v3M5 6l1.3 17h11.4L19 6M9.5 10v9M12 10v9M14.5 10v9"/></svg>',
  fleche: '<svg width="30" height="50" viewBox="0 0 34 54" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m5 3 24 24L5 51"/></svg>',
  entrepot: '<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" stroke-linejoin="round"><path d="M2 10 12 4l10 6v10H2z"/><path d="M6 20v-7h12v7M6 16.5h12"/></svg>',
  etiquette: '<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" stroke-linejoin="round"><path d="M3 3h8l10 10-8 8L3 11z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
  feuille: '<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round"><path d="M5 20c-1-9 4-15 15-15 0 11-6 16-15 15z"/><path d="M5 20 14 11"/></svg>',
  horloge: '<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-1.6 19.9V15H8v-3h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.6l-.4 3h-2.2v6.9A10 10 0 0 0 12 2z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.4 2.2 1.8 3.6 4 3.8v3c-1.5 0-2.8-.4-4-1.2v6.3a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v3.1a2.6 2.6 0 1 0 1.7 2.4V3z"/></svg>',
  youtube: '<svg viewBox="0 0 28 20" fill="currentColor"><path d="M27.4 3.1A3.5 3.5 0 0 0 24.9.6C22.7 0 14 0 14 0S5.3 0 3.1.6A3.5 3.5 0 0 0 .6 3.1C0 5.3 0 10 0 10s0 4.7.6 6.9a3.5 3.5 0 0 0 2.5 2.5C5.3 20 14 20 14 20s8.7 0 10.9-.6a3.5 3.5 0 0 0 2.5-2.5c.6-2.2.6-6.9.6-6.9s0-4.7-.6-6.9zM11.2 14.3V5.7l7.3 4.3z"/></svg>'
};

/* ===== Panier (localStorage, avec repli en mémoire) ===== */
const Panier = (() => {
  const CLE = 'rebatir-panier';
  let memoire = {};
  const lire = () => { try { return JSON.parse(localStorage.getItem(CLE)) || {}; } catch (e) { return { ...memoire }; } };
  const ecrire = p => { memoire = p; try { localStorage.setItem(CLE, JSON.stringify(p)); } catch (e) {} majBadge(); };
  return {
    lire,
    nb: () => Object.values(lire()).reduce((a, b) => a + b, 0),
    definir(id, q) {
      const prod = trouver(id), p = lire();
      if (q > prod.stock) { toast(`Quantité limitée à ${prod.stock} pour « ${prod.nom} »`); q = prod.stock; }
      if (q <= 0) delete p[id]; else p[id] = q;
      ecrire(p);
    },
    ajouter(id) {
      const prod = trouver(id), q = (lire()[id] || 0) + 1;
      if (q > prod.stock) { toast(`Stock épuisé pour « ${prod.nom} »`); return; }
      this.definir(id, q);
      toast(`« ${prod.nom} » ajouté au panier`);
    },
    vider() { ecrire({}); }
  };
})();

function majBadge() {
  const b = $('#badge'); if (!b) return;
  const n = Panier.nb();
  b.textContent = n;
  b.classList.toggle('cache', n === 0);
}

function toast(msg) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('on');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 2400);
}

function modale(html, cls = '') {
  const m = document.createElement('div');
  m.className = 'modale';
  m.innerHTML = `<div class="modale-boite ${cls}" role="dialog" aria-modal="true">${html}<button class="btn-blanc" data-fermer>FERMER</button></div>`;
  const fermer = () => { m.remove(); document.removeEventListener('keydown', surTouche); };
  const surTouche = e => { if (e.key === 'Escape') fermer(); };
  m.addEventListener('click', e => { if (e.target === m || e.target.hasAttribute('data-fermer')) fermer(); });
  document.addEventListener('keydown', surTouche);
  document.body.appendChild(m);
  m.querySelector('[data-fermer]').focus();
}

/* Fiche détaillée d'un produit */
function detail(id) {
  const p = trouver(id); if (!p) return;
  const epuise = p.stock <= 0;
  modale(`
    <div class="detail">
      <div class="detail-img">${imgProduit(p)}</div>
      <div class="detail-corps">
        <h2>${esc(p.nom)}</h2>
        <p class="detail-prix">${prix(p.prix)} <small>${p.unite}</small> <span class="tag-reduc en-ligne">-${reduction(p)}%</span></p>
        <p class="detail-neuf">Prix neuf : <s>${prix(p.prixNeuf)}</s>. Économie de ${prix(p.prixNeuf - p.prix)} ${p.unite}</p>
        <ul class="detail-liste">
          <li><span>État</span><span>${etoiles(p.etat)} ${ETATS[p.etat]}</span></li>
          <li><span>Provenance</span><span>${esc(p.provenance)}</span></li>
          <li><span>Disponibilité</span><span>${epuise ? 'Épuisé' : p.stock <= 3 ? `Plus que ${p.stock}` : `${p.stock} en stock`}</span></li>
          <li><span>Retrait</span><span>Entrepôt, sous 48 h</span></li>
        </ul>
        <button class="btn-blanc" data-ajout="${p.id}" ${epuise ? 'disabled' : ''}>${epuise ? 'ÉPUISÉ' : 'AJOUTER AU PANIER'}</button>
      </div>
    </div>`, 'large');
}

/* ===== Gabarits communs ===== */
function header(page) {
  const a = p => page === p ? 'actif' : '';
  return `
  <div class="bandeau">RÉSERVEZ EN LIGNE, RETIREZ À L'ENTREPÔT <a href="stock.html">VOIR LE STOCK</a></div>
  <header class="entete">
    <a href="index.html" class="logo" aria-label="${CONFIG.nom}">${CONFIG.logo}</a>
    <form class="recherche" action="stock.html">
      <input name="q" type="search" aria-label="Rechercher">
      <button aria-label="Rechercher">${ICONES.loupe}</button>
    </form>
    <nav class="nav">
      <a href="index.html" class="${a('accueil')}">accueil</a>
      <a href="stock.html" class="${a('stock')}">le stock</a>
      <a href="index.html#concept">le concept</a>
      <a href="index.html#entreprises">entreprises</a>
      <a href="#contact">nous joindre</a>
      <a href="#" class="ico" aria-label="Mon compte" data-bientot>${ICONES.user}</a>
      <a href="panier.html" class="ico ${a('panier')}" aria-label="Panier">${ICONES.sac}<span class="badge cache" id="badge">0</span></a>
    </nav>
  </header>`;
}

function footer() {
  return `
  <footer class="pied" id="contact">
    <nav class="pied-liens">
      <a href="index.html">accueil</a><a href="stock.html">le stock</a><a href="panier.html">mon panier</a>
      <a href="index.html#concept">le concept</a><a href="mailto:${CONFIG.courriel}">nous joindre</a>
    </nav>
    <div class="pied-milieu">
      <div class="reseaux">${['instagram', 'facebook', 'tiktok', 'youtube'].map(r => `<a href="#" aria-label="${r}">${ICONES[r]}</a>`).join('')}</div>
      <nav class="legal"><a href="#">politique de retour</a><a href="#">conditions générales</a><a href="#">politique de confidentialité</a></nav>
    </div>
    <div class="pied-bas"><span>©${new Date().getFullYear()} Tous droits réservés · <a href="#" data-reset title="Remet le stock et le panier à zéro (prototype)">réinitialiser la démo</a></span><span>${CONFIG.adresse} · ${CONFIG.horaires}</span></div>
  </footer>`;
}

function carte(p) {
  const epuise = p.stock <= 0;
  return `
  <article class="carte ${epuise ? 'epuisee' : ''}">
    <div class="carte-img" data-detail="${p.id}">
      ${p.nouveau ? '<span class="tag-nouveau">NOUVEAU</span>' : ''}
      <span class="tag-reduc">-${reduction(p)}%</span>
      ${imgProduit(p)}
      <button class="btn-ajout" data-ajout="${p.id}" ${epuise ? 'disabled' : ''}>${epuise ? 'ÉPUISÉ' : 'AJOUTER AU PANIER'}</button>
    </div>
    <div class="carte-info"><button class="carte-nom" data-detail="${p.id}">${esc(p.nom)}</button><span class="carte-prix">${prix(p.prix)}</span></div>
    <div class="carte-meta">
      ${etoiles(p.etat)}
      <span class="dispo ${p.stock <= 3 ? 'faible' : ''}">${epuise ? 'Épuisé' : p.stock <= 3 ? `Plus que ${p.stock}` : `${p.stock} en stock`}</span>
    </div>
    <div class="carte-neuf">Neuf : <s>${prix(p.prixNeuf)}</s> ${p.unite}</div>
  </article>`;
}

/* ===== Accueil ===== */
function initAccueil() {
  // Carrousel du hero
  const imgs = [...document.querySelectorAll('.hero-visuel img')], pts = $('.points');
  let i = 0;
  pts.innerHTML = imgs.map((_, k) => `<button aria-label="Image ${k + 1}" class="${k ? '' : 'on'}"></button>`).join('');
  const aller = k => {
    imgs[i]?.classList.remove('on'); pts.children[i].classList.remove('on');
    i = k; imgs[i]?.classList.add('on'); pts.children[i].classList.add('on');
  };
  pts.addEventListener('click', e => { const k = [...pts.children].indexOf(e.target); if (k >= 0) aller(k); });
  if (imgs.length > 1) setInterval(() => aller((i + 1) % imgs.length), 5000);

  // Icônes des atouts
  document.querySelectorAll('[data-icone]').forEach(el => el.innerHTML = ICONES[el.dataset.icone]);

  // Nouvel arrivage
  const rail = $('#rail');
  rail.innerHTML = PRODUITS.filter(p => p.nouveau).map(carte).join('');
  $('#fleche').innerHTML = ICONES.fleche;
  $('#fleche').addEventListener('click', () => {
    const fin = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 5;
    rail.scrollBy({ left: fin ? -rail.scrollWidth : 305, behavior: 'smooth' });
  });

  // Chiffres clés (calculés à partir du catalogue)
  const dispo = PRODUITS.filter(p => p.stock > 0);
  const eco = dispo.reduce((a, p) => a + (p.prixNeuf - p.prix) * p.stock, 0);
  const moy = dispo.length ? Math.round(dispo.reduce((a, p) => a + reduction(p), 0) / dispo.length) : 0;
  $('#chiffres').innerHTML = `
    <div><strong>${dispo.length}</strong><span>références disponibles</span></div>
    <div><strong>${moy} %</strong><span>de réduction moyenne</span></div>
    <div><strong>${prix(eco).replace(',00', '')}</strong><span>d'économies en rayon</span></div>`;

  // Infolettre
  $('#form-infolettre').addEventListener('submit', e => {
    e.preventDefault();
    e.target.innerHTML = '<p class="merci">Merci. Vous recevrez un courriel à chaque nouvel arrivage.</p>';
  });

  // Formulaire entreprises (fournisseurs de surplus)
  $('#form-entreprise').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    e.target.innerHTML = `<p class="merci">Merci. Votre demande a bien été reçue, nous vous répondrons sous 48 h à l'adresse ${esc(f.courriel.value)}.</p>`;
  });
}

/* ===== Stock ===== */
function initStock() {
  // Bandeau des arrivages
  const fmt = s => {
    const d = new Date(s);
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) + ' à ' +
           d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };
  const j = Math.ceil((new Date(CONFIG.prochainArrivage) - Date.now()) / 864e5);
  $('#notif-stock').innerHTML = `
    <span>Dernier renouvellement du stock : <strong>${fmt(CONFIG.dernierArrivage)}</strong></span>
    <span class="sep">|</span>
    <span>Prochain arrivage prévu : <strong>${fmt(CONFIG.prochainArrivage)}</strong>${j > 0 ? ` (dans ${j} jour${j > 1 ? 's' : ''})` : ''}</span>`;

  // Filtres
  const params = new URLSearchParams(location.search);
  const f = { cat: params.get('cat') || 'tous', q: params.get('q') || '', tri: params.get('tri') || 'nouveau', dispo: true };
  $('#recherche').value = f.q;
  $('#tri').value = f.tri;
  const chips = $('#chips');
  chips.innerHTML = [['tous', 'Tout'], ['bois', 'Bois'], ['metal', 'Métal'], ['autre', 'Autre']]
    .map(([v, l]) => `<button class="chip ${f.cat === v ? 'on' : ''}" data-cat="${v}">${l}</button>`).join('');

  const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const tris = {
    nouveau: (a, b) => (b.nouveau ? 1 : 0) - (a.nouveau ? 1 : 0),
    'prix-asc': (a, b) => a.prix - b.prix,
    'prix-desc': (a, b) => b.prix - a.prix,
    reduction: (a, b) => reduction(b) - reduction(a),
    stock: (a, b) => b.stock - a.stock
  };
  const rendre = () => {
    const l = PRODUITS.filter(p =>
      (f.cat === 'tous' || p.cat === f.cat) &&
      (!f.dispo || p.stock > 0) &&
      norm(p.nom + ' ' + p.provenance).includes(norm(f.q))
    ).sort(tris[f.tri] || tris.nouveau);
    $('#nb').textContent = `${l.length} article${l.length > 1 ? 's' : ''}`;
    $('#grille').innerHTML = l.length ? l.map(carte).join('')
      : '<p class="vide">Aucun article ne correspond à votre recherche.</p>';
  };

  chips.addEventListener('click', e => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    f.cat = b.dataset.cat;
    chips.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
    rendre();
  });
  $('#recherche').addEventListener('input', e => { f.q = e.target.value; rendre(); });
  $('#tri').addEventListener('change', e => { f.tri = e.target.value; rendre(); });
  $('#dispo').addEventListener('change', e => { f.dispo = e.target.checked; rendre(); });
  rendre();

  // Indicateur "temps réel" (simulé pour le prétotype)
  let t = 0;
  setInterval(() => { t = (t + 5) % 30; $('#maj').textContent = t ? `il y a ${t} s` : "à l'instant"; }, 5000);
}

/* ===== Panier ===== */
function initPanier() {
  const liste = $('#liste-panier'), recap = $('#recap');
  $('#adresse').innerHTML = `${CONFIG.adresse}<br>${CONFIG.horaires}`;

  const ligne = (p, q) => `
  <article class="ligne">
    <div class="ligne-img">${imgProduit(p)}</div>
    <div class="ligne-corps">
      <div class="ligne-haut"><h2>${p.nom}</h2><span class="ligne-total">${prix(p.prix * q)}</span></div>
      <p class="ligne-pu">${prix(p.prix)} <small>${p.unite}</small> <s>${prix(p.prixNeuf)}</s></p>
      <p class="ligne-prov">Provenance : ${p.provenance}. État : ${ETATS[p.etat]}.</p>
      <div class="ligne-actions">
        <div class="qte">
          <button data-action="moins" data-id="${p.id}" aria-label="Retirer un">−</button>
          <span>${q}</span>
          <button data-action="plus" data-id="${p.id}" aria-label="Ajouter un">+</button>
        </div>
        <button class="poubelle" data-action="suppr" data-id="${p.id}" aria-label="Supprimer">${ICONES.poubelle}</button>
        <span class="ligne-stock">${p.stock} en stock</span>
      </div>
    </div>
  </article>`;

  const rendre = () => {
    const p = Panier.lire();
    const ids = Object.keys(p).filter(trouver);
    ids.forEach(id => { if (p[id] > trouver(id).stock) Panier.definir(id, trouver(id).stock); });
    ids.splice(0, ids.length, ...Object.keys(Panier.lire()).filter(trouver));
    if (!ids.length) {
      liste.innerHTML = '<div class="panier-vide"><p>Votre panier est vide.</p><a class="btn-blanc" href="stock.html">PARCOURIR LE STOCK</a></div>';
      recap.hidden = true;
      return;
    }
    recap.hidden = false;
    liste.innerHTML = ids.map(id => ligne(trouver(id), p[id])).join('');
    let total = 0, neuf = 0;
    ids.forEach(id => { const pr = trouver(id); total += pr.prix * p[id]; neuf += pr.prixNeuf * p[id]; });
    $('#total').textContent = prix(total);
    $('#economie').textContent = prix(neuf - total);
  };

  liste.addEventListener('click', e => {
    const b = e.target.closest('[data-action]'); if (!b) return;
    const id = b.dataset.id, q = Panier.lire()[id] || 0;
    if (b.dataset.action === 'plus') Panier.definir(id, q + 1);
    if (b.dataset.action === 'moins') Panier.definir(id, Math.max(1, q - 1));
    if (b.dataset.action === 'suppr') Panier.definir(id, 0);
    rendre();
  });

  // Créneaux de retrait (6 prochains jours ouvrés, hors dimanche)
  const opts = [], d = new Date();
  while (opts.length < 12) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) continue;
    const jour = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    opts.push(`<option>${jour}, de 8 h à 12 h</option>`, `<option>${jour}, de 13 h à 18 h</option>`);
  }
  $('#creneau').innerHTML = '<option value="">Choisir un créneau de retrait</option>' + opts.join('');

  $('#cgv').addEventListener('change', e => $('#btn-resa').disabled = !e.target.checked);

  $('#form-resa').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const num = 'RB-' + Math.floor(10000 + Math.random() * 90000);
    modale(`
      <h2>Réservation confirmée</h2>
      <p class="num">${num}</p>
      <p>Merci ${esc(f.nom.value)}. Un récapitulatif a été envoyé à <strong>${esc(f.courriel.value)}</strong>.</p>
      <p>Retrait : <strong>${esc(f.creneau.selectedOptions[0].textContent)}</strong><br>${CONFIG.adresse}</p>
      <p class="petit">Présentez ce numéro à l'accueil de l'entrepôt. Paiement sur place. Réservation conservée 48 h.</p>`);
    Reservations.ajouter(Panier.lire());
    Panier.vider();
    f.reset();
    $('#btn-resa').disabled = true;
    rendre();
  });

  rendre();
}

/* ===== Démarrage ===== */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-ajout]');
  if (b) {
    if (!b.disabled) { Panier.ajouter(b.dataset.ajout); b.closest('.modale')?.remove(); }
    return;
  }
  const d = e.target.closest('[data-detail]');
  if (d) return detail(d.dataset.detail);
  if (e.target.closest('[data-bientot]')) { e.preventDefault(); toast("L'espace client sera bientôt disponible"); }
  if (e.target.closest('[data-reset]')) { e.preventDefault(); Reservations.reset(); }
});

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  $('#site-header').innerHTML = header(page);
  $('#site-footer').innerHTML = footer();
  majBadge();
  ({ accueil: initAccueil, stock: initStock, panier: initPanier })[page]?.();
});