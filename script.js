// Navigation: mobile toggle & smooth scroll
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');
  if(navToggle){
    navToggle.addEventListener('click', ()=>{
      nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const target = document.querySelector(a.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        if(nav.classList.contains('open')) nav.classList.remove('open');
      }
    });
  });

  // Timeline reveal
  const items = document.querySelectorAll('.timeline-item');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
      }
    });
  },{threshold:0.12});
  items.forEach(i=>{i.classList.add('will-reveal');io.observe(i)});

  // Download CV fallback: if file missing, open mailto
  const cvBtn = document.querySelector('#download-cv');
  if(cvBtn){
    cvBtn.addEventListener('click',(e)=>{
      const href = cvBtn.getAttribute('href');
      // if no real file provided (still '#'), open email
      if(!href || href === '#'){
        e.preventDefault();
        window.location.href = 'mailto:mackfield@example.com?subject=Request%20for%20CV';
      }
    });
  }

  // History modal
  const openBtn = document.querySelector('#open-history');
  const modalOverlay = document.querySelector('#history-modal');
  const modalClose = modalOverlay ? modalOverlay.querySelector('.modal-close') : null;
  function openModal(){
    if(!modalOverlay) return;
    modalOverlay.classList.add('open');
    // focus first focusable element
    const focusable = modalOverlay.querySelector('button, a, [tabindex]');
    if(focusable) focusable.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    if(!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if(openBtn) openBtn.focus();
  }
  if(openBtn){
    openBtn.addEventListener('click',(e)=>{e.preventDefault();openModal();});
  }
  if(modalClose){
    modalClose.addEventListener('click',closeModal);
  }
  if(modalOverlay){
    modalOverlay.addEventListener('click',(e)=>{
      if(e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown',(e)=>{
    if(e.key === 'Escape') closeModal();
  });

  // Avatar upload & persistence (preview + localStorage)
  const avatarInput = document.querySelector('#avatar-input');
  const avatarRoot = document.querySelector('#avatar-root');
  const resumeAvatarImg = document.querySelector('#resume-avatar-img');
  const avatarImg = document.querySelector('#avatar-img');

  function setAvatarDataURL(dataUrl){
    if(avatarImg){ avatarImg.src = dataUrl; avatarImg.style.display = ''; }
    if(resumeAvatarImg){ resumeAvatarImg.src = dataUrl; resumeAvatarImg.style.display = ''; }
    // hide initials if present
    document.querySelectorAll('.avatar .initials').forEach(el=>el.style.display = 'none');
  }

  // load stored avatar
  try{
    const stored = localStorage.getItem('profile-avatar');
    if(stored){ setAvatarDataURL(stored); }
  }catch(e){ /* ignore */ }

  // load fallback file if present (Profile.png)
  if(!avatarImg || (avatarImg && avatarImg.style.display === 'none')){
    // leave to browser to load Profile.png from same folder
    // resume avatar already references Profile.png in HTML
  }

  if(avatarInput){
    avatarInput.addEventListener('change', (e)=>{
      const file = e.target.files && e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = function(ev){
        const dataUrl = ev.target.result;
        try{ localStorage.setItem('profile-avatar', dataUrl); }catch(err){}
        setAvatarDataURL(dataUrl);
      };
      reader.readAsDataURL(file);
    });
  }

  if(avatarRoot){
    avatarRoot.addEventListener('click', ()=>{
      if(avatarInput) avatarInput.click();
    });
    avatarRoot.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if(avatarInput) avatarInput.click(); } });
  }
});
