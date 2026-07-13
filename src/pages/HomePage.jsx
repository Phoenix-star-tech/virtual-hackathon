import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.png";
import qrCode from "../assets/qr_code.jpeg";

const faqs = [
  {
    q: "How does Module 1 online task system work?",
    a: "Once you register and log in, you will access 'My Tasks' in your dashboard. For 10 days, we assign daily targets consisting of 6 specific subtasks. Submitting these on time builds your points. The top 3 performers on the leaderboard secure immediate, free advancement to Module 2.",
  },
  {
    q: "Do I need a team to register for Module 1?",
    a: "No. Module 1 is completely individual. You register and solve subtasks on your own. During the transition to Module 2, you will form or join a team of 1 to 4 members to build your hackathon project.",
  },
  {
    q: "Are certificates provided to all participants?",
    a: "Yes! We believe participation and effort should be celebrated. Every participant who completes the daily tasks of Module 1 or submits a project in Module 2 receives an official digital participation certificate verified by VASHIK Platform.",
  },
  {
    q: "Where will the Module 3 Offline Finals be held?",
    a: "The location for the physical Grand Finale will be announced to the top 5 qualifying teams at the end of Module 2. Travel details, accommodation guidelines, and schedules will be coordinated directly.",
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const observerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.querySelectorAll(".support-email-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (!isMobile) {
          e.preventDefault();
          window.open("https://mail.google.com/mail/?view=cm&fs=1&to=vashiktechnology@gmail.com", "_blank");
        }
      });
    });

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".reveal-item").forEach((el) => observerRef.current.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-brand-blue/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none hidden lg:block"></div>

        <div className="hidden lg:block absolute top-12 right-12 w-3 h-3 border border-brand-blue/30 rotate-45 pointer-events-none"></div>
        <div className="hidden lg:block absolute top-1/3 left-8 w-px h-16 bg-white/[0.04] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-20 items-center pb-16 lg:pb-28">
            <div className="lg:col-span-7 text-center lg:text-left space-y-6 lg:space-y-8">

              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-9xl text-[#f0efec] leading-none tracking-tight">
                VIRTUAL<br />
                <span className="text-brand-blue">HACKATHON</span><br />
                2K26
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-[#888] max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Learn. Build. Solve. Shape the Future.<br className="hidden sm:inline" />
                Test your limits, build working prototypes, and win grand rewards.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <button onClick={() => navigate("/register")} className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-bold text-white bg-brand-blue hover:bg-brand-blueDark rounded-full shadow-lg shadow-brand-blue/20 transition-all duration-300 hover:-translate-y-0.5 text-center">
                  Register Now
                </button>
                <a href="#modules" className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-bold text-[#888] hover:text-[#f0efec] border border-white/[0.10] hover:border-white/[0.20] rounded-full transition-all duration-300 text-center">
                  Explore Modules
                </a>
              </div>

              <div className="flex sm:hidden items-center justify-center space-x-8 pt-4 border-t border-white/[0.06] mt-6">
                <div className="text-center">
                  <div className="font-display text-3xl text-[#f0efec] leading-none">10+</div>
                  <div className="text-[9px] text-[#555] tracking-[0.15em] uppercase mt-1 font-semibold">Days of Tasks</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-3xl text-[#f0efec] leading-none">42h</div>
                  <div className="text-[9px] text-[#555] tracking-[0.15em] uppercase mt-1 font-semibold">Hackathon</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-3xl text-[#f0efec] leading-none">5+</div>
                  <div className="text-[9px] text-[#555] tracking-[0.15em] uppercase mt-1 font-semibold">Finalist Teams</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center w-full lg:mt-0">
              <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl relative">
                <div className="relative aspect-[4/3] xl:max-h-[420px] rounded-2xl bg-[#111] border border-white/[0.06] p-2 sm:p-4 shadow-2xl overflow-hidden">
                  <div className="w-full h-full rounded-xl bg-[#0a0a0a] flex flex-col overflow-hidden text-[10px] sm:text-[12px] font-mono text-[#666] border border-white/[0.04]">
                    <div className="flex items-center justify-between px-4 py-3 bg-[#050505] border-b border-white/[0.06]">
                      <div className="flex space-x-2">
                        <span className="w-3 h-3 rounded-full bg-[#555]"></span>
                        <span className="w-3 h-3 rounded-full bg-[#555]"></span>
                        <span className="w-3 h-3 rounded-full bg-brand-blue"></span>
                      </div>
                      <div className="text-[#444] text-xs select-none">hack2k26.js</div>
                      <div className="w-8"></div>
                    </div>
                    <div className="p-5 flex-1 space-y-2 select-none overflow-hidden">
                      <div className="text-[#444]">// Initialize Virtual Hackathon 2K26</div>
                      <div><span className="text-brand-blue font-semibold">import</span> {"{"} hackathon {"}"} <span className="text-brand-blue font-semibold">from</span> <span className="text-[#999]">'vashik-platform'</span>;</div>
                      <div className="pt-2"><span className="text-[#aaa] font-semibold">const</span> event = hackathon.create({"{"}</div>
                      <div className="pl-4">year: <span className="text-[#aaa]">2026</span>,</div>
                      <div className="pl-4">phases: [<span className="text-[#999]">'OnlineTasks'</span>, <span className="text-[#999]">'42hSprint'</span>, <span className="text-[#999]">'GrandFinals'</span>],</div>
                      <div className="pl-4">prizes: <span className="text-[#999]">'Cash + Hamper + Recognition'</span></div>
                      <div className="text-[#666]">{"}"});</div>
                      <div className="pt-2 text-[#444]">// Start the challenge</div>
                      <div>event.registerParticipant({'{'}</div>
                      <div className="pl-4">status: <span className="text-[#999]">'Ready'</span>,</div>
                      <div className="pl-4">goals: [<span className="text-[#999]">'Code'</span>, <span className="text-[#999]">'Create'</span>, <span className="text-[#999]">'Compete'</span>, <span className="text-[#999]">'Conquer'</span>]</div>
                      <div>{"}"});</div>
                      <div className="pt-3 flex items-center text-brand-blue">
                        <span className="animate-pulse">❯</span>
                        <span className="ml-2 text-[#555]">npm run conquer</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-[#111] border border-white/[0.08] rounded-2xl p-4 shadow-xl flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /><path d="M22 4 15.477 2 12 5 8.523 2 2 4 3.5 9.5 4 10" /><path d="M12 2v3" /></svg>
                  </div>
                  <div>
                    <div className="text-xs text-[#555] font-medium">Grand Cash Prize</div>
                    <div className="text-sm font-bold text-[#f0efec]">For Winners</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex absolute bottom-10 left-4 sm:left-8 lg:left-12 space-x-12 lg:space-x-16">
          <div>
            <div className="font-display text-4xl sm:text-5xl text-[#f0efec] leading-none">10+</div>
            <div className="text-[10px] sm:text-xs text-[#555] tracking-[0.15em] uppercase mt-1 font-semibold">Days of Tasks</div>
          </div>
          <div>
            <div className="font-display text-4xl sm:text-5xl text-[#f0efec] leading-none">42h</div>
            <div className="text-[10px] sm:text-xs text-[#555] tracking-[0.15em] uppercase mt-1 font-semibold">Hackathon</div>
          </div>
          <div>
            <div className="font-display text-4xl sm:text-5xl text-[#f0efec] leading-none">5+</div>
            <div className="text-[10px] sm:text-xs text-[#555] tracking-[0.15em] uppercase mt-1 font-semibold">Finalist Teams</div>
          </div>
        </div>
      </section>

      <section className="bg-brand-blue py-5 text-white text-center font-semibold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
          </div>
          <p className="text-xs sm:text-sm tracking-wide">
            <strong>Every Participant Matters:</strong> Earn official digital participation certificates for competing in Module 1 & Module 2!
          </p>
        </div>
      </section>

      <section id="modules" className="py-20 sm:py-28 bg-[#0a0a0a] relative">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-blue/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 reveal-item">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#f0efec] tracking-tight">Three Progressive Modules</h2>
            <div className="w-16 h-1 bg-brand-blue mx-auto mt-4"></div>
            <p className="text-[#666] mt-4 text-base sm:text-lg font-medium">A phased journey designed to test your knowledge, focus, speed, and real-world execution.</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-px bg-white/[0.06] hidden md:block"></div>
            <div className="space-y-12 md:space-y-20">

              <div className="relative flex flex-col md:flex-row items-center reveal-item">
                <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#111] border-2 border-brand-blue flex items-center justify-center text-brand-blue shadow-lg shadow-brand-blue/10 z-10 hidden md:flex">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div className="w-full md:w-1/2 md:pr-14 md:text-right">
                  <div className="bg-[#111] p-6 sm:p-8 rounded-2xl border border-white/[0.06] shadow-xl hover:border-white/[0.10] transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 left-0 h-1 bg-brand-blue"></div>
                    <div className="flex items-center space-x-3 md:justify-end mb-4">
                      <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1 0-5H20" /><path d="M12 11v4" /><path d="M8 13h8" /></svg>
                      </div>
                      <h3 className="text-lg font-bold text-[#f0efec]">Module 1: Online Tasks</h3>
                    </div>
                    <p className="text-[#666] text-sm leading-relaxed mb-6">Begin your coding journey with small, curated coding tasks delivered daily. Learn consistent habits, test algorithmic skills, and unlock the basics.</p>
                    <div className="grid grid-cols-2 gap-4 text-left border-t border-white/[0.06] pt-5">
                      <div><span className="text-[10px] text-[#555] font-semibold uppercase tracking-wider">Fee</span><p className="text-base font-bold text-[#aaa]">₹149 / Member</p></div>
                      <div><span className="text-[10px] text-[#555] font-semibold uppercase tracking-wider">Timeline</span><p className="text-base font-bold text-[#f0efec]">10 Days</p></div>
                      <div><span className="text-[10px] text-[#555] font-semibold uppercase tracking-wider">Daily Target</span><p className="text-base font-bold text-[#f0efec]">10 Tasks (6 subtasks/day)</p></div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 md:pl-14 hidden md:block"></div>
              </div>

              <div className="relative flex flex-col md:flex-row-reverse items-center reveal-item">
                <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#111] border-2 border-[#555] flex items-center justify-center text-[#555] shadow-lg z-10 hidden md:flex">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div className="w-full md:w-1/2 md:pl-14">
                  <div className="bg-[#111] p-6 sm:p-8 rounded-2xl border border-white/[0.06] shadow-xl hover:border-white/[0.10] transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 left-0 h-1 bg-[#555]"></div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-white/5 text-[#555] rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                      </div>
                      <h3 className="text-lg font-bold text-[#f0efec]">Module 2: 42h Online Sprint</h3>
                    </div>
                    <p className="text-[#666] text-sm leading-relaxed mb-6">Form your squad and enter a highly-focused 42-hour online hackathon. Solve major problem statements, build standard prototypes, and pitch.</p>
                    <div className="grid grid-cols-2 gap-4 text-left border-t border-white/[0.06] pt-5">
                      <div><span className="text-[10px] text-[#555] font-semibold uppercase tracking-wider">Duration</span><p className="text-base font-bold text-[#f0efec]">42 Hours (2 days)</p></div>
                      <div><span className="text-[10px] text-[#555] font-semibold uppercase tracking-wider">Team Size</span><p className="text-base font-bold text-[#f0efec]">1 - 4 Members</p></div>
                      <div><span className="text-[10px] text-[#555] font-semibold uppercase tracking-wider">Advancement</span><p className="text-base font-bold text-brand-blue">Top 5 Teams advance</p></div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 md:pr-14 hidden md:block"></div>
              </div>

              <div className="relative flex flex-col md:flex-row items-center reveal-item">
                <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#111] border-2 border-[#888] flex items-center justify-center text-[#888] shadow-lg z-10 hidden md:flex">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div className="w-full md:w-1/2 md:pr-14 md:text-right">
                  <div className="bg-[#111] p-6 sm:p-8 rounded-2xl border border-white/[0.06] shadow-xl hover:border-white/[0.10] transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 left-0 h-1 bg-[#888]"></div>
                    <div className="flex items-center space-x-3 md:justify-end mb-4">
                      <div className="p-2 bg-white/5 text-[#888] rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 9 2 12 2s5 2 7.5 2.5a2.5 2.5 0 0 1 0 5H18" /><path d="M18 21h-5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2Z" /><path d="M12 18h-1.5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2H12" /></svg>
                      </div>
                      <h3 className="text-lg font-bold text-[#f0efec]">Module 3: Offline Grand Finale</h3>
                    </div>
                    <p className="text-[#666] text-sm leading-relaxed mb-6">The ultimate showdown. The top 5 teams gather in-person to build, expand, and pitch their projects before a jury of industry leaders.</p>
                    <div className="grid grid-cols-2 gap-4 text-left border-t border-white/[0.06] pt-5">
                      <div><span className="text-[10px] text-[#555] font-semibold uppercase tracking-wider">Finalists</span><p className="text-base font-bold text-[#aaa]">5 Teams</p></div>
                      <div><span className="text-[10px] text-[#555] font-semibold uppercase tracking-wider">Format</span><p className="text-base font-bold text-[#f0efec]">In-Person/Offline</p></div>
                      <div><span className="text-[10px] text-[#555] font-semibold uppercase tracking-wider">Winners</span><p className="text-base font-bold text-brand-blue">2 Teams</p></div>
                      <div><span className="text-[10px] text-[#555] font-semibold uppercase tracking-wider">Prizes</span><p className="text-base font-bold text-[#f0efec]">Cash + Hampers + Certificates</p></div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 md:pl-14 hidden md:block"></div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section id="prizes" className="py-20 sm:py-28 bg-[#111] border-y border-white/[0.06] relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/[0.02] via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 reveal-item">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#f0efec] tracking-tight">Winner Rewards</h2>
            <div className="w-16 h-1 bg-brand-blue mx-auto mt-4"></div>
            <p className="text-[#666] mt-4 text-base sm:text-lg font-medium">Compete hard to conquer the peak and win premium physical and financial payouts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-[#0a0a0a] p-8 sm:p-10 rounded-2xl border border-white/[0.06] shadow-xl transition-transform duration-300 hover:-translate-y-1 relative overflow-hidden group reveal-item">
              <div className="absolute top-4 right-4 bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">1st Winner</div>
              <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.477 12.89 17 22l-5-2-5 3 1.523-9.11" /><path d="M22 4 15.477 2 12 5 8.523 2 2 4 3.5 9.5 4 10" /><path d="M12 2v3" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-[#f0efec] mb-2">Grand Cash Prize</h3>
              <p className="text-[#666] text-sm mb-6 font-medium">Awarded to the ultimate champion team demonstrating perfect implementation, execution, and presentation.</p>
              <div className="border-t border-white/[0.06] pt-6">
                <span className="text-[10px] text-[#555] font-bold tracking-wide uppercase">Reward Package</span>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center text-[#aaa] text-sm font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue mr-2"><polyline points="20 6 9 17 4 12" /></svg>Lump Sum Cash Reward</li>
                  <li className="flex items-center text-[#aaa] text-sm font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue mr-2"><polyline points="20 6 9 17 4 12" /></svg>Champion Trophy & Medals</li>
                  <li className="flex items-center text-[#aaa] text-sm font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue mr-2"><polyline points="20 6 9 17 4 12" /></svg>Achievement Certificate of Honor</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#0a0a0a] p-8 sm:p-10 rounded-2xl border border-white/[0.06] shadow-xl transition-transform duration-300 hover:-translate-y-1 relative overflow-hidden group reveal-item">
              <div className="absolute top-4 right-4 bg-white/5 text-[#888] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">2nd Winner</div>
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#888] mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-[#f0efec] mb-2">Grand Hamper Prize</h3>
              <p className="text-[#666] text-sm mb-6 font-medium">Awarded to the runner-up team demonstrating exceptional grit, clean architectural code, and dynamic design features.</p>
              <div className="border-t border-white/[0.06] pt-6">
                <span className="text-[10px] text-[#555] font-bold tracking-wide uppercase">Reward Package</span>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center text-[#aaa] text-sm font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue mr-2"><polyline points="20 6 9 17 4 12" /></svg>Premium Tech Swag Hampers</li>
                  <li className="flex items-center text-[#aaa] text-sm font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue mr-2"><polyline points="20 6 9 17 4 12" /></svg>Runner-Up Medals</li>
                  <li className="flex items-center text-[#aaa] text-sm font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue mr-2"><polyline points="20 6 9 17 4 12" /></svg>Achievement Certificate of Honor</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-[#0a0a0a] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 reveal-item">
          <div className="bg-[#111] border border-white/[0.06] rounded-2xl shadow-xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left flex-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#f0efec]">Join the Developer Community</h3>
              <p className="text-[#666] text-sm sm:text-base leading-relaxed">Get instant updates on daily subtasks, team match-making alerts, and direct mentoring from the VASHIK Platform squad.</p>
              <div className="pt-2">
                <a href="https://chat.whatsapp.com/GvvCi8XBPqtGgHsMF4BlLj" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 px-6 py-3.5 text-sm font-bold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-[#25D366]/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  <span>Join our WhatsApp Group</span>
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-[#0a0a0a] border border-white/[0.06] rounded-2xl w-44 h-44 shrink-0">
              <img src={qrCode} alt="WhatsApp QR Code Scanner" className="w-28 h-28 object-contain" />
              <span className="text-[10px] text-[#555] font-bold uppercase tracking-wider mt-3 select-none">Scan to Join</span>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 sm:py-28 bg-[#111] border-t border-white/[0.06] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal-item">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#f0efec] tracking-tight">Frequently Asked Questions</h2>
            <div className="w-16 h-1 bg-brand-blue mx-auto mt-4"></div>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto reveal-item">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? "bg-[#0a0a0a] border-white/[0.10] shadow-lg" : "bg-[#0a0a0a]/50 border-white/[0.04]"
        }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left flex items-center justify-between text-[#ccc] font-semibold focus:outline-none"
      >
        <span className="pr-4">{question}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-[#555] shrink-0 transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? "200px" : "0" }}
      >
        <p className="px-6 pb-5 text-[#666] text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}


