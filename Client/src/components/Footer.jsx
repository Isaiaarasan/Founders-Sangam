import React from "react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 pt-12 pb-6 border-t border-slate-200 dark:border-slate-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* BRAND */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-1">
              {["bg-amber-400", "bg-red-500", "bg-emerald-500", "bg-sky-500"].map((color, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border border-white dark:border-slate-900 ${color}`}
                ></div>
              ))}
            </div>

            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              FOUNDERS SANGAM
            </span>
          </div>
        </div>

        {/* GRID LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* COMMUNITY */}
          <FooterSection
            title="Community"
            links={[
              { label: "Events", href: "https://founders-sangam.vercel.app/events" },
              // { label: "Membership", href: "https://founders-sangam.vercel.app/" },
              { label: "Mentorship", href: "https://founders-sangam.vercel.app/courses" },
            ]}
          />

          {/* CONNECT */}
          <FooterSection
            title="Connect"
            links={[
              {
                label: "Instagram",
                href: "https://www.instagram.com/founder.sangam?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
              },
              { label: "LinkedIn", href: "https://www.linkedin.com/company/founders-sangam/" },
              { label: "Twitter", href: "https://twitter.com/founders_sangam" },
            ]}
          />

          {/* POLICIES */}
          <FooterSection
            title="Policies"
            links={[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Refund & Cancellation Policy", href: "/refund-cancellation-policy" },
              { label: "Terms & Conditions", href: "/terms-conditions" },
            ]}
          />
        </div>

        {/* BOTTOM */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">
            © 2025 Founders Sangam. All rights reserved.
          </p>

          {/* COLOR DOT ANIMATION */}
          <div className="flex gap-3 items-center">
            {[
              "from-amber-400 to-yellow-500",
              "from-red-500 to-rose-600",
              "from-emerald-500 to-green-600",
              "from-sky-500 to-blue-600",
            ].map((gradient, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full bg-gradient-to-br ${gradient} animate-wave`}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterSection = ({ title, links }) => (
  <div className="flex flex-col">
    <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
      {title}
    </h4>
    <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
      {links.map((l, i) => (
        <li key={i}>
          <a href={l.href} className="hover:text-amber-500 transition-colors">
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
