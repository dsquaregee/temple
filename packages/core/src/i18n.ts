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
    nearMe: string;
    locating: string;
    locationError: string;
    away: string;
    nearestFirst: string;
    nearMeWhy: string;
    useMyLocation: string;
    notNow: string;
    locationBlocked: string;
    locationBlockedHow: string;
    locationBlockedHowApp: string;
    orChooseCity: string;
    chooseCity: string;
    templesNearYou: string;
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
    share: string;
    shareCopied: string;
    whyItMatters: string;
    supportTemple: string;
    supportNote: string;
    listenComingSoon: string;
    videoStory: string;
    languageName: string;
  };
  footer: { follow: string };
  music: { heading: string; cta: string };
  festivals: {
    title: string;
    intro: string;
    temples: string;
    thisMonth: string;
    comingUp: string;
    addToCalendar: string;
    remindMe: string;
    remindActive: string;
    remindError: string;
  };
  faq: { deityQ: string; festivalsQ: string; reachQ: string };
  offline: { download: string; downloading: string; available: string; remove: string };
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
      nearMe: 'Near me',
      locating: 'Finding your location…',
      locationError: 'Couldn’t get your location. Check location permission.',
      away: 'away',
      nearestFirst: 'Nearest first',
      nearMeWhy:
        'Sort temples by how close they are to you. Your location stays on your device — it’s never sent anywhere.',
      useMyLocation: 'Use my location',
      notNow: 'Not now',
      locationBlocked: 'Location is turned off for this site.',
      locationBlockedHow:
        'Your browser is blocking location for this site — the city picker above works without it, no permission needed. (To use GPS, allow Location for this site in your browser’s site settings, then tap “Near me”.)',
      locationBlockedHowApp:
        'Location is blocked for this app — the city picker above works without it, no permission needed. (To use GPS, allow Location for this app in your device Settings → Apps, then reopen.)',
      orChooseCity: 'Or sort from a city:',
      chooseCity: 'Choose a city…',
      templesNearYou: 'Temples near you',
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
      share: 'Share',
      shareCopied: 'Link copied',
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
      thisMonth: 'This month',
      comingUp: 'Coming up',
      addToCalendar: 'Add to calendar',
      remindMe: 'Remind me',
      remindActive: 'Reminders on',
      remindError: 'Couldn’t enable reminders',
    },
    faq: {
      deityQ: 'Which deity is worshipped at {name}?',
      festivalsQ: 'What are the main festivals at {name}?',
      reachQ: 'How do I get to {name}?',
    },
    offline: {
      download: 'Download for offline',
      downloading: 'Downloading…',
      available: 'Available offline',
      remove: 'Remove download',
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
      nearMe: 'அருகில் உள்ளவை',
      locating: 'உங்கள் இருப்பிடம் கண்டறியப்படுகிறது…',
      locationError: 'இருப்பிடத்தைப் பெற முடியவில்லை. அனுமதியைச் சரிபார்க்கவும்.',
      away: 'தொலைவில்',
      nearestFirst: 'அருகில் உள்ளவை முதலில்',
      nearMeWhy:
        'உங்களுக்கு அருகில் உள்ள கோயில்களைத் தூரத்தின் அடிப்படையில் வரிசைப்படுத்துங்கள். உங்கள் இருப்பிடம் உங்கள் சாதனத்திலேயே இருக்கும் — எங்கும் அனுப்பப்படாது.',
      useMyLocation: 'என் இருப்பிடத்தைப் பயன்படுத்து',
      notNow: 'இப்போது வேண்டாம்',
      locationBlocked: 'இந்தத் தளத்திற்கு இருப்பிடம் முடக்கப்பட்டுள்ளது.',
      locationBlockedHow:
        'உங்கள் உலாவி இந்தத் தளத்திற்கு இருப்பிடத்தைத் தடுக்கிறது — மேலே உள்ள நகரத் தேர்வு அனுமதி தேவையின்றி வேலை செய்யும். (GPS பயன்படுத்த, உலாவியின் தள அமைப்புகளில் இந்தத் தளத்திற்கு இருப்பிடத்தை அனுமதித்து, “அருகில் உள்ளவை” என்பதைத் தட்டவும்.)',
      locationBlockedHowApp:
        'இந்தச் செயலிக்கு இருப்பிடம் தடுக்கப்பட்டுள்ளது — மேலே உள்ள நகரத் தேர்வு அனுமதி தேவையின்றி வேலை செய்யும். (GPS பயன்படுத்த, உங்கள் சாதன அமைப்புகள் → செயலிகள் என்பதில் இந்தச் செயலிக்கு இருப்பிடத்தை அனுமதித்து, மீண்டும் திறக்கவும்.)',
      orChooseCity: 'அல்லது ஒரு நகரத்திலிருந்து வரிசைப்படுத்து:',
      chooseCity: 'நகரத்தைத் தேர்ந்தெடு…',
      templesNearYou: 'உங்களுக்கு அருகில் உள்ள கோயில்கள்',
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
      share: 'பகிர்',
      shareCopied: 'இணைப்பு நகலெடுக்கப்பட்டது',
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
      thisMonth: 'இம்மாதம்',
      comingUp: 'வரவிருப்பவை',
      addToCalendar: 'நாட்காட்டியில் சேர்',
      remindMe: 'நினைவூட்டு',
      remindActive: 'நினைவூட்டல்கள் இயக்கத்தில்',
      remindError: 'நினைவூட்டல்களை இயக்க முடியவில்லை',
    },
    faq: {
      deityQ: '{name} கோயிலில் வழிபடப்படும் தெய்வம் யார்?',
      festivalsQ: '{name} கோயிலின் முக்கியத் திருவிழாக்கள் யாவை?',
      reachQ: '{name} கோயிலை எவ்வாறு அடைவது?',
    },
    offline: {
      download: 'ஆஃப்லைனில் பதிவிறக்கு',
      downloading: 'பதிவிறக்குகிறது…',
      available: 'ஆஃப்லைனில் உள்ளது',
      remove: 'பதிவிறக்கத்தை நீக்கு',
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
      nearMe: 'నా దగ్గర',
      locating: 'మీ స్థానాన్ని కనుగొంటోంది…',
      locationError: 'మీ స్థానాన్ని పొందలేకపోయాం. అనుమతిని తనిఖీ చేయండి.',
      away: 'దూరంలో',
      nearestFirst: 'దగ్గరివి ముందుగా',
      nearMeWhy:
        'మీకు దగ్గరగా ఉన్న ఆలయాలను దూరం ఆధారంగా క్రమబద్ధీకరించండి. మీ స్థానం మీ పరికరంలోనే ఉంటుంది — ఎక్కడికీ పంపబడదు.',
      useMyLocation: 'నా స్థానాన్ని ఉపయోగించు',
      notNow: 'ఇప్పుడు వద్దు',
      locationBlocked: 'ఈ సైట్‌కు స్థానం ఆఫ్ చేయబడింది.',
      locationBlockedHow:
        'మీ బ్రౌజర్ ఈ సైట్‌కు స్థానాన్ని నిరోధిస్తోంది — పైన ఉన్న నగర ఎంపిక అనుమతి అవసరం లేకుండా పని చేస్తుంది. (GPS ఉపయోగించడానికి, బ్రౌజర్ సైట్ సెట్టింగ్‌లలో ఈ సైట్‌కు స్థానాన్ని అనుమతించి, “నా దగ్గర” నొక్కండి.)',
      locationBlockedHowApp:
        'ఈ యాప్‌కు స్థానం నిరోధించబడింది — పైన ఉన్న నగర ఎంపిక అనుమతి అవసరం లేకుండా పని చేస్తుంది. (GPS ఉపయోగించడానికి, మీ పరికర సెట్టింగ్‌లు → యాప్‌లు లో ఈ యాప్‌కు స్థానాన్ని అనుమతించి, మళ్లీ తెరవండి.)',
      orChooseCity: 'లేదా ఒక నగరం నుండి క్రమబద్ధీకరించు:',
      chooseCity: 'నగరాన్ని ఎంచుకోండి…',
      templesNearYou: 'మీ దగ్గరి ఆలయాలు',
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
      share: 'షేర్ చేయి',
      shareCopied: 'లింక్ కాపీ చేయబడింది',
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
      thisMonth: 'ఈ నెల',
      comingUp: 'రాబోయేవి',
      addToCalendar: 'క్యాలెండర్‌కు జోడించు',
      remindMe: 'గుర్తు చేయి',
      remindActive: 'రిమైండర్‌లు ఆన్‌లో ఉన్నాయి',
      remindError: 'రిమైండర్‌లను ఆన్ చేయలేకపోయాం',
    },
    faq: {
      deityQ: '{name} ఆలయంలో ఆరాధించే దేవత ఎవరు?',
      festivalsQ: '{name} ఆలయంలో ప్రధాన పండుగలు ఏవి?',
      reachQ: '{name} ఆలయానికి ఎలా చేరుకోవాలి?',
    },
    offline: {
      download: 'ఆఫ్‌లైన్‌లో డౌన్‌లోడ్ చేయండి',
      downloading: 'డౌన్‌లోడ్ అవుతోంది…',
      available: 'ఆఫ్‌లైన్‌లో అందుబాటులో ఉంది',
      remove: 'డౌన్‌లోడ్‌ను తీసివేయి',
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
      nearMe: 'ನನ್ನ ಹತ್ತಿರ',
      locating: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ…',
      locationError: 'ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಪಡೆಯಲಾಗಲಿಲ್ಲ. ಅನುಮತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.',
      away: 'ದೂರದಲ್ಲಿ',
      nearestFirst: 'ಹತ್ತಿರದವು ಮೊದಲು',
      nearMeWhy:
        'ನಿಮಗೆ ಹತ್ತಿರವಿರುವ ದೇವಾಲಯಗಳನ್ನು ದೂರದ ಆಧಾರದ ಮೇಲೆ ವಿಂಗಡಿಸಿ. ನಿಮ್ಮ ಸ್ಥಳ ನಿಮ್ಮ ಸಾಧನದಲ್ಲೇ ಇರುತ್ತದೆ — ಎಲ್ಲಿಗೂ ಕಳುಹಿಸಲಾಗುವುದಿಲ್ಲ.',
      useMyLocation: 'ನನ್ನ ಸ್ಥಳವನ್ನು ಬಳಸಿ',
      notNow: 'ಈಗ ಬೇಡ',
      locationBlocked: 'ಈ ಸೈಟ್‌ಗೆ ಸ್ಥಳ ಆಫ್ ಆಗಿದೆ.',
      locationBlockedHow:
        'ನಿಮ್ಮ ಬ್ರೌಸರ್ ಈ ಸೈಟ್‌ಗೆ ಸ್ಥಳವನ್ನು ನಿರ್ಬಂಧಿಸುತ್ತಿದೆ — ಮೇಲಿನ ನಗರ ಆಯ್ಕೆ ಅನುಮತಿ ಇಲ್ಲದೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ. (GPS ಬಳಸಲು, ಬ್ರೌಸರ್ ಸೈಟ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಈ ಸೈಟ್‌ಗೆ ಸ್ಥಳವನ್ನು ಅನುಮತಿಸಿ, “ನನ್ನ ಹತ್ತಿರ” ಟ್ಯಾಪ್ ಮಾಡಿ.)',
      locationBlockedHowApp:
        'ಈ ಆ್ಯಪ್‌ಗೆ ಸ್ಥಳ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ — ಮೇಲಿನ ನಗರ ಆಯ್ಕೆ ಅನುಮತಿ ಇಲ್ಲದೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ. (GPS ಬಳಸಲು, ನಿಮ್ಮ ಸಾಧನ ಸೆಟ್ಟಿಂಗ್‌ಗಳು → ಆ್ಯಪ್‌ಗಳು ನಲ್ಲಿ ಈ ಆ್ಯಪ್‌ಗೆ ಸ್ಥಳವನ್ನು ಅನುಮತಿಸಿ, ಮತ್ತೆ ತೆರೆಯಿರಿ.)',
      orChooseCity: 'ಅಥವಾ ಒಂದು ನಗರದಿಂದ ವಿಂಗಡಿಸಿ:',
      chooseCity: 'ನಗರವನ್ನು ಆಯ್ಕೆಮಾಡಿ…',
      templesNearYou: 'ನಿಮ್ಮ ಸಮೀಪದ ದೇವಾಲಯಗಳು',
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
      share: 'ಹಂಚಿಕೊಳ್ಳಿ',
      shareCopied: 'ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ',
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
      thisMonth: 'ಈ ತಿಂಗಳು',
      comingUp: 'ಮುಂಬರುವ',
      addToCalendar: 'ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಸೇರಿಸಿ',
      remindMe: 'ನೆನಪಿಸಿ',
      remindActive: 'ಜ್ಞಾಪನೆಗಳು ಆನ್ ಆಗಿವೆ',
      remindError: 'ಜ್ಞಾಪನೆಗಳನ್ನು ಆನ್ ಮಾಡಲಾಗಲಿಲ್ಲ',
    },
    faq: {
      deityQ: '{name} ದೇವಾಲಯದ ಆರಾಧ್ಯ ದೇವತೆ ಯಾರು?',
      festivalsQ: '{name} ದೇವಾಲಯದ ಪ್ರಮುಖ ಹಬ್ಬಗಳು ಯಾವುವು?',
      reachQ: '{name} ದೇವಾಲಯವನ್ನು ಹೇಗೆ ತಲುಪುವುದು?',
    },
    offline: {
      download: 'ಆಫ್‌ಲೈನ್‌ಗಾಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
      downloading: 'ಡೌನ್‌ಲೋಡ್ ಆಗುತ್ತಿದೆ…',
      available: 'ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಲಭ್ಯವಿದೆ',
      remove: 'ಡೌನ್‌ಲೋಡ್ ತೆಗೆದುಹಾಕಿ',
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
      nearMe: 'എനിക്ക് സമീപം',
      locating: 'നിങ്ങളുടെ സ്ഥാനം കണ്ടെത്തുന്നു…',
      locationError: 'നിങ്ങളുടെ സ്ഥാനം ലഭിച്ചില്ല. അനുമതി പരിശോധിക്കുക.',
      away: 'അകലെ',
      nearestFirst: 'അടുത്തുള്ളവ ആദ്യം',
      nearMeWhy:
        'നിങ്ങൾക്ക് അടുത്തുള്ള ക്ഷേത്രങ്ങളെ ദൂരം അനുസരിച്ച് ക്രമീകരിക്കുക. നിങ്ങളുടെ സ്ഥാനം നിങ്ങളുടെ ഉപകരണത്തിൽ തന്നെ തുടരും — എങ്ങോട്ടും അയയ്ക്കില്ല.',
      useMyLocation: 'എന്റെ സ്ഥാനം ഉപയോഗിക്കുക',
      notNow: 'ഇപ്പോൾ വേണ്ട',
      locationBlocked: 'ഈ സൈറ്റിന് സ്ഥാനം ഓഫാണ്.',
      locationBlockedHow:
        'നിങ്ങളുടെ ബ്രൗസർ ഈ സൈറ്റിന് സ്ഥാനം തടയുന്നു — മുകളിലെ നഗര തിരഞ്ഞെടുപ്പ് അനുമതിയില്ലാതെ പ്രവർത്തിക്കും. (GPS ഉപയോഗിക്കാൻ, ബ്രൗസറിന്റെ സൈറ്റ് ക്രമീകരണങ്ങളിൽ ഈ സൈറ്റിന് സ്ഥാനം അനുവദിച്ച്, “എനിക്ക് സമീപം” ടാപ്പ് ചെയ്യുക.)',
      locationBlockedHowApp:
        'ഈ ആപ്പിന് സ്ഥാനം തടഞ്ഞിരിക്കുന്നു — മുകളിലെ നഗര തിരഞ്ഞെടുപ്പ് അനുമതിയില്ലാതെ പ്രവർത്തിക്കും. (GPS ഉപയോഗിക്കാൻ, നിങ്ങളുടെ ഉപകരണ ക്രമീകരണങ്ങൾ → ആപ്പുകൾ എന്നതിൽ ഈ ആപ്പിന് സ്ഥാനം അനുവദിച്ച്, വീണ്ടും തുറക്കുക.)',
      orChooseCity: 'അല്ലെങ്കിൽ ഒരു നഗരത്തിൽ നിന്ന് ക്രമീകരിക്കുക:',
      chooseCity: 'നഗരം തിരഞ്ഞെടുക്കുക…',
      templesNearYou: 'നിങ്ങൾക്ക് സമീപമുള്ള ക്ഷേത്രങ്ങൾ',
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
      share: 'പങ്കിടുക',
      shareCopied: 'ലിങ്ക് പകർത്തി',
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
      thisMonth: 'ഈ മാസം',
      comingUp: 'വരാനിരിക്കുന്നവ',
      addToCalendar: 'കലണ്ടറിൽ ചേർക്കുക',
      remindMe: 'ഓർമ്മിപ്പിക്കുക',
      remindActive: 'ഓർമ്മപ്പെടുത്തലുകൾ ഓണാണ്',
      remindError: 'ഓർമ്മപ്പെടുത്തലുകൾ ഓണാക്കാനായില്ല',
    },
    faq: {
      deityQ: '{name} ക്ഷേത്രത്തിലെ പ്രതിഷ്ഠ ആരാണ്?',
      festivalsQ: '{name} ക്ഷേത്രത്തിലെ പ്രധാന ഉത്സവങ്ങൾ ഏതൊക്കെയാണ്?',
      reachQ: '{name} ക്ഷേത്രത്തിൽ എങ്ങനെ എത്തിച്ചേരാം?',
    },
    offline: {
      download: 'ഓഫ്‌ലൈനായി ഡൗൺലോഡ് ചെയ്യുക',
      downloading: 'ഡൗൺലോഡ് ചെയ്യുന്നു…',
      available: 'ഓഫ്‌ലൈനിൽ ലഭ്യമാണ്',
      remove: 'ഡൗൺലോഡ് നീക്കം ചെയ്യുക',
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
      nearMe: 'मेरे पास',
      locating: 'आपका स्थान खोजा जा रहा है…',
      locationError: 'आपका स्थान नहीं मिल सका। अनुमति जाँचें।',
      away: 'दूर',
      nearestFirst: 'निकटतम पहले',
      nearMeWhy:
        'मंदिरों को आपसे दूरी के अनुसार क्रमबद्ध करें। आपका स्थान आपके डिवाइस पर ही रहता है — कहीं नहीं भेजा जाता।',
      useMyLocation: 'मेरा स्थान उपयोग करें',
      notNow: 'अभी नहीं',
      locationBlocked: 'इस साइट के लिए स्थान बंद है।',
      locationBlockedHow:
        'आपका ब्राउज़र इस साइट के लिए स्थान रोक रहा है — ऊपर दिया शहर चयन बिना अनुमति के काम करता है। (GPS उपयोग करने के लिए, ब्राउज़र की साइट सेटिंग्स में इस साइट के लिए स्थान अनुमति दें, फिर “मेरे पास” पर टैप करें।)',
      locationBlockedHowApp:
        'इस ऐप के लिए स्थान अवरुद्ध है — ऊपर दिया शहर चयन बिना अनुमति के काम करता है। (GPS उपयोग करने के लिए, अपने डिवाइस सेटिंग्स → ऐप्स में इस ऐप के लिए स्थान अनुमति दें, फिर ऐप दोबारा खोलें।)',
      orChooseCity: 'या किसी शहर से क्रमबद्ध करें:',
      chooseCity: 'शहर चुनें…',
      templesNearYou: 'आपके पास के मंदिर',
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
      share: 'साझा करें',
      shareCopied: 'लिंक कॉपी हो गया',
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
      thisMonth: 'इस माह',
      comingUp: 'आगामी',
      addToCalendar: 'कैलेंडर में जोड़ें',
      remindMe: 'याद दिलाएँ',
      remindActive: 'रिमाइंडर चालू',
      remindError: 'रिमाइंडर चालू नहीं हो सके',
    },
    faq: {
      deityQ: '{name} मंदिर में किस देवता की पूजा होती है?',
      festivalsQ: '{name} मंदिर के प्रमुख उत्सव कौन-से हैं?',
      reachQ: '{name} मंदिर तक कैसे पहुँचें?',
    },
    offline: {
      download: 'ऑफ़लाइन डाउनलोड करें',
      downloading: 'डाउनलोड हो रहा है…',
      available: 'ऑफ़लाइन उपलब्ध',
      remove: 'डाउनलोड हटाएँ',
    },
    install: {
      title: 'ऐप इंस्टॉल करें',
      body: 'मंदिर ऐप को अपनी होम स्क्रीन पर जोड़ें — निःशुल्क, ऑफ़लाइन भी चलता है।',
      action: 'इंस्टॉल करें',
      dismiss: 'अभी नहीं',
      iosHint: 'शेयर आइकन दबाएँ, फिर “होम स्क्रीन पर जोड़ें” चुनें।',
    },
  },
  bn: {
    "appName": "মন্দির",
    "tagline": "দক্ষিণ ভারতের মহান মন্দিরগুলি খুঁজুন, জানুন ও অনুভব করুন",
    "tabs": {
      "home": "হোম",
      "discover": "অন্বেষণ",
      "yatra": "যাত্রা",
      "festivals": "উৎসব",
      "listen": "শুনুন"
    },
    "favorites": {
      "save": "সংরক্ষণ",
      "saved": "সংরক্ষিত",
      "savedTitle": "সংরক্ষিত মন্দির"
    },
    "discover": {
      "searchPlaceholder": "মন্দির, দেবতা, স্থান খুঁজুন…",
      "circuit": "পথ",
      "region": "অঞ্চল",
      "era": "যুগ",
      "all": "সব",
      "unescoOnly": "শুধু ইউনেস্কো",
      "clear": "মুছুন",
      "results": "মন্দির",
      "none": "কোনো মন্দির মেলেনি। ফিল্টার মুছে দেখুন।",
      "eraEarly": "৭ম শতাব্দী পর্যন্ত",
      "eraClassical": "৮–১৩ শতাব্দী",
      "eraLater": "১৪ শতাব্দী থেকে",
      "sort": "ক্রম",
      "sortFeatured": "বিশেষ",
      "sortOldest": "পুরোনো আগে",
      "sortNewest": "নতুন আগে",
      "sortName": "নাম অনুসারে",
      "page": "পৃষ্ঠা",
      "pagePrev": "আগের",
      "pageNext": "পরের",
      "loading": "সম্পূর্ণ তালিকা লোড হচ্ছে…",
      "nearMe": "আমার কাছে",
      "locating": "আপনার অবস্থান খোঁজা হচ্ছে…",
      "locationError": "আপনার অবস্থান পাওয়া যায়নি। অনুমতি পরীক্ষা করুন।",
      "away": "দূরে",
      "nearestFirst": "নিকটতম আগে",
      "nearMeWhy": "মন্দিরগুলি আপনার থেকে দূরত্ব অনুসারে সাজান। আপনার অবস্থান আপনার ডিভাইসেই থাকে — কোথাও পাঠানো হয় না।",
      "useMyLocation": "আমার অবস্থান ব্যবহার করুন",
      "notNow": "এখন নয়",
      "locationBlocked": "এই সাইটের জন্য অবস্থান বন্ধ আছে।",
      "locationBlockedHow": "আপনার ব্রাউজার এই সাইটের জন্য অবস্থান আটকাচ্ছে — উপরের শহর নির্বাচন অনুমতি ছাড়াই কাজ করে। (GPS ব্যবহার করতে, ব্রাউজারের সাইট সেটিংসে এই সাইটের জন্য অবস্থান অনুমতি দিন, তারপর “আমার কাছে” ট্যাপ করুন।)",
      "locationBlockedHowApp": "এই অ্যাপের জন্য অবস্থান আটকানো আছে — উপরের শহর নির্বাচন অনুমতি ছাড়াই কাজ করে। (GPS ব্যবহার করতে, আপনার ডিভাইস সেটিংস → অ্যাপস-এ এই অ্যাপের জন্য অবস্থান অনুমতি দিন, তারপর আবার খুলুন।)",
      "orChooseCity": "অথবা কোনো শহর থেকে সাজান:",
      "chooseCity": "একটি শহর বাছুন…",
      "templesNearYou": "আপনার কাছের মন্দির"
    },
    "listen": {
      "nowPlaying": "এখন বাজছে",
      "play": "চালান",
      "pause": "থামান",
      "previous": "আগের",
      "next": "পরের",
      "readStory": "পূর্ণ কাহিনি পড়ুন"
    },
    "sections": {
      "history": "ইতিহাস",
      "architecture": "স্থাপত্য",
      "legends": "স্থল পুরাণ",
      "festivals": "উৎসব",
      "experience": "দর্শন অনুভব"
    },
    "visit": {
      "heading": "দর্শনের পরিকল্পনা",
      "timings": "সময়",
      "dressCode": "পোশাকবিধি",
      "photography": "ফটোগ্রাফি",
      "gettingThere": "পৌঁছানোর পথ"
    },
    "labels": {
      "templeOfTheDay": "আজকের মন্দির",
      "allTemples": "সব মন্দির",
      "circuits": "তীর্থযাত্রা পথ",
      "stops": "ক্ষেত্র",
      "routeMap": "যাত্রা মানচিত্র",
      "routeNote": "দেখানো পথ কেবল নির্দেশক, সড়কপথ নয়।",
      "drivingOrder": "প্রস্তাবিত যাত্রা ক্রম",
      "partOf": "এর অংশ",
      "unesco": "ইউনেস্কো বিশ্ব ঐতিহ্য",
      "deity": "মূল দেবতা",
      "dynasty": "রাজবংশ",
      "period": "কাল",
      "style": "শৈলী",
      "relatedTemples": "সম্পর্কিত মন্দির",
      "share": "শেয়ার",
      "shareCopied": "লিঙ্ক কপি হয়েছে",
      "whyItMatters": "এই মন্দিরের বিশেষত্ব",
      "supportTemple": "এই মন্দিরকে সমর্থন করুন",
      "supportNote": "দান সরাসরি মন্দিরের অফিসিয়াল মাধ্যমে যায়।",
      "listenComingSoon": "অডিও কাহিনি শীঘ্রই আসছে। প্রতিটি মন্দিরের পাতায় আপনার ভাষায় একটি কাহিনি থাকবে।",
      "videoStory": "ভিডিও কাহিনি",
      "languageName": "বাংলা"
    },
    "footer": {
      "follow": "অনুসরণ করুন"
    },
    "music": {
      "heading": "কর্ণাটকী সংগীত",
      "cta": "YouTube-এ শুনুন"
    },
    "festivals": {
      "title": "উৎসব পঞ্জিকা",
      "intro": "তামিল বছর জুড়ে প্রধান মন্দির উৎসব। কোনো উৎসব ট্যাপ করে তা উদযাপনকারী সব মন্দির দেখুন।",
      "temples": "মন্দির",
      "thisMonth": "এই মাসে",
      "comingUp": "আসন্ন",
      "addToCalendar": "ক্যালেন্ডারে যোগ করুন",
      "remindMe": "মনে করিয়ে দিন",
      "remindActive": "রিমাইন্ডার চালু",
      "remindError": "রিমাইন্ডার চালু করা যায়নি"
    },
    "faq": {
      "deityQ": "{name} মন্দিরে কোন দেবতার পূজা হয়?",
      "festivalsQ": "{name} মন্দিরের প্রধান উৎসব কোনগুলি?",
      "reachQ": "{name} মন্দিরে কীভাবে পৌঁছাবেন?"
    },
    "offline": {
      "download": "অফলাইনের জন্য ডাউনলোড",
      "downloading": "ডাউনলোড হচ্ছে…",
      "available": "অফলাইনে উপলব্ধ",
      "remove": "ডাউনলোড সরান"
    },
    "install": {
      "title": "অ্যাপ ইনস্টল করুন",
      "body": "মন্দির অ্যাপ আপনার হোম স্ক্রিনে যোগ করুন — বিনামূল্যে, অফলাইনেও চলে, অ্যাকাউন্ট লাগে না।",
      "action": "ইনস্টল",
      "dismiss": "এখন নয়",
      "iosHint": "শেয়ার আইকন ট্যাপ করুন, তারপর “হোম স্ক্রিনে যোগ করুন” বাছুন।"
    }
  },
  mr: {
    "appName": "मंदिर",
    "tagline": "दक्षिण भारतातील महान मंदिरे शोधा, जाणून घ्या आणि अनुभवा",
    "tabs": {
      "home": "मुख्यपृष्ठ",
      "discover": "शोधा",
      "yatra": "यात्रा",
      "festivals": "उत्सव",
      "listen": "ऐका"
    },
    "favorites": {
      "save": "जतन करा",
      "saved": "जतन केले",
      "savedTitle": "जतन केलेली मंदिरे"
    },
    "discover": {
      "searchPlaceholder": "मंदिरे, देवता, स्थळे शोधा…",
      "circuit": "मार्ग",
      "region": "प्रदेश",
      "era": "काळ",
      "all": "सर्व",
      "unescoOnly": "फक्त युनेस्को",
      "clear": "साफ करा",
      "results": "मंदिरे",
      "none": "कोणतेही मंदिर जुळत नाही. फिल्टर काढून पहा.",
      "eraEarly": "७व्या शतकापर्यंत",
      "eraClassical": "८वे–१३वे शतक",
      "eraLater": "१४व्या शतकापासून पुढे",
      "sort": "क्रमवारी",
      "sortFeatured": "वैशिष्ट्यपूर्ण",
      "sortOldest": "सर्वात जुने प्रथम",
      "sortNewest": "सर्वात नवे प्रथम",
      "sortName": "नावानुसार",
      "page": "पान",
      "pagePrev": "मागील",
      "pageNext": "पुढील",
      "loading": "संपूर्ण सूची लोड होत आहे…",
      "nearMe": "माझ्या जवळ",
      "locating": "तुमचे स्थान शोधत आहे…",
      "locationError": "तुमचे स्थान मिळवता आले नाही. स्थान परवानगी तपासा.",
      "away": "अंतरावर",
      "nearestFirst": "सर्वात जवळचे प्रथम",
      "nearMeWhy": "मंदिरे तुमच्यापासूनच्या अंतरानुसार क्रमवारीत लावा. तुमचे स्थान तुमच्या उपकरणावरच राहते — ते कुठेही पाठवले जात नाही.",
      "useMyLocation": "माझे स्थान वापरा",
      "notNow": "आता नको",
      "locationBlocked": "या साइटसाठी स्थान बंद केले आहे.",
      "locationBlockedHow": "तुमचा ब्राउझर या साइटसाठी स्थान अडवत आहे — वरील शहर निवडक परवानगीशिवाय चालते, कोणत्याही परवानगीची गरज नाही. (GPS वापरण्यासाठी, तुमच्या ब्राउझरच्या साइट सेटिंग्जमध्ये या साइटसाठी स्थानास परवानगी द्या, नंतर “माझ्या जवळ” वर टॅप करा.)",
      "locationBlockedHowApp": "या अ‍ॅपसाठी स्थान अडवले आहे — वरील शहर निवडक परवानगीशिवाय चालते, कोणत्याही परवानगीची गरज नाही. (GPS वापरण्यासाठी, तुमच्या उपकरण सेटिंग्ज → अ‍ॅप्स मध्ये या अ‍ॅपसाठी स्थानास परवानगी द्या, नंतर पुन्हा उघडा.)",
      "orChooseCity": "किंवा एखाद्या शहरावरून क्रमवारी लावा:",
      "chooseCity": "शहर निवडा…",
      "templesNearYou": "तुमच्या जवळची मंदिरे"
    },
    "listen": {
      "nowPlaying": "सध्या वाजत आहे",
      "play": "वाजवा",
      "pause": "थांबवा",
      "previous": "मागील",
      "next": "पुढील",
      "readStory": "संपूर्ण कथा वाचा"
    },
    "sections": {
      "history": "इतिहास",
      "architecture": "वास्तुकला",
      "legends": "दंतकथा",
      "festivals": "उत्सव",
      "experience": "अनुभव"
    },
    "visit": {
      "heading": "तुमच्या दर्शनाचे नियोजन",
      "timings": "वेळा",
      "dressCode": "वेशभूषा",
      "photography": "छायाचित्रण",
      "gettingThere": "तिथे कसे पोहोचाल"
    },
    "labels": {
      "templeOfTheDay": "आजचे मंदिर",
      "allTemples": "सर्व मंदिरे",
      "circuits": "तीर्थयात्रा मार्ग",
      "stops": "थांबे",
      "routeMap": "मार्ग नकाशा",
      "routeNote": "दाखवलेला मार्ग केवळ सूचक आहे, रस्त्याचा मार्ग नाही.",
      "drivingOrder": "सुचवलेला वाहन क्रम",
      "partOf": "याचा भाग",
      "unesco": "युनेस्को जागतिक वारसा",
      "deity": "देवता",
      "dynasty": "राजवंश",
      "period": "कालखंड",
      "style": "शैली",
      "relatedTemples": "संबंधित मंदिरे",
      "share": "शेअर करा",
      "shareCopied": "दुवा कॉपी केला",
      "whyItMatters": "हे मंदिर का महत्त्वाचे आहे",
      "supportTemple": "या मंदिराला पाठिंबा द्या",
      "supportNote": "देणग्या थेट मंदिराच्या अधिकृत माध्यमांतून जातात.",
      "listenComingSoon": "ध्वनी कथा लवकरच येत आहेत. प्रत्येक मंदिराच्या पानावर तुमच्या भाषेत निवेदित कथा असेल.",
      "videoStory": "व्हिडिओ कथा",
      "languageName": "मराठी"
    },
    "footer": {
      "follow": "फॉलो करा"
    },
    "music": {
      "heading": "कर्नाटक संगीत",
      "cta": "YouTube वर ऐका"
    },
    "festivals": {
      "title": "उत्सव दिनदर्शिका",
      "intro": "तमिळ वर्षातील प्रमुख मंदिर उत्सव. तो साजरा करणारी सर्व मंदिरे पाहण्यासाठी एखाद्या उत्सवावर टॅप करा.",
      "temples": "मंदिरे",
      "thisMonth": "या महिन्यात",
      "comingUp": "लवकरच येणारे",
      "addToCalendar": "दिनदर्शिकेत जोडा",
      "remindMe": "मला आठवण करा",
      "remindActive": "आठवणी चालू",
      "remindError": "आठवणी चालू करता आल्या नाहीत"
    },
    "faq": {
      "deityQ": "{name} येथे कोणत्या देवतेची पूजा केली जाते?",
      "festivalsQ": "{name} येथील प्रमुख उत्सव कोणते आहेत?",
      "reachQ": "{name} येथे मी कसे पोहोचू?"
    },
    "offline": {
      "download": "ऑफलाइनसाठी डाउनलोड करा",
      "downloading": "डाउनलोड होत आहे…",
      "available": "ऑफलाइन उपलब्ध",
      "remove": "डाउनलोड काढा"
    },
    "install": {
      "title": "अ‍ॅप इन्स्टॉल करा",
      "body": "मंदिर तुमच्या होम स्क्रीनवर जोडा — मोफत, ऑफलाइन चालते, खाते नको.",
      "action": "इन्स्टॉल करा",
      "dismiss": "आता नको",
      "iosHint": "शेअर चिन्हावर टॅप करा, नंतर “Add to Home Screen”."
    }
  },
};

export function t(locale: Locale): UiStrings {
  return strings[locale] ?? strings.en;
}
