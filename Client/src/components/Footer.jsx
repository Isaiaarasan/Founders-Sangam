import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 pt-12 pb-6 border-t border-slate-200 dark:border-slate-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* BRAND SECTION (Full Row) */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-1">
              <div className="w-3 h-3 rounded-full border border-white dark:border-slate-900 bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full border border-white dark:border-slate-900 bg-red-500"></div>
              <div className="w-3 h-3 rounded-full border border-white dark:border-slate-900 bg-emerald-500"></div>
              <div className="w-3 h-3 rounded-full border border-white dark:border-slate-900 bg-sky-500"></div>
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              FOUNDERS SANGAM
            </span>
          </div>

          {/* <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md">
            Empowering the next generation of Tirupur's entrepreneurs through
            community, mentorship, and collaboration.
          </p> */}
        </div>

        {/* 3-Column Straight Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* COMMUNITY */}
          <div className="flex flex-col">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
              Community
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Membership
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Mentorship
                </a>
              </li>
            </ul>
          </div>

          {/* CONNECT */}
          <div className="flex flex-col">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
              Connect
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-500 transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          {/* POLICIES */}
          <div className="flex flex-col">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">
              Policies
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a
                  href="/privacy-policy"
                  className="hover:text-amber-500 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/refund-cancellation-policy"
                  className="hover:text-amber-500 transition-colors"
                >
                  Refund & Cancellation Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-conditions"
                  className="hover:text-amber-500 transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">
            © 2025 Founders Sangam. All rights reserved.
          </p>

          {/* <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"
              ></div>
            ))}
          </div> */}
          <div className="flex gap-3 items-center">
            {[
              "from-amber-400 to-yellow-500",
              "from-red-500 to-rose-600",
              "from-emerald-500 to-green-600",
              "from-sky-500 to-blue-600",
            ].map((gradient, i) => (
              <div
                key={i}
                className={`
        w-3 h-3 rounded-full 
        bg-gradient-to-br ${gradient}
        animate-wave
      `}
                style={{ animationDelay: `${i * 0.15}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
