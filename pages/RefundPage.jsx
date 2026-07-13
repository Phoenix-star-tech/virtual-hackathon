import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function RefundPage() {
  useEffect(() => {
    document.querySelectorAll(".support-email-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (!isMobile) { e.preventDefault(); window.open("https://mail.google.com/mail/?view=cm&fs=1&to=vashiktechnology@gmail.com", "_blank"); }
      });
    });
  }, []);

  return (
    <div className="bg-slate-50 text-slate-800 antialiased font-sans min-h-screen flex flex-col">
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
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-purple">Legal</span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">Refund Policy</h1>
            <p className="text-sm text-slate-400 mt-2 font-medium">Last updated: July 8, 2026</p>
          </div>

          <div className="space-y-8 text-slate-600 leading-relaxed text-sm sm:text-base">
            <p className="text-slate-700 font-medium">All registration fees paid for Virtual Hackathon 2K26 — including Module 1 (₹9) and Module 2 (₹149 per member) — are strictly non-refundable under any circumstances, including but not limited to:</p>
            <ul className="space-y-3.5 pl-2">
              <li className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 shrink-0"></span><span>Voluntary withdrawal from the hackathon after registration</span></li>
              <li className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 shrink-0"></span><span>Failure to advance to the next module</span></li>
              <li className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 shrink-0"></span><span>Disqualification due to violation of the Terms of Service</span></li>
              <li className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 shrink-0"></span><span>Missed deadlines, tasks, or submissions</span></li>
              <li className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 shrink-0"></span><span>Technical issues on the participant's end (internet, device, etc.)</span></li>
            </ul>
            <p className="pt-2">The only exception is if <strong>VASHIK</strong> cancels a module entirely before it begins — in that case, a refund will be issued for that specific module's fee.</p>
            <p className="font-semibold text-slate-900 border-t border-slate-100 pt-6">By completing payment, you acknowledge and accept that your registration fee is final and non-refundable.</p>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-2 mt-8">
              <p className="font-bold text-slate-900">VASHIK Platform Support</p>
              <p className="text-sm">Kazipet, Warangal, Telangana</p>
              <p className="text-sm flex items-center gap-2 pt-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-purple"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <span>Email: <a href="mailto:vashiktechnology@gmail.com" className="text-brand-purple font-semibold hover:underline support-email-link">vashiktechnology@gmail.com</a></span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}