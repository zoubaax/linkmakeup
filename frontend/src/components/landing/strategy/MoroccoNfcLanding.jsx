import React from 'react';
import { FiSmartphone, FiRefreshCw, FiShield, FiSend, FiActivity, FiGlobe, FiCheck } from 'react-icons/fi';
import StrategyPageLayout, { ScrollAndClickNfc3DFlip } from './StrategyPageLayout';
import SEOHead from '../../common/SEOHead';

export default function MoroccoNfcLanding() {
  const seo = {
    title: 'Carte de Visite Digitale & NFC au Maroc | Link Make Up',
    description: 'La plateforme de référence au Maroc pour cartes de visite digitales, NFC et sous-domaines professionnels. Partagez votre profil, portfolio et coordonnées en un tap.',
    keywords: 'carte de visite digitale maroc, carte nfc maroc, link in bio maroc, carte de visite sans contact casablanca, carte nfc rabat marrakech, link make up maroc',
    canonicalUrl: 'https://linkmakeup.com/fr/carte-de-visite-digitale-maroc',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': 'Carte de Visite NFC & Digitale Maroc — Link Make Up',
    'image': 'https://linkmakeup.com/logo-d.png',
    'description': 'Carte de visite sans contact NFC et profil digital professionnel pour entrepreneurs, freelancers, et entreprises au Maroc.',
    'brand': {
      '@type': 'Brand',
      'name': 'Link Make Up'
    },
    'offers': {
      '@type': 'Offer',
      'price': '99',
      'priceCurrency': 'MAD',
      'availability': 'https://schema.org/InStock',
      'areaServed': 'Morocco'
    }
  };

  const features = [
    {
      icon: <FiSmartphone className="w-5 h-5 text-emerald-500" />,
      title: 'Partage Instantané par Tap NFC',
      description: 'Aucune application requise. Compatible avec tous les smartphones (iPhone & Android). Un simple tap transfère vos coordonnées, site web et réseaux.',
    },
    {
      icon: <FiRefreshCw className="w-5 h-5 text-emerald-500" />,
      title: 'Mise à Jour en Temps Réel',
      description: 'Changement de numéro ou de poste ? Modifiez votre profil en ligne instantanément sans jamais réimprimer de cartes physiques.',
    },
    {
      icon: <FiGlobe className="w-5 h-5 text-emerald-500" />,
      title: 'Livraison Rapide Partout au Maroc',
      description: 'Expédition express sécurisée à Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès et dans toutes les villes du Maroc.',
    },
    {
      icon: <FiShield className="w-5 h-5 text-emerald-500" />,
      title: 'Finition Premium Mat & Résistante',
      description: 'Conçue en matériau ultra-résistant, étanche à l’eau et résistant aux rayures pour durer dans votre portefeuille.',
    },
    {
      icon: <FiSend className="w-5 h-5 text-emerald-500" />,
      title: 'Idéal pour le Networking au Maroc',
      description: 'Démarquez-vous lors de vos rendez-vous clients, salons professionnels et événements networking à Casablanca et Rabat.',
    },
    {
      icon: <FiActivity className="w-5 h-5 text-emerald-500" />,
      title: 'Statistiques & Suivi des Clics',
      description: 'Suivez en direct combien de personnes ont scanné votre carte NFC et consulté votre portfolio ou vos liens sociaux.',
    },
  ];

  const faqs = [
    {
      question: 'Est-ce que le destinataire a besoin d’une application ?',
      answer: 'Absolument pas ! Les smartphones modernes lisent les cartes NFC nativement. Il suffit d’approcher la carte du téléphone pour ouvrir immédiatement votre profil digital Link Make Up.',
    },
    {
      question: 'Comment se passe la livraison au Maroc ?',
      answer: 'Nous livrons à domicile partout au Maroc (Casablanca, Rabat, Marrakech, Tanger, Agadir, Fès, etc.) avec suivi de colis et paiement sécurisé ou en Dirhams (MAD).',
    },
    {
      question: 'Puis-je personnaliser ma carte NFC aux couleurs de mon entreprise ?',
      answer: 'Oui, vous pouvez ajouter votre logo, votre nom et choisir parmi nos designs premium épurés.',
    },
  ];

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonicalUrl={seo.canonicalUrl}
        jsonLd={jsonLd}
      />
      <StrategyPageLayout
        seo={seo}
        heroBadge="🇲🇦 N°1 de la Identité Digitale & Cartes NFC au Maroc"
        heroTitle="Votre Carte de Visite Digitale & NFC au Maroc"
        heroSubtitle="Fini les cartes en papier ! Partagez vos coordonnées, WhatsApp, portfolio et réseaux sociaux en 1 tap avec Link Make Up."
        features={features}
        faqs={faqs}
        demoWidget={
          <div className="flex flex-col items-center gap-4">
            <ScrollAndClickNfc3DFlip
              customMaxW="max-w-[200px] min-[380px]:max-w-[230px] sm:max-w-[260px] lg:max-w-[285px]"
            />
            {/* Moroccan Local Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <FiCheck className="w-4 h-4 text-emerald-400" />
              <span>Livraison express à domicile au Maroc (MAD Dirhams)</span>
            </div>
          </div>
        }
      />
    </>
  );
}
