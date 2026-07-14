import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://virtual-hack-backend.onrender.com";
import { getProfileApi } from "../api/users";
import { getTasksByModule, getMySubmissions, submitTask, getPublicModules } from "../api/tasks";
import { getPlatformSettings } from "../api/platform";
import { getAnnouncements } from "../api/announcements";
import logo from "../assets/logo.png";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [moduleStatus, setModuleStatus] = useState("Module 1");
  const [settings, setSettings] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [mySubs, setMySubs] = useState({});
  const [modules, setModules] = useState([]);
  const [currentModuleId, setCurrentModuleId] = useState(null);

  const [submitTaskId, setSubmitTaskId] = useState(null);
  const [submitAnswer, setSubmitAnswer] = useState("");
  const [submitFiles, setSubmitFiles] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [certLoading, setCertLoading] = useState(false);
  const [certMemberModal, setCertMemberModal] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login", { replace: true }); return; }
    Promise.all([
      getProfileApi(user.user_id).then((p) => {
        setProfile(p);
        if (p.registration_type) {
          setModuleStatus(p.module_status || "Module 1");
        }
      }).catch(() => setProfile({
        full_name: user.full_name || "Developer", email: user.email || "",
        phone: "N/A", college: "N/A",
      })),
      getPublicModules().then((d) => setModules(d.modules || [])).catch(() => {}),
      getPlatformSettings().then(setSettings).catch(() => {}),
      getAnnouncements().then((d) => setAnnouncements(d.announcements || [])).catch(() => {}).finally(() => setAnnouncementsLoading(false)),
    ]).finally(() => setTimeout(() => setLoading(false), 400));
  }, [user, navigate]);

  useEffect(() => {
    if (profile?.module_status) setModuleStatus(profile.module_status);
  }, [profile]);

  useEffect(() => {
    if (!settings) return;
    const activeMod = settings.active_module || "Module 1";
    if (moduleStatus !== activeMod && moduleStatus !== activeMod) {
      setModuleStatus(activeMod);
    }
  }, [settings]);

  useEffect(() => {
    if (!modules.length || !moduleStatus) return;
    const matched = modules.find((m) => m.name === moduleStatus);
    if (matched) setCurrentModuleId(matched.id);
  }, [modules, moduleStatus]);

  useEffect(() => {
    if (!currentModuleId) return;
    getTasksByModule(currentModuleId).then((d) => setTasks(d.tasks || [])).catch(() => {});
    if (user?.user_id) {
      getMySubmissions(user.user_id).then((d) => {
        const map = {};
        (d.submissions || []).forEach((s) => { map[s.task_id] = s; });
        setMySubs(map);
      }).catch(() => {});
    }
  }, [currentModuleId, user?.user_id]);

  const handleLogout = async () => { await logout(); navigate("/login", { replace: true }); };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    const currentTask = tasks.find((t) => t.id === submitTaskId);
    if (currentTask) {
      if (currentTask.answer_type === "quiz" && !submitAnswer) {
        setSubmitError("Please select an answer (A, B, C, or D)"); return;
      }
      if (currentTask.answer_type === "link" && !/^https?:\/\//i.test(submitAnswer.trim())) {
        setSubmitError("Please enter a valid URL starting with http:// or https://"); return;
      }
      if (currentTask.answer_type === "description" && !submitAnswer.trim()) {
        setSubmitError("Please enter a description answer"); return;
      }
      if (currentTask.answer_type === "image" && submitFiles.length === 0) {
        setSubmitError("Please select an image file to upload"); return;
      }
    }

    setSubmitLoading(true);
    try {
      let finalAnswer = submitAnswer;
      let finalFiles = submitFiles;

      if (currentTask?.answer_type === "image" && submitFiles.length > 0) {
        const formData = new FormData();
        formData.append("file", submitFiles[0]);
        const res = await fetch(`${API_BASE}/api/submissions/upload-image`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ detail: "Upload failed" }));
          throw new Error(err.detail || "Upload failed");
        }
        const { url } = await res.json();
        finalAnswer = url;
        finalFiles = [];
      }

      await submitTask({ taskId: submitTaskId, submitterId: user.user_id, answer: finalAnswer, files: finalFiles });
      setSubmitTaskId(null); setSubmitAnswer(""); setSubmitFiles([]);
      const d = await getMySubmissions(user.user_id);
      const map = {};
      (d.submissions || []).forEach((s) => { map[s.task_id] = s; });
      setMySubs(map);
    } catch (err) { setSubmitError(err.message); }
    finally { setSubmitLoading(false); }
  }

  async function downloadCert(name) {
    if (!certEnabled || !user?.user_id || certLoading) return;
    setCertLoading(true);
    try {
      const params = new URLSearchParams({ user_id: user.user_id });
      if (name) params.append("full_name", name);
      const res = await fetch(`${API_BASE}/api/certificate/download?${params}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Download failed" }));
        throw new Error(err.detail);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate_${(name || user.full_name || "Participant").replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Certificate download failed:", err);
    } finally {
      setCertLoading(false);
    }
  }

  const tasksVisible = settings?.tasks_visible !== false;
  const certEnabled = settings?.certificate_download_enabled === true;
  const activeModule = settings?.active_module || "Module 1";
  const isMod2 = activeModule === "Module 2";

  const stepper = (() => {
    if (moduleStatus === "Module 1") return { step1: isMod2 ? "locked" : "active", step2: "locked", step3: "locked" };
    if (moduleStatus === "Module 2") return { step1: "done", step2: "active", step3: "locked" };
    if (moduleStatus === "Module 3") return { step1: "done", step2: "done", step3: "active" };
    return { step1: "active", step2: "locked", step3: "locked" };
  })();

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
          <p className="text-sm font-semibold text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] text-white antialiased font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <a href="/" className="flex items-center space-x-3 group">
              <img src={logo} alt="Logo" className="w-9 h-9 rounded-full object-contain bg-white/10 p-0.5 border border-white/20 transition-transform group-hover:scale-105" />
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white uppercase">VH 2K26</span>
            </a>
            <div className="hidden sm:block text-right">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Portal</span>
              <span className="text-sm font-bold text-white">Dashboard</span>
            </div>
            <button onClick={handleLogout} className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] border border-white/10 p-6 sm:p-8 mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full filter blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full filter blur-[60px] pointer-events-none"></div>
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Online</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Welcome back{user.registration_type === "team" ? (
                  <> to <span className="text-red-400">{profile?.team_name || user.team_name || "Your Team"}</span>!</>
                ) : (
                  <>, <span className="text-red-400">{profile?.full_name || user.full_name || "Developer"}</span>!</>
                )}
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
                {user.registration_type === "team"
                  ? `Team leader: ${profile?.full_name || user.full_name}`
                  : isMod2
                    ? "Module 2 registration is open. Form your squad and prepare for the 42h sprint."
                    : "Track your tasks, earn points, and advance through Module 1 to qualify for the next stage."}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.477 12.89 17 22l-5-2-5 3 1.523-9.11"/><path d="M22 4 15.477 2 12 5 8.523 2 2 4 3.5 9.5 4 10"/><path d="M12 2v3"/></svg>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Active Module</div>
                  <div className="text-sm font-bold text-white">{activeModule}</div>
                </div>
              </div>
              {isMod2 && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Registration Open</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Progression Roadmap */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Progression Roadmap
              </h3>
              <div className="relative pl-6 space-y-6">
                <div className="absolute left-[9px] top-2 bottom-2 w-px bg-white/10"></div>
                <Step num={1} label="Module 1: Online Tasks" desc="Solve daily subtasks & earn points." status={stepper.step1} isMod2={isMod2} />
                <Step num={2} label="Module 2: 42h Online Sprint" desc="Squad-based project hacking." status={stepper.step2} />
                <Step num={3} label="Module 3: Offline Finals" desc="In-person pitch and grand rewards." status={stepper.step3} />
              </div>
            </div>

            {/* Profile / Team Info */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                {profile?.registration_type === "team" ? "Team Info" : "Profile"}
              </h3>
              {profile?.registration_type === "team" ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Team Name</span>
                    <span className="text-sm font-semibold text-gray-200">{profile?.team_name || user.team_name || "-"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Team Leader</span>
                    <span className="text-sm font-semibold text-gray-200">{profile?.full_name || user.full_name || "-"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Leader Gmail</span>
                    <span className="text-sm font-semibold text-gray-200">{profile?.email || user.email || "-"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Phone</span>
                    <span className="text-sm font-semibold text-gray-200">{profile?.phone || "-"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">College</span>
                    <span className="text-sm font-semibold text-gray-200">{profile?.college || "-"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Domain</span>
                    <span className="text-sm font-semibold text-gray-200">{profile?.domain || "-"}</span>
                  </div>
                  {profile?.team_members?.length > 0 && (
                    <div className="border-t border-white/10 pt-3 mt-3">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Team Members</span>
                      {profile.team_members.map((m, i) => (
                        <div key={i} className="flex items-center gap-2 py-1.5">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-[10px] font-bold">
                            {m.full_name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-gray-200 block">{m.full_name}</span>
                            <span className="text-[10px] text-gray-500">{m.email}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { label: "Full Name", value: profile?.full_name },
                    { label: "Email", value: profile?.email },
                    { label: "Phone", value: profile?.phone },
                    { label: "College", value: profile?.college },
                  ].map((item) => (
                    <div key={item.label}>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-200">{item.value || "-"}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-gray-600 font-medium leading-relaxed border-t border-white/10 pt-3 mt-3">
                To edit your profile, contact <a href="mailto:vashiktechnology@gmail.com" className="text-red-400 hover:underline">vashiktechnology@gmail.com</a>
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Announcements */}
            {!announcementsLoading && announcements.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  <h3 className="text-sm font-bold text-white">Announcements</h3>
                  <span className="text-[10px] font-semibold text-gray-500 ml-auto">{announcements.length} update{announcements.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {announcements.map((a) => {
                    const typeStyles = {
                      info: { border: "border-blue-500/20", bg: "bg-blue-500/5", badge: "bg-blue-500/10 text-blue-400 border-blue-500/20", dot: "bg-blue-500" },
                      warning: { border: "border-yellow-500/20", bg: "bg-yellow-500/5", badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", dot: "bg-yellow-500" },
                      alert: { border: "border-red-500/20", bg: "bg-red-500/5", badge: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-500" },
                    };
                    const s = typeStyles[a.type] || typeStyles.info;
                    return (
                      <div key={a.id} className={`${s.bg} ${s.border} border rounded-xl p-4`}>
                        <div className="flex items-start gap-3">
                          <span className={`w-2 h-2 rounded-full ${s.dot} mt-1.5 shrink-0`}></span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-white">{a.title}</h4>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${s.badge}`}>{a.type}</span>
                              {a.priority === "urgent" && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Urgent</span>
                              )}
                              {a.priority === "high" && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">High</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1 whitespace-pre-wrap">{a.body}</p>
                            <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-600">
                              {a.author_name && <span>{a.author_name}</span>}
                              {a.created_at && <span>{new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tasks / Coming Soon */}
            {!tasksVisible ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-10 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Tasks Coming Soon</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                  The task panel for <strong className="text-white">{activeModule}</strong> is being prepared. Check back shortly — new challenges will appear here.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                  Stay tuned for updates
                </div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-10 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/></svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No Tasks Yet</h3>
                <p className="text-sm text-gray-400">No tasks available for this module yet. Check back later.</p>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/></svg>
                      {activeModule} Tasks
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{tasks.length} task{tasks.length !== 1 ? "s" : ""} available</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {tasks.map((t) => {
                    const submission = mySubs[t.id];
                    const isSubmitted = !!submission;
                    return (
                      <div key={t.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:bg-white/[0.04] transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isSubmitted ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                            {isSubmitted ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white">{t.title}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{t.description || "No description"}</p>
                            {t.link && (
                              <a href={t.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                View Resource
                              </a>
                            )}
                            {t.attachments?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {t.attachments.map((url, i) => (
                                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                                    <img src={url} alt={`Attachment ${i + 1}`} className="w-24 h-24 object-cover rounded-lg border border-white/10 hover:border-red-500/50 transition-colors" />
                                  </a>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-600 font-medium">
                              {t.points > 0 && <span>{t.points} pts</span>}
                              {t.deadline && <span>Due: {new Date(t.deadline).toLocaleDateString()}</span>}
                            </div>

                            {isSubmitted ? (
                              <div className="mt-3 space-y-1">
                                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  Submitted
                                </span>
                                {submission.notes && (
                                  <div className="text-xs text-gray-400">
                                    <span className="font-medium text-gray-300">Answer:</span>
                                    {submission.answer_type === "image" || submission.notes.match(/^https?:\/\/.*\.(png|jpg|jpeg|gif|webp|svg)/i) ? (
                                      <a href={submission.notes} target="_blank" rel="noopener noreferrer">
                                        <img src={submission.notes} alt="Submitted" className="mt-1 w-32 h-32 object-cover rounded-lg border border-white/10" />
                                      </a>
                                    ) : (
                                      <span className="ml-1">{submission.notes}</span>
                                    )}
                                  </div>
                                )}
                                {submission.files?.length > 0 && submission.files.map((f, i) => (
                                  <a key={i} href={f} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline block">View file</a>
                                ))}
                              </div>
                            ) : (
                              <div className="mt-3">
                                {submitTaskId === t.id ? (
                                  <form onSubmit={handleSubmit} className="space-y-2">
                                    {t.answer_type === "quiz" && (
                                      <div className="flex flex-wrap gap-2">
                                        {["A", "B", "C", "D"].map((letter, i) => (
                                          <button key={letter} type="button" onClick={() => setSubmitAnswer(letter)}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                                              submitAnswer === letter
                                                ? "bg-red-600 text-white border-red-500"
                                                : "bg-white/5 text-gray-400 border-white/10 hover:border-red-500/50"
                                            }`}
                                          >{letter}. {t.quiz_options?.[i] || letter}</button>
                                        ))}
                                      </div>
                                    )}
                                    {t.answer_type === "link" && (
                                      <input value={submitAnswer} onChange={(e) => setSubmitAnswer(e.target.value)} placeholder="Submission URL" className="w-full px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50" />
                                    )}
                                    {t.answer_type === "description" && (
                                      <textarea value={submitAnswer} onChange={(e) => setSubmitAnswer(e.target.value)} placeholder="Your answer..." rows="3" className="w-full px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50" />
                                    )}
                                    {t.answer_type === "image" && (
                                      <input type="file" accept="image/*" onChange={(e) => setSubmitFiles(e.target.files ? [...e.target.files] : [])} className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-500/10 file:text-red-400 hover:file:bg-red-500/20" />
                                    )}
                                    {submitError && <p className="text-xs text-red-400 font-semibold">{submitError}</p>}
                                    <div className="flex gap-2">
                                      <button type="submit" disabled={submitLoading} className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50">
                                        {submitLoading ? "Sending..." : "Submit"}
                                      </button>
                                      <button type="button" onClick={() => { setSubmitTaskId(null); setSubmitAnswer(""); setSubmitError(""); }} className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-300">Cancel</button>
                                    </div>
                                  </form>
                                ) : (
                                  <button onClick={() => setSubmitTaskId(t.id)} className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all">Submit Task</button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Certificate Download */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${certEnabled ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/10 text-gray-500"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">Certificate</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {certEnabled
                      ? "Your participation certificate is ready for download."
                      : "Certificate will be available once eligibility criteria are met."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!certEnabled || certLoading) return;
                    if (profile?.registration_type === "team" && profile?.team_members?.length > 0) {
                      setCertMemberModal(true);
                    } else {
                      downloadCert();
                    }
                  }}
                  disabled={!certEnabled || certLoading}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 flex items-center gap-2 ${
                    certEnabled
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                      : "bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed"
                  }`}
                >
                  {certLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      Generating...
                    </>
                  ) : certEnabled ? (
                    "Download Certificate"
                  ) : (
                    "Still Not Qualified"
                  )}
                </button>
              </div>
            </div>

            {/* Module Registration Info */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 flex items-center justify-center text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">
                    {isMod2 ? "Module 2 Registration Open" : "Module 1 Registration"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isMod2
                      ? "You can now register for Module 2 (42h Sprint). Form a team of 1-4 members to participate."
                      : "Complete tasks and earn points to qualify for Module 2 advancement."}
                  </p>
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                  isMod2
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  {isMod2 ? "Open" : "Active"}
                </div>
              </div>
            </div>

            {/* Team / Squad (only shown for mod2) */}
            {isMod2 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  My Squad
                </h3>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Team Formation</h4>
                  <p className="text-xs text-gray-400">Form or join a team of 1-4 members to participate in the 42h sprint.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Certificate Member Selection Modal */}
      {certMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setCertMemberModal(false)}>
          <div className="bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm mx-4 w-full relative" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-t-2xl"></div>
            <button onClick={() => setCertMemberModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h3 className="text-lg font-bold text-white mb-1 mt-2">Select Member</h3>
            <p className="text-xs text-gray-400 mb-5">Choose whose name to print on the certificate</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {/* Leader */}
              <button
                onClick={() => { setCertMemberModal(false); downloadCert(profile?.full_name || user.full_name); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 transition-all text-left"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                  {(profile?.full_name || user.full_name || "L").charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-white block truncate">{profile?.full_name || user.full_name || "Leader"}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Team Leader</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              {/* Team Members */}
              {profile?.team_members?.map((m, i) => (
                <button
                  key={i}
                  onClick={() => { setCertMemberModal(false); downloadCert(m.full_name); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 transition-all text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0">
                    {(m.full_name || "?").charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-white block truncate">{m.full_name}</span>
                    <span className="text-[10px] text-gray-500">Team Member</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              ))}
            </div>
            <button
              onClick={() => setCertMemberModal(false)}
              className="w-full mt-4 py-2.5 text-sm font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <footer className="py-6 text-center text-xs text-gray-600 border-t border-white/5">
        &copy; 2026 VASHIK Platform. All rights reserved.
      </footer>
    </div>
  );
}

function Step({ label, desc, status }) {
  const colors = {
    active: { node: "border-red-500 bg-red-500/20", dot: "bg-red-500", title: "text-white", badge: "bg-red-500/10 text-red-400 border-red-500/20" },
    done: { node: "border-emerald-500 bg-emerald-500/20", dot: "bg-emerald-500", title: "text-gray-400 line-through", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    locked: { node: "border-white/10 bg-white/[0.02]", dot: "bg-white/20", title: "text-gray-500", badge: "bg-white/5 text-gray-500 border-white/10" },
  };
  const c = colors[status] || colors.locked;
  return (
    <div className="relative flex items-start group">
      <div className={`absolute left-[-23px] w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center z-10 ${c.node}`}>
        {status === "done" && (
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><polyline points="20 6 9 17 4 12"/></svg>
        )}
        {status === "active" && <div className={`w-2 h-2 rounded-full ${c.dot}`}></div>}
      </div>
      <div>
        <h4 className={`text-sm font-bold leading-none ${c.title}`}>{label}</h4>
        <p className="text-xs text-gray-500 mt-1">{desc}</p>
        <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.badge}`}>
          {status === "active" ? "Active" : status === "done" ? "Completed" : "Locked"}
        </span>
      </div>
    </div>
  );
}
