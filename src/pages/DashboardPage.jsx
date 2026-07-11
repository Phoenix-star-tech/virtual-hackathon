import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getProfileApi } from "../api/users";
import logo from "../assets/logo.png";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [moduleStatus, setModuleStatus] = useState("Module 1");

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    loadProfile();
  }, [user, navigate]);

  async function loadProfile() {
    try {
      const data = await getProfileApi(user.user_id);
      setProfile(data);
      setModuleStatus(data.module_status);
    } catch {
      // fallback to user metadata
      setProfile({
        full_name: user.full_name || "Developer",
        email: user.email || "",
        phone: "N/A",
        college: "N/A",
      });
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const stepper = (() => {
    if (moduleStatus === "Module 1") return { step1: "active", step2: "locked", step3: "locked" };
    if (moduleStatus === "Module 2") return { step1: "done", step2: "active", step3: "locked" };
    if (moduleStatus === "Module 3") return { step1: "done", step2: "done", step3: "active" };
    return { step1: "active", step2: "locked", step3: "locked" };
  })();

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-purple border-t-transparent animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Securing environment & loading credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 antialiased font-sans min-h-screen flex flex-col">
      <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <a href="/" className="flex items-center space-x-3 group">
              <img src={logo} alt="Virtual Hack 2K26 Logo" className="w-10 h-10 rounded-full object-contain bg-white p-0.5 border border-slate-100 transition-transform duration-300 group-hover:scale-105" />
              <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent uppercase">VIRTUAL HACK 2K26</span>
            </a>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Portal</span>
              <span className="text-sm font-extrabold text-slate-800">Developer Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={handleLogout} className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-xl transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="bg-gradient-to-r from-slate-900 via-brand-blue to-brand-blueDark p-6 sm:p-8 rounded-2xl text-white shadow-xl shadow-brand-blue/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-brand-pink font-semibold text-xs tracking-wider uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse"></span>
              <span>Online Mode</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Welcome back, <span id="user-display-name">{profile?.full_name || "Developer"}</span>!</h1>
            <p className="text-white/70 text-xs sm:text-sm mt-1 max-w-xl">Track your tasks, form your teams, and advance through the module progression to achieve final victory.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 shrink-0 border border-white/10 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-brand-pink/20 flex items-center justify-center text-brand-pink">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.477 12.89 17 22l-5-2-5 3 1.523-9.11"/><path d="M22 4 15.477 2 12 5 8.523 2 2 4 3.5 9.5 4 10"/><path d="M12 2v3"/></svg>
            </div>
            <div>
              <div className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Current Stage</div>
              <div className="text-base font-extrabold text-white">{moduleStatus}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-md">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-purple"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Progression Roadmap</span>
              </h3>
              <div className="relative pl-6 space-y-8">
                <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                <Step num={1} label="Module 1: Online Tasks" desc="Solve daily subtasks & earn points." status={stepper.step1} />
                <Step num={2} label="Module 2: 42h Online Sprint" desc="Squad-based project hacking." status={stepper.step2} />
                <Step num={3} label="Module 3: Offline Finals" desc="In-person pitch and grand rewards." status={stepper.step3} />
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-md">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>Profile Credentials</span>
              </h3>
              <div className="space-y-4">
                <div><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span><span className="text-sm font-semibold text-slate-700">{profile?.full_name || "-"}</span></div>
                <div><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span><span className="text-sm font-semibold text-slate-700">{profile?.email || "-"}</span></div>
                <div><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span><span className="text-sm font-semibold text-slate-700">{profile?.phone || "-"}</span></div>
                <div><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">College / Org</span><span className="text-sm font-semibold text-slate-700">{profile?.college || "-"}</span></div>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed border-t border-slate-100 pt-4">
                  * To edit your registered profile metadata, contact our support desk at <a href="mailto:vashiktechnology@gmail.com" className="support-email-link text-brand-purple hover:underline">vashiktechnology@gmail.com</a>.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-pink"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/></svg>
                    <span>Module 1 Tasks</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Daily targets: 6 subtasks each day</p>
                </div>
                <div className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-150 px-3.5 py-1.5 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  <span className="text-xs font-bold text-slate-700">Leaderboard Rank: <span className="text-brand-purple font-extrabold">#14</span></span>
                </div>
              </div>
              <div className="space-y-4">
                <TaskItem title="Day 1: Environmental Setup & Git Init" desc="Configure workspace, commit code, and push metadata schemas." status="completed" />
                <TaskItem title="Day 2: Authentication Handshakes" desc="Integrate auth forms with client tokens and mock database redirects." status="completed" />
                <TaskItem title="Day 3: Relational Tables & RLS Policies" desc="Configure profile schema triggers and write security rules." status="active" extra="6 subtasks remaining" />
                <TaskItem title="Day 4: Real-time Database Subscriptions" desc="Receive immediate broadcasts of messages and leaderboard points changes." status="locked" />
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-md relative overflow-hidden group">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>My Hackathon Squad</span>
              </h3>
              <div className="p-6 sm:p-8 rounded-xl bg-slate-50 border border-slate-100 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h4 className="text-base font-bold text-slate-700">Team Module Locked</h4>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    Formation of squads and collaborative team interfaces unlock upon qualifying for **Module 2 (42h Sprint)**. Continue solving Module 1 tasks to qualify!
                  </p>
                </div>
                <div className="pt-2">
                  <a href="#modules" className="inline-flex items-center space-x-2 text-xs font-bold text-brand-blue hover:text-brand-purple transition-colors">
                    <span>How to qualify for Module 2?</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-100 bg-white/40 mt-12">
        &copy; 2026 VASHIK Platform. All rights reserved.
      </footer>
    </div>
  );
}

function Step({ label, desc, status }) {
  const colors = {
    active: { node: "border-brand-purple bg-white", title: "text-slate-800", badge: "bg-brand-purple/10 text-brand-purple" },
    done: { node: "border-emerald-500 bg-emerald-500", title: "text-slate-500 line-through", badge: "bg-emerald-50 text-emerald-600" },
    locked: { node: "border-slate-200 bg-white", title: "text-slate-500", badge: "bg-slate-100 text-slate-400" },
  };
  const c = colors[status] || colors.locked;
  return (
    <div className="relative flex items-start group">
      <div className={`absolute left-[-23px] w-[18px] h-[18px] rounded-full border-4 flex items-center justify-center z-10 ${c.node}`}>
        {status === "done" && (
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        )}
      </div>
      <div>
        <h4 className={`text-sm font-bold leading-none ${c.title}`}>{label}</h4>
        <p className="text-xs text-slate-400 mt-1 font-medium">{desc}</p>
        <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge}`}>
          {status === "active" ? "Active" : status === "done" ? "Completed" : "Locked"}
        </span>
      </div>
    </div>
  );
}

function TaskItem({ title, desc, status, extra }) {
  if (status === "locked") {
    return (
      <div className="flex items-start space-x-4 p-4 opacity-60 border border-slate-50 rounded-xl select-none">
        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-500 leading-tight">{title}</h4>
          <p className="text-xs text-slate-400 mt-1">{desc}</p>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">Locked</span>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-4 p-4 rounded-xl transition-colors ${status === "active" ? "bg-slate-50 border border-slate-100" : "hover:bg-slate-50 border border-slate-50"}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${status === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-brand-purple/10 text-brand-purple"}`}>
        {status === "completed" ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        )}
      </div>
      <div className="flex-1">
        <h4 className={`text-sm font-bold leading-tight ${status === "active" ? "text-slate-800" : "text-slate-700"}`}>{title}</h4>
        <p className={`text-xs mt-1 ${status === "active" ? "text-slate-600" : "text-slate-500"}`}>{desc}</p>
        {extra && (
          <div className="mt-3 flex items-center space-x-3">
            <button className="px-3.5 py-1.5 text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple/90 rounded-lg shadow-md transition-all">Start Task</button>
            <span className="text-[10px] text-slate-400 font-semibold">{extra}</span>
          </div>
        )}
      </div>
      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${status === "completed" ? "text-emerald-600 bg-emerald-50" : "text-brand-purple bg-brand-purple/10"}`}>
        {status === "completed" ? "Completed" : "Active"}
      </span>
    </div>
  );
}