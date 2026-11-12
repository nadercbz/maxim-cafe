/* Maxim Standorte · EINZIGE Quelle für die Seite standorte.html (Liste, Karte, Info Karten).
   Stand der Recherche: 12.11.2026. Nichts erfunden: jede Angabe hat eine Quelle (quellen).
   zeiten: je Wochentag 0 = Sonntag bis 6 = Samstag [öffnet, schließt] in Minuten ab 0 Uhr, über 1440 = nach Mitternacht.
   zeiten nur, wenn belegt (belegt: true). Nur dann gibt es den Live Status. Sonst text_zeiten oder offen.
   lat/lng: Lage des Hauses (für den Pin auf der Karte). foto: Stimmungsbild aus dem Shooting des Kunden, kein Foto des jeweiligen Ladens
   (außer Potsdamer Platz, eigenes_foto: true). */
window.MAXIM_STANDORTE = {
  stand: "2026-11-12",
  orte: [
    {
      id: "potsdamer-platz", zentrale: true,
      name: "Potsdamer Platz",
      lage: { de: "Café & Bar mit Glasfront zum Platz", en: "Café & bar with a glass front onto the square", tr: "Meydana bakan cam cepheli kafe & bar", ru: "Кафе и бар со стеклянным фасадом на площадь", ar: "مقهى وبار بواجهة زجاجية على الساحة" },
      adresse: "Potsdamer Platz 11", ort: "10785 Berlin", bezirk: "Mitte · Tiergarten",
      lat: 52.50963, lng: 13.37638,
      foto: "assets/img/kunde/innen-sm.webp", eigenes_foto: true,
      belegt: true,
      zeiten: { 0: [480, 1440], 1: [480, 1440], 2: [480, 1440], 3: [480, 1440], 4: [480, 1440], 5: [480, 1560], 6: [480, 1560] },
      telefon: "+49 30 54982046",
      quellen: ["maxim-cafe.com/potsdamer-platz", "Impressum"]
    },
    {
      id: "am-tacheles",
      name: "Am Tacheles",
      lage: { de: "Im neuen Stadtquartier AM TACHELES", en: "In the new AM TACHELES quarter", tr: "Yeni AM TACHELES mahallesinde", ru: "В новом квартале AM TACHELES", ar: "في حي AM TACHELES الجديد" },
      adresse: "Oranienburger Straße 54-64", ort: "10117 Berlin", bezirk: "Mitte",
      lat: 52.52548, lng: 13.38956,
      foto: "assets/img/kunde/tassen-sm.webp",
      belegt: false,
      quellen: ["maxim-cafe.com/am-tacheles", "airport-region.com (Mieter AM TACHELES)", "robobau.de (Projekt Maxim Café am Tacheles)"],
      offen: "Öffnungszeiten: Unterseite nennt täglich 08:00 bis 00:00, zeigt aber die Adresse vom Potsdamer Platz. Hausnummer genau?"
    },
    {
      id: "kadewe",
      name: "KaDeWe",
      lage: { de: "Café Maxim in der 6. Etage", en: "Café Maxim on the 6th floor", tr: "6. katta Café Maxim", ru: "Café Maxim на 6-м этаже", ar: "Café Maxim في الطابق السادس" },
      adresse: "Tauentzienstraße 21-24", ort: "10789 Berlin", bezirk: "Schöneberg",
      lat: 52.50156, lng: 13.34122,
      foto: "assets/img/kunde/espresso-sm.webp",
      belegt: false,
      text_zeiten: { de: "Zu den Öffnungszeiten des KaDeWe", en: "During KaDeWe opening hours", tr: "KaDeWe çalışma saatlerinde", ru: "В часы работы KaDeWe", ar: "خلال ساعات عمل KaDeWe" },
      seit: "2026-04-24",
      quellen: ["kadewe.de/restaurants_bars (Café Maxim in der Sechsten, geöffnet zu den KaDeWe Öffnungszeiten)"]
    },
    {
      id: "gesundbrunnen",
      name: "Gesundbrunnen-Center",
      lage: { de: "Im Gesundbrunnen-Center", en: "Inside Gesundbrunnen-Center", tr: "Gesundbrunnen-Center içinde", ru: "В Gesundbrunnen-Center", ar: "داخل Gesundbrunnen-Center" },
      adresse: "Badstraße 4", ort: "13357 Berlin", bezirk: "Mitte · Gesundbrunnen",
      lat: 52.54827, lng: 13.38818,
      foto: "assets/img/kunde/toertchen-sm.webp",
      belegt: false,
      seit: "2025-09-12",
      quellen: ["gesundbrunnen-center.de/gastronomie/cafe-maxim", "neueroeffnung.info/berlin/cafe-maxim (Eröffnung 12.09.2025)"],
      offen: "Öffnungszeiten widersprüchlich: Center Seite Mo bis So 09:00 bis 22:00 (Sa bis 23:00), neueroeffnung.info Mo bis Sa 10:00 bis 20:00. Etage?"
    }
  ],
  ausserhalb: [
    {
      id: "hamburg",
      name: "Hamburg · Alsterhaus",
      lage: { de: "Im Alsterhaus am Jungfernstieg", en: "Inside Alsterhaus on Jungfernstieg", tr: "Jungfernstieg'deki Alsterhaus içinde", ru: "В Alsterhaus на Юнгфернштиг", ar: "داخل Alsterhaus في يونغفرنشتيغ" },
      adresse: "Jungfernstieg 16-20", ort: "20354 Hamburg",
      foto: "assets/img/kunde/champagner-sm.webp",
      belegt: false,
      text_zeiten: { de: "Mo bis Sa 10:00 bis 20:00, So geschlossen", en: "Mon to Sat 10:00 to 20:00, closed Sun", tr: "Pzt ile Cmt 10:00 ile 20:00, Paz kapalı", ru: "Пн по Сб 10:00 до 20:00, Вс выходной", ar: "الاثنين إلى السبت 10:00 حتى 20:00، الأحد مغلق" },
      quellen: ["maxim-cafe.com/alsterhaus (Mo bis Sa 10:00 bis 20:00, So geschlossen)"],
      offen: "Adresse vom Alsterhaus allgemein, Etage und Zeiten bestätigen."
    }
  ]
};
