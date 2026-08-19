import React from 'react';
import { FiCheck, FiZap, FiGlobe, FiSmartphone, FiShield, FiTrendingUp, FiCreditCard, FiStar, FiX } from 'react-icons/fi';
import nfcCardsFront from '../../assets/nfc crdas.png';
import nfcCardsBack from '../../assets/nfc crdas back.png';

export default function ReactBitsPricingCards({ onSelectPlan }) {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 px-4 antialiased">
      {/* Plan Cards Grid */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        
        {/* CARD 1: FREE PLAN */}
        <div className="relative rounded-[32px] p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-zinc-900/95 border border-slate-200/90 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <FiGlobe className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400">
                  DIGITAL PROFILE
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free Plan</h3>
                <div className="pt-1.5 flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black font-serif text-slate-900 dark:text-white tracking-tight">
                    0 DH
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/forever</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                For developers, creators, and professionals to build their digital identity and link-in-bio page.
              </p>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={() => onSelectPlan?.('free')}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 font-bold text-sm transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
            >
              Start for Free
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center pt-2">
              <div className="w-full border-t border-slate-200 dark:border-zinc-800" />
              <span className="absolute bg-white dark:bg-zinc-900 px-3 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                INCLUDED FEATURES
              </span>
            </div>

            {/* Feature Checklist (Included + Strikethrough Unavailable Pro Features) */}
            <ul className="space-y-3 pt-1">
              {/* Included Features */}
              <li className="flex items-center gap-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <FiCheck className="w-4 h-4 stroke-[3]" />
                </div>
                <span>Custom Subdomain (<strong className="font-semibold text-slate-900 dark:text-white">username.linkmakeup.com</strong>)</span>
              </li>

              <li className="flex items-center gap-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <FiCheck className="w-4 h-4 stroke-[3]" />
                </div>
                <span>Unlimited Bio Links & Social Buttons</span>
              </li>

              <li className="flex items-center gap-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <FiCheck className="w-4 h-4 stroke-[3]" />
                </div>
                <span>Built-in Dynamic QR Code Generator</span>
              </li>

              <li className="flex items-center gap-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <FiCheck className="w-4 h-4 stroke-[3]" />
                </div>
                <span>Sub-50ms Global Edge Latency (Cloudflare V8)</span>
              </li>

              {/* Disabled Strikethrough Pro Features (Line Mode) */}
              <li className="flex items-center gap-3 text-xs text-slate-400 dark:text-zinc-600 line-through opacity-50 font-normal">
                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800/60 text-slate-400 dark:text-zinc-600 shrink-0">
                  <FiX className="w-4 h-4 stroke-[2]" />
                </div>
                <span>Physical Custom Printed Matte Black NFC Card</span>
              </li>

              <li className="flex items-center gap-3 text-xs text-slate-400 dark:text-zinc-600 line-through opacity-50 font-normal">
                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800/60 text-slate-400 dark:text-zinc-600 shrink-0">
                  <FiX className="w-4 h-4 stroke-[2]" />
                </div>
                <span>Tap-to-Share in 2 Seconds (iPhone & Android)</span>
              </li>

              <li className="flex items-center gap-3 text-xs text-slate-400 dark:text-zinc-600 line-through opacity-50 font-normal">
                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800/60 text-slate-400 dark:text-zinc-600 shrink-0">
                  <FiX className="w-4 h-4 stroke-[2]" />
                </div>
                <span>Tap Analytics & Instant vCard Contact Download</span>
              </li>

              <li className="flex items-center gap-3 text-xs text-slate-400 dark:text-zinc-600 line-through opacity-50 font-normal">
                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800/60 text-slate-400 dark:text-zinc-600 shrink-0">
                  <FiX className="w-4 h-4 stroke-[2]" />
                </div>
                <span>Free Express Delivery across all Morocco</span>
              </li>
            </ul>
          </div>
        </div>


        {/* CARD 2: PRO / NFC CARD BUNDLE (POPULAR) */}
        <div className="relative rounded-[32px] p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-zinc-900/95 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/15 transition-all duration-300">
          
          {/* Popular Badge */}
          <div className="absolute top-6 right-6 px-3.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-xs">
            <FiStar className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
            <span>POPULAR</span>
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <FiCreditCard className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">NFC Smart Card Bundle</h3>
                <div className="pt-1.5 flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black font-serif text-slate-900 dark:text-white tracking-tight">
                    200 DH
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/one-time payment ($29)</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Physical custom matte black NFC card shipped directly to your door + Lifetime Pro profile.
              </p>
            </div>

            {/* Official Card Logo Image Showcase */}
            <div className="py-2 flex items-center justify-center">
              <img
                src="/walletcard.png"
                alt="Link Make Up Custom NFC Card"
                className="max-h-40 sm:max-h-48 w-auto object-contain rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.03]"
              />
            </div>



            {/* CTA Button */}
            <button
              type="button"
              onClick={() => onSelectPlan?.('nfc')}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all duration-200 shadow-xl shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              Order NFC Smart Card →
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center pt-2">
              <div className="w-full border-t border-slate-200 dark:border-zinc-800" />
              <span className="absolute bg-white dark:bg-zinc-900 px-3 text-[10px] font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                ALL FEATURES INCLUDED
              </span>
            </div>

            {/* Feature Checklist */}
            <ul className="space-y-3 pt-1">
              <li className="flex items-center gap-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <FiCreditCard className="w-4 h-4" />
                </div>
                <span>Custom Printed Matte Black NFC Card (Zero Subscriptions)</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <FiZap className="w-4 h-4" />
                </div>
                <span>Tap-to-Share in 2 Seconds (iPhone & Android)</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <FiTrendingUp className="w-4 h-4" />
                </div>
                <span>Tap Analytics & vCard Instant Contact Download</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <FiShield className="w-4 h-4" />
                </div>
                <span>Free Express Delivery across all Morocco</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
