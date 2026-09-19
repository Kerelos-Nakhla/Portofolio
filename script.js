document.addEventListener("DOMContentLoaded",()=>{
  const root=document.documentElement, toggle=document.getElementById("themeToggle");
  const saved=localStorage.getItem("portfolio-theme");
  if(saved) root.dataset.theme=saved;
  const sync=()=>{const dark=root.dataset.theme==="dark";toggle.querySelector(".theme-icon").textContent=dark?"☀":"☾";toggle.querySelector(".theme-text").textContent=dark?"Light":"Dark";document.querySelector('meta[name="theme-color"]').content=dark?"#101010":"#f4f1ea"};
  sync();
  toggle.addEventListener("click",()=>{root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";localStorage.setItem("portfolio-theme",root.dataset.theme);sync()});

  const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");reveal.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>reveal.observe(el));

  document.querySelectorAll("[data-count]").forEach(el=>{
    const target=+el.dataset.count; let start=0; const step=()=>{start+=Math.max(1,Math.ceil(target/24));el.textContent=Math.min(start,target);if(start<target)requestAnimationFrame(step)}; 
    const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){step();obs.disconnect()}}),{threshold:.8});obs.observe(el);
  });

  const bar=document.querySelector(".scroll-progress");
  addEventListener("scroll",()=>{const h=document.documentElement.scrollHeight-innerHeight;bar.style.width=(h?scrollY/h*100:0)+"%"},{passive:true});

  const dot=document.querySelector(".cursor-dot"),ring=document.querySelector(".cursor-ring");
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`},{passive:true});
  const cursorLoop=()=>{rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(cursorLoop)};cursorLoop();
  document.querySelectorAll("a,button,.project-card,.magnetic").forEach(el=>{el.addEventListener("mouseenter",()=>ring.classList.add("active"));el.addEventListener("mouseleave",()=>ring.classList.remove("active"))});
});