import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("solo"); // solo | team
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const validate = () => {
    const errs = {};
    if (mode === "solo") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) errs.email = "Email address is required";
      else if (!emailRegex.test(email.trim())) errs.email = "Please enter a valid email format";
    } else {
      if (!teamName.trim()) errs.teamName = "Team name is required";
    }
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;
    setLoading(true);
    try {
      const credential = mode === "solo" ? email.trim() : teamName.trim();
      await login(mode, credential, password);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setError(err.message || "An error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 antialiased font-sans min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute top-6 left-6 z-30">
        <Link to="/" className="flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-brand-purple transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><polyline points="12 19 5 12 12 5" /></svg>
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-brand-blue/5 rounded-full filter blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-brand-pink/5 rounded-full filter blur-[80px] pointer-events-none"></div>

      <main className="flex-1 flex items-center justify-center px-4 py-16 relative z-10 w-full">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink"></div>

          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4 group">
              <img src={logo} alt="Virtual Hack 2K26 Logo" className="w-24 h-24 mx-auto rounded-full object-contain bg-white p-0.5 border border-slate-100 transition-transform duration-300 group-hover:scale-105" />
            </Link>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Sign in to your account</p>
          </div>

          {/* Login Mode Toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode("solo"); setErrors({}); setError(""); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                mode === "solo" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Solo Login
            </button>
            <button
              type="button"
              onClick={() => { setMode("team"); setErrors({}); setError(""); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                mode === "team" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Team Login
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs sm:text-sm font-semibold flex items-start space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-xs sm:text-sm font-semibold flex items-start space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {mode === "solo" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Gmail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  </div>
                  <input
                    type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 text-slate-800 transition-all placeholder:text-slate-400 font-medium ${errors.email ? "border-rose-400" : "border-slate-200/80"}`}
                    placeholder="name@gmail.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-500 font-semibold">{errors.email}</p>}
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Team Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  </div>
                  <input
                    type="text" value={teamName} onChange={(e) => { setTeamName(e.target.value); setErrors((p) => ({ ...p, teamName: "" })); }}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 text-slate-800 transition-all placeholder:text-slate-400 font-medium ${errors.teamName ? "border-rose-400" : "border-slate-200/80"}`}
                    placeholder="Your team name"
                  />
                </div>
                {errors.teamName && <p className="text-xs text-rose-500 font-semibold">{errors.teamName}</p>}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {mode === "team" ? "Common Password" : "Password"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                  className={`w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 text-slate-800 transition-all placeholder:text-slate-400 font-medium ${errors.password ? "border-rose-400" : "border-slate-200/80"}`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-500 font-semibold">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 px-4 font-bold text-white bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-95 rounded-xl shadow-lg shadow-brand-blue/15 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center space-x-2.5"
            >
              <span>{loading ? "Signing In..." : "Sign In"}</span>
              {loading && <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6">
            {mode === "solo" ? (
              <>Don't have an account? <Link to="/register" className="text-brand-purple hover:underline font-semibold">Register here</Link></>
            ) : (
              <>Team not registered? <Link to="/register" className="text-brand-purple hover:underline font-semibold">Register your team</Link></>
            )}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
