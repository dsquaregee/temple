import type { Locale } from './types';

export interface UiStrings {
  appName: string;
  tagline: string;
  tabs: { home: string; discover: string; yatra: string; listen: string };
  favorites: {
    save: string;
    saved: string;
    savedTitle: string;
  };
  discover: {
    searchPlaceholder: string;
    circuit: string;
    region: string;
    era: string;
    all: string;
    unescoOnly: string;
    clear: string;
    results: string;
    none: string;
    eraEarly: string;
    eraClassical: string;
    eraLater: string;
    sort: string;
    sortFeatured: string;
    sortOldest: string;
    sortNewest: string;
    sortName: string;
  };
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
    videoStory: string;
    languageName: string;
  };
}

export const strings: Record<Locale, UiStrings> = {
  en: {
    appName: 'Temple',
    tagline: 'Find, learn, and experience the great temples of South India',
    tabs: { home: 'Home', discover: 'Discover', yatra: 'Yatra', listen: 'Listen' },
    favorites: { save: 'Save', saved: 'Saved', savedTitle: 'Saved temples' },
    discover: {
      searchPlaceholder: 'Search temples, deities, places…',
      circuit: 'Circuit',
      region: 'Region',
      era: 'Era',
      all: 'All',
      unescoOnly: 'UNESCO only',
      clear: 'Clear',
      results: 'temples',
      none: 'No temples match. Try clearing the filters.',
      eraEarly: 'Up to 7th c.',
      eraClassical: '8th–13th c.',
      eraLater: '14th c. onward',
      sort: 'Sort',
      sortFeatured: 'Featured',
      sortOldest: 'Oldest first',
      sortNewest: 'Newest first',
      sortName: 'By name',
    },
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
      videoStory: 'Video story',
      languageName: 'English',
    },
  },
  ta: {
    appName: 'கோயில்',
    tagline: 'தென்னிந்தியாவின் மாபெரும் கோயில்களை கண்டறிந்து, அறிந்து, அனுபவியுங்கள்',
    tabs: { home: 'முகப்பு', discover: 'கண்டறி', yatra: 'யாத்திரை', listen: 'கேளுங்கள்' },
    favorites: { save: 'சேமி', saved: 'சேமித்தது', savedTitle: 'சேமித்த கோயில்கள்' },
    discover: {
      searchPlaceholder: 'கோயில், மூலவர், ஊர் தேடுங்கள்…',
      circuit: 'வழித்தடம்',
      region: 'பகுதி',
      era: 'காலம்',
      all: 'அனைத்தும்',
      unescoOnly: 'யுனெஸ்கோ மட்டும்',
      clear: 'அழி',
      results: 'கோயில்கள்',
      none: 'எந்த கோயிலும் பொருந்தவில்லை. வடிகட்டிகளை நீக்கிப் பாருங்கள்.',
      eraEarly: '7ஆம் நூற்றாண்டு வரை',
      eraClassical: '8–13ஆம் நூற்றாண்டு',
      eraLater: '14ஆம் நூற்றாண்டு முதல்',
      sort: 'வரிசை',
      sortFeatured: 'சிறப்பு',
      sortOldest: 'பழமையானவை முதலில்',
      sortNewest: 'புதியவை முதலில்',
      sortName: 'அகர வரிசை',
    },
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
      videoStory: 'காணொளிக் கதை',
      languageName: 'தமிழ்',
    },
  },
  te: {
    appName: 'ఆలయం',
    tagline: 'దక్షిణ భారతదేశపు మహా ఆలయాలను కనుగొనండి, తెలుసుకోండి, అనుభవించండి',
    tabs: { home: 'హోమ్', discover: 'అన్వేషించండి', yatra: 'యాత్ర', listen: 'వినండి' },
    favorites: { save: 'భద్రపరచు', saved: 'భద్రపరచబడింది', savedTitle: 'భద్రపరచిన ఆలయాలు' },
    discover: {
      searchPlaceholder: 'ఆలయాలు, దేవతలు, ప్రదేశాల కోసం వెతకండి…',
      circuit: 'మార్గం',
      region: 'ప్రాంతం',
      era: 'కాలం',
      all: 'అన్నీ',
      unescoOnly: 'యునెస్కో మాత్రమే',
      clear: 'తొలగించు',
      results: 'ఆలయాలు',
      none: 'ఏ ఆలయమూ సరిపోలలేదు. వడపోతలను తొలగించి చూడండి.',
      eraEarly: '7వ శతాబ్దం వరకు',
      eraClassical: '8–13వ శతాబ్దాలు',
      eraLater: '14వ శతాబ్దం నుండి',
      sort: 'క్రమం',
      sortFeatured: 'ప్రత్యేకం',
      sortOldest: 'పురాతనమైనవి ముందు',
      sortNewest: 'కొత్తవి ముందు',
      sortName: 'అక్షర క్రమం',
    },
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
      videoStory: 'వీడియో కథ',
      languageName: 'తెలుగు',
    },
  },
  kn: {
    appName: 'ದೇವಾಲಯ',
    tagline: 'ದಕ್ಷಿಣ ಭಾರತದ ಮಹಾನ್ ದೇವಾಲಯಗಳನ್ನು ಹುಡುಕಿ, ತಿಳಿಯಿರಿ, ಅನುಭವಿಸಿ',
    tabs: { home: 'ಮುಖಪುಟ', discover: 'ಅನ್ವೇಷಿಸಿ', yatra: 'ಯಾತ್ರೆ', listen: 'ಆಲಿಸಿ' },
    favorites: { save: 'ಉಳಿಸಿ', saved: 'ಉಳಿಸಲಾಗಿದೆ', savedTitle: 'ಉಳಿಸಿದ ದೇವಾಲಯಗಳು' },
    discover: {
      searchPlaceholder: 'ದೇವಾಲಯ, ದೇವರು, ಸ್ಥಳ ಹುಡುಕಿ…',
      circuit: 'ಮಾರ್ಗ',
      region: 'ಪ್ರದೇಶ',
      era: 'ಕಾಲ',
      all: 'ಎಲ್ಲಾ',
      unescoOnly: 'ಯುನೆಸ್ಕೋ ಮಾತ್ರ',
      clear: 'ತೆರವು',
      results: 'ದೇವಾಲಯಗಳು',
      none: 'ಯಾವ ದೇವಾಲಯವೂ ಹೊಂದಿಕೆಯಾಗಲಿಲ್ಲ. ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ ನೋಡಿ.',
      eraEarly: '7ನೇ ಶತಮಾನದವರೆಗೆ',
      eraClassical: '8–13ನೇ ಶತಮಾನ',
      eraLater: '14ನೇ ಶತಮಾನದಿಂದ',
      sort: 'ಕ್ರಮ',
      sortFeatured: 'ವಿಶೇಷ',
      sortOldest: 'ಹಳೆಯವು ಮೊದಲು',
      sortNewest: 'ಹೊಸವು ಮೊದಲು',
      sortName: 'ಅಕ್ಷರ ಕ್ರಮ',
    },
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
      videoStory: 'ವಿಡಿಯೋ ಕಥೆ',
      languageName: 'ಕನ್ನಡ',
    },
  },
  ml: {
    appName: 'ക്ഷേത്രം',
    tagline: 'ദക്ഷിണേന്ത്യയിലെ മഹാക്ഷേത്രങ്ങൾ കണ്ടെത്തുക, അറിയുക, അനുഭവിക്കുക',
    tabs: { home: 'ഹോം', discover: 'കണ്ടെത്തുക', yatra: 'യാത്ര', listen: 'കേൾക്കുക' },
    favorites: { save: 'സൂക്ഷിക്കൂ', saved: 'സൂക്ഷിച്ചു', savedTitle: 'സൂക്ഷിച്ച ക്ഷേത്രങ്ങൾ' },
    discover: {
      searchPlaceholder: 'ക്ഷേത്രം, പ്രതിഷ്ഠ, സ്ഥലം തിരയുക…',
      circuit: 'പാത',
      region: 'പ്രദേശം',
      era: 'കാലഘട്ടം',
      all: 'എല്ലാം',
      unescoOnly: 'യുനെസ്കോ മാത്രം',
      clear: 'മായ്ക്കുക',
      results: 'ക്ഷേത്രങ്ങൾ',
      none: 'ഒരു ക്ഷേത്രവും ചേരുന്നില്ല. ഫിൽട്ടറുകൾ മായ്ച്ചു നോക്കൂ.',
      eraEarly: '7-ാം നൂറ്റാണ്ട് വരെ',
      eraClassical: '8–13 നൂറ്റാണ്ട്',
      eraLater: '14-ാം നൂറ്റാണ്ട് മുതൽ',
      sort: 'ക്രമം',
      sortFeatured: 'പ്രത്യേകം',
      sortOldest: 'പഴയവ ആദ്യം',
      sortNewest: 'പുതിയവ ആദ്യം',
      sortName: 'പേരനുസരിച്ച്',
    },
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
      videoStory: 'വീഡിയോ കഥ',
      languageName: 'മലയാളം',
    },
  },
  hi: {
    appName: 'मंदिर',
    tagline: 'दक्षिण भारत के महान मंदिरों को खोजें, जानें और अनुभव करें',
    tabs: { home: 'होम', discover: 'खोजें', yatra: 'यात्रा', listen: 'सुनें' },
    favorites: { save: 'सहेजें', saved: 'सहेजा गया', savedTitle: 'सहेजे गए मंदिर' },
    discover: {
      searchPlaceholder: 'मंदिर, देवता, स्थान खोजें…',
      circuit: 'मार्ग',
      region: 'क्षेत्र',
      era: 'काल',
      all: 'सभी',
      unescoOnly: 'केवल यूनेस्को',
      clear: 'साफ़ करें',
      results: 'मंदिर',
      none: 'कोई मंदिर मेल नहीं खाता। फ़िल्टर हटाकर देखें।',
      eraEarly: '7वीं सदी तक',
      eraClassical: '8–13वीं सदी',
      eraLater: '14वीं सदी से',
      sort: 'क्रम',
      sortFeatured: 'विशेष',
      sortOldest: 'सबसे पुराने पहले',
      sortNewest: 'सबसे नए पहले',
      sortName: 'नाम अनुसार',
    },
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
      videoStory: 'वीडियो कथा',
      languageName: 'हिन्दी',
    },
  },
};

export function t(locale: Locale): UiStrings {
  return strings[locale] ?? strings.en;
}
