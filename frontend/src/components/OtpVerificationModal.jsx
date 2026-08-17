import { useState, useRef, useEffect } from 'react';
import ApiService from '../services/api';
import { useToast } from '../contexts/ToastContext';
import Logo from './ui/Logo';

export default function OtpVerificationModal({ email, onSuccess, onClose }) {
  const { success: toastSuccess, error: toastError } = useToast();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for resend code
  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    // Keep only numbers
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue && value !== '') return;

    const newDigits = [...digits];
    newDigits[index] = cleanValue.slice(-1);
    setDigits(newDigits);

    // Auto-advance focus to next input
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits entered
    if (newDigits.every((d) => d !== '')) {
      handleVerify(newDigits.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < pastedData.length; i += 1) {
      newDigits[i] = pastedData[i];
    }
    setDigits(newDigits);

    if (pastedData.length === 6) {
      handleVerify(pastedData);
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  const handleVerify = async (codeToVerify) => {
    const code = codeToVerify || digits.join('');
    if (code.length !== 6) {
      toastError('Please enter all 6 digits');
      return;
    }

    setSubmitting(true);
    try {
      const res = await ApiService.verifyEmail({ email, code });
      toastSuccess('Email verified successfully!');
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      toastError(err.message || 'Invalid verification code');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    try {
      await ApiService.resendVerificationCode({ email });
      toastSuccess('A new 6-digit code has been sent to your email');
      setResendCooldown(60);
    } catch (err) {
      toastError(err.message || 'Could not resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <button
        type="button"
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm cursor-default"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal Dialog Box (Clean Light Mode) */}
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-2xl p-6 sm:p-8 text-center animate-scale-in z-10 text-slate-900">
        <div className="flex justify-center mb-4">
          <Logo height={28} />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Check your email</h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-4">
          We sent a 6-digit verification code to{' '}
          <span className="font-bold text-emerald-600">{email}</span>
        </p>

        {/* Spam / Junk Notice Box */}
        <div className="mb-6 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] sm:text-xs text-amber-700 dark:text-amber-600 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Check your <strong>Spam / Junk folder</strong> if you don&apos;t see the email immediately.</span>
        </div>

        {/* 6 Digit Input Group (Light Mode) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-10 h-12 sm:w-12 sm:h-14 rounded-xl border border-slate-300 bg-slate-50 text-center font-mono text-xl sm:text-2xl font-bold text-slate-900 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-xs"
            />
          ))}
        </div>

        {/* Action Buttons */}
        <button
          type="button"
          onClick={() => handleVerify()}
          disabled={submitting || digits.some((d) => !d)}
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-sm text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 mb-4"
        >
          {submitting ? 'Verifying...' : 'Verify Email'}
        </button>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Didn&apos;t receive code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || resending}
            className="font-bold text-emerald-600 hover:underline disabled:opacity-50 disabled:no-underline"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : resending ? 'Sending…' : 'Resend Code'}
          </button>
        </div>
      </div>
    </div>
  );
}
