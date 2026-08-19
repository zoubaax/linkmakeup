import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiBolt, HiArrowPath, HiArrowRight, HiCheck } from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa6';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import Header from './landing/Header';
import Footer from './landing/Footer';
import { ScrollAndClickNfc3DFlip } from './landing/strategy/StrategyPageLayout';

const inputClass =
  'w-full px-4 py-3 bg-[var(--lm-surface-alt)] border border-[var(--lm-border)] rounded-xl text-sm text-[var(--lm-fg)] placeholder:text-[var(--lm-fg-subtle)] focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all';

const MOROCCAN_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Tangier (Tanger)',
  'Agadir',
  'Fes (Fès)',
  'Meknes',
  'Oujda',
  'Kenitra',
  'Tetouan',
  'Safi',
  'Mohammedia',
  'El Jadida',
  'Nador',
  'Beni Mellal',
  'Khouribga',
  'Taza',
  'Khemisset',
  'Guelmim',
  'Laâyoune',
  'Dakhla',
  'Essaouira',
  'Berkane',
  'Al Hoceima',
  'Ksar El Kebir',
  'Larache',
  'Settat',
  'Other / Other City',
];

export default function OrderNfcPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    customCity: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: cleanValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCity =
      formData.city === 'Other / Other City'
        ? formData.customCity.trim()
        : formData.city.trim();

    if (!formData.fullName.trim() || !formData.phone.trim() || !finalCity || !formData.address.trim()) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }

    if (formData.phone.trim().length !== 10) {
      setErrorMsg('Phone number must be exactly 10 digits (e.g. 0612345678).');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await ApiService.createNfcOrder({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        city: finalCity,
        address: formData.address.trim(),
      });

      if (response.success && response.data) {
        setSubmittedOrder(response.data);
      } else {
        throw new Error(response.message || 'Failed to place order.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--lm-app)] text-[var(--lm-fg)] font-sans p-4 sm:p-8 flex flex-col justify-between selection:bg-emerald-600 selection:text-white transition-colors duration-300">
      {/* Original SaaS Navbar Header */}
      <Header user={user} profile={profile} />

      <main id="main-content" className="flex-1 max-w-6xl mx-auto px-2 sm:px-4 py-8 sm:py-12 w-full">
        {submittedOrder ? (
          /* SUCCESS CONFIRMATION SCREEN */
          <div className="max-w-xl mx-auto bg-[var(--lm-surface)] border border-[var(--lm-border)] rounded-3xl p-6 sm:p-8 shadow-xl text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <HiCheck className="w-8 h-8" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[var(--lm-fg)] mb-2">Order Confirmed!</h1>
            <p className="text-sm text-[var(--lm-fg-muted)] mb-6">
              Thank you, <strong className="text-[var(--lm-fg)]">{submittedOrder.fullName}</strong>! Your NFC Smart Card order has been received. We will contact you on phone or WhatsApp shortly to confirm shipping details.
            </p>

            {/* Summary Box */}
            <div className="bg-[var(--lm-surface-alt)] border border-[var(--lm-border)] rounded-2xl p-4 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-[var(--lm-fg-subtle)]">Order ID:</span>
                <span className="font-mono text-[var(--lm-fg)] font-bold truncate max-w-[200px]">{submittedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--lm-fg-subtle)]">Full Name:</span>
                <span className="font-semibold text-[var(--lm-fg)]">{submittedOrder.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--lm-fg-subtle)]">Phone Number:</span>
                <span className="font-semibold text-[var(--lm-fg)]">{submittedOrder.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--lm-fg-subtle)]">City:</span>
                <span className="font-semibold text-[var(--lm-fg)]">{submittedOrder.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--lm-fg-subtle)]">Delivery Address:</span>
                <span className="font-semibold text-[var(--lm-fg)] truncate max-w-[220px]">{submittedOrder.address}</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Hello! I just ordered an NFC Smart Card on LinkMakeup.\nName: ${submittedOrder.fullName}\nCity: ${submittedOrder.city}\nPhone: ${submittedOrder.phone}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <FaWhatsapp className="w-4 h-4 shrink-0" />
                <span>Quick Contact on WhatsApp</span>
              </a>

              <Link
                to={user ? "/dashboard" : "/"}
                className="w-full sm:w-auto py-3 px-5 rounded-xl border border-[var(--lm-border)] bg-[var(--lm-surface)] hover:bg-[var(--lm-surface-alt)] font-semibold text-xs text-[var(--lm-fg)] transition-colors"
              >
                {user ? "Go to Dashboard" : "Return Home"}
              </Link>
            </div>
          </div>
        ) : (
          /* MAIN ORDER PAGE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Right Column (Mobile Order 1, Desktop Order 2): 4-Field Checkout Form */}
            <div className="order-1 lg:order-2 lg:col-span-6">
              <div className="bg-[var(--lm-surface)] border border-[var(--lm-border)] rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-[var(--lm-border)]">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--lm-fg)]">Delivery Information</h2>
                    <p className="text-xs text-[var(--lm-fg-subtle)] mt-1">
                      Fill in your details below to place your NFC Smart Card order.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black font-serif text-emerald-600 dark:text-emerald-400">200 DH</span>
                    <p className="text-[10px] text-[var(--lm-fg-subtle)] font-medium">Pay on Delivery</p>
                  </div>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* 1. Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--lm-fg-subtle)] uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. Younes Zoubaa"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* 2. Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--lm-fg-subtle)] uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="e.g. 0612345678"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* 3. City */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--lm-fg-subtle)] uppercase tracking-wider mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="" disabled className="bg-[var(--lm-surface)] text-[var(--lm-fg-subtle)]">
                        Select your city...
                      </option>
                      {MOROCCAN_CITIES.map((c) => (
                        <option key={c} value={c} className="bg-[var(--lm-surface)] text-[var(--lm-fg)]">
                          {c}
                        </option>
                      ))}
                    </select>

                    {formData.city === 'Other / Other City' && (
                      <input
                        type="text"
                        name="customCity"
                        placeholder="Type your city name..."
                        value={formData.customCity}
                        onChange={handleChange}
                        required
                        className={`${inputClass} mt-2 animate-in fade-in zoom-in-95 duration-200`}
                      />
                    )}
                  </div>

                  {/* 4. Delivery Address */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--lm-fg-subtle)] uppercase tracking-wider mb-1.5">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      rows="3"
                      placeholder="e.g. Street name, Building #, Apartment, Neighborhood"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-3 sm:px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer mt-2"
                  >
                    {loading ? (
                      <span className="whitespace-nowrap">Submitting Order...</span>
                    ) : (
                      <>
                        <span className="whitespace-nowrap">Confirm & Place Order — 200 DH</span>
                        <HiArrowRight className="w-4 h-4 shrink-0" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Left Column (Mobile Order 2, Desktop Order 1): 3D NFC Card Preview & Product Pitch */}
            <div className="order-2 lg:order-1 lg:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--lm-fg)] tracking-tight leading-tight">
                Order Your Custom <span className="text-emerald-600 dark:text-emerald-400">NFC Smart Card</span>
              </h1>

              <p className="text-sm sm:text-base text-[var(--lm-fg-muted)] max-w-lg">
                Tap your physical smart card against any smartphone to instantly share your digital profile, social media links, contact card, and website.
              </p>

              {/* 3D Showcase */}
              <div className="w-full max-w-md py-4">
                <ScrollAndClickNfc3DFlip />
              </div>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-3 w-full text-left">
                <div className="p-3.5 rounded-2xl bg-[var(--lm-surface)] border border-[var(--lm-border)] flex items-center gap-3 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <HiBolt className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--lm-fg)]">Instant Tap</p>
                    <p className="text-[10px] text-[var(--lm-fg-subtle)]">No apps required</p>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-[var(--lm-surface)] border border-[var(--lm-border)] flex items-center gap-3 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <HiArrowPath className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--lm-fg)]">Unlimited Updates</p>
                    <p className="text-[10px] text-[var(--lm-fg-subtle)]">Edit links anytime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Original SaaS Landing Footer */}
      <Footer />
    </div>
  );
}

