import { useState, useEffect, useMemo, useCallback, useDeferredValue, useRef } from 'react';
import { Clock, MapPin, BookOpen, ChevronRight, Loader2, X, Navigation, Search, Star } from 'lucide-react';

// Hardcoded verses database
const verses = [
  { text: "Şüphesiz ben, Allah'a ve ahiret gününe inanan ve salih amel işleyen kimseler için elbette çok bağışlayıcıyım.", source: "Tâhâ Suresi, 82. Ayet" },
  { text: "Rabbiniz, yalvararak ve gizlice kendisine dua etmenizi sever.", source: "Araf Suresi, 55. Ayet" },
  { text: "Allah, hiç kimseye gücünün yettiğinden fazlasını yüklemez.", source: "Bakara Suresi, 286. Ayet" },
  { text: "Gevşemeyin, hüzünlenmeyin. Eğer (gerçekten) iman etmişseniz, üstün olan sizlersiniz.", source: "Âl-i İmrân Suresi, 139. Ayet" },
  { text: "Biz insana şah damarından daha yakınız.", source: "Kaf Suresi, 16. Ayet" },
  { text: "O, hanginizin daha güzel amel yapacağını sınamak için ölümü ve hayatı yaratandır.", source: "Mülk Suresi, 2. Ayet" },
  { text: "Sabredenlere, mükâfatları hesapsız ödenecektir.", source: "Zümer Suresi, 10. Ayet" },
  { text: "Şüphesiz zorlukla beraber bir kolaylık vardır.", source: "İnşirah Suresi, 5. Ayet" },
];

const surahNames = [
  "Fâtiha", "Bakara", "Âl-i İmrân", "Nisâ", "Mâide", "En'âm", "A'râf", "Enfâl", "Tevbe", "Yûnus",
  "Hûd", "Yûsuf", "Ra'd", "İbrâhîm", "Hicr", "Nahl", "İsrâ", "Kehf", "Meryem", "Tâhâ",
  "Enbiyâ", "Hac", "Mü'minûn", "Nûr", "Furkân", "Şu'arâ", "Neml", "Kasas", "Ankebût", "Rûm",
  "Lokmân", "Secde", "Ahzâb", "Sebe'", "Fâtır", "Yâsîn", "Sâffât", "Sâd", "Zümer", "Mü'min",
  "Fussilet", "Şûrâ", "Zuhruf", "Duhân", "Câsiye", "Ahkâf", "Muhammed", "Fetih", "Hucurât", "Kâf",
  "Zâriyât", "Tûr", "Necm", "Kamer", "Rahmân", "Vâkıa", "Hadîd", "Mücâdele", "Haşr", "Mümtehine",
  "Saf", "Cum'a", "Münâfikûn", "Teğâbun", "Talâk", "Tahrîm", "Mülk", "Kalem", "Hâkka", "Meâric",
  "Nûh", "Cin", "Müzzemmil", "Müddessir", "Kıyâme", "İnsan", "Mürselât", "Nebe'", "Nâziât", "Abese",
  "Tekvîr", "İnfitâr", "Mutaffifîn", "İnşikâk", "Burûc", "Târık", "A'lâ", "Gâşiye", "Fecr", "Beled",
  "Şems", "Leyl", "Duhâ", "İnşirah", "Tîn", "Alak", "Kadir", "Beyyine", "Zilzâl", "Âdiyât",
  "Kâria", "Tekâsür", "Asr", "Hümeze", "Fîl", "Kureyş", "Mâûn", "Kevser", "Kâfirûn", "Nasr",
  "Tebbet", "İhlâs", "Felak", "Nâs"
];

// Critical Religious Days for 2026 (Diyanet)
// Special Days for 2026 (Religious, National, Global)
const specialDays = [
  { name: "Yılbaşı", date: "2026-01-01", description: "Yeni bir yılın başlangıcı, yeni umutlar ve hedefler." },
  { name: "Berat Kandili", date: "2026-02-02", description: "Günahlardan arınma ve bağışlanma gecesi, dua kapılarının sonuna kadar açıldığı mübarek bir zaman." },
  { name: "Sevgililer Günü", date: "2026-02-14", description: "Sevginin ve romantizmin kutlandığı, sevdiklerimize değer verdiğimizi hissettirdiğimiz özel gün." },
  { name: "Ramazan Başlangıcı", date: "2026-02-19", description: "On bir ayın sultanı, oruç, sabır ve Kur'an ayı. Rahmet ve bereket iklimi." },
  { name: "Dünya Kadınlar Günü", date: "2026-03-08", description: "Kadınların sosyal, ekonomik ve siyasi başarılarının kutlandığı, eşitlik mücadelesinin simgesi." },
  { name: "Kadir Gecesi", date: "2026-03-16", description: "Bin aydan daha hayırlı olan, Kur'an'ın indirilmeye başlandığı mübarek gece." },
  { name: "Ramazan Bayramı", date: "2026-03-20", description: "Oruç ibadetinin tamamlanmasının sevinci, birlik, beraberlik ve paylaşma günleri." },
  { name: "Ulusal Egemenlik ve Çocuk Bayramı", date: "2026-04-23", description: "TBMM'nin açılışı ve Atatürk'ün çocuklara armağan ettiği, dünyadaki tek çocuk bayramı." },
  { name: "Emek ve Dayanışma Günü", date: "2026-05-01", description: "İşçi ve emekçilerin bayramı, dayanışma ve haksızlıklarla mücadele günü." },
  { name: "Anneler Günü", date: "2026-05-10", description: "Bizi karşılıksız seven, her daim yanımızda olan annelerimize minnetimizi sunduğumuz gün." },
  { name: "Atatürk'ü Anma, Gençlik ve Spor Bayramı", date: "2026-05-19", description: "Milli mücadelenin başladığı tarih, Atatürk'ün Samsun'a çıkışı ve gençlere armağan ettiği bayram." },
  { name: "Kurban Bayramı", date: "2026-05-27", description: "Hz. İbrahim'in sadakatinin, Hz. İsmail'in teslimiyetinin simgesi. Paylaşma ve yakınlaşma bayramı." },
  { name: "Hicri Yılbaşı", date: "2026-06-16", description: "Muharrem ayının başlangıcı ve İslam tarihindeki dönüm noktalarından biri olan Hicret'in yıldönümü." },
  { name: "Babalar Günü", date: "2026-06-21", description: "Ailemizin direği, fedakar babalarımızın değerini hatırladığımız ve kutladığımız gün." },
  { name: "Aşure Günü", date: "2026-06-25", description: "Paylaşmanın, dayanışmanın, birlik ve beraberliğin simgesi. Muharrem ayının 10. günü." },
  { name: "Demokrasi ve Milli Birlik Günü", date: "2026-07-15", description: "Hain darbe girişimine karşı milletin zaferi, şehitlerimizi anma ve demokrasiye sahip çıkma günü." },
  { name: "Mevlid Kandili", date: "2026-08-24", description: "Alemlere rahmet olarak gönderilen Peygamber Efendimiz Hz. Muhammed'in (s.a.v) dünyaya teşrif ettiği gece." },
  { name: "Zafer Bayramı", date: "2026-08-30", description: "Büyük Taarruz'un zaferle sonuçlandığı, Türk ordusunun gücünü dünyaya gösterdiği gün." },
  { name: "Cumhuriyet Bayramı", date: "2026-10-29", description: "Cumhuriyetin ilanı, egemenliğin kayıtsız şartsız millete verildiği en büyük milli bayramımız." },
  { name: "Öğretmenler Günü", date: "2026-11-24", description: "Geleceğimizi şekillendiren, fedakar öğretmenlerimize saygı ve şükranlarımızı sunduğumuz gün." },
];

// List of 81 Provinces of Turkey for the Modal
const turkeyCities = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
  "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];

const App = () => {
  // App State
  const [location, setLocation] = useState({ country: 'Turkey', city: 'İstanbul', district: '' });
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]); // Store whole month data
  const [selectedDate, setSelectedDate] = useState(new Date()); // The date user clicked on

  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [currentVerse, setCurrentVerse] = useState(verses[0]);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState('country'); // 'country', 'city', 'district'
  const [tempCountry, setTempCountry] = useState('Türkiye');
  const [tempCity, setTempCity] = useState('');

  const [countries, setCountries] = useState([]); // List of countries
  const [cities, setCities] = useState([]); // List of cities for selected country
  const [districts, setDistricts] = useState([]);

  const [loadingData, setLoadingData] = useState(false); // For fetching countries/cities
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Pre-load Turkey as default or special handling? 
  // We'll treat Turkey specially for districts as before.


  const getDayData = useCallback((date) => {
    if (!monthlyData || monthlyData.length === 0) return null;

    // Aladhan Calendar API returns data array where we can find by date
    // specific format in data[i].date.gregorian.date is "DD-MM-YYYY"
    const target = String(date.getDate()).padStart(2, '0') + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + date.getFullYear();

    return monthlyData.find(d => d.date.gregorian.date === target);
  }, [monthlyData]);

  // Derived state for the currently designated "active" day
  const activeDayData = useMemo(() => getDayData(selectedDate), [getDayData, selectedDate]);


  const calculateNextPrayer = useCallback(() => {
    // This function calculates the NEXT prayer relative to *NOW* (real time), 
    // using today's timings. It is for the countdown timer.

    // We need *today's* timings for the countdown, not necessarily the *selected* day's timings.
    // So we need to find today's data from monthlyData.

    if (!monthlyData.length) return;

    const today = new Date();
    const todayData = getDayData(today);

    if (!todayData) return; // Should not happen if monthly data is loaded

    const timings = todayData.timings;

    const prayers = [
      { name: 'İmsak', time: timings.Fajr, key: 'Fajr' },
      { name: 'Güneş', time: timings.Sunrise, key: 'Sunrise' },
      { name: 'Öğle', time: timings.Dhuhr, key: 'Dhuhr' },
      { name: 'İkindi', time: timings.Asr, key: 'Asr' },
      { name: 'Akşam', time: timings.Maghrib, key: 'Maghrib' },
      { name: 'Yatsı', time: timings.Isha, key: 'Isha' },
    ];

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const currentSeconds = now.getSeconds();

    let foundNext = false;

    for (let i = 0; i < prayers.length; i++) {
      // Aladhan returns HH:MM (sometimes (EST) etc removed)
      const timeStr = prayers[i].time.split(' ')[0];
      const [hours, minutes] = timeStr.split(':').map(Number);
      const prayerTimeMinutes = hours * 60 + minutes;

      if (prayerTimeMinutes > currentTime) {
        setNextPrayer(prayers[i]);
        let diffSeconds = (prayerTimeMinutes * 60) - (currentTime * 60 + currentSeconds);
        const h = Math.floor(diffSeconds / 3600);
        const m = Math.floor((diffSeconds % 3600) / 60);
        const s = diffSeconds % 60;
        setCountdown(`${h}sa ${m}dk ${s}sn`);
        foundNext = true;
        break;
      }
    }

    if (!foundNext) {
      // Next is Fajr tomorrow
      // We need tomorrow's Fajr time.
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowData = getDayData(tomorrow);

      if (tomorrowData) {
        const fajr = tomorrowData.timings.Fajr.split(' ')[0];
        setNextPrayer({ name: 'İmsak (Yarın)', time: fajr, key: 'Fajr' });

        const [fajrH, fajrM] = fajr.split(':').map(Number);
        const nowTotalSeconds = (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();
        const fajrTotalSeconds = (fajrH * 3600) + (fajrM * 60);
        const daySeconds = 24 * 3600;
        let diff = (daySeconds - nowTotalSeconds) + fajrTotalSeconds;
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        setCountdown(`${h}sa ${m}dk ${s}sn`);
      }
    }

  }, [monthlyData, getDayData]);

  const fetchRandomVerse = useCallback(async () => {
    try {
      // 6236 verses in Quran. Pick one random ID.
      const randomId = Math.floor(Math.random() * 6236) + 1;
      const res = await fetch(`http://api.alquran.cloud/v1/ayah/${randomId}/tr.diyanet`);
      const data = await res.json();

      if (data.code === 200 && data.data) {
        const trSurahName = surahNames[data.data.surah.number - 1];
        setCurrentVerse({
          text: data.data.text,
          source: `${trSurahName || data.data.surah.name} Suresi, ${data.data.numberInSurah}. Ayet`
        });
      } else {
        // Fallback to local if API has issues but no crash
        const randomIndex = Math.floor(Math.random() * verses.length);
        setCurrentVerse(verses[randomIndex]);
      }
    } catch (e) {
      console.error("Verse fetch failed", e);
      // Fallback
      const randomIndex = Math.floor(Math.random() * verses.length);
      setCurrentVerse(verses[randomIndex]);
    }
  }, []);

  // Fetch Monthly Prayer Times
  const fetchMonthlyPrayerTimes = useCallback(async (country, city, district) => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      // Fetch a random verse when we fetch times (or on mount implicitly)
      fetchRandomVerse();

      // Aladhan Calendar API
      // Use country param if provided, else Turkey default (for older calls)
      const targetCountry = country || 'Turkey';
      let apiUrl = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=${targetCountry}&method=13`;
      if (district && district !== 'Bulunan Konum') {
        // Note: Aladhan doesn't have a direct calendarByAddress for generic addresses efficiently, 
        // but let's try assuming city-level is fine for now or keep using the same structure if available.
        // Actually, let's stick to city for the calendar to ensure stability, 
        // or use the address query if supported. 
        // The `calendarByAddress` endpoint exists.
        apiUrl = `https://api.aladhan.com/v1/calendarByAddress/${year}/${month}?address=${district},${city},Turkey&method=13`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.code === 200) {
        setMonthlyData(data.data);
        // randomizeVerse() was removed, fetchRandomVerse called above
      } else {
        setError('Vakitler alınamadı.');
      }
    } catch (err) {
      setError('Bağlantı hatası.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [fetchRandomVerse]);

  // Initial Fetch & when location changes
  useEffect(() => {
    fetchMonthlyPrayerTimes(location.country, location.city, location.district);
  }, [fetchMonthlyPrayerTimes, location.country, location.city, location.district]);

  // Attempt to auto-locate on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        // Don't set loading true here to avoid flashing if default is already showing, 
        // or do set it if we want to show we are working on it. 
        // User said "direkt konum izni isteyip konumu bulsun".

        try {
          // We can reuse the same logic as handleAutoLocation but without the alerts
          const today = new Date();
          const year = today.getFullYear();
          const month = today.getMonth() + 1;

          const timesPromise = fetch(
            `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lon}&method=13`
          );
          const cityPromise = fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=tr`
          );

          const [timesRes, cityRes] = await Promise.all([timesPromise, cityPromise]);
          const timesData = await timesRes.json();
          const cityData = await cityRes.json();

          if (timesData.code === 200) {
            setMonthlyData(timesData.data);
            const detectedCity = cityData.city || cityData.locality || cityData.principalSubdivision || 'Konum';
            setLocation({ city: 'Konum', district: detectedCity });
          }
        } catch (e) {
          console.error("Auto-location failed", e);
          // Fallback is already Istanbul (default state)
        }
      }, (err) => {
        console.log("Geolocation permission denied or failed", err);
        // Fallback is already Istanbul
      });
    }
  }, []);

  // Timer Effect
  useEffect(() => {
    if (!monthlyData.length) return;
    calculateNextPrayer(); // Immediate
    const interval = setInterval(() => calculateNextPrayer(), 1000);
    return () => clearInterval(interval);
  }, [monthlyData, calculateNextPrayer]);

  // --- Modal Logic ---
  const fetchCountries = async () => {
    if (countries.length > 0) return;
    setLoadingData(true);
    try {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries');
      const data = await res.json();
      if (!data.error) {
        // data.data is array of objects { country: "Name", cities: [...] }
        // Sort: Turkey first, then alphabetical
        const sorted = data.data.sort((a, b) => {
          if (a.country === 'Turkey') return -1;
          if (b.country === 'Turkey') return 1;
          return a.country.localeCompare(b.country);
        });
        setCountries(sorted);
      }
    } catch (e) {
      console.error("Countries fetch failed", e);
      // Fallback?
    } finally {
      setLoadingData(false);
    }
  };

  const openSelectionModal = () => {
    setModalStep('country');
    setTempCountry('');
    setTempCity('');
    setDistricts([]);
    setCities([]);
    setSearchTerm('');
    setIsModalOpen(true);
    fetchCountries();
  };

  const handleCountrySelect = (countryObj) => {
    // countryObj is { country: "Name", cities: [...] }
    const name = countryObj.country;
    setTempCountry(name);
    setSearchTerm('');

    if (name === 'Turkey') {
      // Use our special Turkey list for cities (provinces)
      setCities([]); // Not using the API cities for Turkey because we have a better list
      setModalStep('city');
    } else {
      // Use the cities from the API
      setCities(countryObj.cities);
      setModalStep('city');
    }
  };

  const handleCitySelect = async (selectedCityName) => {
    setTempCity(selectedCityName);
    setSearchTerm('');

    if (tempCountry === 'Turkey') {
      // Turkey Flow: Go to District
      setLoadingDistricts(true);
      setModalStep('district');
      try {
        const res = await fetch(`https://turkiyeapi.dev/api/v1/provinces?name=${selectedCityName}`);
        const data = await res.json();
        if (data.status === "OK" && data.data.length > 0) {
          setDistricts(data.data[0].districts);
        } else {
          setDistricts([]);
        }
      } catch (e) {
        console.error("Failed to fetch districts", e);
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    } else {
      // International Flow: Done
      setLocation({ country: tempCountry, city: selectedCityName, district: '' });
      setIsModalOpen(false);
    }
  };

  const handleDistrictSelect = (districtName) => {
    setLocation({ country: 'Turkey', city: tempCity, district: districtName });
    setIsModalOpen(false);
  };

  const handleAutoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLoading(true);
        setIsModalOpen(false);
        try {
          const today = new Date();
          const year = today.getFullYear();
          const month = today.getMonth() + 1;

          // Parallel fetch: Times & City Name
          const timesPromise = fetch(
            `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lon}&method=13`
          );

          // Use a free reverse geocoding service (OpenStreetMap Nominatim or BigDataCloud)
          // BigDataCloud is reliable and free for client-side
          const cityPromise = fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=tr`
          );

          const [timesRes, cityRes] = await Promise.all([timesPromise, cityPromise]);
          const timesData = await timesRes.json();
          const cityData = await cityRes.json();

          if (timesData.code === 200) {
            setMonthlyData(timesData.data);

            // Extract meaningful location name
            // locality, city, or principalSubdivision
            const detectedCity = cityData.city || cityData.locality || cityData.principalSubdivision || 'Konum';

            // Simple logic: if City is detected, use it.
            // setLocation({ city: 'Konum', district: detectedCity });
            // Better: use the actual city name if available in our list, or fallback
            setLocation({ city: 'Konum', district: detectedCity });
          }
        } catch (e) {
          setError("Konum bazlı vakitler alınamadı.");
        } finally {
          setLoading(false);
        }
      }, (err) => {
        alert("Konum alınamadı: " + err.message);
      });
    } else {
      alert("Tarayıcınız konum servisini desteklemiyor.");
    }
  };

  // Optimize search performance
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredItems = useMemo(() => {
    if (modalStep === 'country') {
      return countries.filter(c => c.country.toLowerCase().includes(deferredSearchTerm.toLowerCase()));
    }
    if (modalStep === 'city') {
      if (tempCountry === 'Turkey') {
        return turkeyCities.filter(c => c.toLowerCase().includes(deferredSearchTerm.toLowerCase()));
      } else {
        return cities.filter(c => c.toLowerCase().includes(deferredSearchTerm.toLowerCase()));
      }
    }
    // District
    return districts.map(d => d.name).filter(d => d.toLowerCase().includes(deferredSearchTerm.toLowerCase()));
  }, [modalStep, deferredSearchTerm, countries, cities, districts, tempCountry]);


  // --- Calendar Logic ---
  const [calendarViewDate, setCalendarViewDate] = useState(new Date()); // For navigating months
  // Note: If user navigates months, we actually need to fetch NEW data for that month.
  // For simplicity MVP, let's fetch new data if month changes.

  const handleCalendarMonthChange = (offset) => {
    const newDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + offset, 1);
    setCalendarViewDate(newDate);

    // Auto-select date logic
    const today = new Date();
    if (newDate.getMonth() === today.getMonth() && newDate.getFullYear() === today.getFullYear()) {
      setSelectedDate(today);
    } else {
      setSelectedDate(newDate); // 1st of the month
    }

    const newYear = newDate.getFullYear();
    const newMonth = newDate.getMonth() + 1;

    setLoading(true);

    const targetCountry = location.country || 'Turkey';
    let apiUrl = `https://api.aladhan.com/v1/calendarByCity/${newYear}/${newMonth}?city=${location.city}&country=${targetCountry}&method=13`;
    if (location.district && location.district !== 'Bulunan Konum') {
      apiUrl = `https://api.aladhan.com/v1/calendarByAddress/${newYear}/${newMonth}?address=${location.district},${location.city},${targetCountry}&method=13`;
    }
    // If auto location was used (Bulunan Konum), we might need coords. 
    // For this specific 'Bulunan Konum' edge case, we might fail to change months correctly without storing coords. 
    // Ignoring for now or falling back to Istanbul/default if simple string.

    fetch(apiUrl).then(res => res.json()).then(data => {
      if (data.code === 200) setMonthlyData(data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };


  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
    const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const days = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const isSameDay = (d1, d2) => {
    return d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();
  };

  const getEventForDay = (date) => {
    // Fix: Use local date construction to avoid UTC timezone shifts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    return specialDays.find(d => d.date === dateString);
  };

  const calendarDays = useMemo(() => getDaysInMonth(calendarViewDate), [calendarViewDate]);
  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const daysOfWeek = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  // Active Special Day Logic (Selected, Today or Next)
  const activeSpecialDay = useMemo(() => {
    // 1. Check if the SELECTED DATE is a special day
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const selectedDay = String(selectedDate.getDate()).padStart(2, '0');
    const selectedDateStr = `${selectedYear}-${selectedMonth}-${selectedDay}`;

    const selectedEvent = specialDays.find(d => d.date === selectedDateStr);
    if (selectedEvent) {
      return { ...selectedEvent, status: 'selected' };
    }

    // 2. Fallback: Default Logic (Today or Next relative to real time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Construct local YYYY-MM-DD string for today
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    // Check if today is a special day
    const todayEvent = specialDays.find(d => d.date === todayStr);
    if (todayEvent) {
      return { ...todayEvent, status: 'today' };
    }

    // Find next special day
    const nextEvent = specialDays.find(d => d.date > todayStr);
    if (nextEvent) {
      const eventDate = new Date(nextEvent.date);
      const diffTime = Math.abs(eventDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...nextEvent, status: 'upcoming', daysLeft: diffDays };
    }

    return null;
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-sans selection:bg-orange-500 selection:text-white relative overflow-x-hidden flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-800 via-stone-900 to-stone-950"></div>

      {/* Top Navigation Bar */}
      <nav className="bg-stone-900/80 backdrop-blur-md border-b border-stone-800 py-4 sticky top-0 z-40">
        <div className="container mx-auto px-4 max-w-6xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo / Title */}
            <div className="bg-orange-500/10 p-2 rounded-lg text-orange-500">
              <Clock size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-100">Huzur Vakti</h1>
          </div>

          <button
            onClick={openSelectionModal}
            className="flex items-center gap-2 bg-stone-800/80 hover:bg-stone-800 border border-stone-700/50 hover:border-orange-500/50 rounded-full px-4 py-2 transition-all group"
          >
            <MapPin size={16} className="text-orange-500" />
            <span className="text-sm font-medium text-stone-300 group-hover:text-white transition-colors">{location.district || location.city}</span>
            <ChevronRight size={14} className="text-stone-600 group-hover:text-stone-400" />
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 max-w-6xl py-8 flex-1 flex flex-col gap-8">
        {/* Header Content: Date & Countdown */}
        <div className="text-center space-y-4">
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </h2>
            <p className="text-orange-500 font-medium text-lg">
              {/* Try to show Hijri date from active day data */}
              {activeDayData ? `${activeDayData.date.hijri.day} ${activeDayData.date.hijri.month.en} ${activeDayData.date.hijri.year}` : 'Yükleniyor...'}
            </p>
          </div>

          {!loading && (
            <div className="flex justify-center">
              <div className="bg-stone-800/50 backdrop-blur rounded-full px-6 py-2 border border-stone-700/50 flex items-center gap-2 text-stone-300 shadow-lg">
                <Clock size={16} className="text-orange-400" />
                <span className="text-sm font-medium">Sıradaki Vakit: <span className="text-white font-bold">{nextPrayer?.name}</span></span>
                <span className="w-1 h-1 bg-stone-500 rounded-full mx-1"></span>
                <span className="text-sm font-mono text-orange-400 font-bold">{countdown}</span>
              </div>
            </div>
          )}
        </div>

        {/* Horizontal Prayer Times Strip */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-orange-500 w-10 h-10" />
          </div>
        ) : (
          <div className="bg-stone-800/40 backdrop-blur-md rounded-2xl border border-stone-700/50 p-2 overflow-x-auto">
            {activeDayData && (
              <div className="flex justify-between min-w-[600px] lg:min-w-full">
                {[
                  { name: 'İmsak', time: activeDayData.timings.Fajr.split(' ')[0], key: 'Fajr' },
                  { name: 'Güneş', time: activeDayData.timings.Sunrise.split(' ')[0], key: 'Sunrise' },
                  { name: 'Öğle', time: activeDayData.timings.Dhuhr.split(' ')[0], key: 'Dhuhr' },
                  { name: 'İkindi', time: activeDayData.timings.Asr.split(' ')[0], key: 'Asr' },
                  { name: 'Akşam', time: activeDayData.timings.Maghrib.split(' ')[0], key: 'Maghrib' },
                  { name: 'Yatsı', time: activeDayData.timings.Isha.split(' ')[0], key: 'Isha' }
                ].map((item, idx) => {
                  // Highlight logic: If today and this is the next prayer? 
                  // Or purely styling. Diyanet style is simple blocks.
                  const isNext = nextPrayer?.key === item.key && isSameDay(selectedDate, new Date());
                  return (
                    <div key={idx} className={`flex-1 flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all
                                        ${isNext ? 'bg-orange-600 shadow-lg shadow-orange-900/50 scale-105 z-10' : 'hover:bg-stone-800'}
                                    `}>
                      <span className={`text-sm font-medium mb-1 ${isNext ? 'text-orange-100' : 'text-stone-400'}`}>{item.name}</span>
                      <span className={`text-2xl font-bold ${isNext ? 'text-white' : 'text-white'}`}>{item.time}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Main Content Split: Verse & Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Random Verse / Info Card */}
          <div className="bg-gradient-to-br from-stone-800/40 to-stone-900/40 backdrop-blur rounded-2xl border border-stone-700/50 p-8 flex flex-col justify-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <BookOpen size={120} />
            </div>
            <BookOpen className="w-10 h-10 text-orange-500 mx-auto mb-6" />
            <blockquote className="text-xl md:text-2xl text-stone-200 font-serif italic leading-relaxed">
              &quot;{currentVerse.text}&quot;
            </blockquote>
            <div className="w-12 h-1 bg-orange-500/30 mx-auto my-6 rounded-full"></div>
            <cite className="text-orange-500 text-sm font-bold uppercase tracking-widest not-italic">
              {currentVerse.source}
            </cite>
          </div>

          {/* Calendar */}
          <div className="bg-stone-800/40 backdrop-blur rounded-2xl border border-stone-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-bold text-white">Takvim</span>
              <div className="flex items-center gap-2 bg-stone-900/50 rounded-lg p-1">
                <button onClick={() => handleCalendarMonthChange(-1)} className="p-1.5 hover:bg-stone-700 rounded-md text-stone-400 hover:text-white"><ChevronRight className="rotate-180" size={16} /></button>
                <span className="text-sm font-medium w-28 text-center">{monthNames[calendarViewDate.getMonth()]} {calendarViewDate.getFullYear()}</span>
                <button onClick={() => handleCalendarMonthChange(1)} className="p-1.5 hover:bg-stone-700 rounded-md text-stone-400 hover:text-white"><ChevronRight size={16} /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {daysOfWeek.map(d => (
                <div key={d} className="text-xs font-bold text-stone-500 uppercase py-3">{d}</div>
              ))}
              {calendarDays.map((date, idx) => {
                if (!date) return <div key={idx}></div>;
                const isToday = isSameDay(date, new Date());
                const isSelected = isSameDay(date, selectedDate);
                const event = getEventForDay(date);

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl relative transition-all
                                        ${isSelected ? 'bg-orange-600 text-white ring-2 ring-orange-500 ring-offset-2 ring-offset-stone-900 z-10' : 'text-stone-300 hover:bg-stone-700/50'}
                                        ${isToday && !isSelected ? 'bg-stone-700 font-bold border border-stone-600' : ''}
                                    `}
                  >
                    <span className="text-sm">{date.getDate()}</span>
                    {event && (
                      <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-orange-500'}`}></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Special Day Card */}
        {activeSpecialDay && (
          <div className="bg-gradient-to-r from-orange-900/40 to-stone-900/40 backdrop-blur rounded-2xl border border-orange-500/30 p-6 flex flex-col md:flex-row items-center gap-6 text-center md:text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-orange-500">
              <Star size={100} />
            </div>

            <div className="bg-orange-500/20 p-4 rounded-full text-orange-500 shrink-0">
              <Star size={32} fill={(activeSpecialDay.status === 'today' || activeSpecialDay.status === 'selected') ? "currentColor" : "none"} />
            </div>

            <div className="flex-1 z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 justify-center md:justify-start">
                <span className="text-orange-400 font-bold uppercase tracking-wider text-sm">
                  {activeSpecialDay.status === 'today' ? "BUGÜN ÖZEL BİR GÜN" :
                    activeSpecialDay.status === 'selected' ? "SEÇİLEN ÖZEL GÜN" : "SIRADAKİ ÖZEL GÜN"}
                </span>
                {activeSpecialDay.status === 'upcoming' && (
                  <span className="bg-stone-800 text-stone-300 text-xs px-2 py-1 rounded-full border border-stone-700">
                    {activeSpecialDay.daysLeft} gün kaldı
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{activeSpecialDay.name}</h3>
              <p className="text-stone-300 leading-relaxed max-w-2xl">{activeSpecialDay.description}</p>
            </div>

            <div className="shrink-0 z-10 flex flex-col items-center bg-stone-900/50 p-3 rounded-lg border border-stone-800 backdrop-blur-sm">
              <span className="text-3xl font-bold text-orange-500">{new Date(activeSpecialDay.date).getDate()}</span>
              <span className="text-xs text-stone-400 uppercase font-bold">{monthNames[new Date(activeSpecialDay.date).getMonth()]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Modal (Same) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950 flex flex-col animate-in fade-in duration-200">
          <div className="p-4 border-b border-stone-800 flex items-center gap-4 bg-stone-900/80">
            <button
              onClick={() => {
                if (modalStep === 'district') setModalStep('city');
                else if (modalStep === 'city') setModalStep('country');
                else setIsModalOpen(false);
              }}
              className="p-2 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white transition-colors"
            >
              {modalStep !== 'country' ? <ChevronRight className="rotate-180" /> : <X />}
            </button>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">
                {modalStep === 'country' && 'Ülke Seç'}
                {modalStep === 'city' && (tempCountry === 'Turkey' ? 'Şehir Seç' : `${tempCountry} - Şehir Seç`)}
                {modalStep === 'district' && `${tempCity} - İlçe Seç`}
              </h2>
            </div>
          </div>

          <div className="p-4 border-b border-stone-800 bg-stone-900">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 w-5 h-5" />
              <input
                className="w-full bg-stone-800 text-white rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-orange-500/50 border border-stone-700 focus:border-orange-500 transition-all placeholder:text-stone-600"
                placeholder={
                  modalStep === 'country' ? "Ülke ara..." :
                    modalStep === 'city' ? "Şehir ara..." : "İlçe ara..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {modalStep === 'city' && tempCountry === 'Turkey' && (
            <div className="p-4 pb-0 max-w-2xl mx-auto w-full">
              <button
                onClick={handleAutoLocation}
                className="w-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-orange-500/20"
              >
                <Navigation size={18} />
                Konumumu Bul
              </button>
            </div>
          )}

          <div className="flex-1 w-full overflow-hidden p-4">
            <div className="max-w-2xl mx-auto h-full flex flex-col">
              {((modalStep === 'district' && loadingDistricts) || (modalStep === 'country' && loadingData)) ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-orange-500" />
                </div>
              ) : filteredItems.length > 0 ? (
                <div className="flex-1">
                  <CityList
                    items={filteredItems}
                    onSelect={
                      modalStep === 'country' ? handleCountrySelect :
                        modalStep === 'city' ? handleCitySelect :
                          handleDistrictSelect
                    }
                    getItemLabel={(item) => item.country || item.name || item} // Handle object vs string
                  />
                </div>
              ) : (
                <div className="text-center text-stone-500 py-10">Sonuç bulunamadı</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const CityList = ({ items, onSelect, getItemLabel }) => {
  const Row = ({ index, style }) => {
    const item = items[index];
    const label = getItemLabel ? getItemLabel(item) : (item.name || item);
    return (
      <div style={style} className="px-1 py-1">
        <button
          onClick={() => onSelect(item)}
          className="w-full text-left p-4 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition-colors border border-transparent hover:border-stone-700 flex items-center justify-between group"
        >
          <span>{label}</span>
          <ChevronRight size={16} className="text-stone-700 group-hover:text-stone-500" />
        </button>
      </div>
    );
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          itemCount={items.length}
          itemSize={72} // Approx height of each button including padding
          width={width}
        >
          {Row}
        </List>
      )}
    </AutoSizer>
  );
};

const AutoSizer = ({ children }) => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        // Use contentRect for precise content box size, or generic width/height
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ flex: 1, width: '100%', height: '100%', overflow: 'hidden' }}>
      {size.width > 0 && size.height > 0 && children(size)}
    </div>
  );
};

const List = ({ height, width, itemCount, itemSize, children }) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemSize);
  const endIndex = Math.min(
    itemCount - 1,
    Math.floor((scrollTop + height) / itemSize)
  );

  const items = [];
  for (let i = startIndex; i <= endIndex; i++) {
    items.push(
      children({
        index: i,
        style: {
          position: 'absolute',
          top: i * itemSize,
          left: 0,
          width: '100%',
          height: itemSize,
        },
      })
    );
  }

  return (
    <div
      style={{ position: 'relative', height, width, overflowY: 'auto', overflowX: 'hidden' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: itemCount * itemSize, width: '100%' }}>
        {items}
      </div>
    </div>
  );
};

export default App;