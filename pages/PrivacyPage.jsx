import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function PrivacyPage() {
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
      <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] bg-brand-blue/5 rounded-full filter blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] bg-brand-pink/5 rounded-full filter blur-[80px] pointer-events-none"></div>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 sm:py-16 relative z-10 w-full">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-brand-purple transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><polyline points="12 19 5 12 12 5" /></svg>
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink"></div>
          <div className="border-b border-slate-100 pb-8 mb-8">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-purple">Legal</span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">Privacy Policy</h1>
            <p className="text-sm text-slate-400 mt-2 font-medium">Last updated: July 8, 2026</p>
          </div>

          <div className="space-y-8 text-slate-600 leading-relaxed text-sm sm:text-base">
            <Section num="1" title="Introduction">
              <p>This Privacy Policy explains how VASHIK, the organizer of Virtual Hackathon 2K26 ("we", "us", "our"), collects, uses, and protects the personal information of participants ("you") who register on this website. By registering, you agree to the practices described below.</p>
            </Section>

            <Section num="2" title="Information We Collect">
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-2.5"><Bullet /><span><strong>Account information:</strong> full name, email address, phone number, and password (stored securely via Supabase Authentication; we never see or store your raw password).</span></li>
                <li className="flex items-start gap-2.5"><Bullet /><span><strong>Profile information:</strong> college/organization name and module registration status.</span></li>
                <li className="flex items-start gap-2.5"><Bullet /><span><strong>Payment information:</strong> registration fee transaction details (₹9 for Module 1, ₹149 per member for Module 2). Payment processing is handled by our third-party payment gateway; we do not store card or UPI credentials.</span></li>
                <li className="flex items-start gap-2.5"><Bullet /><span><strong>Usage data:</strong> task submissions, subtask completion records, and hackathon activity logs needed to run the competition and determine winners.</span></li>
                <li className="flex items-start gap-2.5"><Bullet /><span><strong>Communication data:</strong> messages sent through our WhatsApp community group are governed by WhatsApp's own privacy policy, not this one.</span></li>
              </ul>
            </Section>

            <Section num="3" title="How We Use Your Information">
              <p>We use the collected information for the following purposes:</p>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-2.5"><Bullet2 />To create and manage your participant account and dashboard.</li>
                <li className="flex items-start gap-2.5"><Bullet2 />To track your progress across Module 1, 2, and 3, and determine eligibility to advance.</li>
                <li className="flex items-start gap-2.5"><Bullet2 />To communicate important updates, deadlines, and results via email or WhatsApp.</li>
                <li className="flex items-start gap-2.5"><Bullet2 />To issue participation and achievement certificates.</li>
                <li className="flex items-start gap-2.5"><Bullet2 />To distribute cash and hamper prizes to winners.</li>
                <li className="flex items-start gap-2.5"><Bullet2 />To improve the hackathon experience and troubleshoot technical issues.</li>
              </ul>
            </Section>

            <Section num="4" title="Data Storage &amp; Security">
              <p>Your data is stored using Supabase, which provides encrypted storage and Row-Level Security (RLS) so that you can only access your own profile and submission data. We take reasonable technical measures to protect your information, but no online system is 100% secure, and we cannot guarantee absolute security.</p>
            </Section>

            <Section num="5" title="Data Sharing">
              <p>We do not sell your personal data. We may share limited information with:</p>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-2.5"><Bullet3 />Module 3 offline event partners/venues, solely for logistics (e.g. name, team, contact number).</li>
                <li className="flex items-start gap-2.5"><Bullet3 />Payment processors, to complete registration fee transactions.</li>
                <li className="flex items-start gap-2.5"><Bullet3 />Service providers (e.g. email/SMS delivery via Brevo) used strictly to operate the hackathon.</li>
                <li className="flex items-start gap-2.5"><Bullet3 />Legal authorities, if required by law.</li>
              </ul>
            </Section>

            <Section num="6" title="Your Rights">
              <p>You may request to access, correct, or delete your personal data at any time by contacting us at <a href="mailto:vashiktechnology@gmail.com" className="text-brand-purple font-semibold hover:underline support-email-link">vashiktechnology@gmail.com</a>. Note that deleting your account before the hackathon concludes may affect your eligibility to continue in the competition.</p>
            </Section>

            <Section num="7" title="Data Retention">
              <p>We retain participant data for the duration of Virtual Hackathon 2K26 and for a reasonable period afterward for record-keeping, certificate verification, and prize distribution, after which it may be archived or deleted.</p>
            </Section>

            <Section num="8" title="Children's Privacy">
              <p>This hackathon is intended for students and professionals. If you are under 18, please register with the consent and involvement of a parent or guardian.</p>
            </Section>

            <Section num="9" title="Changes to This Policy">
              <p>We may update this Privacy Policy from time to time. Material changes will be communicated via email or through the WhatsApp community group.</p>
            </Section>

            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-950 flex items-center gap-2"><span className="text-brand-blue">10.</span> Contact Us</h2>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-2">
                <p className="font-bold text-slate-900">VASHIK</p>
                <p className="text-sm">Kazipet, Warangal, Telangana</p>
                <p className="text-sm flex items-center gap-2 pt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-purple"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  <span>Email: <a href="mailto:vashiktechnology@gmail.com" className="text-brand-purple font-semibold hover:underline support-email-link">vashiktechnology@gmail.com</a></span>
                </p>
                <p className="text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-purple"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  <span>Phone: 9381728045</span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ num, title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg sm:text-xl font-bold text-slate-950 flex items-center gap-2"><span className="text-brand-blue">{num}.</span> {title}</h2>
      {children}
    </section>
  );
}
function Bullet() { return <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 shrink-0"></span>; }
function Bullet2() { return <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0"></span>; }
function Bullet3() { return <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 shrink-0"></span>; }