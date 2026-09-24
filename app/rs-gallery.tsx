"use client";
import { useEffect, useRef, useState } from "react";
const works = [
 { id: "student-testimonial", title: "A student's perspective", description: "Shady Mohamed shares his experience at the Financial Accountant Workshop.", role: "Filming & editing", badge: "Organic + Paid", views: "742K", likes: "~1K", comments: "215", shares: "39", url: "https://www.facebook.com/reel/1538084490731890", note: "Combined organic and paid counts; breakdown unavailable." },
 { id: "cash-flow-workshop", title: "Cash flow, explained", description: "A moment from the financial statements workshop, captured as a short educational reel.", role: "", badge: "Organic", views: "124K", likes: "996", comments: "46", shares: "108", url: "https://www.facebook.com/reel/4395420284070934", note: "Organic performance · No paid promotion." },
];
export default function RSGallery() {
 const rail = useRef<HTMLDivElement>(null);
 const [paused,setPaused] = useState(false);
 const [playing,setPlaying] = useState(false);
 const [hovered,setHovered] = useState(false);
 const [focused,setFocused] = useState(false);
 const [reduced,setReduced] = useState(true);
 useEffect(() => { const q=window.matchMedia("(prefers-reduced-motion: reduce)"); const update=()=>setReduced(q.matches); update(); q.addEventListener("change",update); return ()=>q.removeEventListener("change",update); },[]);
 useEffect(() => {
  if(paused || playing || hovered || focused || reduced) return;
  const timer=window.setInterval(()=>{ const n=rail.current; if(!n || document.hidden || n.scrollWidth<=n.clientWidth+2)return; n.scrollTo({left:n.scrollLeft>=n.scrollWidth-n.clientWidth-8?0:n.scrollLeft+n.clientWidth*.85,behavior:"smooth"}); },5500);
  return ()=>window.clearInterval(timer);
 },[paused,playing,hovered,focused,reduced]);
 function move(direction:number){setPaused(true);rail.current?.scrollBy({left:direction*rail.current.clientWidth*.85,behavior:reduced?"auto":"smooth"});}
 return <section className="rs-gallery shell" id="rs-creative" aria-label="RS video and creative gallery">
  <div className="section-label"><span>02</span> Selected creative / RS</div>
  <div className="rs-gallery-heading"><div><h2>Stories in motion.</h2><p>Workshop moments. Real experiences. Visible engagement.</p></div><div className="rs-gallery-controls"><button onClick={()=>move(-1)} aria-label="Previous work">←</button><button onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?"Resume slides":"Pause slides"}</button><button onClick={()=>move(1)} aria-label="Next work">→</button></div></div>
  <div className="rs-rail" ref={rail} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false);}} onTouchStart={()=>setPaused(true)}>
   {works.map(work=><article className="rs-work" key={work.id}>
    <div className="rs-video-wrap"><video controls playsInline preload="none" poster={`/work/rs/${work.id}.jpg`} aria-label={work.title} onPlay={e=>{rail.current?.querySelectorAll("video").forEach(v=>{if(v!==e.currentTarget)v.pause();});setPlaying(true);}} onPause={()=>setPlaying(Array.from(rail.current?.querySelectorAll("video")??[]).some(v=>!v.paused))} onEnded={()=>setPlaying(false)}><source src={`/work/rs/${work.id}.mp4`} type="video/mp4"/>Your browser does not support video. Use the Facebook link below.</video><span className={`rs-performance ${work.badge==="Organic"?"organic":""}`}>{work.badge}</span></div>
    <div className="rs-work-copy"><h3>{work.title}</h3><p>{work.description}</p>{work.role&&<span className="rs-role">My role / {work.role}</span>}<dl className="rs-counts">{[["Views",work.views],["Likes",work.likes],["Comments",work.comments],["Shares",work.shares]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="rs-count-note">{work.note}<br/>Public counts captured September 24, 2026.</p><a href={work.url} target="_blank" rel="noreferrer">Watch on Facebook ↗</a></div>
   </article>)}
  </div><p className="rs-gallery-hint">Swipe or use the arrows to explore · Select a video to play</p>
 </section>;
}
