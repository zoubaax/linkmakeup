import { useState } from 'react';
import { HiEnvelope, HiInboxStack, HiXMark } from 'react-icons/hi2';
import ApiService from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import Logo from './ui/Logo';
import { env } from '../config/env';
import walletCardImg from '../assets/walletcard.png';

export default function WalletCardModal({ profile, publicUrl, onClose }) {
  const { user } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const username = profile?.username || 'card';
  const displayName = profile?.displayName || 'LinkMakeup Creator';
  const targetUrl = publicUrl || `http://localhost:5173/${username}`;
  const apiUrl = env.apiUrl || 'http://localhost:5000/api/v1';

  const recipientEmail = user?.email || profile?.email;
  const appleWalletUrl = `${apiUrl}/wallet/apple/${username}`;
  const googleWalletUrl = `${apiUrl}/wallet/google/${username}`;

  const handleSendEmail = async () => {
    if (!recipientEmail) {
      toastError('No email address associated with account.');
      return;
    }

    setSendingEmail(true);
    try {
      await ApiService.sendWalletEmail({
        recipientEmail,
        username,
      });
      setEmailSent(true);
      toastSuccess(`Wallet card sent to ${recipientEmail}! Check your inbox & spam folder.`);
    } catch (err) {
      toastError(err.message || 'Could not send wallet card email.');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Dynamic Backdrop */}
      <button
        type="button"
        className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm cursor-default"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal Container with Light/Dark Mode Support */}
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl p-6 text-center animate-scale-in z-10 text-slate-900 dark:text-white my-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <Logo height={24} />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Digital Wallet Pass</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Add your card to Apple Pay or Google Wallet for 1-tap offline networking.</p>

        {/* Custom Wallet Card Frame based on walletcard.png */}
        <div className="relative w-full aspect-[1.75/1] rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 mb-5 text-left group">
          {/* Background Card Image */}
          <img
            src={walletCardImg}
            alt="LinkMakeup Wallet Card"
            className="w-full h-full object-cover"
          />

          {/* Top-Left User Name & Handle Overlay */}
          <div className="absolute top-7 sm:top-8 left-8 sm:left-9 right-20 z-10 text-left pointer-events-none">
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate drop-shadow-md">
              {displayName}
            </h4>
            <p className="text-[10px] sm:text-xs text-emerald-400 font-semibold truncate drop-shadow-md pt-0.5">
              @{username}
            </p>
          </div>
        </div>

        {/* 1-Click Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          {/* Apple Wallet (Coming Soon) */}
          <button
            type="button"
            disabled
            className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 dark:text-slate-500 cursor-not-allowed flex items-center justify-center gap-1.5 opacity-80"
          >
            <span></span> Apple Wallet <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">Soon</span>
          </button>

          {/* Google Wallet (Live) */}
          <a
            href={googleWalletUrl}
            target="_blank"
            rel="noreferrer"
            className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>G</span> Save to Google Wallet
          </a>
        </div>

        {/* Direct Send via Email Action */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80">
          <button
            type="button"
            onClick={handleSendEmail}
            disabled={sendingEmail}
            className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            <HiEnvelope className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            {sendingEmail ? 'Sending Email...' : 'Send Pass via Email'}
          </button>

          {/* Spam / Inbox Alert Message using React Icons */}
          {emailSent && (
            <div className="mt-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-left text-xs space-y-1 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-200">
                <HiInboxStack className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Email Sent to {recipientEmail}</span>
              </div>
              <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed pl-6">
                If you don't see the email in your inbox within 1 minute, please <strong>check your Spam / Junk folder</strong> and mark it as "Not Spam".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
