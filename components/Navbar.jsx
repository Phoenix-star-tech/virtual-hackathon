import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

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
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  const scrollTo = (id) => {
    if (location.pathname !== "/") {
      window.location.href = "/#" + id;
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] backdrop-blur-lg border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src={logo} alt="Virtual Hack 2K26 Logo" className="w-10 h-10 rounded-full object-contain bg-white/10 p-0.5 border border-white/10 transition-transform duration-300 group-hover:scale-105" />
              <span className="text-sm sm:text-base font-bold tracking-[0.15em] text-[#f0efec] uppercase">
                VIRTUAL HACK 2K26
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-10">
              <button onClick={() => scrollTo("modules")} className="text-sm text-[#888] hover:text-[#f0efec] transition-colors tracking-wider uppercase">Modules</button>
              <button onClick={() => scrollTo("prizes")} className="text-sm text-[#888] hover:text-[#f0efec] transition-colors tracking-wider uppercase">Prizes</button>
              <button onClick={() => scrollTo("faq")} className="text-sm text-[#888] hover:text-[#f0efec] transition-colors tracking-wider uppercase">FAQ</button>
              <a href="mailto:vashiktechnology@gmail.com" className="support-email-link text-sm text-[#888] hover:text-[#f0efec] transition-colors tracking-wider uppercase">Contact</a>
            </div>

            <div className="hidden sm:flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold text-[#aaa] hover:text-[#f0efec] transition-all">
                    <span>{user.full_name || "Dashboard"}</span>
                  </Link>
                  <button onClick={handleLogout} className="px-5 py-2.5 text-sm font-bold text-white bg-brand-blue hover:bg-brand-blueDark rounded-full transition-all">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-5 py-2.5 text-sm font-semibold text-[#aaa] hover:text-[#f0efec] transition-colors">Login</Link>
                  <button onClick={() => setRegisterOpen(true)} className="px-6 py-2.5 text-sm font-bold text-white bg-brand-blue hover:bg-brand-blueDark rounded-full transition-all shadow-lg shadow-brand-blue/20">
                    Register Now
                  </button>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-[#888] hover:text-[#f0efec] hover:bg-white/5 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {mobileOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" /></>}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-lg px-4 pt-4 pb-6 space-y-3">
            <button onClick={() => scrollTo("modules")} className="block w-full text-left py-3 px-4 text-sm text-[#888] hover:text-[#f0efec] hover:bg-white/5 rounded-lg transition-all tracking-wider uppercase">Modules</button>
            <button onClick={() => scrollTo("prizes")} className="block w-full text-left py-3 px-4 text-sm text-[#888] hover:text-[#f0efec] hover:bg-white/5 rounded-lg transition-all tracking-wider uppercase">Prizes</button>
            <button onClick={() => scrollTo("faq")} className="block w-full text-left py-3 px-4 text-sm text-[#888] hover:text-[#f0efec] hover:bg-white/5 rounded-lg transition-all tracking-wider uppercase">FAQ</button>
            <a href="mailto:vashiktechnology@gmail.com" className="support-email-link block py-3 px-4 text-sm text-[#888] hover:text-[#f0efec] hover:bg-white/5 rounded-lg transition-all tracking-wider uppercase">Contact</a>
            <div className="pt-4 border-t border-white/[0.06] flex flex-col space-y-3">
              {user ? (
                <>
                  <Link to="/dashboard" className="w-full text-center py-3 text-sm font-semibold text-[#aaa] hover:text-[#f0efec] hover:bg-white/5 rounded-lg transition-colors">{user.full_name || "Dashboard"}</Link>
                  <button onClick={handleLogout} className="w-full text-center py-3 text-sm font-bold text-white bg-brand-blue hover:bg-brand-blueDark rounded-full transition-colors">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full text-center py-3 text-sm font-semibold text-[#aaa] hover:text-[#f0efec] hover:bg-white/5 rounded-lg transition-colors">Login</Link>
                  <button onClick={() => { setRegisterOpen(true); setMobileOpen(false); }} className="w-full text-center py-3 text-sm font-bold text-white bg-brand-blue hover:bg-brand-blueDark rounded-full transition-all">Register Now</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {registerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setRegisterOpen(false)}>
          <div className="bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl p-8 sm:p-10 max-w-sm mx-4 w-full relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-blue"></div>
            <button onClick={() => setRegisterOpen(false)} className="absolute top-4 right-4 text-[#555] hover:text-[#aaa] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-[#f0efec] tracking-tight">Register</h3>
              <p className="text-xs sm:text-sm text-[#666] mt-1">Choose your participation type</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => { setRegisterOpen(false); navigate("/register"); }}
                className="w-full group flex items-center justify-between p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-brand-blue/30 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center group-hover:scale-105 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#f0efec] block">Register Now</span>
                    <span className="text-xs text-[#666]">Solo or Team — choose on the next page</span>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


