import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterModal() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleModule1 = () => {
    setOpen(false);
    navigate("/register");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-90 rounded-xl shadow-lg shadow-brand-blue/15 transition-all duration-300 hover:-translate-y-0.5"
      >
        Register Now
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-2xl border border-slate-100 shadow-2xl p-8 sm:p-10 max-w-sm mx-4 w-full relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink"></div>

            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <div className="text-center mb-6">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Choose a Module</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Select which module you want to register for</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleModule1}
                className="w-full group flex items-center justify-between p-4 rounded-xl border-2 border-brand-blue/20 bg-brand-blue/5 hover:bg-brand-blue/10 hover:border-brand-blue/40 transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:scale-105 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1 0-5H20"/><circle cx="12" cy="11" r="1"/><path d="M9 14v2"/><path d="M15 14v2"/></svg>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">Module 1: Online Tasks</span>
                    <span className="text-xs text-slate-500 font-medium">₹9 registration — 20 days of coding tasks</span>
                  </div>
                </div>
                <div className="text-brand-purple group-hover:translate-x-0.5 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg>
                </div>
              </button>

              <div className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-slate-50 opacity-60 select-none cursor-not-allowed text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-500 block">Module 2: 42h Online Sprint</span>
                    <span className="text-xs text-slate-400 font-medium">₹149/member — Team-based hackathon</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-200 px-2 py-0.5 rounded">Locked</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center mt-5 leading-relaxed">
              Module 2 unlocks after qualifying from Module 1. Top 3 performers advance automatically.
            </p>
          </div>
        </div>
      )}
    </>
  );
}