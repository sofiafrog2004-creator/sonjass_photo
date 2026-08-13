async function loadSite(){
  const res = await fetch('content/site.json', {cache:'no-store'});
  const d = await res.json();

  const $ = id => document.getElementById(id);
  $('brand').innerHTML = d.brand.replace(' ', '<br>');
  $('city').textContent = d.city;
  $('heroTitle').innerHTML = d.heroTitle.replace(' ', '<br>').replace(' ', '<br>');
  $('heroText').textContent = d.heroText;
  $('heroImage').src = d.heroImage;
  $('aboutImage').src = d.aboutImage;
  $('aboutTitle').textContent = d.aboutTitle;
  $('aboutRole').textContent = d.aboutRole;
  $('aboutText').textContent = d.aboutText;
  $('years').textContent = d.years; $('yearsLabel').textContent = d.yearsLabel;
  $('love').textContent = d.love; $('loveLabel').textContent = d.loveLabel;

  $('filmStrip').innerHTML = d.works.slice(0,3).map(w=>`<img src="${w.image}" alt="">`).join('');

  $('categories').innerHTML = d.categories.map(c=>`
    <a class="category-card" href="#gallery" data-filter="${c.slug}">
      <img src="${c.image}" alt="${c.name}"><span>${c.name}</span><b>→</b>
    </a>`).join('');

  $('selectedGrid').innerHTML = d.works.slice(0,5).map((w,i)=>`
    <button class="photo-card ${i===0||i===4?'tall':''}" data-full="${w.image}">
      <img src="${w.image}" alt="${w.alt||''}">
    </button>`).join('');

  $('servicesGrid').innerHTML = d.services.map(s=>`
    <article><span>${s.number}</span><h3>${s.title}</h3><p>${s.text}</p></article>`).join('');

  const catNames = Object.fromEntries(d.categories.map(c=>[c.slug,c.name]));
  $('filters').innerHTML = `<button class="active" data-gallery-filter="all">ВСЕ</button>` +
    d.categories.map(c=>`<button data-gallery-filter="${c.slug}">${c.name}</button>`).join('');

  $('galleryGrid').innerHTML = d.works.map(w=>`
    <button class="gallery-item" data-cat="${w.category}" data-full="${w.image}">
      <img src="${w.image}" alt="${w.alt||catNames[w.category]||''}">
    </button>`).join('');

  $('reviewsGrid').innerHTML = d.reviews.map(r=>`
    <article class="review"><div class="quote">“</div><blockquote>${r.text}</blockquote><p>— ${r.author}</p></article>`).join('');

  $('email').href = `mailto:${d.email}`; $('email').textContent = d.email;
  $('telegram').href = d.telegram; $('instagram').href = d.instagram;

  initInteractions();
}
function initInteractions(){
  const nav=document.querySelector('#nav'), menu=document.querySelector('.menu-btn');
  menu?.addEventListener('click',()=>nav.classList.toggle('open'));
  document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

  const items=[...document.querySelectorAll('.gallery-item')];
  document.querySelectorAll('[data-gallery-filter]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-gallery-filter]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); const f=btn.dataset.galleryFilter;
    items.forEach(i=>i.style.display=f==='all'||i.dataset.cat===f?'':'none');
  }));
  document.querySelectorAll('[data-filter]').forEach(c=>c.addEventListener('click',()=>{
    setTimeout(()=>document.querySelector(`[data-gallery-filter="${c.dataset.filter}"]`)?.click(),50);
  }));

  const box=document.querySelector('#lightbox'), img=document.querySelector('#lightbox-img');
  const open=src=>{img.src=src;box.classList.add('open');document.body.style.overflow='hidden'};
  const close=()=>{box.classList.remove('open');document.body.style.overflow=''};
  document.querySelectorAll('[data-full]').forEach(x=>x.addEventListener('click',()=>open(x.dataset.full)));
  document.querySelector('.lightbox-close').onclick=close;
  box.onclick=e=>{if(e.target===box)close()};
  document.onkeydown=e=>{if(e.key==='Escape')close()};
}
loadSite().catch(err=>console.error('Не удалось загрузить content/site.json',err));
