async function loadSite(){

  const res = await fetch('content/site.json?v=2', {
    cache: 'no-store'
  });

  const d = await res.json();

  const $ = id => document.getElementById(id);


  // ==========================
  // ОСНОВНАЯ ИНФОРМАЦИЯ
  // ==========================

  $('brand').innerHTML = d.brand.replace(' ', '<br>');
  $('city').textContent = d.city;

  $('heroTitle').innerHTML = d.heroTitle
    .split(' ')
    .join('<br>');

  $('heroText').textContent = d.heroText;

  $('heroImage').src = d.heroImage;


  $('aboutImage').src = d.aboutImage;

  $('aboutTitle').textContent = d.aboutTitle;

  $('aboutRole').textContent = d.aboutRole;

  $('aboutText').textContent = d.aboutText;


  $('years').textContent = d.years;

  $('yearsLabel').textContent = d.yearsLabel;


  $('love').textContent = d.love;

  $('loveLabel').textContent = d.loveLabel;



  // ==========================
  // РАБОТЫ
  // ==========================

  const works = d.works || [];


  $('filmStrip').innerHTML =
    works.map(w => `
      <img 
        src="${w.image}"
        alt="${w.alt || ''}"
      >
    `).join('');



  const featuredWorks =
    works.filter(w => w.featured).length
    ? works.filter(w => w.featured)
    : works;



  $('selectedGrid').innerHTML =
    featuredWorks.map((w,i)=>`

      <button
        class="photo-card ${i===0 || i===4 ? 'tall':''}"
        data-full="${w.image}"
      >

        <img
          src="${w.image}"
          alt="${w.alt || ''}"
        >

      </button>

    `).join('');



  $('galleryGrid').innerHTML =
    works.map(w=>`

      <button
        class="gallery-item"
        data-cat="${w.category}"
        data-full="${w.image}"
      >

        <img
          src="${w.image}"
          alt="${w.alt || ''}"
        >

      </button>

    `).join();



  // ==========================
  // КАТЕГОРИИ
  // ==========================

  const categories = d.categories || [];


  $('categories').innerHTML =
    categories.map(c=>`

      <article 
        class="category-card"
        data-filter="${c.slug}"
      >

        <img src="${c.image}" alt="${c.name}">

        <h3>${c.name}</h3>

      </article>

    `).join();



  $('filters').innerHTML =
    `
    <button 
      class="active"
      data-gallery-filter="all">
      ВСЕ
    </button>
    `
    +
    categories.map(c=>`

      <button
        data-gallery-filter="${c.slug}">
        ${c.name}
      </button>

    `).join();



  // ==========================
  // УСЛУГИ
  // ==========================

  $('servicesGrid').innerHTML =
    (d.services || [])
    .map(s=>`

      <article>

        <span>${s.number}</span>

        <h3>${s.title}</h3>

        <p>${s.text}</p>

      </article>

    `).join();



  // ==========================
  // ОТЗЫВЫ
  // ==========================

  $('reviewsGrid').innerHTML =
    (d.reviews || [])
    .map(r=>`

      <article class="review">

        <div class="quote">“</div>

        <blockquote>
          ${r.text.replace(/\n/g,'<br>')}
        </blockquote>

        <p>
          — ${r.author}
        </p>

      </article>

    `).join();



  // ==========================
  // КОНТАКТЫ
  // ==========================

  $('email').href =
    `mailto:${d.email}`;

  $('email').textContent =
    d.email;


  $('telegram').href =
    d.telegram;


  $('instagram').href =
    d.instagram;



  initInteractions();

}




// ==========================
// ИНТЕРАКТИВ
// ==========================

function initInteractions(){


  const menu =
    document.querySelector('.menu-btn');

  const nav =
    document.querySelector('#nav');


  menu?.addEventListener(
    'click',
    ()=>nav.classList.toggle('open')
  );



  document
  .querySelectorAll('[data-gallery-filter]')
  .forEach(btn=>{


    btn.onclick = ()=>{


      document
      .querySelectorAll('[data-gallery-filter]')
      .forEach(b=>b.classList.remove('active'));


      btn.classList.add('active');


      const filter =
        btn.dataset.galleryFilter;



      document
      .querySelectorAll('.gallery-item')
      .forEach(item=>{


        item.style.display =
          filter==="all" ||
          item.dataset.cat===filter
          ? ''
          : 'none';


      });


    };


  });



  const box =
    document.querySelector('#lightbox');

  const img =
    document.querySelector('#lightbox-img');



  document
  .querySelectorAll('[data-full]')
  .forEach(item=>{


    item.onclick=()=>{

      img.src=item.dataset.full;

      box.classList.add('open');

      document.body.style.overflow='hidden';

    };


  });



  document
  .querySelector('.lightbox-close')
  ?.addEventListener(
    'click',
    ()=>{

      box.classList.remove('open');

      document.body.style.overflow='';

    }
  );



}




loadSite()
.catch(err=>{
  console.error(
    'Ошибка загрузки сайта:',
    err
  );
});
