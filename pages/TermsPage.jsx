import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function TermsPage() {
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><polyline points="12 19 5 12 12 5" /></svg>
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink"></div>
          <div className="border-b border-slate-100 pb-8 mb-8">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-purple">Legal</span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">Terms of Service</h1>
            <p className="text-sm text-slate-400 mt-2 font-medium">Last updated: July 8, 2026</p>
          </div>

          <div className="space-y-8 text-slate-600 leading-relaxed text-sm sm:text-base">
            <Section num="1" title="Acceptance of Terms">
              <p>By registering for or participating in Virtual Hackathon 2K26, organized by VASHIK, you agree to be bound by these Terms of Service. If you do not agree, please do not register.</p>
            </Section>
            <Section num="2" title="Eligibility">
              <p>The hackathon is open to students and professionals interested in coding and innovation. Participants under 18 must register with parental or guardian consent. VASHIK reserves the right to verify eligibility and disqualify participants who provide false information.</p>
            </Section>
            <Section num="3" title="Hackathon Structure">
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 shrink-0"></span><span><strong>Module 1 (Online):</strong> Registration fee ₹9. Runs 20 days, comprising 20 tasks (6 subtasks/day). Top 3 performers receive free access to Module 2.</span></li>
                <li className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 shrink-0"></span><span><strong>Module 2 (Online):</strong> Registration fee ₹149 per team member. A 42-hour hackathon conducted over 2 days. Top 5 teams advance to Module 3.</span></li>
                <li className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 shrink-0"></span><span><strong>Module 3 (Offline):</strong> In-person event for the 5 qualifying teams. 2 winning teams receive a cash prize and a hamper prize, respectively, along with achievement certificates.</span></li>
              </ul>
              <p className="pt-2 text-slate-500 italic">VASHIK reserves the right to modify the schedule, tasks, format, or fee structure at its discretion, with reasonable prior notice to registered participants.</p>
            </Section>
            <Section num="4" title="Registration Fees &amp; Refunds">
              <p>Registration fees are non-refundable except where required by law, or in the event VASHIK cancels a module entirely. Fees do not guarantee advancement to subsequent modules — advancement is based solely on performance as described above.</p>
            </Section>
            <Section num="5" title="Participant Conduct">
              <p>Participants agree to:</p>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0"></span><span>Submit only original work; plagiarism or use of unauthorized pre-built solutions may result in disqualification.</span></li>
                <li className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0"></span><span>Not engage in harassment, cheating, or disruptive behavior toward organizers or fellow participants, including in the WhatsApp community group.</span></li>
                <li className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0"></span><span>Provide accurate registration and team information.</span></li>
                <li className="flex items-start gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0"></span><span>Comply with any additional rules published for each module.</span></li>
              </ul>
            </Section>
            <Section num="6" title="Intellectual Property">
              <p>Participants retain ownership of the projects and code they create during the hackathon. By submitting work, you grant VASHIK a non-exclusive, royalty-free license to showcase, publicize, and promote your submission (e.g. name, project name, screenshots) in connection with Virtual Hackathon 2K26 marketing and results announcements.</p>
            </Section>
            <Section num="7" title="Prizes">
              <p>Cash and hamper prizes, along with achievement certificates, will be awarded to the top teams in Module 3 as described on the event page. Participation certificates will be issued to all Module 1 and Module 2 participants. Prize eligibility requires compliance with these Terms and successful completion of all required verification steps. VASHIK is not responsible for delays caused by incorrect participant-provided information (e.g. bank/payment details).</p>
            </Section>
            <Section num="8" title="Account Security">
              <p>You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account. Notify us immediately at <a href="mailto:vashiktechnology@gmail.com" className="text-brand-purple font-semibold hover:underline support-email-link">vashiktechnology@gmail.com</a> if you suspect unauthorized access.</p>
            </Section>
            <Section num="9" title="Limitation of Liability">
              <p>VASHIK provides this hackathon on an "as is" basis and makes no guarantees regarding uninterrupted availability of the website or platform. To the maximum extent permitted by law, VASHIK is not liable for any indirect, incidental, or consequential damages arising from participation, including technical issues, internet outages, or third-party service disruptions (e.g. Supabase, payment gateway, WhatsApp).</p>
            </Section>
            <Section num="10" title="Disqualification &amp; Termination">
              <p>VASHIK reserves the right to disqualify any participant or team found violating these Terms, and to suspend or terminate access to the platform at its discretion.</p>
            </Section>
            <Section num="11" title="Governing Law">
              <p>These Terms are governed by the laws of India, with jurisdiction in the courts of Warangal, Telangana.</p>
            </Section>
            <Section num="12" title="Changes to These Terms">
              <p>VASHIK may revise these Terms at any time. Continued participation after changes are posted constitutes acceptance of the revised Terms.</p>
            </Section>

            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-950 flex items-center gap-2"><span className="text-brand-blue">13.</span> Contact Us</h2>
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