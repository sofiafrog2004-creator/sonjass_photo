async function loadSite(){

const res = await fetch("./content/site.json?t=" + Date.now());
const d = await res.json();

const $ = id => document.getElementById(id);


// ОСНОВА

if($("brand")) $("brand").innerHTML = d.brand.replace("_","<br>");

if($("city")) $("city").textContent = d.city;

if($("heroTitle")){
$("heroTitle").innerHTML = d.heroTitle.replaceAll(" ","<br>");
}

if($("heroText"))
$("heroText").textContent=d.heroText;


if($("heroImage"))
$("heroImage").src=d.heroImage;



// ABOUT

if($("aboutImage"))
$("aboutImage").src=d.aboutImage;

if($("aboutTitle"))
$("aboutTitle").textContent=d.aboutTitle;

if($("aboutRole"))
$("aboutRole").textContent=d.aboutRole;

if($("aboutText"))
$("aboutText").textContent=d.aboutText;



// СТАТИСТИКА

if($("years"))
$("years").textContent=d.years;

if($("yearsLabel"))
$("yearsLabel").textContent=d.yearsLabel;

if($("love"))
$("love").textContent=d.love;

if($("loveLabel"))
$("loveLabel").textContent=d.loveLabel;



// ФОТО

const works=d.works || [];


const selected=document.getElementById("selectedGrid");

if(selected){

selected.innerHTML=works.map((w,i)=>`

<button class="photo-card ${i%3===0?"tall":""}" data-full="${w.image}">
<img src="${w.image}">
</button>

`).join("");

}



const gallery=document.getElementById("galleryGrid");

if(gallery){

gallery.innerHTML=works.map(w=>`

<button class="gallery-item"
data-cat="${w.category}"
data-full="${w.image}">

<img src="${w.image}">

</button>

`).join("");

}



// ОТЗЫВЫ

const reviews=document.getElementById("reviewsGrid");

if(reviews){

reviews.innerHTML=(d.reviews || []).map(r=>`

<article class="review">

<div class="quote">“</div>

<blockquote>
${r.text}
</blockquote>

<p>
— ${r.author}
</p>

</article>

`).join("");

}



// КОНТАКТЫ

if($("email")){

$("email").href="mailto:"+d.email;
$("email").textContent=d.email;

}


if($("telegram")){
$("telegram").href=d.telegram;
}


if($("instagram")){
$("instagram").href=d.instagram;
}



}


loadSite()
.catch(e=>console.error(e));
