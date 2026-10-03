document.documentElement.classList.add("js-enabled");

const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = themeToggle?.querySelector(".theme-icon");
const themeLabel = themeToggle?.querySelector(".theme-label");
function applyTheme(theme){
  document.documentElement.dataset.theme=theme;
  const dark=theme==="dark";
  themeToggle?.setAttribute("aria-pressed",String(dark));
  if(themeIcon) themeIcon.textContent=dark?"☀":"☾";
  if(themeLabel) themeLabel.textContent=dark?"Light mode":"Dark mode";
}
const savedTheme=localStorage.getItem("bumi-theme");
if(savedTheme==="dark"||savedTheme==="light") applyTheme(savedTheme);
themeToggle?.addEventListener("click",()=>{
  const next=document.documentElement.dataset.theme==="dark"?"light":"dark";
  applyTheme(next);localStorage.setItem("bumi-theme",next);
});

const menuButton=document.querySelector(".menu-toggle");
const navigation=document.querySelector(".site-nav");
if(menuButton&&navigation){
  menuButton.addEventListener("click",()=>{const open=navigation.classList.toggle("is-open");menuButton.setAttribute("aria-expanded",String(open));menuButton.textContent=open?"Tutup":"Menu"});
  navigation.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{navigation.classList.remove("is-open");menuButton.setAttribute("aria-expanded","false");menuButton.textContent="Menu"}));
}

const aboutToggle=document.querySelector("#about-toggle");
const aboutExtra=document.querySelector("#about-extra");
aboutToggle?.addEventListener("click",()=>{const open=aboutExtra?.classList.toggle("is-open")??false;aboutToggle.setAttribute("aria-expanded",String(open));aboutToggle.textContent=open?"Tutup cerita ↑":"Lihat cerita lengkap ↓"});

const filterButtons=document.querySelectorAll(".filter-button");
const projectCards=document.querySelectorAll(".project-card");
const filterFeedback=document.querySelector("#filter-feedback");
filterButtons.forEach(button=>button.addEventListener("click",()=>{
  const filter=button.dataset.filter;filterButtons.forEach(item=>item.classList.remove("is-active"));button.classList.add("is-active");let count=0;
  projectCards.forEach(card=>{const show=filter==="all"||card.dataset.category===filter;card.classList.toggle("is-hidden",!show);if(show)count++});
  if(filterFeedback) filterFeedback.textContent=`Menampilkan ${count} project${filter==="all"?"":" kategori "+filter}.`;
}));

const modal=document.querySelector("#project-modal");
const modalTitle=document.querySelector("#modal-title");
const modalType=document.querySelector("#modal-type");
const modalDescription=document.querySelector("#modal-description");
const modalMeta=document.querySelector("#modal-meta");
let lastFocused=null;
const projectData={
  portfolio:{type:"Website",title:"Bumi Aksara Portfolio",description:"Portfolio personal yang menyatukan profil, pengalaman, layanan, dan project dalam satu halaman responsif.",meta:"Peran: struktur konten, desain, dan implementasi frontend."},
  campaign:{type:"Marketing",title:"Campaign Planning",description:"Contoh perencanaan campaign yang dimulai dari objective, audience, pesan, channel, hingga evaluasi.",meta:"Fokus: struktur berpikir dan eksekusi campaign."},
  landing:{type:"Website",title:"Small Business Landing Page",description:"Landing page sederhana yang membantu bisnis memperkenalkan layanan dan kanal kontak dengan lebih jelas.",meta:"Fokus: clarity, responsive layout, dan CTA."},
  business:{type:"Business",title:"Small Business Experiment",description:"Eksperimen untuk menguji ide, penawaran, dan cara berkomunikasi dengan calon pelanggan.",meta:"Fokus: problem, offer, test, learn, iterate."}
};
function openModal(key,trigger){const data=projectData[key];if(!modal||!data)return;lastFocused=trigger;if(modalType)modalType.textContent=data.type;if(modalTitle)modalTitle.textContent=data.title;if(modalDescription)modalDescription.textContent=data.description;if(modalMeta)modalMeta.textContent=data.meta;modal.classList.add("is-open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");modal.querySelector(".modal-close")?.focus()}
function closeModal(){if(!modal)return;modal.classList.remove("is-open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");lastFocused?.focus()}
document.querySelectorAll(".project-detail").forEach(button=>button.addEventListener("click",()=>openModal(button.dataset.project,button)));
document.querySelectorAll("[data-close-modal]").forEach(target=>target.addEventListener("click",closeModal));
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&modal?.classList.contains("is-open"))closeModal()});

const scrollProgress=document.querySelector("#scroll-progress-bar");
const backToTop=document.querySelector("#back-to-top");
function updateScrollUI(){const y=window.scrollY;const max=document.documentElement.scrollHeight-window.innerHeight;const progress=max>0?y/max*100:0;if(scrollProgress)scrollProgress.style.width=`${progress}%`;backToTop?.classList.toggle("is-visible",y>500)}
window.addEventListener("scroll",updateScrollUI,{passive:true});updateScrollUI();backToTop?.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

const navLinks=[...document.querySelectorAll(".site-nav a")];
const sections=[...document.querySelectorAll("main section[id]")];
if("IntersectionObserver" in window){
  const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;navLinks.forEach(link=>link.classList.toggle("is-active",link.getAttribute("href")===`#${entry.target.id}`))}),{rootMargin:"-35% 0px -55% 0px"});
  sections.forEach(section=>sectionObserver.observe(section));
}

const revealCards=document.querySelectorAll(".reveal-card");
if("IntersectionObserver" in window){const revealObserver=new IntersectionObserver((entries,observer)=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add("is-visible");observer.unobserve(entry.target)}),{threshold:.15});revealCards.forEach(card=>revealObserver.observe(card))}else{revealCards.forEach(card=>card.classList.add("is-visible"))}

const statNumbers=document.querySelectorAll(".stat-number");let statsAnimated=false;
function animateStats(){if(statsAnimated)return;statsAnimated=true;statNumbers.forEach(number=>{const target=Number(number.dataset.target||0);const duration=750;const start=performance.now();function tick(now){const p=Math.min((now-start)/duration,1);number.textContent=String(Math.round(target*p));if(p<1)requestAnimationFrame(tick)}number.textContent="0";requestAnimationFrame(tick)})}
const statsSection=document.querySelector(".stats-section");
if(statsSection&&"IntersectionObserver" in window){const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){animateStats();observer.disconnect()}},{threshold:.3});observer.observe(statsSection)}else{animateStats()}
