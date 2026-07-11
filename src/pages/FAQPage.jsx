import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFaqsApi } from "../api/faq";

const fallbackFaqs = [
  { question: "How does Module 1 online task system work?", answer: "Once you register and log in, you will access 'My Tasks' in your dashboard. For 20 days, we assign daily targets consisting of 6 specific subtasks. Submitting these on time builds your points. The top 3 performers on the leaderboard secure immediate, free advancement to Module 2." },
  { question: "Do I need a team to register for Module 1?", answer: "No. Module 1 is completely individual. You register and solve subtasks on your own. During the transition to Module 2, you will form or join a team of 1 to 4 members to build your hackathon project." },
  { question: "Are certificates provided to all participants?", answer: "Yes! We believe participation and effort should be celebrated. Every participant who completes the daily tasks of Module 1 or submits a project in Module 2 receives an official digital participation certificate verified by VASHIK Platform." },
  { question: "Where will the Module 3 Offline Finals be held?", answer: "The location for the physical Grand Finale will be announced to the top 5 qualifying teams at the end of Module 2. Travel details, accommodation guidelines, and schedules will be coordinated directly." },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState(fallbackFaqs);

  useEffect(() => {
    getFaqsApi()
      .then((data) => {
        if (data && data.length) setFaqs(data.map((f) => ({ question: f.question, answer: f.answer })));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-slate-50 text-slate-800 antialiased font-sans min-h-screen flex flex-col">
      <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] bg-brand-blue/5 rounded-full filter blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] bg-brand-pink/5 rounded-full filter blur-[80px] pointer-events-none"></div>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 sm:py-16 relative z-10 w-full">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-brand-purple transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink"></div>
          <div className="border-b border-slate-100 pb-8 mb-8">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-purple">Help Desk</span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">Frequently Asked Questions</h1>
            <p className="text-sm text-slate-400 mt-2 font-medium">Last updated: July 8, 2026</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          <div className="mt-12 bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Still have questions?</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Can't find the answer you're looking for? Reach out directly.</p>
            </div>
            <a href="mailto:vashiktechnology@gmail.com" className="support-email-link px-5 py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-95 rounded-xl shadow-md transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap">
              Contact Support Desk
            </a>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-slate-400 border-t border-slate-100 bg-white/40 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>&copy; 2026 VASHIK. All rights reserved. — Virtual Hackathon 2K26</div>
          <div className="flex space-x-6">
            <Link to="/terms" className="hover:text-brand-purple transition-colors font-medium">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-brand-purple transition-colors font-medium">Privacy Policy</Link>
            <Link to="/refund" className="hover:text-brand-purple transition-colors font-medium">Refund Policy</Link>
            <Link to="/faq" className="hover:text-brand-purple transition-colors font-medium font-semibold text-brand-purple">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "bg-white shadow-md shadow-slate-100/50 border-slate-200/60" : "bg-slate-50/50 border-slate-100"}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-6 py-5 text-left flex items-center justify-between text-slate-800 font-bold focus:outline-none">
        <span className="pr-4">{question}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: isOpen ? "200px" : "0" }}>
        <p className="px-6 pb-5 text-slate-600 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}