/* Maxim Café & Bar · Potsdamer Platz
   EINZIGE Quelle für Produkte und Preise der Website (Karte, Tageszeit Bühne, Frühstück Baukasten, Kaffee Labor).
   Quelle: echte Karte des Kunden "Maxim-Innen-neu-.pdf" (maxim-cafe.com, Stand der Datei 11/2023), übernommen am 10.11.2026.
   Preise in Euro. p = Preise je Größe [small, medium, large], null = gibt es nicht in der Größe.
   vol = Menge, n = Namen je Sprache (fehlt eine Sprache, gilt de), img = Bild in assets/img/cut und foto. */
window.MAXIM_MENU = {
  updated: "2023-11",
  sizes: { de: ["Small", "Medium", "Large"], en: ["Small", "Medium", "Large"], tr: ["Küçük", "Orta", "Büyük"], ru: ["Маленький", "Средний", "Большой"], ar: ["صغير", "وسط", "كبير"] },
  cats: [
    { id: "espresso", sized: true, n: { de: "Espressogetränke", en: "Espresso drinks", tr: "Espresso içecekleri", ru: "Эспрессо напитки", ar: "مشروبات الإسبريسو" }, items: [
      { id: "espresso", p: [3.10, 3.50, null], img: "espresso", n: { de: "Espresso" , ru: "Эспрессо", ar: "إسبريسو" } },
      { id: "macchiato", p: [3.40, 3.90, null], img: "macchiato", n: { de: "Espresso Macchiato", ru: "Эспрессо макиато", ar: "إسبريسو ماكياتو" } },
      { id: "cappuccino", p: [3.90, 5.10, null], img: "cappuccino", n: { de: "Cappuccino", ru: "Капучино", ar: "كابتشينو" } },
      { id: "latte", p: [4.30, 4.70, 5.10], img: "latte", n: { de: "Caffè Latte", ru: "Латте", ar: "كافيه لاتيه" } },
      { id: "mocha", p: [4.50, 4.80, 5.20], img: "mocha", n: { de: "Caffè Mocha", ru: "Мокко", ar: "كافيه موكا" } },
      { id: "flatwhite", p: [null, 4.90, 5.30], img: "flatwhite", n: { de: "Flat White", ru: "Флэт уайт", ar: "فلات وايت" } },
      { id: "americano", p: [3.80, 4.10, 4.40], img: "americano", n: { de: "Americano", ru: "Американо", ar: "أمريكانو" } }
    ] },
    { id: "iced", sized: true, n: { de: "Eisgetränke", en: "Iced drinks", tr: "Soğuk içecekler", ru: "Холодные напитки", ar: "مشروبات مثلجة" }, items: [
      { id: "icedespresso", p: [4.50, 4.80, null], img: "icedespresso", n: { de: "Iced Espresso", ru: "Айс эспрессо", ar: "إسبريسو مثلج" } },
      { id: "icedcappuccino", p: [4.70, 5.10, 5.70], img: "icedcappuccino", n: { de: "Iced Cappuccino", ru: "Айс капучино", ar: "كابتشينو مثلج" } },
      { id: "icedmocha", p: [5.10, 5.50, 5.90], img: "icedmocha", n: { de: "Iced Mocha", ru: "Айс мокко", ar: "موكا مثلجة" } },
      { id: "icedchocolate", p: [4.60, 5.00, 5.60], img: "icedchocolate", n: { de: "Iced Chocolate", ru: "Холодный шоколад", ar: "شوكولاتة مثلجة" } },
      { id: "icedchai", p: [4.50, 4.90, 5.50], img: "icedchai", n: { de: "Iced Chai Latte", ru: "Айс чай латте", ar: "تشاي لاتيه مثلج" } },
      { id: "latterocks", p: [4.60, 5.00, 5.40], img: "icedlatte", n: { de: "Latte on the Rocks", ru: "Латте со льдом", ar: "لاتيه بالثلج" } },
      { id: "americanorocks", p: [4.30, 4.70, 5.10], img: "americanorocks", n: { de: "Americano on the Rocks", ru: "Американо со льдом", ar: "أمريكانو بالثلج" } }
    ] },
    { id: "hot", sized: true, n: { de: "Heißgetränke", en: "Hot drinks", tr: "Sıcak içecekler", ru: "Горячие напитки", ar: "مشروبات ساخنة" }, items: [
      { id: "tee", p: [null, null, 3.50], img: "tee", n: { de: "Tee", en: "Tea", tr: "Çay", ru: "Чай", ar: "شاي" } },
      { id: "minze", p: [null, null, 4.50], img: "minze", n: { de: "Tee frische Minze", en: "Fresh mint tea", tr: "Taze nane çayı", ru: "Чай со свежей мятой", ar: "شاي بالنعناع الطازج" } },
      { id: "matcha", p: [null, 4.90, null], img: "matcha", n: { de: "Matcha", ru: "Матча", ar: "ماتشا" } },
      { id: "hotchocolate", p: [4.20, 4.50, 4.80], img: "hotchocolate", n: { de: "Hot Chocolate", tr: "Sıcak çikolata", ru: "Горячий шоколад", ar: "شوكولاتة ساخنة" } },
      { id: "whitechocolate", p: [4.20, 4.50, 4.80], img: "whitechocolate", n: { de: "Hot White Chocolate", tr: "Sıcak beyaz çikolata", ru: "Горячий белый шоколад", ar: "شوكولاتة بيضاء ساخنة" } },
      { id: "chai", p: [4.10, 4.40, 4.80], img: "chai", n: { de: "Chai Latte", ru: "Чай латте", ar: "تشاي لاتيه" } },
      { id: "milch", p: [2.50, 2.80, 3.30], img: "milch", n: { de: "Glas Milch", en: "Glass of milk", tr: "Bir bardak süt", ru: "Стакан молока", ar: "كوب حليب" } }
    ] },
    { id: "food", n: { de: "Frühstück & Food", en: "Breakfast & food", tr: "Kahvaltı & yemek", ru: "Завтрак и еда", ar: "فطور وطعام" }, items: [
      { id: "oats", p: [5.90], img: "oats", bf: true, n: { de: "Pfirsich Oats", en: "Peach oats", tr: "Şeftalili yulaf", ru: "Овсянка с персиком", ar: "شوفان بالخوخ" } },
      { id: "chia", p: [5.90], img: "chia", bf: true, n: { de: "Chia Pudding", en: "Chia pudding", tr: "Chia puding", ru: "Чиа пудинг", ar: "بودينغ الشيا" } },
      { id: "avocado", p: [6.90], img: "avocado", bf: true, n: { de: "Avocado Bello", ru: "Авокадо Белло", ar: "أفوكادو بيلو" } },
      { id: "laugenstange", p: [5.90], img: "laugenstange", bf: true, n: { de: "Laugenstange Käse", en: "Pretzel stick with cheese", tr: "Peynirli pretzel çubuk", ru: "Брецель с сыром", ar: "عصا البريتزل بالجبن" } },
      { id: "caesar", p: [6.50], img: "caesar", bf: true, n: { de: "Caesar Bowl", ru: "Боул Цезарь", ar: "وعاء سيزر" } },
      { id: "bavarian", p: [6.50], img: "bavarian", bf: true, n: { de: "Bavarian Bowl", ru: "Баварский боул", ar: "وعاء بافاري" } }
    ] },
    { id: "sweets", n: { de: "Sweets", en: "Sweets", tr: "Tatlılar", ru: "Десерты", ar: "حلويات" }, items: [
      { id: "croissant", p: [2.30], img: "croissant", bf: true, n: { de: "Croissant", ru: "Круассан", ar: "كرواسون" } },
      { id: "kuchen", p: [6.90], img: "kuchen", n: { de: "Kuchen", en: "Cake", tr: "Kek", ru: "Торт", ar: "كعكة" } },
      { id: "toertchen", p: [5.90], img: "toertchen", n: { de: "Törtchen", en: "Tartlet", tr: "Tartolet", ru: "Пирожное", ar: "تارت صغيرة" } },
      { id: "eclair", p: [5.90], img: "eclair", n: { de: "Eclair", en: "Éclair", tr: "Ekler", ru: "Эклер", ar: "إكلير" } },
      { id: "apfelstrudel", p: [5.90], img: "apfelstrudel", n: { de: "Apfelstrudel", en: "Apple strudel", tr: "Elmalı strudel", ru: "Яблочный штрудель", ar: "شترودل التفاح" } },
      { id: "napoleon", p: [2.80], img: "napoleon", n: { de: "Mini Napoleon", ru: "Мини Наполеон", ar: "ميني نابليون" } },
      { id: "cookie", p: [3.50], img: "cookie", n: { de: "Cookie", tr: "Kurabiye", ru: "Печенье", ar: "كوكيز" } },
      { id: "muffin", p: [3.50], img: "muffin", n: { de: "Muffin", ru: "Маффин", ar: "مافن" } }
    ] },
    { id: "soft", n: { de: "Softdrinks", en: "Soft drinks", tr: "Meşrubatlar", ru: "Безалкогольные напитки", ar: "مشروبات غازية" }, items: [
      { id: "wasser", p: [3.50], img: "wasser", vol: "0,33 l", n: { de: "Wasser sprudelnd / still", en: "Water sparkling / still", tr: "Su maden / sade", ru: "Вода газированная / негазированная", ar: "ماء فوار / عادي" } },
      { id: "orangina", p: [3.50], vol: "0,2 l", n: { de: "Orangina classic / rouge", ru: "Оранжина классик / руж", ar: "أورانجينا كلاسيك / روج" } },
      { id: "cola", p: [3.50], img: "softdrinks", vol: "0,2 l", n: { de: "Coca Cola · light · zero", ru: "Кока кола · лайт · зеро", ar: "كوكا كولا · لايت · زيرو" } },
      { id: "fanta", p: [3.50], vol: "0,2 l", n: { de: "Fanta / Sprite", ru: "Фанта / Спрайт", ar: "فانتا / سبرايت" } },
      { id: "saft", p: [3.10], vol: "0,2 l", n: { de: "Fruchtsäfte", en: "Fruit juices", tr: "Meyve suları", ru: "Фруктовые соки", ar: "عصائر فواكه" } },
      { id: "schorle", p: [4.10], img: "schorle", vol: "0,33 l", n: { de: "Apfelschorle / Rhabarberschorle", en: "Apple spritzer / rhubarb spritzer", tr: "Elma / ravent soda", ru: "Яблочный / ревеневый шорле", ar: "سبريتزر التفاح / الراوند" } },
      { id: "osaft", p: [4.90], vol: "0,3 l", img: "osaft", bf: true, n: { de: "Frisch gepresster Orangensaft", en: "Freshly squeezed orange juice", tr: "Taze sıkılmış portakal suyu", ru: "Свежевыжатый апельсиновый сок", ar: "عصير برتقال طازج" } }
    ] },
    { id: "bar", n: { de: "Bar", en: "Bar", tr: "Bar", ru: "Бар", ar: "البار" }, items: [
      { id: "bier", p: [4.50, 5.10], img: "bier", vol: "0,33 l / 0,5 l", n: { de: "Bier", en: "Beer", tr: "Bira", ru: "Пиво", ar: "بيرة" } },
      { id: "weisswein", p: [4.90, 7.00], img: "weisswein", vol: "0,1 l / 0,2 l", n: { de: "Weißwein", en: "White wine", tr: "Beyaz şarap", ru: "Белое вино", ar: "نبيذ أبيض" } },
      { id: "rotwein", p: [4.90, 7.00], img: "rotwein", vol: "0,1 l / 0,2 l", n: { de: "Rotwein", en: "Red wine", tr: "Kırmızı şarap", ru: "Красное вино", ar: "نبيذ أحمر" } },
      { id: "sekt", p: [5.90], img: "sekt", vol: "0,1 l", n: { de: "Sekt", en: "Sparkling wine", tr: "Köpüklü şarap", ru: "Игристое вино", ar: "نبيذ فوار" } },
      { id: "champagner", p: [14.90], vol: "0,1 l", img: "champagner", n: { de: "Champagner", en: "Champagne", tr: "Şampanya", ru: "Шампанское", ar: "شمبانيا" } },
      { id: "aperol", p: [11.90], img: "aperol", n: { de: "Aperol Spritz", ru: "Апероль шприц", ar: "أبيرول سبريتز" } }
    ] },
    { id: "extras", n: { de: "Extras", en: "Extras", tr: "Ekstralar", ru: "Дополнительно", ar: "إضافات" }, items: [
      { id: "shot", p: [1.00], n: { de: "Espresso Shot", ru: "Шот эспрессо", ar: "شوت إسبريسو" } },
      { id: "sirup", p: [1.00], n: { de: "Sirup", en: "Syrup", tr: "Şurup", ru: "Сироп", ar: "شراب منكه" } },
      { id: "sahne", p: [1.00], n: { de: "Sahne", en: "Whipped cream", tr: "Krema", ru: "Сливки", ar: "كريمة" } },
      { id: "hafer", p: [0.50], n: { de: "Hafermilch", en: "Oat milk", tr: "Yulaf sütü", ru: "Овсяное молоко", ar: "حليب الشوفان" } },
      { id: "soja", p: [0.50], n: { de: "Sojamilch", en: "Soy milk", tr: "Soya sütü", ru: "Соевое молоко", ar: "حليب الصويا" } },
      { id: "mandel", p: [0.50], n: { de: "Mandelmilch", en: "Almond milk", tr: "Badem sütü", ru: "Миндальное молоко", ar: "حليب اللوز" } }
    ] }
  ]
};
