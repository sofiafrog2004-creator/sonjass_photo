async function loadSite(){

  const res = await fetch('content/site.json', {
    cache:'no-store'
  });

  const d = await res.json();

  const $ = id => document.getElementById(id);


  // ==========================
  // ОСНОВНАЯ ИНФОРМАЦИЯ
  // ==========================

  $('brand').innerHTML = d.brand.replace('_','<br>');

  $('city').textContent = d.city;

  $('heroTitle').innerHTML = d.heroTitle
    .replace(' ','<br>')
    .replace(' ','<br>');

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
  // ДАННЫЕ
  // ==========================

  const works = d.works || [];

  const categories = d.categories || [];



  // ==========================
  // ЛЕНТА ФОТО
  // ==========================


  $('filmStrip').innerHTML = works
    .map(w=>`

      <img 
        src="${w.image}"
        alt="${w.alt || ''}"
      >

    `)
    .join('');



  // ==========================
  // ИЗБРАННЫЕ ФОТО
  // ==========================


  const featuredWorks =
    works.filter(w=>w.featured).length
    ?
    works.filter(w=>w.featured)
    :
    works;



  $('selectedGrid').innerHTML =
    featuredWorks
    .map((w,i)=>`

      <button
        class="photo-card ${i===0 || i===4 ? 'tall':''}"
        data-full="${w.image}"
      >

        <img
          src="${w.image}"
          alt="${w.alt || ''}"
        >

      </button>

    `)
    .join('');




  // ==========================
  // ГАЛЕРЕЯ
  // ==========================


  renderGallery(works);



  // ==========================
  // КАТЕГОРИИ
  // ==========================


  $('categories').innerHTML =
    categories
    .map(c=>`

      <article 
        class="category-card"
        data-filter="${c.slug}"
      >

        <img src="${c.image}" alt="${c.name}">

        <h3>${c.name}</h3>

      </article>

    `)
    .join('');



  // ==========================
  // ФИЛЬТРЫ
  // ==========================


  const catNames =
    Object.fromEntries(
      categories.map(c=>[
        c.slug,
        c.name
      ])
    );



  $('filters').innerHTML =

    `
    <button 
      class="active"
      data-gallery-filter="all"
    >
      ВСЕ
    </button>
    `

    +

    categories.map(c=>`

      <button
        data-gallery-filter="${c.slug}"
      >
        ${c.name}
      </button>

    `).join('');



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

    `)
    .join('');



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

    `)
    .join('');




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
// ГАЛЕРЕЯ
// ==========================


function renderGallery(works){


  const gallery =
    document.getElementById('galleryGrid');


  if(!gallery) return;



  gallery.innerHTML =
    works
    .map(w=>`

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

    `)
    .join('');

}




// ==========================
// ИНТЕРАКТИВ
// ==========================


function initInteractions(){


  const nav =
    document.querySelector('#nav');


  const menu =
    document.querySelector('.menu-btn');


  menu?.addEventListener(
    'click',
    ()=>nav.classList.toggle('open')
  );



  document
  .querySelectorAll('[data-gallery-filter]')
  .forEach(btn=>{


    btn.addEventListener(
      'click',
      ()=>{


        document
        .querySelectorAll('[data-gallery-filter]')
        .forEach(b=>
          b.classList.remove('active')
        );


        btn.classList.add('active');


        const filter =
          btn.dataset.galleryFilter;



        document
        .querySelectorAll('.gallery-item')
        .forEach(item=>{


          item.style.display =
          filter==='all' ||
          item.dataset.cat===filter
          ?
          ''
          :
          'none';


        });


      }
    );


  });



  document
  .querySelectorAll('[data-filter]')
  .forEach(card=>{


    card.addEventListener(
      'click',
      ()=>{


        const btn =
        document.querySelector(
          `[data-gallery-filter="${card.dataset.filter}"]`
        );


        btn?.click();


      }
    );


  });



  // LIGHTBOX


  const box =
    document.querySelector('#lightbox');


  const img =
    document.querySelector('#lightbox-img');



  document
  .querySelectorAll('[data-full]')
  .forEach(item=>{


    item.addEventListener(
      'click',
      ()=>{


        img.src =
        item.dataset.full;


        box.classList.add('open');


        document.body.style.overflow='hidden';


      }
    );


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



  document.onkeydown =
  e=>{


    if(e.key==='Escape'){

      box.classList.remove('open');

      document.body.style.overflow='';

    }


  };


}



// ==========================
// ЗАПУСК
// ==========================


loadSite()
.catch(err=>
  console.error(
    'Ошибка загрузки сайта:',
    err
  )
);
