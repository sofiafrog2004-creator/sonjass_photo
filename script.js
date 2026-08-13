async function loadSite(){

try {

const res = await fetch('/content/site.json?t=' + Date.now());

if(!res.ok){
throw new Error('site.json не найден');
}

const d = await res.json();


const $ = id => document.getElementById(id);


// ======================
// ОСНОВА
// ======================

$('brand').innerHTML =
(d.brand || '').replace('_','<br>');

$('city').textContent =
d.city || '';

$('heroTitle').innerHTML =
(d.heroTitle || '')
.replace(' ','<br>')
.replace(' ','<br>');

$('heroText').textContent =
d.heroText || '';

$('heroImage').src =
d.heroImage || '';



$('aboutImage').src =
d.aboutImage || '';

$('aboutTitle').textContent =
d.aboutTitle || '';

$('aboutRole').textContent =
d.aboutRole || '';

$('aboutText').textContent =
d.aboutText || '';



$('years').textContent =
d.years || '';

$('yearsLabel').textContent =
d.yearsLabel || '';

$('love').textContent =
d.love || '';

$('loveLabel').textContent =
d.loveLabel || '';



// ======================
// ФОТО
// ======================


const works = d.works || [];



$('filmStrip').innerHTML =
works.map(w=>`

<img src="${w.image}">

`).join('');



$('selectedGrid').innerHTML =
works.map((w,i)=>`

<button class="photo-card"
data-full="${w.image}">

<img src="${w.image}"
alt="${w.alt || ''}">

</button>

`).join('');



$('galleryGrid').innerHTML =
works.map(w=>`

<button class="gallery-item"
data-cat="${w.category}"
data-full="${w.image}">

<img src="${w.image}"
alt="${w.alt || ''}">

</button>

`).join('');




// ======================
// КАТЕГОРИИ
// ======================


const categories =
d.categories || [];


$('categories').innerHTML =
categories.map(c=>`

<div class="category-card"
data-filter="${c.slug}">

<img src="${c.image}">

<h3>${c.name}</h3>

</div>

`).join('');




// ======================
// УСЛУГИ
// ======================


$('servicesGrid').innerHTML =
(d.services || [])
.map(s=>`

<article>

<span>${s.number}</span>

<h3>${s.title}</h3>

<p>${s.text}</p>

</article>

`).join('');




// ======================
// ФИЛЬТРЫ
// ======================


$('filters').innerHTML =

`
<button class="active"
data-gallery-filter="all">
ВСЕ
</button>
`

+

categories.map(c=>`

<button data-gallery-filter="${c.slug}">
${c.name}
</button>

`).join('');




// ======================
// ОТЗЫВЫ
// ======================


$('reviewsGrid').innerHTML =

(d.reviews || [])
.map(r=>`

<article class="review">

<div class="quote">
“
</div>

<blockquote>
${r.text}
</blockquote>

<p>
— ${r.author}
</p>

</article>

`).join('');




// ======================
// КОНТАКТЫ
// ======================


const email =
document.getElementById('email');


if(email){

email.href =
'mailto:' + d.email;

email.textContent =
d.email;

}


const telegram =
document.getElementById('telegram');


if(telegram){

telegram.href =
d.telegram;

}



const instagram =
document.getElementById('instagram');


if(instagram){

instagram.href =
d.instagram;

}




initInteractions();


}

catch(e){

console.error(
'Ошибка загрузки:',
e
);

}

}





function initInteractions(){



// фильтры

document
.querySelectorAll('[data-gallery-filter]')
.forEach(btn=>{


btn.onclick=()=>{


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


};


});




// категории

document
.querySelectorAll('[data-filter]')
.forEach(card=>{


card.onclick=()=>{


document
.querySelector(
`[data-gallery-filter="${card.dataset.filter}"]`
)
?.click();


};


});




// lightbox


const box =
document.querySelector('#lightbox');

const img =
document.querySelector('#lightbox-img');



document
.querySelectorAll('[data-full]')
.forEach(el=>{


el.onclick=()=>{


img.src =
el.dataset.full;


box.classList.add('open');

document.body.style.overflow='hidden';


};


});



document
.querySelector('.lightbox-close')
?.addEventListener('click',()=>{


box.classList.remove('open');

document.body.style.overflow='';


});



}



loadSite();
