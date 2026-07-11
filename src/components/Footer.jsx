import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-[#666] border-t border-white/[0.06] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-white/[0.06]">
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Virtual Hack 2K26 Logo" className="w-9 h-9 rounded-full object-contain bg-white/10 p-0.5 border border-white/[0.06]" />
              <span className="font-bold text-sm tracking-[0.15em] text-[#f0efec] uppercase">VIRTUAL HACK 2K26</span>
            </div>
            <p className="text-sm max-w-sm text-[#555]">
              Powered by VASHIK Platform. Creating ecosystems that empower developers to learn, build outstanding solutions, and shape industry standards.
            </p>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[#f0efec] text-xs font-bold uppercase tracking-[0.15em]">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#modules" className="text-[#555] hover:text-[#f0efec] transition-colors">Modules</Link></li>
              <li><Link to="/#prizes" className="text-[#555] hover:text-[#f0efec] transition-colors">Prizes & Rewards</Link></li>
              <li><Link to="/#faq" className="text-[#555] hover:text-[#f0efec] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[#f0efec] text-xs font-bold uppercase tracking-[0.15em]">Support & Help</h4>
            <p className="text-sm text-[#555]">Reach out to our support channel for any inquiries:</p>
            <div className="flex flex-col space-y-2">
              <a href="mailto:vashiktechnology@gmail.com" className="support-email-link inline-flex items-center space-x-2 text-brand-blue hover:underline text-sm font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <span>vashiktechnology@gmail.com</span>
              </a>
            </div>
            <div className="pt-3.5 border-t border-white/[0.06] space-y-2.5">
              <span className="text-[10px] text-[#444] font-bold uppercase tracking-wider block">Organizer Helpdesk</span>
              <div className="space-y-2 text-xs font-medium text-[#555]">
                <div className="flex items-center justify-between">
                  <span>HARSHITHA</span>
                  <a href="tel:+919550437963" className="hover:text-[#f0efec] transition-colors flex items-center space-x-1.5 font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>+91 95504 37963</span>
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span>AKHIL</span>
                  <a href="tel:+918688220602" className="hover:text-[#f0efec] transition-colors flex items-center space-x-1.5 font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>+91 86882 20602</span>
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span>KARTHIK</span>
                  <a href="tel:+919381728045" className="hover:text-[#f0efec] transition-colors flex items-center space-x-1.5 font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>+91 93817 28045</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <div className="text-[#444]">&copy; 2026 VASHIK Platform. All rights reserved.</div>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-[#555] hover:text-[#f0efec] transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="text-[#555] hover:text-[#f0efec] transition-colors">Privacy Policy</Link>
            <Link to="/refund" className="text-[#555] hover:text-[#f0efec] transition-colors">Refund Policy</Link>
            <Link to="/faq" className="text-[#555] hover:text-[#f0efec] transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
