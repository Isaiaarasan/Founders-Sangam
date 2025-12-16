import React from "react";

// --- START: FooterSection Component ---
const FooterSection = ({ title, links }) => (
  <div className="flex flex-col">
    <h4
      className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-[0.15em] mb-3 border-b border-transparent pb-1 
      hover:border-amber-500 transition-colors duration-300"
    >
      {title}
    </h4>

    <ul className="space-y-3">
      {links.map((l, i) => (
        <li key={i}>
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-600 dark:text-slate-400 relative group hover:text-amber-500 transition-all duration-200 block"
          >
            {l.label}

            <span
              className="absolute left-0 bottom-0 h-[1px] w-full bg-gradient-to-r from-amber-500/0 via-red-500/0 to-sky-500/0 transition-all duration-300 
              scale-x-0 group-hover:scale-x-100 origin-left"
            ></span>

            <span
              className="absolute left-0 bottom-[-4px] w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 bg-gradient-to-br from-amber-400 to-red-500 
              transition-all duration-300 group-hover:translate-x-1.5"
            ></span>
          </a>
        </li>
      ))}
    </ul>
  </div>
);
// --- END: FooterSection Component ---

// --- START: Footer Component ---
const Footer = () => {
  return (
    <footer
      className="relative pt-10 pb-4 overflow-hidden 
      bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:to-black
      shadow-lg dark:shadow-2xl dark:shadow-slate-900/50 
      before:content-[''] before:absolute before:inset-0 
      before:bg-repeat before:opacity-10 dark:before:opacity-[0.05]
      before:bg-[size:25px_25px] 
      before:bg-[radial-gradient(ellipse_at_center,_#94a3b8_1px,_transparent_0)] 
      dark:before:bg-[radial-gradient(ellipse_at_center,_#0f172a_1px,_transparent_0)]"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <div className="absolute top-[-10%] left-[15%] w-[200px] h-[200px] bg-amber-400/15 dark:bg-amber-500/10 blur-[70px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[10%] w-[220px] h-[220px] bg-sky-400/15 dark:bg-sky-500/10 blur-[80px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* BRAND */}
        <div className="mb-6 pb-2 border-b border-white/20 dark:border-slate-800/60">
          <div className="flex items-center gap-3 mb-2">
            {/* Dots */}
            <div className="flex -space-x-1">
              {[
                "bg-amber-400",
                "bg-red-500",
                "bg-emerald-500",
                "bg-sky-500",
              ].map((color, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border border-white/80 dark:border-slate-900/70 ${color} 
                    hover:scale-110 hover:shadow-md transition-all duration-300`}
                ></div>
              ))}
            </div>

            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-500 via-red-500 to-sky-500 bg-clip-text text-transparent">
              FOUNDERS SANGAM
            </span>
          </div>

          <div className="h-px w-20 bg-gradient-to-r from-amber-500/60 to-sky-500/60" />
        </div>

        {/* GRID LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <FooterSection
            title="Community"
            links={[
              { label: "Events", href: "/events" },
              { label: "Mentorship", href: "/courses" },
            ]}
          />

          <FooterSection
            title="Connect"
            links={[
              {
                label: "Instagram",
                href: "https://www.instagram.com/founder.sangam",
              },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/company/founders-sangam/",
              },
              {
                label: "YouTube",
                href: "https://www.youtube.com/channel/UCIVx_-c90l7W89WgpRQF6dA",
              },
            ]}
          />

          <FooterSection
            title="Policies"
            links={[
              { label: "Privacy Policy", href: "/privacy-policy" },
              {
                label: "Refund & Cancellation Policy",
                href: "/refund-cancellation-policy",
              },
              { label: "Terms & Conditions", href: "/terms-conditions" },
            ]}
          />
        </div>

        {/* BOTTOM SECTION — CENTERED */}
        <div
          className="pt-4 border-t border-white/20 dark:border-slate-800/40 
          flex flex-col items-center justify-center gap-3 text-center"
        >
          <p
            className="text-slate-400 text-xs 
              hover:text-amber-500 transition-colors duration-300 cursor-default"
          >
            © 2025 Founders Sangam. All rights reserved.
          </p>

          {/* Built with + Logo (Center + Bold) */}
          <div className="flex gap-4 items-center justify-center">
            <a
              href="https://isaii.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 group"
            >
              <span className="text-sm font-semibold text-slate-500">
                Built with
              </span>

              <img
                src="/Images/isaii-logo.png"
                alt="Logo"
                className="w-10 h-10 object-contain
                  group-hover:scale-110 transition-transform duration-300"
              />
            </a>

            {/* {[
              "from-amber-400 to-yellow-500",
              "from-red-500 to-rose-600",
              "from-emerald-500 to-green-600",
              "from-sky-500 to-blue-600",
            ].map((gradient, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${gradient} animate-pulse`}
                style={{
                  animationDelay: `${i * 0.25}s`,
                  animationDuration: "3s",
                }}
              ></div>
            ))} */}
          </div>
        </div>
      </div>
    </footer>
  );
};
// --- END: Footer Component ---

export default Footer;
