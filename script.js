// ----- 81 Şehir Otomatik -----
const citiesTR = [
"Adana","Adıyaman","Afyonkarahisar","Ağrı","Aksaray","Amasya","Ankara","Antalya","Ardahan","Artvin",
"Aydın","Balıkesir","Bartın","Batman","Bayburt","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa",
"Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır","Düzce","Edirne","Elazığ","Erzincan","Erzurum",
"Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkâri","Hatay","Iğdır","Isparta","İstanbul","İzmir",
"Kahramanmaraş","Karabük","Karaman","Kars","Kastamonu","Kayseri","Kırıkkale","Kırklareli","Kırşehir",
"Kilis","Kocaeli","Konya","Kütahya","Malatya","Manisa","Mardin","Mersin","Muğla","Muş","Nevşehir",
"Niğde","Ordu","Osmaniye","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Şanlıurfa","Şırnak",
"Tekirdağ","Tokat","Trabzon","Tunceli","Uşak","Van","Yalova","Yozgat","Zonguldak"
];

const citySelect = document.getElementById("citySelect");

citiesTR.forEach(c => {
    let opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    citySelect.appendChild(opt);
});


// ----- İkonlar -----
function getIcon(code) {
    if (code === 0) return "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // güneş
    if ([1,2,3].includes(code)) return "https://cdn-icons-png.flaticon.com/512/414/414825.png"; // bulutlu
    if ([45,48].includes(code)) return "https://cdn-icons-png.flaticon.com/512/4005/4005817.png"; // sis
    if ([51,53,55,61,63,65].includes(code)) return "https://cdn-icons-png.flaticon.com/512/1163/1163657.png"; // yağmur
    if ([71,73,75].includes(code)) return "https://cdn-icons-png.flaticon.com/512/2315/2315309.png"; // kar
    return "https://cdn-icons-png.flaticon.com/512/869/869869.png";
}


// ----- Hava Durumu -----
async function getWeather() {
    const cityName = citySelect.value;

    // 1) Geocoding
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`);
    const geoData = await geoRes.json();

    if (!geoData.results) {
        alert("Şehir bulunamadı");
        return;
    }

    const { latitude, longitude } = geoData.results[0];

    // 2) 7 günlük hava durumu
    const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    const weatherData = await weatherRes.json();

    const container = document.getElementById("weather-container");
    container.innerHTML = "";

    weatherData.daily.time.forEach((day, index) => {
        let card = document.createElement("div");
        card.className = "weather-card";

        let icon = getIcon(weatherData.daily.weathercode[index]);

        card.innerHTML = `
            <h3>${day}</h3>
            <img src="${icon}">
            <p>Max: ${weatherData.daily.temperature_2m_max[index]}°C</p>
            <p>Min: ${weatherData.daily.temperature_2m_min[index]}°C</p>
        `;

        container.appendChild(card);
    });
}
