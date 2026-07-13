import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerSoloApi, registerTeamApi } from "../api/auth";
import { getQrConfigApi, checkTransactionApi } from "../api/payment";
import { getDomainsApi } from "../api/domains";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";

const TID_CHECK_DEBOUNCE_MS = 500;
const MAX_TEAM_MEMBERS = 4;

export default function RegisterPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState("choice"); // choice | form
  const [type, setType] = useState(null); // solo | team

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", college: "",
    password: "", confirmPassword: "", transactionId: "",
    teamName: "", domain: "",
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [qrConfig, setQrConfig] = useState(null);
  const [qrLoading, setQrLoading] = useState(true);
  const [tidStatus, setTidStatus] = useState(null);
  const [domains, setDomains] = useState([]);
  const [soloBaseAmount, setSoloBaseAmount] = useState(9);
  const tidDebounceRef = useRef(null);

  useEffect(() => {
    Promise.all([
      getQrConfigApi().then((c) => { setQrConfig(c); setSoloBaseAmount(c?.amount || 9); }).catch((err) => console.error("Failed to fetch QR config:", err)),
      getDomainsApi().then(setDomains).catch((err) => console.error("Failed to fetch domains:", err)),
    ]).finally(() => setQrLoading(false));
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const teamAmount = soloBaseAmount * (1 + teamMembers.length);
  const displayAmount = type === "team" ? teamAmount : soloBaseAmount;

  const validateField = useCallback((field, value, currentForm, currentTidStatus, currentMembers) => {
    const f = { ...currentForm, [field]: value };
    switch (field) {
      case "fullName":
        return !value.trim() ? "Full name is required" : "";
      case "email":
        if (!value.trim()) return "Email is required";
        return !emailRegex.test(value.trim()) ? "Please enter a valid email format" : "";
      case "phone":
        if (!value.trim()) return "Phone number is required";
        return value.replace(/\D/g, "").length < 10 ? "Please enter a valid 10-digit phone number" : "";
      case "college":
        return !value.trim() ? "College/Organization name is required" : "";
      case "teamName":
        return !value.trim() ? "Team name is required" : "";
      case "domain":
        return !value ? "Please select a domain" : "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        if (f.confirmPassword && value !== f.confirmPassword) return "Passwords do not match";
        return "";
      case "confirmPassword":
        if (!value) return "Password confirmation is required";
        if (value !== f.password) return "Passwords do not match";
        return "";
      case "transactionId":
        if (!value.trim()) return "Transaction ID is required";
        if (currentTidStatus === "invalid") return "This Transaction ID has already been used";
        return "";
      default:
        return "";
    }
  }, []);

  const validateMember = (member, index) => {
    const errs = {};
    if (!member.full_name.trim()) errs.full_name = "Name is required";
    if (!member.email.trim()) errs.email = "Email is required";
    else if (!emailRegex.test(member.email.trim())) errs.email = "Invalid email format";
    return errs;
  };

  const set = useCallback((field) => (e) => {
    let value = e.target.value;
    if (field === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      return updated;
    });
    const err = validateField(field, value, form, tidStatus, teamMembers);
    setErrors((p) => ({ ...p, [field]: err }));
    if (field === "password" && form.confirmPassword) {
      setErrors((p) => ({ ...p, confirmPassword: value !== form.confirmPassword ? "Passwords do not match" : "" }));
    }
    if (field === "confirmPassword") {
      setErrors((p) => ({ ...p, confirmPassword: value !== form.password ? "Passwords do not match" : "" }));
    }
    if (field === "transactionId") {
      setTidStatus(null);
      if (tidDebounceRef.current) clearTimeout(tidDebounceRef.current);
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        tidDebounceRef.current = setTimeout(async () => {
          setTidStatus("checking");
          try {
            const res = await checkTransactionApi(trimmed);
            setTidStatus(res.exists ? "invalid" : "valid");
            setErrors((p) => ({ ...p, transactionId: res.exists ? "This Transaction ID has already been used" : "" }));
          } catch {
            setTidStatus(null);
          }
        }, TID_CHECK_DEBOUNCE_MS);
      }
    }
  }, [form, tidStatus, teamMembers, validateField]);

  const handleMemberChange = (index, field, value) => {
    setTeamMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addMember = () => {
    if (1 + teamMembers.length >= MAX_TEAM_MEMBERS) return;
    setTeamMembers((prev) => [...prev, { full_name: "", email: "" }]);
  };

  const removeMember = (index) => {
    setTeamMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errs = {};
    const baseFields = ["fullName", "email", "phone", "college", "password", "confirmPassword", "transactionId", "domain"];
    baseFields.forEach((f) => {
      if (f === "password" || f === "confirmPassword" || f === "transactionId") {
        const val = form[f];
        const err = validateField(f, val, form, tidStatus, teamMembers);
        if (err) errs[f] = err;
      } else {
        const val = form[f];
        const err = validateField(f, val, form, tidStatus, teamMembers);
        if (err) errs[f] = err;
      }
    });
    if (type === "team") {
      const teamErr = validateField("teamName", form.teamName, form, tidStatus, teamMembers);
      if (teamErr) errs.teamName = teamErr;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const isFormValid = () => {
    if (tidStatus !== "valid") return false;
    const requiredChecks = [
      form.fullName.trim(),
      form.email.trim() && emailRegex.test(form.email.trim()),
      form.phone.trim() && form.phone.replace(/\D/g, "").length >= 10,
      form.college.trim(),
      form.password && form.password.length >= 6,
      form.confirmPassword && form.confirmPassword === form.password,
      form.transactionId.trim(),
      form.domain,
    ];
    if (!requiredChecks.every(Boolean)) return false;
    if (type === "team") {
      if (!form.teamName.trim()) return false;
    }
    return true;
  };

  const memberErrors = (index) => {
    const errs = {};
    const m = teamMembers[index];
    if (!m) return errs;
    if (!m.full_name.trim()) errs.full_name = "Name is required";
    if (!m.email.trim()) errs.email = "Email is required";
    else if (!emailRegex.test(m.email.trim())) errs.email = "Invalid email format";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;
    if (tidStatus !== "valid") {
      setError("Please ensure your Transaction ID is valid and not already used");
      return;
    }
    if (type === "team") {
      for (let i = 0; i < teamMembers.length; i++) {
        const merrs = validateMember(teamMembers[i], i);
        if (Object.keys(merrs).length > 0) {
          setError(`Please fix errors in team member ${i + 1}`);
          return;
        }
      }
    }

    setLoading(true);
    try {
      const payload = {
        full_name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        college: form.college.trim(),
        password: form.password,
        domain: form.domain,
        transaction_id: form.transactionId.trim(),
      };

      let result;
      if (type === "solo") {
        result = await registerSoloApi(payload);
      } else {
        result = await registerTeamApi({
          ...payload,
          team_name: form.teamName.trim(),
          team_members: teamMembers.map((m) => ({ full_name: m.full_name.trim(), email: m.email.trim() })),
        });
      }

      setSuccess(result.message || "Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field, hasError) => {
    const isPw = field.includes("password");
    return `w-full pl-10 ${isPw ? "pr-10" : "pr-4"} py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 text-slate-800 transition-all placeholder:text-slate-400 font-medium ${hasError ? "border-rose-400" : "border-slate-200/80"
    }`;
  };

  const selectClass = (hasError) =>
    `w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 text-slate-800 transition-all appearance-none cursor-pointer font-medium ${hasError ? "border-rose-400" : "border-slate-200/80"}`;

  if (step === "choice") {
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
        <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-20 relative z-10 w-full">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink"></div>
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-4 group">
                <img src={logo} alt="Virtual Hack 2K26 Logo" className="w-24 h-24 mx-auto rounded-full object-contain bg-white p-0.5 border border-slate-100 transition-transform duration-300 group-hover:scale-105" />
              </Link>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Join the Hackathon</h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">Choose your participation type</p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => { setType("solo"); setStep("form"); }}
                className="w-full group flex items-center justify-between p-5 rounded-xl border-2 border-brand-blue/20 bg-brand-blue/5 hover:bg-brand-blue/10 hover:border-brand-blue/40 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center group-hover:scale-105 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                  <div>
                    <span className="text-base font-bold text-slate-800 block">Solo</span>
                    <span className="text-xs text-slate-500">Register and compete individually</span>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-purple group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
              <button
                onClick={() => { setType("team"); setStep("form"); }}
                className="w-full group flex items-center justify-between p-5 rounded-xl border-2 border-brand-purple/20 bg-brand-purple/5 hover:bg-brand-purple/10 hover:border-brand-purple/40 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center group-hover:scale-105 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  </div>
                  <div>
                    <span className="text-base font-bold text-slate-800 block">Team</span>
                    <span className="text-xs text-slate-500">Register with 1–4 members (leader + up to 3)</span>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-purple group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 antialiased font-sans min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute top-6 left-6 z-30">
        <button onClick={() => { setStep("choice"); setType(null); setErrors({}); setError(""); setSuccess(""); }} className="flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-brand-purple transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><polyline points="12 19 5 12 12 5" /></svg>
          <span>Change Type</span>
        </button>
      </div>

      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-brand-blue/5 rounded-full filter blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-brand-pink/5 rounded-full filter blur-[80px] pointer-events-none"></div>

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-20 relative z-10 w-full">
        <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink"></div>

          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4 group">
              <img src={logo} alt="Virtual Hack 2K26 Logo" className="w-24 h-24 mx-auto rounded-full object-contain bg-white p-0.5 border border-slate-100 transition-transform duration-300 group-hover:scale-105" />
            </Link>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {type === "solo" ? "Solo Registration" : "Team Registration"}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              {type === "solo" ? "Register as an individual participant" : `Team of ${1 + teamMembers.length} — ₹${displayAmount} total via UPI`}
            </p>
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

          <form onSubmit={handleSubmit} noValidate>
            {type === "team" && (
              <div className="mb-5 space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Team Name <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  </div>
                  <input type="text" value={form.teamName} onChange={set("teamName")} className={inputClass("teamName", errors.teamName)} placeholder="Enter your team name" />
                </div>
                {errors.teamName && <p className="text-xs text-rose-500 font-semibold">{errors.teamName}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={type === "team" ? "Team Leader Name" : "Full Name"} icon="user" error={errors.fullName}>
                <input type="text" value={form.fullName} onChange={set("fullName")} className={inputClass("fullName", errors.fullName)} placeholder="Full name" />
              </Field>
              <Field label={type === "team" ? "Leader Gmail" : "Gmail"} icon="mail" error={errors.email}>
                <input type="email" value={form.email} onChange={set("email")} className={inputClass("email", errors.email)} placeholder="name@gmail.com" />
              </Field>
              <Field label={type === "team" ? "Leader Phone" : "Phone Number"} icon="phone" error={errors.phone}>
                <input type="tel" value={form.phone} onChange={set("phone")} className={inputClass("phone", errors.phone)} placeholder="+91 9876543210" />
              </Field>
              <Field label={type === "team" ? "Leader College" : "College"} icon="graduation-cap" error={errors.college}>
                <input type="text" value={form.college} onChange={set("college")} className={inputClass("college", errors.college)} placeholder="University Institute of Tech" />
              </Field>

              {/* Domain Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Select Domain <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  </div>
                  <select value={form.domain} onChange={set("domain")} className={selectClass(errors.domain)}>
                    <option value="">Select a domain</option>
                    {domains.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                {errors.domain && <p className="text-xs text-rose-500 font-semibold">{errors.domain}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Password <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </div>
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={set("password")} className={inputClass("password", errors.password)} placeholder={type === "team" ? "Common team password" : "Min. 6 characters"} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-500 font-semibold">{errors.password}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Confirm Password <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                  </div>
                  <input type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={set("confirmPassword")} className={inputClass("confirmPassword", errors.confirmPassword)} placeholder="Re-enter password" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                    {showConfirm ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-rose-500 font-semibold">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Team Members Section */}
            {type === "team" && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-700">Team Members</h3>
                  <button
                    type="button"
                    onClick={addMember}
                    disabled={1 + teamMembers.length >= MAX_TEAM_MEMBERS}
                    className="text-xs font-semibold text-brand-purple hover:text-brand-purple/80 disabled:text-slate-300 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span>Add Member</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mb-3">You (leader) + up to {MAX_TEAM_MEMBERS - 1} additional members. Each member only needs Name + Gmail.</p>
                {teamMembers.map((member, idx) => (
                  <div key={idx} className="mb-3 p-4 bg-slate-50 rounded-xl border border-slate-100 relative">
                    <button
                      type="button"
                      onClick={() => removeMember(idx)}
                      className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Member {idx + 1}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={member.full_name}
                          onChange={(e) => handleMemberChange(idx, "full_name", e.target.value)}
                          className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 text-slate-800 transition-all placeholder:text-slate-400 font-medium ${
                            member.full_name.trim() || !member.email ? "border-slate-200" : "border-rose-400"
                          }`}
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => handleMemberChange(idx, "email", e.target.value)}
                          className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 text-slate-800 transition-all placeholder:text-slate-400 font-medium ${
                            member.email.trim() || !member.full_name ? "border-slate-200" : "border-rose-400"
                          }`}
                          placeholder="name@gmail.com"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Transaction ID Field */}
            <div className="mt-5 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Transaction ID <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                </div>
                <input
                  type="text"
                  value={form.transactionId}
                  onChange={set("transactionId")}
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 text-slate-800 transition-all placeholder:text-slate-400 font-medium ${errors.transactionId ? "border-rose-400" : tidStatus === "valid" ? "border-emerald-400" : "border-slate-200/80"}`}
                  placeholder="Transaction reference ID"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                  {tidStatus === "checking" && (
                    <div className="w-4 h-4 rounded-full border-2 border-brand-purple border-t-transparent animate-spin"></div>
                  )}
                  {tidStatus === "valid" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                  )}
                  {tidStatus === "invalid" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                  )}
                </div>
              </div>
              {tidStatus === "invalid" && (
                <p className="text-xs text-rose-500 font-semibold">Transaction ID already used for another registration</p>
              )}
              {tidStatus === "valid" && (
                <p className="text-xs text-emerald-500 font-semibold">Transaction ID is valid</p>
              )}
              {errors.transactionId && tidStatus !== "invalid" && (
                <p className="text-xs text-rose-500 font-semibold">{errors.transactionId}</p>
              )}
            </div>

            {/* QR Code */}
            {qrLoading ? (
              <div className="mb-6 mt-6 flex justify-center">
                <div className="w-36 h-36 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center">
                  <span className="text-xs text-slate-400">Loading QR...</span>
                </div>
              </div>
            ) : qrConfig?.qr_image_url ? (
              <div className="mb-6 mt-6 flex flex-col items-center">
                <img src={qrConfig.qr_image_url} alt="Scan to pay" className="w-36 h-36 rounded-xl border border-slate-200 shadow-sm object-contain" />
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  Pay ₹{displayAmount} — UPI: <span className="font-semibold text-slate-700">{qrConfig.upi_id || "N/A"}</span>
                </p>
              </div>
            ) : (
              <div className="mb-6 mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-600 text-xs sm:text-sm font-medium text-center">
                QR code not available yet. Please check back later or contact support.
              </div>
            )}

            {/* Amount Display */}
            <div className="mb-6 p-4 bg-brand-blue/5 border border-brand-blue/10 rounded-xl text-center">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Registration Fee: </span>
              <span className="text-xl font-extrabold text-brand-purple">₹{displayAmount}</span>
              {type === "team" && (
                <span className="text-xs text-slate-400 ml-2">({soloBaseAmount} × {1 + teamMembers.length} members)</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="w-full mt-2 py-3.5 px-4 font-bold text-white bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-95 rounded-xl shadow-lg shadow-brand-blue/15 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center space-x-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <span>{loading ? "Registering..." : type === "solo" ? "Register Solo" : `Register Team (${1 + teamMembers.length} members)`}</span>
              {loading && <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>}
            </button>
          </form>

          <p className="text-[10px] text-slate-400 text-center mt-4 leading-relaxed">
            By registering, you agree to our{" "}
            <Link to="/terms" className="text-brand-purple hover:underline font-semibold">Terms</Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-brand-purple hover:underline font-semibold">Privacy Policy</Link>.
            Registration fee is non-refundable.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Field({ label, icon, error, children }) {
  const svgIcons = {
    user: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    mail: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>,
    phone: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
    "graduation-cap": <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>,
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          {svgIcons[icon]}
        </div>
        {children}
      </div>
      {error && <p className="text-xs text-rose-500 font-semibold">{error}</p>}
    </div>
  );
}
