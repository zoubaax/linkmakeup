export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center font-bold text-white text-xs">
            L
          </div>
          <span className="font-bold text-slate-200 text-base">LinkMakeup</span>
          <span className="text-xs text-slate-500 font-mono">v1.0 MVP</span>
        </div>

        <p className="text-xs text-slate-500 text-center md:text-left">
          © {new Date().getFullYear()} LinkMakeup. Built with React, Express, Neon PostgreSQL & Cloudflare Wildcard DNS.
        </p>

        <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          <a href="https://github.com/zoubaax/linkmakeup" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
