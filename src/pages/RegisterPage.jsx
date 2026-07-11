import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createOrderApi, verifyPaymentApi } from "../api/payment";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";

function waitForRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const check = () => {
      if (window.Razorpay) return resolve(true);
      setTimeout(check, 200);
    };
    check();
    setTimeout(() => resolve(!!window.Razorpay), 5000);
  });
}

export default function RegisterPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: "", email: "", phone: "", college: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentStep, setPaymentStep] = useState("form");
  const [errors, setErrors] = useState({});
  const formRef = useRef(form);

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!emailRegex.test(form.email.trim())) errs.email = "Please enter a valid email format";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (form.phone.trim().replace(/\D/g, "").length < 10) errs.phone = "Please enter a valid 10-digit phone number";
    if (!form.college.trim()) errs.college = "College/Organization name is required";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (!form.confirmPassword) errs.confirmPassword = "Password confirmation is required";
    else if (form.confirmPassword !== form.password) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openRazorpayCheckout = (orderData) => {
    return new Promise((resolve, reject) => {
      let resolved = false;

      // Normalize contact: strip non-digits, prepend +91 if needed
      const rawPhone = (formRef.current.phone || "").replace(/\D/g, "");
      const contact = rawPhone.startsWith("91") && rawPhone.length > 10
        ? `+${rawPhone}`
        : `+91${rawPhone}`;

      const options = {
        key: orderData.key_id,
        // Do NOT pass amount/currency — order_id carries both.
        // Passing them redundantly causes 400 if there's any mismatch.
        name: "Virtual Hackathon 2K26",
        description: "Module 1 Registration",
        order_id: orderData.order_id,
        prefill: {
          name: formRef.current.fullName,
          email: formRef.current.email,
          contact: contact,
        },
        handler: function (response) {
          resolved = true;
          resolve(response);
        },
        modal: {
          ondismiss: function () {
            if (!resolved) reject(new Error("dismissed"));
          },
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        resolved = true;
        const err = response.error || {};
        const msg = err.description || err.reason || "Payment failed";
        const code = err.code ? ` (${err.code})` : "";
        console.error("Razorpay payment.failed:", JSON.stringify(err));
        reject(new Error(`${msg}${code}`));
      });
      rzp.on("payment.error", function (response) {
        if (!resolved) {
          resolved = true;
          reject(new Error(response?.error?.description || "Payment error occurred"));
        }
      });
      rzp.open();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;

    setLoading(true);
    setPaymentStep("order");

    const razorpayReady = await waitForRazorpay();
    if (!razorpayReady) {
      setError("Payment gateway failed to load. Please check your internet connection and try again.");
      setLoading(false);
      setPaymentStep("form");
      return;
    }

    let orderData;
    try {
      orderData = await createOrderApi(formRef.current);
    } catch (err) {
      setError(err.message || "Failed to initiate payment. Please try again.");
      setLoading(false);
      setPaymentStep("form");
      return;
    }

    setPaymentStep("payment");
    setLoading(false);

    let razorpayResponse;
    try {
      razorpayResponse = await openRazorpayCheckout(orderData);
    } catch (err) {
      const msg = err.message === "dismissed"
        ? "Payment was cancelled. Your registration was not saved. Please try again."
        : err.message === "Payment failed"
          ? "Payment declined by bank/card. Try a different card or try again."
          : err.message || "Payment was not completed. Your registration was not saved. Please try again.";
      setError(msg);
      setPaymentStep("form");
      return;
    }

    setLoading(true);
    setPaymentStep("verify");

    try {
      const verifyResult = await verifyPaymentApi({
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
      });

      if (verifyResult.success) {
        setUser({
          authenticated: true,
          user_id: verifyResult.user_id,
          email: verifyResult.email,
          full_name: verifyResult.full_name,
        });

        setSuccess(verifyResult.message || "Payment successful! Redirecting to dashboard...");
        setPaymentStep("done");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setError(verifyResult.message || "Payment could not be verified. Please contact support.");
        setPaymentStep("form");
      }
    } catch (err) {
      setError(err.message || "Payment verification failed. Your registration was not saved. Please try again.");
      setPaymentStep("form");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field, hasError) =>
    `w-full pl-10 pr-${field.includes("password") ? "10" : "4"} py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 text-slate-800 transition-all placeholder:text-slate-400 font-medium ${hasError ? "border-rose-400" : "border-slate-200/80"
    }`;

  const getButtonText = () => {
    if (loading && paymentStep === "order") return "Creating payment order...";
    if (loading && paymentStep === "verify") return "Verifying payment...";
    if (paymentStep === "payment") return "Complete payment in popup...";
    return "Register & Pay ₹9";
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

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-20 relative z-10 w-full">
        <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink"></div>

          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4 group">
              <img src={logo} alt="Virtual Hack 2K26 Logo" className="w-24 h-24 mx-auto rounded-full object-contain bg-white p-0.5 border border-slate-100 transition-transform duration-300 group-hover:scale-105" />
            </Link>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Your Account</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Start Module 1 and unlock the developer dashboard — ₹9 registration</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Full Name" icon="user" error={errors.fullName}>
                <input type="text" value={form.fullName} onChange={set("fullName")} className={inputClass("fullName", errors.fullName)} placeholder="Full name" />
              </Field>
              <Field label="Email Address" icon="mail" error={errors.email}>
                <input type="email" value={form.email} onChange={set("email")} className={inputClass("email", errors.email)} placeholder="name@gmail.com" />
              </Field>
              <Field label="Phone Number" icon="phone" error={errors.phone}>
                <input type="tel" value={form.phone} onChange={set("phone")} className={inputClass("phone", errors.phone)} placeholder="+91 9876543210" />
              </Field>
              <Field label="College / Organization" icon="graduation-cap" error={errors.college}>
                <input type="text" value={form.college} onChange={set("college")} className={inputClass("college", errors.college)} placeholder="University Institute of Tech" />
              </Field>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </div>
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={set("password")} className={inputClass("password", errors.password)} placeholder="Min. 6 characters" />
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
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Confirm Password</label>
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

            <button type="submit" disabled={loading || paymentStep === "payment"}
              className="w-full mt-8 py-3.5 px-4 font-bold text-white bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-95 rounded-xl shadow-lg shadow-brand-blue/15 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center space-x-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <span>{getButtonText()}</span>
              {loading && <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>}
            </button>
          </form>

          <p className="text-[10px] text-slate-400 text-center mt-4 leading-relaxed">
            By registering, you agree to our{" "}
            <Link to="/terms" className="text-brand-purple hover:underline font-semibold">Terms</Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-brand-purple hover:underline font-semibold">Privacy Policy</Link>.
            ₹9 registration fee is non-refundable.
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
