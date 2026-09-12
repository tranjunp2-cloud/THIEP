"use client";
import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "./use-scroll-reveal";
import Celebration from "./celebration";
import { WeddingMusic, type WeddingMusicHandle } from "./wedding-music";
import { ArrowDown } from "lucide-react";
export default function Home() {
 const rootRef=useRef<HTMLElement>(null);
 useScrollReveal(rootRef);
 const [opened,setOpened]=useState(false);
 const musicRef=useRef<WeddingMusicHandle>(null);
 function openInvitation(){setOpened(true);musicRef.current?.startOnOpen();}
 const [count,setCount]=useState([0,0,0,0]);
 useEffect(()=>{const tick=()=>{const n=Math.max(0,new Date('2027-06-12T17:00:00+02:00').getTime()-Date.now());setCount([Math.floor(n/86400000),Math.floor(n/3600000)%24,Math.floor(n/60000)%60,Math.floor(n/1000)%60])};tick();const id=setInterval(tick,1000);return()=>clearInterval(id)},[]);
 return <main id="top" ref={rootRef}>
 <WeddingMusic ref={musicRef}/>
 <nav className="desktop-nav" aria-label="Invitation navigation"><a href="#top" className="nav-monogram">C <i>&</i> A</a><div><a href="#celebration">The celebration</a><a href="#details">The details</a><a href="#rsvp">RSVP</a></div><span>12 . 06 . 2027</span></nav>
 <section className={`hero ${opened?'is-open':''}`} aria-label="Wedding invitation">
 <div className="hero-paper"><div className="hero-copy"><p className="eyebrow">The wedding of</p><h1>Camille <span>&</span> Antoine</h1><p className="hero-date">Saturday, 12 June 2027</p><p className="script">Burgundy, France</p></div></div>
 <div className="door door-left" aria-hidden="true"/><div className="door door-right" aria-hidden="true"/>
 <div className="envelope-copy"><p className="script">A beautiful day.<br/>A lifetime together.</p><button className="seal" onClick={openInvitation} aria-label="Open wedding invitation"><span>C<small>&</small>A</span></button><p className="eyebrow">You are cordially invited</p><button className="open-invitation" onClick={openInvitation}>Open the invitation <ArrowDown size={14}/></button></div>
 {opened&&<a className="discover" href="#celebration">Discover <ArrowDown size={15}/></a>}
 </section>
 <section className="countdown section" id="celebration"><p className="script">Every moment brings us closer</p><h2>Counting down to forever</h2><div className="count-grid">{count.map((v,i)=><div key={i}><strong>{String(v).padStart(2,'0')}</strong><span>{['Days','Hours','Minutes','Seconds'][i]}</span></div>)}</div></section>
 <section className="invitation section"><p className="script">Together with their families</p><h2>Camille Lefèvre<span className="script">and</span>Antoine Marchand</h2><p className="script">invite you to celebrate their marriage</p><p className="eyebrow">Saturday, 12 June 2027</p><div className="fine-rule"/><p>Surrounded by the gardens of Burgundy,<br/>and the people we love most.</p></section>
 <Celebration/>
 </main>
}
