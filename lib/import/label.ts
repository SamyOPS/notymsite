/**
 * Libellés du logiciel de gestion (« COCA COLA ORIGINAL IMPORT 24 x 33CL »)
 * → nom lisible, marque, contenance et conditionnement pour le site.
 * Logique pure, testée dans label.test.ts. Les cas non reconnus gardent le
 * libellé complet dans le nom : aucune information n'est perdue.
 */

export type ParsedLabel = {
  name: string;
  brand: string | null;
  /** Contenance unitaire : « 33 cl », « 1,5 L », « 500 g » */
  volume: string | null;
  /** Unités par conditionnement ; 1 = vendu à l'unité */
  unitsPerPack: number | null;
  packLabel: string;
  /** Points à vérifier dans le fichier de contrôle. */
  warnings: string[];
};

// ---------------------------------------------------------------------------
// Marques (libellé dans l'export → nom affiché). Les plus longues d'abord.
// ---------------------------------------------------------------------------

const BRANDS: Array<[pattern: string, display: string]> = [
  ["COCA COLA", "Coca-Cola"],
  ["AMERICAN FANTA", "Fanta"],
  ["FANTA", "Fanta"],
  ["SPRITE", "Sprite"],
  ["PEPSI", "Pepsi"],
  ["7UP", "7Up"],
  ["MIRINDA", "Mirinda"],
  ["SCHWEPPES", "Schweppes"],
  ["ORANGINA", "Orangina"],
  ["OASIS", "Oasis"],
  ["LIPTON", "Lipton"],
  ["FUZETEA", "Fuze Tea"],
  ["TROPICO", "Tropico"],
  ["HAWAI", "Hawaï"],
  ["CARAIBOS", "Caraïbos"],
  ["DADA", "Dada"],
  ["MINUTE MAID", "Minute Maid"],
  ["CAPRISUN", "Capri-Sun"],
  ["GRANINI", "Granini"],
  ["MAAZA", "Maaza"],
  ["VIMTO", "Vimto"],
  ["VITA MALT", "Vitamalt"],
  ["MALTA GUINNESS", "Malta Guinness"],
  ["BLUE WATER", "Blue Water"],
  ["CRISTALINE", "Cristaline"],
  ["EVIAN", "Evian"],
  ["VITTEL", "Vittel"],
  ["VOLVIC", "Volvic"],
  ["CONTREX", "Contrex"],
  ["BADOIT", "Badoit"],
  ["PERRIER", "Perrier"],
  ["SAN PELLEGRINO", "San Pellegrino"],
  ["MONT ROUCOUS", "Mont Roucous"],
  ["SAINT ANTONIN", "Saint-Antonin"],
  ["VOLCANIA", "Volcania"],
  ["RED BULL", "Red Bull"],
  ["REDBULL", "Red Bull"],
  ["MONSTER MUNCH", "Monster Munch"],
  ["MONSTER MUCHO", "Monster"],
  ["MONSTER", "Monster"],
  ["CRAZY TIGER", "Crazy Tiger"],
  ["POWERADE", "Powerade"],
  ["DR PEPPER", "Dr Pepper"],
  ["SELECTO", "Selecto"],
  ["HAMOUD", "Hamoud Boualem"],
  ["GINI", "Gini"],
  ["POMS", "Pom's"],
  ["PULCO", "Pulco"],
  ["TEISSEIRE", "Teisseire"],
  ["RIOBA", "Rioba"],
  ["CACOLAC", "Cacolac"],
  ["HEINEKEN", "Heineken"],
  ["1664", "1664"],
  ["DESPERADOS", "Desperados"],
  ["LEFFE", "Leffe"],
  ["GOUDALE", "Goudale"],
  ["CHIMAY", "Chimay"],
  ["CHOUFFE", "La Chouffe"],
  ["KRONENBOURG", "Kronenbourg"],
  ["PELFORTH", "Pelforth"],
  ["SKOLL", "Skoll"],
  ["SOMBRERO", "Sombrero"],
  ["RINCE COCHON", "Rince Cochon"],
  ["MORT SUBIT", "Mort Subite"],
  ["SUPER BOCK", "Super Bock"],
  ["BALTUS", "Baltus"],
  ["ROYAL CLUB", "Royal Club"],
  ["ST OMER", "Saint-Omer"],
  ["8.6 ORIGINAL", "8.6"],
  ["VODY", "Vody"],
  ["CODYS", "Cody's"],
  ["SMIRNOFF", "Smirnoff"],
  ["ABSOLUT", "Absolut"],
  ["POLIAKOV", "Poliakov"],
  ["SOBIESKI", "Sobieski"],
  ["ERISTOFF", "Eristoff"],
  ["ZUBROWKA", "Żubrówka"],
  ["LABEL5", "Label 5"],
  ["WILLIAM PEEL", "William Peel"],
  ["CLAN CAMPBELL", "Clan Campbell"],
  ["J&B", "J&B"],
  ["BALLANTINES", "Ballantine's"],
  ["JACK DANIEL'S", "Jack Daniel's"],
  ["JAMESON", "Jameson"],
  ["CHIVAS", "Chivas"],
  ["GRANTS", "Grant's"],
  ["RED LABEL", "Johnnie Walker"],
  ["WILLIAM LAWSON'S", "William Lawson's"],
  ["SIR EDWARDS", "Sir Edward's"],
  ["RICARD", "Ricard"],
  ["PASTIS 51", "Pastis 51"],
  ["BACARDI", "Bacardi"],
  ["SAINT JAMES", "Saint James"],
  ["CAPTAIN MORGAN", "Captain Morgan"],
  ["OLD NICK", "Old Nick"],
  ["DAMOISEAU", "Damoiseau"],
  ["DAMOIS", "Damoiseau"],
  ["DILLON", "Dillon"],
  ["MALIBU", "Malibu"],
  ["BAILEYS", "Baileys"],
  ["JAGERMEISTER", "Jägermeister"],
  ["GET 27", "Get 27"],
  ["BOMBAY SAPHIRE", "Bombay Sapphire"],
  ["MARTINI", "Martini"],
  ["MUSCADOR", "Muscador"],
  ["PORTO CRUZ", "Porto Cruz"],
  ["GIBSON", "Gibson's"],
  ["CAMBRAS", "Cambras"],
  ["BELLE FRANCE", "Belle France"],
  ["BELL FRANCE", "Belle France"],
  ["PANZANI", "Panzani"],
  ["BARILLA", "Barilla"],
  ["LAYS", "Lay's"],
  ["BRETS", "Brets"],
  ["VICO", "Vico"],
  ["PRINGLES", "Pringles"],
  ["DORITOS", "Doritos"],
  ["DORITES", "Doritos"],
  ["CHEETOS", "Cheetos"],
  ["BENENUTS", "Bénénuts"],
  ["BELIN", "Belin"],
  ["HARIBO", "Haribo"],
  ["MAOAM", "Maoam"],
  ["CHUPA CHUPS", "Chupa Chups"],
  ["MENTOS", "Mentos"],
  ["HOLLYWOOD", "Hollywood"],
  ["MALABAR", "Malabar"],
  ["KINDER", "Kinder"],
  ["MILKA", "Milka"],
  ["OREO", "Oreo"],
  ["TUC", "Tuc"],
  ["TWIX", "Twix"],
  ["SNICKERS", "Snickers"],
  ["M&M'S", "M&M's"],
  ["M&M", "M&M's"],
  ["MALTESERS", "Maltesers"],
  ["KIT KAT", "KitKat"],
  ["NUTELLA", "Nutella"],
  ["DOLCE GUSTO", "Nescafé Dolce Gusto"],
  ["NESCAFE", "Nescafé"],
  ["NESQUIK", "Nesquik"],
  ["CARTE NOIRE", "Carte Noire"],
  ["L'OR", "L'Or"],
  ["LAVAZZA", "Lavazza"],
  ["SENSEO", "Senseo"],
  ["TASSIMO", "Tassimo"],
  ["GRAND MERE", "Grand'Mère"],
  ["SAN MARCO", "San Marco"],
  ["CAFE ROYAL", "Café Royal"],
  ["RICORE", "Ricoré"],
  ["BANANIA", "Banania"],
  ["STARLING", "Starling"],
  ["MAGGI", "Maggi"],
  ["SAMIA", "Samia"],
  ["TANTINE", "Tantine"],
  ["LEGUMOR", "Legumor"],
  ["AKASH", "Akash"],
  ["TILDA", "Tilda"],
  ["PERLE D'ASIE", "Perle d'Asie"],
  ["HAUDECOEUR", "Haudecœur"],
  ["MAMA FUTA", "Mama Futa"],
  ["VILLAGEOISE", "Villageoise"],
  ["BON GUINEE", "Bon Guinée"],
  ["NKULENU", "Nkulenu"],
  ["NUMBER ONE", "Number One"],
  ["TROFAI", "Trofai"],
  ["PEAK MILK", "Peak"],
  ["BONNET ROUGE", "Bonnet Rouge"],
  ["NIDO", "Nido"],
  ["CANDIA", "Candia"],
  ["REGILAIT", "Régilait"],
  ["NESTLE", "Nestlé"],
  ["MONT BLANC", "Mont Blanc"],
  ["HEINZ", "Heinz"],
  ["AMORA", "Amora"],
  ["TABASCO", "Tabasco"],
  ["CAP BON", "Cap Bon"],
  ["ROLLI", "Rolli"],
  ["SAINT LOUIS", "Saint Louis"],
  ["DADDY", "Daddy"],
  ["BALEINE", "La Baleine"],
  ["CEREBEO", "Cérébos"],
  ["PETIT NAVIRE", "Petit Navire"],
  ["SAUPIQUET", "Saupiquet"],
  ["CONNETABLE", "Connétable"],
  ["WILLIAM SAURIN", "William Saurin"],
  ["KNORR", "Knorr"],
  ["INDOMIE", "Indomie"],
  ["BULDAK", "Buldak"],
  ["AROY-D", "Aroy-D"],
  ["BAMA", "Bama"],
  ["DAKATINE", "Dakatine"],
  ["PINDAKA", "Pindaka"],
  ["HAPPY", "Happy"],
  ["SEREBIS", "Serebis"],
  ["PURINA ONE", "Purina One"],
  ["WHISKAS", "Whiskas"],
  ["FELIX", "Felix"],
  ["CATISFACTION", "Catisfactions"],
  ["GOURMET", "Gourmet"],
  ["OMO", "Omo"],
  ["LA CROIX", "La Croix"],
  ["LACROIX", "La Croix"],
  ["HARPIC", "Harpic"],
  ["CANARD", "Canard"],
  ["DESTOP", "Destop"],
  ["L'ARBRE VERT", "L'Arbre Vert"],
  ["DR.BECKMANN", "Dr. Beckmann"],
  ["ALWAYS", "Always"],
  ["GENIE", "Génie"],
  ["BINGOIL", "Bingoil"],
  ["PUGET", "Puget"],
  ["MISTER T", "Mister T"],
  ["DAUCY", "d'aucy"],
  ["BROSSARD", "Brossard"],
  ["TIPIAK", "Tipiak"],
  ["AASHIRVAAD", "Aashirvaad"],
  ["CERDAN", "Cerdán"],
  ["ALDOR", "Aldor"],
  ["ZED CANDY", "Zed Candy"],
  ["FUNNY CANDY", "Funny Candy"],
  ["BEBETO", "Bebeto"],
  ["HITSCHIES", "Hitschies"],
  ["TROPIWAY", "Tropiway"],
  ["EXETER", "Exeter"],
  ["GLENRYCK", "Glenryck"],
  ["EL MANAR", "El Manar"],
  ["ACORSA", "Acorsa"],
  ["ALFAPAC", "Alfapac"],
  ["RAMZY", "Ramzy"],
  ["LOLLYDIP", "Lollydip"],
  ["PROFISA", "Profisa"],
  ["FINI", "Fini"],
  ["JUMBO", "Jumbo"],
  ["LU", "LU"],
  ["BN", "BN"],
  ["MARS", "Mars"],
];

/** Marques de distributeur signalées par un sigle en fin de libellé. */
const PRIVATE_LABELS: Record<string, string> = { BF: "Belle France" };

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

type BrandEntry = { pattern: string; display: string; re: RegExp };

const BRAND_ENTRIES: BrandEntry[] = BRANDS.map(([pattern, display]) => ({
  pattern,
  display,
  // « JUMBO » ne doit pas reconnaître « JUMBOS » (bonbons Fini).
  re: new RegExp(`(?:^|[^A-Z0-9'])${escape(pattern)}(?![A-Z0-9])`),
})).sort((a, b) => b.pattern.length - a.pattern.length);

function findBrand(upper: string): string | null {
  for (const { re, display } of BRAND_ENTRIES) {
    if (re.test(upper)) return display;
  }
  for (const [token, display] of Object.entries(PRIVATE_LABELS)) {
    if (new RegExp(`(?:^|\\s)${token}(?=\\s|$)`).test(upper)) return display;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Contenance et conditionnement
// ---------------------------------------------------------------------------

const UNIT = String.raw`(CL|ML|LITRES?|L|KG|GR|G)`;
const NUM = String.raw`(\d+(?:[.,]\d+)?)`;

/** « 33 », « CL » → « 33 cl » ; « 1.5 », « L » → « 1,5 L » */
export function formatSize(value: string, unit: string): string {
  const n = value.replace(".", ",").replace(/,0+$/, "");
  const u = unit.toUpperCase();
  const label =
    u === "L" || u.startsWith("LITRE")
      ? "L"
      : u === "GR"
        ? "g"
        : u === "KG"
          ? "kg"
          : u.toLowerCase();
  return `${n} ${label}`;
}

type Pack = { units: number; size: string | null; match: string };

/**
 * Conditionnement reconnu dans le libellé (en majuscules), du plus précis
 * au plus simple. `match` est le texte à retirer du nom.
 */
function findPack(upper: string, isBeverage: boolean): Pack | null {
  const tests: Array<[RegExp, (m: RegExpExecArray) => Pack]> = [
    // (6x20CL) x 4 → 24 × 20 cl
    [
      new RegExp(
        String.raw`\(\s*L?(\d+)\s*X\s*${NUM}\s*${UNIT}\s*\)\s*X\s*(\d+)`,
      ),
      (m) => ({
        units: Number(m[1]) * Number(m[4]),
        size: formatSize(m[2]!, m[3]!),
        match: m[0],
      }),
    ],
    // (10 x 4) x 20CL → 40 × 20 cl
    [
      new RegExp(
        String.raw`\(\s*(\d+)\s*X\s*(\d+)\s*\)\s*X\s*${NUM}\s*${UNIT}`,
      ),
      (m) => ({
        units: Number(m[1]) * Number(m[2]),
        size: formatSize(m[3]!, m[4]!),
        match: m[0],
      }),
    ],
    // (20PCS x 10L) x 48, (60G x 30) x 12 → 48 unités (contenance intérieure)
    [
      /\(([^()]*)\)\s*X\s*(\d+)/,
      (m) => {
        const inner = findSize(m[1]!);
        return { units: Number(m[2]), size: inner?.size ?? null, match: m[0] };
      },
    ],
    // 24 x 33CL, 12x50cl, 10 x 1KG
    [
      new RegExp(String.raw`(?<![\d.,])(\d+)\s*X\s*${NUM}\s*${UNIT}(?![A-Z])`),
      (m) => ({
        units: Number(m[1]),
        size: formatSize(m[2]!, m[3]!),
        match: m[0],
      }),
    ],
    // 6 x 38PCS (couches) → 6 paquets de 38 pièces
    [
      /(?<![\d.,])(\d+)\s*X\s*(\d+)\s*PCS\b/,
      (m) => ({ units: Number(m[1]), size: `${m[2]} pièces`, match: m[0] }),
    ],
    // 1L5X6 (Vittel)
    [
      /(?<![\d.,])(\d)L(\d)\s*X\s*(\d+)/,
      (m) => ({
        units: Number(m[3]),
        size: formatSize(`${m[1]}.${m[2]}`, "L"),
        match: m[0],
      }),
    ],
    // 1.5LX6, 500G X 12, 25CLX24, 42GX24
    [
      new RegExp(
        String.raw`(?<![\d.,])${NUM}\s*${UNIT}\s*X\s*(\d+)(?![\d.,]*\s*(?:CL|ML|L|KG|G)\b)`,
      ),
      (m) => ({
        units: Number(m[3]),
        size: formatSize(m[1]!, m[2]!),
        match: m[0],
      }),
    ],
  ];
  if (isBeverage) {
    // Boissons sans unité : « 1.25X6 » = 6 × 1,25 L, « 33X12 » = 12 × 33 cl
    tests.push(
      [
        /(?<![\d.,])(\d[.,]\d+)\s*X\s*(\d+)(?![\d.,])/,
        (m) => ({
          units: Number(m[2]),
          size: formatSize(m[1]!, "L"),
          match: m[0],
        }),
      ],
      [
        /(?<![\d.,])(25|33|50)\s*X\s*(\d+)(?![\d.,])/,
        (m) => ({
          units: Number(m[2]),
          size: formatSize(m[1]!, "CL"),
          match: m[0],
        }),
      ],
      [
        /(?<![\d.,])(\d{1,2})\s*X\s*(25|33|50)(?![\d.,A-Z])/,
        (m) => ({
          units: Number(m[1]),
          size: formatSize(m[2]!, "CL"),
          match: m[0],
        }),
      ],
    );
  }
  for (const [pattern, build] of tests) {
    const m = pattern.exec(upper);
    if (m) return build(m);
  }
  return null;
}

/** Contenance seule (« 5KG », « 70CL ») quand aucun multiple n'est indiqué. */
function findSize(upper: string): { size: string; match: string } | null {
  const m = new RegExp(String.raw`(?<![\d.,/])${NUM}\s*${UNIT}(?![A-Z])`).exec(
    upper,
  );
  return m ? { size: formatSize(m[1]!, m[2]!), match: m[0] } : null;
}

// ---------------------------------------------------------------------------
// Mise en forme du nom
// ---------------------------------------------------------------------------

/** Mots en majuscules dans l'export → orthographe correcte. */
const WORDS: Record<string, string> = {
  PATES: "pâtes",
  PATE: "pâte",
  PATEE: "pâtée",
  CAFE: "café",
  EPICES: "épices",
  EPICE: "épice",
  EPCIES: "épices",
  PECHE: "pêche",
  CREME: "crème",
  PUREE: "purée",
  LEGUMES: "légumes",
  LEGUME: "légume",
  CEREALES: "céréales",
  CEREALE: "céréale",
  BOEUF: "bœuf",
  FRAICHEUR: "fraîcheur",
  FRAICHE: "fraîche",
  EPINARDS: "épinards",
  MELANGE: "mélange",
  SESAME: "sésame",
  CACAHUETE: "cacahuète",
  CACAHUETES: "cacahuètes",
  CACAHUETTE: "cacahuète",
  CACAHUETTES: "cacahuètes",
  GENOISE: "génoise",
  ECREME: "écrémé",
  ENTIERE: "entière",
  ENTIERES: "entières",
  FUME: "fumé",
  FUMEE: "fumée",
  FUMEES: "fumées",
  GRILLE: "grillé",
  GRILLEES: "grillées",
  GRILLER: "grillé",
  SALE: "salé",
  SALES: "salés",
  SALEES: "salées",
  ALLEGE: "allégé",
  ALLEGEE: "allégée",
  DECORTIQUE: "décortiqué",
  PIMENTEE: "pimentée",
  ETUVE: "étuvé",
  ETUI: "étui",
  METEORE: "météore",
  CHEVRE: "chèvre",
  GELEE: "gelée",
  SAUTE: "sauté",
  EMINCE: "émincé",
  EMINCES: "émincés",
  EMIETTE: "émietté",
  EFFILES: "effilés",
  BOUCHEES: "bouchées",
  FEUILLETES: "feuilletés",
  FOURRES: "fourrés",
  GOUTERS: "goûters",
  GOUT: "goût",
  GOUTS: "goûts",
  EGLEFIN: "églefin",
  MEROU: "mérou",
  MURE: "mûre",
  MURES: "mûres",
  ENERGISANTE: "énergisante",
  ETOILE: "étoilé",
  BLE: "blé",
  MAIS: "maïs",
  DEGERME: "dégermé",
  CUISINEES: "cuisinées",
  ECAILLE: "écaillé",
  SURGELER: "surgelé",
  COUPEE: "coupée",
  COUPE: "coupé",
  CREPE: "crêpe",
  DENOYAUTEES: "dénoyautées",
  DENOYAUTE: "dénoyauté",
  POELEE: "poêlée",
  FECULE: "fécule",
  CHICOREE: "chicorée",
  MEDITERRANEE: "Méditerranée",
  CREMEUX: "crémeux",
  SAVOUREUX: "savoureux",
  REUTILISABLE: "réutilisable",
  REUTILISABEL: "réutilisable",
  DESODORISANT: "désodorisant",
  DETACHANT: "détachant",
  DETACHEUR: "détacheur",
  DETARTRANT: "détartrant",
  DEPOUSSIERANT: "dépoussiérant",
  DEMAQUILLANT: "démaquillant",
  BEBE: "bébé",
  LITIERE: "litière",
  ASSOUPLISSANT: "assouplissant",
  THE: "thé",
  GRENADE: "grenade",
  TETE: "tête",
  ALIMENTAIRE: "alimentaire",
  MOULUE: "moulue",
  BATONNETS: "bâtonnets",
  BATONNET: "bâtonnet",
  BÂTONNETS: "bâtonnets",
  CONCENTRE: "concentré",
  PREPARER: "préparé",
  PRET: "prêt",
  DEGUSTER: "déguster",
  BRUN: "brun",
  ECOLIER: "écolier",
  LYOPHILISE: "lyophilisé",
  SELECTION: "sélection",
  DECAFEINE: "décaféiné",
  DELICE: "délice",
  CAFEINE: "caféine",
  PARFUME: "parfumé",
  CASSE: "cassé",
  VELOUTE: "velouté",
  QUALITE: "qualité",
  BRESIL: "Brésil",
  PASTEQUE: "pastèque",
  PEPITE: "pépite",
  PEPITES: "pépites",
  CERISE: "cerise",
  ELEPHAN: "éléphant",
  LEGERE: "légère",
  NATUREL: "naturel",
  SPECIALE: "spéciale",
  TROPICALE: "tropicale",
  ORIGINALE: "originale",
  EXOTIQUE: "exotique",
  SUPERIEUR: "supérieur",
  SUPERIEURE: "supérieure",
  PREPARE: "préparé",
  PREPARES: "préparés",
  PIMENTE: "pimenté",
  ENROBE: "enrobé",
  ENROBES: "enrobés",
  FERMENTE: "fermenté",
  CARRE: "carré",
  CARRES: "carrés",
  DORE: "doré",
  DOREE: "dorée",
  DOREES: "dorées",
  RAPE: "râpé",
  PELEES: "pelées",
  CONCASSE: "concassé",
  MOULINE: "mouliné",
  NETTOYANT: "nettoyant",
  ECO: "éco",
  ETIRABLE: "étirable",
  CUILLERES: "cuillères",
  ASSIETTE: "assiette",
  ECHALOTE: "échalote",
  AMERICAIN: "américain",
  CANNELLE: "cannelle",
  GLACE: "glace",
  GLACEE: "glacée",
  MULTIVITAMINEE: "multivitaminée",
  MULTIVITAMINEES: "multivitaminées",
  RESISTANTS: "résistants",
  MODELE: "modèle",
  CONGELATION: "congélation",
  EPONGE: "éponge",
  DECORE: "décoré",
  POIGNEE: "poignée",
  PELEE: "pelée",
  NORVEGE: "Norvège",
  SENEGAL: "Sénégal",
  ATTIEKE: "attiéké",
  BIERE: "bière",
  BIERES: "bières",
  TRES: "très",
  AROME: "arôme",
  OEUF: "œuf",
  OEUFS: "œufs",
};

/** Mots laissés en majuscules. */
const KEEP_UPPER = new Set([
  "FR",
  "UK",
  "BF",
  "EP",
  "BBQ",
  "PET",
  "BQ",
  "IWW",
  "XL",
  "BIO",
  "VS",
  "BPA",
  "CB",
  "LDPE",
  "PDT",
  "WC",
  "DIY",
  "ABC",
  "MRP",
  "PCD",
  "USA",
  "UHT",
  "TV",
  "N°1",
  "J&B",
  "LU",
  "BN",
  "OG",
  "MSC",
]);

/** Petits mots en minuscules (sauf en début de nom). */
const SMALL = new Set([
  "DE",
  "DU",
  "DES",
  "LA",
  "LE",
  "LES",
  "À",
  "A",
  "AU",
  "AUX",
  "ET",
  "EN",
  "SUR",
  "SANS",
  "AVEC",
  "POUR",
  "OU",
  "X",
]);

function formatWord(word: string, index: number, isAlcohol: boolean): string {
  // Contenances et nombres : « 33CL » → « 33 cl », « 37.5° » → « 37,5° »
  const size = new RegExp(String.raw`^${NUM}${UNIT}$`).exec(word);
  if (size) return formatSize(size[1]!, size[2]!);
  if (/^\d+[.,]\d+°$/.test(word)) return word.replace(".", ",");
  if (/\d/.test(word))
    return word.toLowerCase().replace(/^(\d+)x(\d)/, "$1 x $2");
  if (KEEP_UPPER.has(word)) return word;
  if (isAlcohol && word === "ROSE") return "Rosé";
  if (index > 0 && SMALL.has(word))
    return word === "A" ? "à" : word.toLowerCase();

  // Élisions : D'ORANGER → d'Oranger, L'ANCIENNE → l'Ancienne
  const elision = /^([DL])'(.+)$/.exec(word);
  if (elision) {
    const head = index === 0 ? elision[1]! : elision[1]!.toLowerCase();
    return `${head}'${capitalize(WORDS[elision[2]!] ?? elision[2]!.toLowerCase())}`;
  }
  const known = WORDS[word];
  return capitalize(known ?? word.toLowerCase());
}

const capitalize = (s: string) =>
  s
    .replace(/^(\p{L})/u, (c) => c.toUpperCase())
    .replace(
      /([-'(&])(\p{L})/gu,
      (_m, sep: string, c: string) => sep + c.toUpperCase(),
    );

function titleCase(upper: string, isAlcohol: boolean): string {
  return upper
    .split(" ")
    .filter(Boolean)
    .map((word, i) => formatWord(word, i, isAlcohol))
    .join(" ");
}

/** Écrit les marques reconnues comme elles s'affichent (« Coca Cola » → « Coca-Cola »). */
function applyBrandSpelling(name: string, upper: string): string {
  let result = name;
  for (const { pattern, display, re } of BRAND_ENTRIES) {
    if (!re.test(upper)) continue;
    const written = titleCase(pattern, false);
    if (written === display) continue;
    const inName = new RegExp(
      String.raw`(^|[^\p{L}\d'])${escape(written)}(?![\p{L}\d])`,
      "u",
    );
    result = result.replace(inName, `$1${display}`);
  }
  return result;
}

/** Retire les sigles de distributeur (« BF ») et le bruit de fin de libellé. */
function stripNoise(upper: string): string {
  return upper
    .replace(/\bLE CARTON\b|\bLA PIECE\b|\bCARTON\b$/g, " ")
    .replace(/(?:^|\s)BF(?=\s|$)/g, " ")
    .replace(/(?:^|\s)(?:1\s*PCS|X\s*1)\s*$/g, " ")
    .replace(/\(\s*\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------

export type LabelContext = {
  /** Univers de la catégorie : « Pack de » pour les boissons, « Carton de » sinon. */
  isBeverage: boolean;
  isAlcohol: boolean;
  /** Épicerie : « 125X12 » sans unité = 12 × 125 g. */
  isFood?: boolean;
};

/** Reste de libellé après extraction : « ( x ) », « / » ou « x » orphelins. */
function tidy(text: string): string {
  return text
    .replace(/\(\s*(?:X\s*)?\)/g, " ")
    .replace(/(?:^|\s)X(?=\s*(?:$|\)))/g, " ")
    .replace(/\s\/\s*$/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseLabel(raw: string, context: LabelContext): ParsedLabel {
  const warnings: string[] = [];
  // Libellés écrits avec des tirets à la place des espaces.
  let upper = raw.trim().toUpperCase().replace(/’/g, "'");
  if (!upper.includes(" ") && (upper.match(/-/g)?.length ?? 0) >= 2) {
    upper = upper.replace(/-/g, " ");
  }
  upper = upper.replace(/\s+/g, " ");

  const brand = findBrand(upper);
  // « 1PCS », « X 1 » en fin de libellé : vendu à l'unité.
  const single = /(?:^|\s)(?:1\s*PCS|X\s*1)\s*$/.test(upper);
  let rest = stripNoise(upper);
  let volume: string | null = null;
  let units: number | null = single ? 1 : null;

  let pack = findPack(rest, context.isBeverage);
  if (!pack && context.isFood) {
    const m = /(?<![\d.,])(\d{2,3})\s*X\s*(\d{1,2})(?![\d.,A-Z])/.exec(rest);
    if (m) {
      pack = { units: Number(m[2]), size: formatSize(m[1]!, "G"), match: m[0] };
    }
  }
  let lot = false;
  if (pack) {
    units = pack.units;
    volume = pack.size;
    rest = rest.replace(pack.match, " ");
  } else {
    const pieces = /(?<![\d.,])(\d+)\s*PCS\b/.exec(rest);
    const times = /(?:^|\s)X\s*(\d+)\s*$/.exec(rest);
    if (pieces) {
      units = Number(pieces[1]);
      lot = true;
      rest = rest.replace(pieces[0], " ");
    } else if (times) {
      units = Number(times[1]);
      rest = rest.replace(times[0], " ");
    }
    const size = findSize(rest);
    if (size) {
      volume = size.size;
      rest = rest.replace(size.match, " ");
      units ??= 1;
    }
    if (units === null) warnings.push("conditionnement non reconnu");
  }
  // La contenance va en fin de nom : « Pâtes Torti Panzani 500 g ».
  rest = tidy(rest);
  if (volume && !volume.endsWith("pièces")) rest = `${rest} ${volume}`;

  rest = rest.replace(/\s+/g, " ").trim();
  // Les contenances déjà formatées (« 33 cl ») ne doivent pas être recasées.
  let name = titleCase(rest, context.isAlcohol)
    .replace(
      /\b(\d+(?:,\d+)?) (Cl|Ml|Kg|G)\b/g,
      (_m, n: string, u: string) =>
        `${n} ${u === "Kg" ? "kg" : u.toLowerCase()}`,
    )
    .replace(/\b(\d+(?:,\d+)?) (l)\b/g, "$1 L");
  name = applyBrandSpelling(name, upper);
  if (!name) {
    name = titleCase(upper, context.isAlcohol);
    warnings.push("nom vide après nettoyage");
  }

  const packLabel =
    units === null
      ? "À l'unité"
      : units === 1
        ? "À l'unité"
        : lot
          ? `Lot de ${units}`
          : `${context.isBeverage ? "Pack" : "Carton"} de ${units}`;
  if (units !== null && units > 500) warnings.push("nombre d'unités élevé");
  // Restes de dimensions ou de multiples dans le nom (« 24 x 20m », « 3sx »).
  if (/\d\s*x\b|\bx\s*\d|\d+x\d/i.test(name)) warnings.push("nom à relire");

  return { name, brand, volume, unitsPerPack: units, packLabel, warnings };
}
