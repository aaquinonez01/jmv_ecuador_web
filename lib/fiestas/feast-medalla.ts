// La noche del 27: contenido de la experiencia del día de la fiesta de la Medalla Milagrosa.
// Los textos son citas literales del Manual de JMV (Ecuador) y de la novena
// «Milagrosa, abres caminos» (2026). Solo se corrigieron erratas evidentes
// (tildes, "acuñar"). No agregar frases sin fuente.

export type FeastArt = "anio" | "capilla" | "estrellas" | "virgen" | "medalla" | "rayos" | "servicio";

export interface FeastSlide {
  kicker: string;
  art: FeastArt;
  text: string;
  source: string;
}

const MANUAL_ORIGEN = "Manual de JMV, «¿Cuándo y cómo nació JMV?»";
const MANUAL_CATALINA = "Manual de JMV, «Santa Catalina Labouré»";
const NOVENA = "Novena «Milagrosa, abres caminos», Anexo V";

export const FEAST_STORY: FeastSlide[] = [
  {
    kicker: "París, 1830",
    art: "anio",
    text: "En 1830, santa Catalina Labouré era una novicia de las Hijas de la Caridad en la calle del Bac, París.",
    source: NOVENA,
  },
  {
    kicker: "La noche del 18 de julio",
    art: "capilla",
    text: "Esa noche estando en el dormitorio sintió que un hermoso niño la invitaba a ir a la capilla. Lo siguió hasta allá y él la llevó ante la imagen de la Virgen Santísima.",
    source: MANUAL_CATALINA,
  },
  {
    kicker: "El deseo de la Virgen",
    art: "estrellas",
    text: "En su primera aparición la Virgen revela a Catalina su deseo de que se forme una Asociación de jóvenes que imiten a su hijo Jesús, y a la que concedería abundantes gracias, pues ella misma sería su protectora.",
    source: MANUAL_ORIGEN,
  },
  {
    kicker: "27 de noviembre de 1830",
    art: "virgen",
    text: "Estando por la noche en la capilla, de pronto vio que la Sma. Virgen se le aparecía totalmente resplandeciente, derramando de sus manos hermosos rayos de luz hacia la tierra.",
    source: MANUAL_CATALINA,
  },
  {
    kicker: "La Medalla",
    art: "medalla",
    text: "Otro de los mensajes de la Virgen fue la de mandar acuñar la Medalla Milagrosa, que también será la insignia de nuestra Asociación.",
    source: MANUAL_ORIGEN,
  },
  {
    kicker: "Los rayos de sus manos",
    art: "rayos",
    text: "«Muchas gracias y ayudas celestiales no se obtienen porque no se piden».",
    source: MANUAL_CATALINA,
  },
  {
    kicker: "1832",
    art: "servicio",
    text: "En 1832, durante la epidemia de cólera parisina, comenzaron a distribuirse las primeras medallas acuñadas. En este origen encontramos una relación elocuente entre confianza en María y servicio concreto a los enfermos y a los pobres.",
    source: NOVENA,
  },
];

export interface FeastRoot {
  year: string;
  place: string;
  text: string;
}

export const FEAST_ROOTS: FeastRoot[] = [
  { year: "1830", place: "París", text: "JMV tiene su origen el 18 de julio de 1830, en París, a partir de las apariciones de la Santísima Virgen María a Santa Catalina Labouré." },
  { year: "1847", place: "Roma", text: "La Asociación de Hijas de María fue aprobada por el Romano Pontífice Pío IX el 20 de junio de 1847." },
  { year: "1995", place: "Ecuador", text: "Juventudes Marianas Vicencianas fue fundada en el Ecuador el 18 de julio de 1995." },
];

export const FEAST_ROOTS_SOURCE = MANUAL_ORIGEN;

/** Presentación del Manual de JMV */
export const FEAST_CHAIN =
  "En JMV no eres uno más, tú eres una pieza clave de esa cadena de esperanza y amor que empezó en París en 1830, llegando esa semilla al Ecuador en 1995.";
export const FEAST_CHAIN_SOURCE = "Manual de JMV, presentación";

export const FEAST_CONSECRATION = {
  title: "Consagración a la Virgen de la Medalla Milagrosa",
  source: "Manual de JMV, p. 149",
  text: [
    "¡Postrado ante tu acatamiento, oh Virgen de la Medalla Milagrosa!, y después de saludarte en el venerable misterio de tu concepción sin mancha, te elijo, desde ahora para siempre, por mi Madre, Abogada, Reina y Señora de todas mis acciones y Protectora ante la majestad de Dios.",
    "Yo te prometo, Virgen purísima, no olvidarte jamás, ni tu culto ni los intereses de tu gloria, a la vez que te prometo también promover en los que me rodean tu amor.",
    "Recíbeme, Madre tierna, desde este momento y sé para mí el refugio en esta vida y el sostén a la hora de la muerte.",
    "Amén.",
  ],
};

/** Orden en que se arma la Medalla en la celebración: primero el anverso, luego el reverso */
export const FEAST_PIECES: { id: string; face: "front" | "back" }[] = [
  { id: "rayos", face: "front" },
  { id: "globo", face: "front" },
  { id: "serpiente", face: "front" },
  { id: "inscripcion", face: "front" },
  { id: "maria", face: "front" },
  { id: "m", face: "back" },
  { id: "cruz", face: "back" },
  { id: "corazones", face: "back" },
  { id: "estrellas", face: "back" },
];
