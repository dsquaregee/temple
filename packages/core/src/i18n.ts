import type { Locale } from './types';

export interface UiStrings {
  appName: string;
  tagline: string;
  tabs: { home: string; discover: string; yatra: string; festivals: string; listen: string };
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
    page: string;
    pagePrev: string;
    pageNext: string;
    loading: string;
  };
  listen: {
    nowPlaying: string;
    play: string;
    pause: string;
    previous: string;
    next: string;
    readStory: string;
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
    routeMap: string;
    routeNote: string;
    drivingOrder: string;
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
  footer: { follow: string };
  music: { heading: string; cta: string };
  festivals: { title: string; intro: string; temples: string };
  faq: { deityQ: string; festivalsQ: string; reachQ: string };
  install: {
    title: string;
    body: string;
    action: string;
    dismiss: string;
    iosHint: string;
  };
}

export const strings: Record<Locale, UiStrings> = {
  en: {
    appName: 'Temple',
    tagline: 'Find, learn, and experience the great temples of South India',
    tabs: { home: 'Home', discover: 'Discover', yatra: 'Yatra', festivals: 'Festivals', listen: 'Listen' },
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
      page: 'Page',
      pagePrev: 'Previous',
      pageNext: 'Next',
      loading: 'Loading the full catalogue…',
    },
    listen: {
      nowPlaying: 'Now playing',
      play: 'Play',
      pause: 'Pause',
      previous: 'Previous',
      next: 'Next',
      readStory: 'Read full story',
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
      routeMap: 'Route map',
      routeNote: 'Route shown is illustrative, not a road route.',
      drivingOrder: 'Suggested driving order',
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
    footer: { follow: 'Follow' },
    music: { heading: 'Carnatic music', cta: 'Listen on YouTube' },
    festivals: {
      title: 'Festival Calendar',
      intro:
        'Major temple festivals through the Tamil year. Tap a festival to see every temple that celebrates it.',
      temples: 'temples',
    },
    faq: {
      deityQ: 'Which deity is worshipped at {name}?',
      festivalsQ: 'What are the main festivals at {name}?',
      reachQ: 'How do I get to {name}?',
    },
    install: {
      title: 'Install the app',
      body: 'Add Temple to your home screen — free, works offline, no account.',
      action: 'Install',
      dismiss: 'Not now',
      iosHint: 'Tap the Share icon, then “Add to Home Screen”.',
    },
  },
  ta: {
    appName: 'கோயில்',
    tagline: 'தென்னிந்தியாவின் மாபெரும் கோயில்களை கண்டறிந்து, அறிந்து, அனுபவியுங்கள்',
    tabs: { home: 'முகப்பு', discover: 'கண்டறி', yatra: 'யாத்திரை', festivals: 'விழாக்கள்', listen: 'கேளுங்கள்' },
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
      page: 'பக்கம்',
      pagePrev: 'முந்தைய',
      pageNext: 'அடுத்து',
      loading: 'முழுப் பட்டியல் ஏற்றப்படுகிறது…',
    },
    listen: {
      nowPlaying: 'இப்போது ஒலிக்கிறது',
      play: 'இயக்கு',
      pause: 'இடைநிறுத்து',
      previous: 'முந்தையது',
      next: 'அடுத்தது',
      readStory: 'முழுக் கதையைப் படிக்க',
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
      routeMap: 'பயண வரைபடம்',
      routeNote: 'காட்டப்படும் வழி விளக்கத்திற்காக மட்டுமே; சாலை வழி அல்ல.',
      drivingOrder: 'பரிந்துரைக்கப்படும் பயண வரிசை',
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
    footer: { follow: 'பின்தொடருங்கள்' },
    music: { heading: 'கர்நாடக இசை', cta: 'YouTube-இல் கேளுங்கள்' },
    festivals: {
      title: 'திருவிழா நாட்காட்டி',
      intro:
        'தமிழ் ஆண்டு முழுவதும் முக்கியக் கோயில் திருவிழாக்கள். ஒரு திருவிழாவைத் தொட்டு அதைக் கொண்டாடும் அனைத்துக் கோயில்களையும் காணலாம்.',
      temples: 'கோயில்கள்',
    },
    faq: {
      deityQ: '{name} கோயிலில் வழிபடப்படும் தெய்வம் யார்?',
      festivalsQ: '{name} கோயிலின் முக்கியத் திருவிழாக்கள் யாவை?',
      reachQ: '{name} கோயிலை எவ்வாறு அடைவது?',
    },
    install: {
      title: 'செயலியை நிறுவுங்கள்',
      body: 'கோயில் செயலியை உங்கள் முகப்புத் திரையில் சேர்க்கவும் — இலவசம், இணையம் இல்லாமலும் இயங்கும்.',
      action: 'நிறுவு',
      dismiss: 'இப்போது வேண்டாம்',
      iosHint: 'பகிர் ஐகானைத் தட்டி, “முகப்புத் திரையில் சேர்” என்பதைத் தேர்ந்தெடுக்கவும்.',
    },
  },
  te: {
    appName: 'ఆలయం',
    tagline: 'దక్షిణ భారతదేశపు మహా ఆలయాలను కనుగొనండి, తెలుసుకోండి, అనుభవించండి',
    tabs: { home: 'హోమ్', discover: 'అన్వేషించండి', yatra: 'యాత్ర', festivals: 'పండుగలు', listen: 'వినండి' },
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
      page: 'పేజీ',
      pagePrev: 'మునుపటి',
      pageNext: 'తదుపరి',
      loading: 'పూర్తి జాబితా లోడ్ అవుతోంది…',
    },
    listen: {
      nowPlaying: 'ఇప్పుడు వినిపిస్తోంది',
      play: 'ప్లే చేయి',
      pause: 'పాజ్ చేయి',
      previous: 'మునుపటిది',
      next: 'తదుపరిది',
      readStory: 'పూర్తి కథను చదవండి',
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
      routeMap: 'యాత్రా మార్గ పటం',
      routeNote: 'చూపిన మార్గం సూచన కోసం మాత్రమే; రహదారి మార్గం కాదు.',
      drivingOrder: 'సూచించిన ప్రయాణ క్రమం',
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
    footer: { follow: 'అనుసరించండి' },
    music: { heading: 'కర్ణాటక సంగీతం', cta: 'YouTubeలో వినండి' },
    festivals: {
      title: 'పండుగల క్యాలెండర్',
      intro:
        'తమిళ సంవత్సరం అంతటా ప్రధాన ఆలయ పండుగలు. ఒక పండుగను తాకి దాన్ని జరుపుకునే అన్ని ఆలయాలను చూడండి.',
      temples: 'ఆలయాలు',
    },
    faq: {
      deityQ: '{name} ఆలయంలో ఆరాధించే దేవత ఎవరు?',
      festivalsQ: '{name} ఆలయంలో ప్రధాన పండుగలు ఏవి?',
      reachQ: '{name} ఆలయానికి ఎలా చేరుకోవాలి?',
    },
    install: {
      title: 'యాప్‌ను ఇన్‌స్టాల్ చేయండి',
      body: 'ఆలయం యాప్‌ను మీ హోమ్ స్క్రీన్‌కు జోడించండి — ఉచితం, ఆఫ్‌లైన్‌లోనూ పనిచేస్తుంది.',
      action: 'ఇన్‌స్టాల్ చేయి',
      dismiss: 'ఇప్పుడు వద్దు',
      iosHint: 'షేర్ చిహ్నాన్ని నొక్కి, “హోమ్ స్క్రీన్‌కు జోడించు” ఎంచుకోండి.',
    },
  },
  kn: {
    appName: 'ದೇವಾಲಯ',
    tagline: 'ದಕ್ಷಿಣ ಭಾರತದ ಮಹಾನ್ ದೇವಾಲಯಗಳನ್ನು ಹುಡುಕಿ, ತಿಳಿಯಿರಿ, ಅನುಭವಿಸಿ',
    tabs: { home: 'ಮುಖಪುಟ', discover: 'ಅನ್ವೇಷಿಸಿ', yatra: 'ಯಾತ್ರೆ', festivals: 'ಹಬ್ಬಗಳು', listen: 'ಆಲಿಸಿ' },
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
      page: 'ಪುಟ',
      pagePrev: 'ಹಿಂದಿನ',
      pageNext: 'ಮುಂದಿನ',
      loading: 'ಸಂಪೂರ್ಣ ಪಟ್ಟಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ…',
    },
    listen: {
      nowPlaying: 'ಈಗ ಪ್ಲೇ ಆಗುತ್ತಿದೆ',
      play: 'ಪ್ಲೇ ಮಾಡಿ',
      pause: 'ವಿರಾಮ',
      previous: 'ಹಿಂದಿನದು',
      next: 'ಮುಂದಿನದು',
      readStory: 'ಪೂರ್ಣ ಕಥೆ ಓದಿ',
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
      routeMap: 'ಯಾತ್ರಾ ಮಾರ್ಗ ನಕ್ಷೆ',
      routeNote: 'ತೋರಿಸಿರುವ ಮಾರ್ಗ ಸೂಚನೆಗಾಗಿ ಮಾತ್ರ; ರಸ್ತೆ ಮಾರ್ಗವಲ್ಲ.',
      drivingOrder: 'ಸೂಚಿತ ಪ್ರಯಾಣ ಕ್ರಮ',
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
    footer: { follow: 'ಅನುಸರಿಸಿ' },
    music: { heading: 'ಕರ್ನಾಟಕ ಸಂಗೀತ', cta: 'YouTube ನಲ್ಲಿ ಆಲಿಸಿ' },
    festivals: {
      title: 'ಹಬ್ಬಗಳ ಕ್ಯಾಲೆಂಡರ್',
      intro:
        'ತಮಿಳು ವರ್ಷದುದ್ದಕ್ಕೂ ಪ್ರಮುಖ ದೇವಾಲಯ ಹಬ್ಬಗಳು. ಒಂದು ಹಬ್ಬವನ್ನು ಮುಟ್ಟಿ ಅದನ್ನು ಆಚರಿಸುವ ಎಲ್ಲಾ ದೇವಾಲಯಗಳನ್ನು ನೋಡಿ.',
      temples: 'ದೇವಾಲಯಗಳು',
    },
    faq: {
      deityQ: '{name} ದೇವಾಲಯದ ಆರಾಧ್ಯ ದೇವತೆ ಯಾರು?',
      festivalsQ: '{name} ದೇವಾಲಯದ ಪ್ರಮುಖ ಹಬ್ಬಗಳು ಯಾವುವು?',
      reachQ: '{name} ದೇವಾಲಯವನ್ನು ಹೇಗೆ ತಲುಪುವುದು?',
    },
    install: {
      title: 'ಆ್ಯಪ್ ಸ್ಥಾಪಿಸಿ',
      body: 'ದೇವಾಲಯ ಆ್ಯಪ್ ಅನ್ನು ನಿಮ್ಮ ಮುಖಪುಟಕ್ಕೆ ಸೇರಿಸಿ — ಉಚಿತ, ಆಫ್‌ಲೈನ್‌ನಲ್ಲೂ ಕೆಲಸ ಮಾಡುತ್ತದೆ.',
      action: 'ಸ್ಥಾಪಿಸಿ',
      dismiss: 'ಈಗ ಬೇಡ',
      iosHint: 'ಹಂಚಿಕೆ ಐಕಾನ್ ಒತ್ತಿ, “ಮುಖಪುಟಕ್ಕೆ ಸೇರಿಸಿ” ಆಯ್ಕೆಮಾಡಿ.',
    },
  },
  ml: {
    appName: 'ക്ഷേത്രം',
    tagline: 'ദക്ഷിണേന്ത്യയിലെ മഹാക്ഷേത്രങ്ങൾ കണ്ടെത്തുക, അറിയുക, അനുഭവിക്കുക',
    tabs: { home: 'ഹോം', discover: 'കണ്ടെത്തുക', yatra: 'യാത്ര', festivals: 'ഉത്സവങ്ങൾ', listen: 'കേൾക്കുക' },
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
      page: 'പേജ്',
      pagePrev: 'മുമ്പത്തെ',
      pageNext: 'അടുത്തത്',
      loading: 'പൂർണ്ണ പട്ടിക ലോഡ് ചെയ്യുന്നു…',
    },
    listen: {
      nowPlaying: 'ഇപ്പോൾ കേൾക്കുന്നു',
      play: 'പ്ലേ ചെയ്യുക',
      pause: 'താൽക്കാലികമായി നിർത്തുക',
      previous: 'മുൻപത്തേത്',
      next: 'അടുത്തത്',
      readStory: 'മുഴുവൻ കഥ വായിക്കുക',
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
      routeMap: 'യാത്രാ മാർഗരേഖ',
      routeNote: 'കാണിച്ചിരിക്കുന്ന പാത സൂചനയ്ക്കു മാത്രം; റോഡ് മാർഗമല്ല.',
      drivingOrder: 'നിർദ്ദേശിക്കുന്ന യാത്രാ ക്രമം',
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
    footer: { follow: 'പിന്തുടരൂ' },
    music: { heading: 'കർണാടക സംഗീതം', cta: 'YouTube-ൽ കേൾക്കൂ' },
    festivals: {
      title: 'ഉത്സവ കലണ്ടർ',
      intro:
        'തമിഴ് വർഷത്തിലുടനീളമുള്ള പ്രധാന ക്ഷേത്ര ഉത്സവങ്ങൾ. ഒരു ഉത്സവത്തിൽ തൊട്ട് അത് ആഘോഷിക്കുന്ന എല്ലാ ക്ഷേത്രങ്ങളും കാണുക.',
      temples: 'ക്ഷേത്രങ്ങൾ',
    },
    faq: {
      deityQ: '{name} ക്ഷേത്രത്തിലെ പ്രതിഷ്ഠ ആരാണ്?',
      festivalsQ: '{name} ക്ഷേത്രത്തിലെ പ്രധാന ഉത്സവങ്ങൾ ഏതൊക്കെയാണ്?',
      reachQ: '{name} ക്ഷേത്രത്തിൽ എങ്ങനെ എത്തിച്ചേരാം?',
    },
    install: {
      title: 'ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യൂ',
      body: 'ക്ഷേത്രം ആപ്പ് നിങ്ങളുടെ ഹോം സ്ക്രീനിൽ ചേർക്കൂ — സൗജന്യം, ഓഫ്‌ലൈനിലും പ്രവർത്തിക്കും.',
      action: 'ഇൻസ്റ്റാൾ ചെയ്യൂ',
      dismiss: 'ഇപ്പോൾ വേണ്ട',
      iosHint: 'ഷെയർ ഐക്കൺ അമർത്തി, “ഹോം സ്ക്രീനിൽ ചേർക്കുക” തിരഞ്ഞെടുക്കൂ.',
    },
  },
  hi: {
    appName: 'मंदिर',
    tagline: 'दक्षिण भारत के महान मंदिरों को खोजें, जानें और अनुभव करें',
    tabs: { home: 'होम', discover: 'खोजें', yatra: 'यात्रा', festivals: 'उत्सव', listen: 'सुनें' },
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
      page: 'पृष्ठ',
      pagePrev: 'पिछला',
      pageNext: 'अगला',
      loading: 'पूरी सूची लोड हो रही है…',
    },
    listen: {
      nowPlaying: 'अभी चल रहा है',
      play: 'चलाएँ',
      pause: 'रोकें',
      previous: 'पिछला',
      next: 'अगला',
      readStory: 'पूरी कथा पढ़ें',
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
      routeMap: 'यात्रा मार्ग मानचित्र',
      routeNote: 'दिखाया गया मार्ग केवल संकेत के लिए है, सड़क मार्ग नहीं।',
      drivingOrder: 'सुझाया गया यात्रा क्रम',
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
    footer: { follow: 'फ़ॉलो करें' },
    music: { heading: 'कर्नाटक संगीत', cta: 'YouTube पर सुनें' },
    festivals: {
      title: 'उत्सव कैलेंडर',
      intro:
        'तमिल वर्ष भर के प्रमुख मंदिर उत्सव। किसी उत्सव पर टैप करके उसे मनाने वाले सभी मंदिर देखें।',
      temples: 'मंदिर',
    },
    faq: {
      deityQ: '{name} मंदिर में किस देवता की पूजा होती है?',
      festivalsQ: '{name} मंदिर के प्रमुख उत्सव कौन-से हैं?',
      reachQ: '{name} मंदिर तक कैसे पहुँचें?',
    },
    install: {
      title: 'ऐप इंस्टॉल करें',
      body: 'मंदिर ऐप को अपनी होम स्क्रीन पर जोड़ें — निःशुल्क, ऑफ़लाइन भी चलता है।',
      action: 'इंस्टॉल करें',
      dismiss: 'अभी नहीं',
      iosHint: 'शेयर आइकन दबाएँ, फिर “होम स्क्रीन पर जोड़ें” चुनें।',
    },
  },
};

export function t(locale: Locale): UiStrings {
  return strings[locale] ?? strings.en;
}
