import type { Locale } from './types';

export interface UiStrings {
  appName: string;
  tagline: string;
  tabs: { home: string; discover: string; yatra: string; listen: string };
  sections: {
    history: string;
    architecture: string;
    legends: string;
    festivals: string;
    experience: string;
  };
  visit: {
    heading: string;
    timings: string;
    dressCode: string;
    photography: string;
    gettingThere: string;
  };
  labels: {
    templeOfTheDay: string;
    allTemples: string;
    circuits: string;
    stops: string;
    partOf: string;
    unesco: string;
    deity: string;
    dynasty: string;
    period: string;
    style: string;
    relatedTemples: string;
    whyItMatters: string;
    supportTemple: string;
    supportNote: string;
    listenComingSoon: string;
    languageName: string;
  };
}

export const strings: Record<Locale, UiStrings> = {
  en: {
    appName: 'Temple',
    tagline: 'Find, learn, and experience the great temples of South India',
    tabs: { home: 'Home', discover: 'Discover', yatra: 'Yatra', listen: 'Listen' },
    sections: {
      history: 'History',
      architecture: 'Architecture',
      legends: 'Legends',
      festivals: 'Festivals',
      experience: 'The Experience',
    },
    visit: {
      heading: 'Planning your darshan',
      timings: 'Timings',
      dressCode: 'Dress code',
      photography: 'Photography',
      gettingThere: 'Getting there',
    },
    labels: {
      templeOfTheDay: 'Temple of the day',
      allTemples: 'All temples',
      circuits: 'Pilgrimage circuits',
      stops: 'stops',
      partOf: 'Part of',
      unesco: 'UNESCO World Heritage',
      deity: 'Deity',
      dynasty: 'Dynasty',
      period: 'Period',
      style: 'Style',
      relatedTemples: 'Related temples',
      whyItMatters: 'Why this temple matters',
      supportTemple: 'Support this temple',
      supportNote: 'Donations go directly through the temple’s official channels.',
      listenComingSoon: 'Audio stories are coming soon. Every temple page will have a narrated story in your language.',
      languageName: 'English',
    },
  },
  ta: {
    appName: 'கோயில்',
    tagline: 'தென்னிந்தியாவின் மாபெரும் கோயில்களை கண்டறிந்து, அறிந்து, அனுபவியுங்கள்',
    tabs: { home: 'முகப்பு', discover: 'கண்டறி', yatra: 'யாத்திரை', listen: 'கேளுங்கள்' },
    sections: {
      history: 'வரலாறு',
      architecture: 'கட்டிடக்கலை',
      legends: 'தல புராணம்',
      festivals: 'திருவிழாக்கள்',
      experience: 'தரிசன அனுபவம்',
    },
    visit: {
      heading: 'தரிசனத் திட்டம்',
      timings: 'நேரங்கள்',
      dressCode: 'உடை முறை',
      photography: 'புகைப்படம்',
      gettingThere: 'செல்லும் வழி',
    },
    labels: {
      templeOfTheDay: 'இன்றைய கோயில்',
      allTemples: 'அனைத்து கோயில்கள்',
      circuits: 'யாத்திரை வழித்தடங்கள்',
      stops: 'தலங்கள்',
      partOf: 'இதன் பகுதி',
      unesco: 'யுனெஸ்கோ உலக பாரம்பரியம்',
      deity: 'மூலவர்',
      dynasty: 'அரச மரபு',
      period: 'காலம்',
      style: 'பாணி',
      relatedTemples: 'தொடர்புடைய கோயில்கள்',
      whyItMatters: 'இக்கோயிலின் சிறப்பு',
      supportTemple: 'இக்கோயிலை ஆதரியுங்கள்',
      supportNote: 'நன்கொடைகள் கோயிலின் அதிகாரப்பூர்வ வழிகள் மூலமாக நேரடியாக செல்லும்.',
      listenComingSoon: 'ஒலிக் கதைகள் விரைவில் வருகின்றன. ஒவ்வொரு கோயில் பக்கத்திலும் உங்கள் மொழியில் ஒரு கதை இருக்கும்.',
      languageName: 'தமிழ்',
    },
  },
  te: {
    appName: 'ఆలయం',
    tagline: 'దక్షిణ భారతదేశపు మహా ఆలయాలను కనుగొనండి, తెలుసుకోండి, అనుభవించండి',
    tabs: { home: 'హోమ్', discover: 'అన్వేషించండి', yatra: 'యాత్ర', listen: 'వినండి' },
    sections: {
      history: 'చరిత్ర',
      architecture: 'వాస్తుశిల్పం',
      legends: 'స్థల పురాణం',
      festivals: 'ఉత్సవాలు',
      experience: 'దర్శన అనుభవం',
    },
    visit: {
      heading: 'దర్శన ప్రణాళిక',
      timings: 'సమయాలు',
      dressCode: 'వస్త్రధారణ',
      photography: 'ఫోటోగ్రఫీ',
      gettingThere: 'చేరుకునే మార్గం',
    },
    labels: {
      templeOfTheDay: 'నేటి ఆలయం',
      allTemples: 'అన్ని ఆలయాలు',
      circuits: 'యాత్రా మార్గాలు',
      stops: 'క్షేత్రాలు',
      partOf: 'ఇందులో భాగం',
      unesco: 'యునెస్కో ప్రపంచ వారసత్వం',
      deity: 'మూలవిరాట్టు',
      dynasty: 'రాజవంశం',
      period: 'కాలం',
      style: 'శైలి',
      relatedTemples: 'సంబంధిత ఆలయాలు',
      whyItMatters: 'ఈ ఆలయ విశిష్టత',
      supportTemple: 'ఈ ఆలయాన్ని ఆదరించండి',
      supportNote: 'విరాళాలు ఆలయ అధికారిక మార్గాల ద్వారా నేరుగా వెళ్తాయి.',
      listenComingSoon: 'ఆడియో కథలు త్వరలో వస్తున్నాయి. ప్రతి ఆలయ పేజీలో మీ భాషలో ఒక కథ ఉంటుంది.',
      languageName: 'తెలుగు',
    },
  },
  kn: {
    appName: 'ದೇವಾಲಯ',
    tagline: 'ದಕ್ಷಿಣ ಭಾರತದ ಮಹಾನ್ ದೇವಾಲಯಗಳನ್ನು ಹುಡುಕಿ, ತಿಳಿಯಿರಿ, ಅನುಭವಿಸಿ',
    tabs: { home: 'ಮುಖಪುಟ', discover: 'ಅನ್ವೇಷಿಸಿ', yatra: 'ಯಾತ್ರೆ', listen: 'ಆಲಿಸಿ' },
    sections: {
      history: 'ಇತಿಹಾಸ',
      architecture: 'ವಾಸ್ತುಶಿಲ್ಪ',
      legends: 'ಸ್ಥಳ ಪುರಾಣ',
      festivals: 'ಉತ್ಸವಗಳು',
      experience: 'ದರ್ಶನ ಅನುಭವ',
    },
    visit: {
      heading: 'ದರ್ಶನ ಯೋಜನೆ',
      timings: 'ಸಮಯ',
      dressCode: 'ವಸ್ತ್ರ ಸಂಹಿತೆ',
      photography: 'ಛಾಯಾಗ್ರಹಣ',
      gettingThere: 'ತಲುಪುವ ದಾರಿ',
    },
    labels: {
      templeOfTheDay: 'ಇಂದಿನ ದೇವಾಲಯ',
      allTemples: 'ಎಲ್ಲಾ ದೇವಾಲಯಗಳು',
      circuits: 'ಯಾತ್ರಾ ಮಾರ್ಗಗಳು',
      stops: 'ಕ್ಷೇತ್ರಗಳು',
      partOf: 'ಇದರ ಭಾಗ',
      unesco: 'ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆ',
      deity: 'ಮೂಲ ದೇವರು',
      dynasty: 'ರಾಜವಂಶ',
      period: 'ಕಾಲ',
      style: 'ಶೈಲಿ',
      relatedTemples: 'ಸಂಬಂಧಿತ ದೇವಾಲಯಗಳು',
      whyItMatters: 'ಈ ದೇವಾಲಯದ ವಿಶೇಷತೆ',
      supportTemple: 'ಈ ದೇವಾಲಯವನ್ನು ಬೆಂಬಲಿಸಿ',
      supportNote: 'ದೇಣಿಗೆಗಳು ದೇವಾಲಯದ ಅಧಿಕೃತ ಮಾರ್ಗಗಳ ಮೂಲಕ ನೇರವಾಗಿ ಹೋಗುತ್ತವೆ.',
      listenComingSoon: 'ಆಡಿಯೊ ಕಥೆಗಳು ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿವೆ. ಪ್ರತಿ ದೇವಾಲಯದ ಪುಟದಲ್ಲಿ ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಕಥೆ ಇರುತ್ತದೆ.',
      languageName: 'ಕನ್ನಡ',
    },
  },
  ml: {
    appName: 'ക്ഷേത്രം',
    tagline: 'ദക്ഷിണേന്ത്യയിലെ മഹാക്ഷേത്രങ്ങൾ കണ്ടെത്തുക, അറിയുക, അനുഭവിക്കുക',
    tabs: { home: 'ഹോം', discover: 'കണ്ടെത്തുക', yatra: 'യാത്ര', listen: 'കേൾക്കുക' },
    sections: {
      history: 'ചരിത്രം',
      architecture: 'വാസ്തുവിദ്യ',
      legends: 'ഐതിഹ്യങ്ങൾ',
      festivals: 'ഉത്സവങ്ങൾ',
      experience: 'ദർശനാനുഭവം',
    },
    visit: {
      heading: 'ദർശന ആസൂത്രണം',
      timings: 'സമയങ്ങൾ',
      dressCode: 'വസ്ത്രധാരണം',
      photography: 'ഫോട്ടോഗ്രാഫി',
      gettingThere: 'എത്തിച്ചേരാനുള്ള വഴി',
    },
    labels: {
      templeOfTheDay: 'ഇന്നത്തെ ക്ഷേത്രം',
      allTemples: 'എല്ലാ ക്ഷേത്രങ്ങളും',
      circuits: 'തീർത്ഥാടന പാതകൾ',
      stops: 'ക്ഷേത്രങ്ങൾ',
      partOf: 'ഇതിന്റെ ഭാഗം',
      unesco: 'യുനെസ്കോ ലോക പൈതൃകം',
      deity: 'പ്രതിഷ്ഠ',
      dynasty: 'രാജവംശം',
      period: 'കാലഘട്ടം',
      style: 'ശൈലി',
      relatedTemples: 'ബന്ധപ്പെട്ട ക്ഷേത്രങ്ങൾ',
      whyItMatters: 'ഈ ക്ഷേത്രത്തിന്റെ പ്രാധാന്യം',
      supportTemple: 'ഈ ക്ഷേത്രത്തെ പിന്തുണയ്ക്കുക',
      supportNote: 'സംഭാവനകൾ ക്ഷേത്രത്തിന്റെ ഔദ്യോഗിക മാർഗങ്ങളിലൂടെ നേരിട്ട് പോകുന്നു.',
      listenComingSoon: 'ഓഡിയോ കഥകൾ ഉടൻ വരുന്നു. ഓരോ ക്ഷേത്ര പേജിലും നിങ്ങളുടെ ഭാഷയിൽ ഒരു കഥ ഉണ്ടാകും.',
      languageName: 'മലയാളം',
    },
  },
  hi: {
    appName: 'मंदिर',
    tagline: 'दक्षिण भारत के महान मंदिरों को खोजें, जानें और अनुभव करें',
    tabs: { home: 'होम', discover: 'खोजें', yatra: 'यात्रा', listen: 'सुनें' },
    sections: {
      history: 'इतिहास',
      architecture: 'वास्तुकला',
      legends: 'स्थल पुराण',
      festivals: 'उत्सव',
      experience: 'दर्शन अनुभव',
    },
    visit: {
      heading: 'दर्शन की योजना',
      timings: 'समय',
      dressCode: 'वेशभूषा',
      photography: 'फोटोग्राफी',
      gettingThere: 'पहुँचने का मार्ग',
    },
    labels: {
      templeOfTheDay: 'आज का मंदिर',
      allTemples: 'सभी मंदिर',
      circuits: 'तीर्थ मार्ग',
      stops: 'क्षेत्र',
      partOf: 'इसका भाग',
      unesco: 'यूनेस्को विश्व धरोहर',
      deity: 'मूल देवता',
      dynasty: 'राजवंश',
      period: 'काल',
      style: 'शैली',
      relatedTemples: 'संबंधित मंदिर',
      whyItMatters: 'इस मंदिर का महत्व',
      supportTemple: 'इस मंदिर का समर्थन करें',
      supportNote: 'दान सीधे मंदिर के आधिकारिक माध्यमों से जाता है।',
      listenComingSoon: 'ऑडियो कथाएँ जल्द आ रही हैं। हर मंदिर पृष्ठ पर आपकी भाषा में एक कथा होगी।',
      languageName: 'हिन्दी',
    },
  },
};

export function t(locale: Locale): UiStrings {
  return strings[locale] ?? strings.en;
}
