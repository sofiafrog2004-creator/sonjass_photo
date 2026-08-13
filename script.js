async function loadSite() {
  const res = await fetch('content/site.json', { cache: 'no-store' });
  const d = await res.json();

  const $ = id => document.getElementById(id);

  // Основная информация
  $('brand').innerHTML = d.brand.replace(' ', '<br>');
  $('city').textContent = d.city;
  $('heroTitle').innerHTML = d.heroTitle
    .replace(' ', '<br>')
    .replace(' ', '<br>');
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

  // --------------------------------------------------
  // ФОТОГРАФИИ
  // --------------------------------------------------

  const works = Array.isArray(d.works) ? d.works : [];

  // Избранные фотографии
  // Если пользователь отметил featured — используем их.
  // Если ни одной не отмечено — показываем первые 5,
  // чтобы существующий сайт не изменился неожиданно.
  const featuredWorks = works.some(w => w.featured)
    ? works.filter(w => w.featured)
    : works.slice(0, 5);

  // Верхняя фотоплёнка
  $('filmStrip').innerHTML = works
    .slice(0, 3)
    .map(w => `
      <img src="${w.image}" alt="${w.alt || ''}">
    `)
    .join('');

  // --------------------------------------------------
  // РАЗДЕЛЫ / КАТЕГОРИИ
  // --------------------------------------------------

  const categories = Array.isArray(d.categories) ? d.categories : [];

  $('categories').innerHTML = categories
    .map(c => `
      <a class="category-card" href="#gallery" data-filter="${c.slug}">
        <img src="${c.image}" alt="${c.name}">
        <span>${c.name}</span>
        <b>→</b>
      </a>
    `)
    .join('');

  // --------------------------------------------------
  // ИЗБРАННЫЕ РАБОТЫ НА ГЛАВНОЙ
  // --------------------------------------------------

  $('selectedGrid').innerHTML = featuredWorks
    .map((w, i) => `
      <button class="photo-card ${i === 0 || i === 4 ? 'tall' : ''}" data-full="${w.image}">
        <img src="${w.image}" alt="${w.alt || ''}">
      </button>
    `)
    .join('');

  // --------------------------------------------------
  // УСЛУГИ
  // --------------------------------------------------

  $('servicesGrid').innerHTML = (d.services || [])
    .map(s => `
      <article>
        <span>${s.number}</span>
        <h3>${s.title}</h3>
        <p>${s.text}</p>
      </article>
    `)
    .join('');

  // --------------------------------------------------
  // ФИЛЬТРЫ ГАЛЕРЕИ
  // --------------------------------------------------

  const catNames = Object.fromEntries(
    categories.map(c => [c.slug, c.name])
  );

  $('filters').innerHTML =
    `<button class="active" data-gallery-filter="all">ВСЕ</button>` +
    categories
      .map(c => `
        <button data-gallery-filter="${c.slug}">
          ${c.name}
        </button>
      `)
      .join('');

  // --------------------------------------------------
  // ВСЯ ГАЛЕРЕЯ
  // --------------------------------------------------

  $('galleryGrid').innerHTML = works
    .map(w => `
      <button
        class="gallery-item"
        data-cat="${w.category}"
        data-full="${w.image}"
      >
        <img
          src="${w.image}"
          alt="${w.alt || catNames[w.category] || ''}"
        >
      </button>
    `)
    .join('');

  // --------------------------------------------------
  // ОТЗЫВЫ
  // --------------------------------------------------

  $('reviewsGrid').innerHTML = (d.reviews || [])
    .map(r => `
      <article class="review">
        <div class="quote">“</div>
        <blockquote>${r.text}</blockquote>
        <p>— ${r.author}</p>
      </article>
    `)
    .join('');

  // --------------------------------------------------
  // КОНТАКТЫ
  // --------------------------------------------------

  $('email').href = `mailto:${d.email}`;
  $('email').textContent = d.email;

  $('telegram').href = d.telegram;
  $('instagram').href = d.instagram;

  // --------------------------------------------------
  // ВЗАИМОДЕЙСТВИЯ
  // --------------------------------------------------

  initInteractions();
}


function initInteractions() {

  // --------------------------------------------------
  // МОБИЛЬНОЕ МЕНЮ
  // --------------------------------------------------

  const nav = document.querySelector('#nav');
  const menu = document.querySelector('.menu-btn');

  menu?.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  document
    .querySelectorAll('.nav a')
    .forEach(a =>
      a.addEventListener('click', () => {
        nav.classList.remove('open');
      })
    );


  // --------------------------------------------------
  // ФИЛЬТРАЦИЯ ГАЛЕРЕИ
  // --------------------------------------------------

  const items = [
    ...document.querySelectorAll('.gallery-item')
  ];

  document
    .querySelectorAll('[data-gallery-filter]')
    .forEach(btn => {

      btn.addEventListener('click', () => {

        document
          .querySelectorAll('[data-gallery-filter]')
          .forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        const filter = btn.dataset.galleryFilter;

        items.forEach(item => {

          item.style.display =
            filter === 'all' ||
            item.dataset.cat === filter
              ? ''
              : 'none';

        });

      });

    });


  // --------------------------------------------------
  // ПЕРЕХОД ИЗ КАРТОЧКИ КАТЕГОРИИ
  // --------------------------------------------------

  document
    .querySelectorAll('[data-filter]')
    .forEach(category => {

      category.addEventListener('click', () => {

        setTimeout(() => {

          document
            .querySelector(
              `[data-gallery-filter="${category.dataset.filter}"]`
            )
            ?.click();

        }, 50);

      });

    });


  // --------------------------------------------------
  // LIGHTBOX
  // --------------------------------------------------

  const box = document.querySelector('#lightbox');
  const img = document.querySelector('#lightbox-img');

  const open = src => {

    if (!box || !img) return;

    img.src = src;

    box.classList.add('open');

    document.body.style.overflow = 'hidden';

  };

  const close = () => {

    if (!box) return;

    box.classList.remove('open');

    document.body.style.overflow = '';

  };

  document
    .querySelectorAll('[data-full]')
    .forEach(item => {

      item.addEventListener('click', () => {

        open(item.dataset.full);

      });

    });


  document
    .querySelector('.lightbox-close')
    ?.addEventListener('click', close);


  box?.addEventListener('click', event => {

    if (event.target === box) {
      close();
    }

  });


  document.addEventListener('keydown', event => {

    if (event.key === 'Escape') {
      close();
    }

  });

}


loadSite().catch(err => {

  console.error(
    'Не удалось загрузить content/site.json',
    err
  );

});
