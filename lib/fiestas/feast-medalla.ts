// La noche del 27: contenido de la experiencia del día de la fiesta de la Medalla Milagrosa.
// Los textos son citas del Manual de JMV (Ecuador) y de la novena «Milagrosa, abres
// caminos» (2026); solo se corrigieron erratas y se desarrollaron abreviaturas
// ("Sma. Virgen" → "Santísima Virgen María"). La fuente de cada texto se anota aquí
// (no se muestra en pantalla). Excepción: la tercera aparición no está en esos
// documentos y se redactó aparte (ver nota en esa pantalla).

export type FeastArt = "anio" | "capilla" | "estrellas" | "virgen" | "medalla" | "rayos" | "luz" | "servicio" | "nombre";

export interface FeastSlide {
  kicker: string;
  art: FeastArt;
  text: string;
}

export const FEAST_STORY: FeastSlide[] = [
  {
    // Novena, Anexo V
    kicker: "París, 1830",
    art: "anio",
    text: "En 1830, santa Catalina Labouré era una novicia de las Hijas de la Caridad en la calle del Bac, París.",
  },
  {
    // Manual de JMV, «Santa Catalina Labouré»
    kicker: "Primera aparición · 18 de julio",
    art: "capilla",
    text: "Esa noche estando en el dormitorio sintió que un hermoso niño la invitaba a ir a la capilla. Lo siguió hasta allá y él la llevó ante la imagen de la Virgen Santísima.",
  },
  {
    // Manual de JMV, «¿Cuándo y cómo nació JMV?»
    kicker: "El deseo de la Virgen",
    art: "estrellas",
    text: "En su primera aparición la Virgen revela a Catalina su deseo de que se forme una Asociación de jóvenes que imiten a su hijo Jesús, y a la que concedería abundantes gracias, pues ella misma sería su protectora.",
  },
  {
    // Manual de JMV, «Santa Catalina Labouré»
    kicker: "Segunda aparición · 27 de noviembre",
    art: "virgen",
    text: "Estando por la noche en la capilla, de pronto vio que la Santísima Virgen María se le aparecía totalmente resplandeciente, derramando de sus manos hermosos rayos de luz hacia la tierra.",
  },
  {
    // Manual de JMV, «Santa Catalina Labouré»
    kicker: "La Medalla",
    art: "medalla",
    text: "Le encomendó que mandara hacer una medalla que tuviera por un lado las iniciales de la Virgen, M y una cruz, con esta frase: «Oh María, sin pecado concebida, ruega por nosotros que recurrimos a Ti».",
  },
  {
    // Manual de JMV, «Santa Catalina Labouré»
    kicker: "Los rayos de sus manos",
    art: "rayos",
    text: "«Muchas gracias y ayudas celestiales no se obtienen porque no se piden».",
  },
  {
    // NO está en el Manual ni en la novena: redactado a pedido del equipo nacional.
    // Revisar contra una fuente vicenciana antes de reutilizarlo.
    kicker: "Tercera aparición · diciembre de 1830",
    art: "luz",
    text: "En diciembre de 1830, la Santísima Virgen María se apareció por tercera vez a Catalina y le confirmó la misión de la Medalla.",
  },
  {
    // Novena, Anexo V
    kicker: "1832 · Las primeras medallas",
    art: "servicio",
    text: "En 1832, durante la epidemia de cólera parisina, comenzaron a distribuirse las primeras medallas acuñadas. En este origen encontramos una relación elocuente entre confianza en María y servicio concreto a los enfermos y a los pobres.",
  },
  {
    // Manual de JMV, «El nombre de la Medalla»
    kicker: "El nombre",
    art: "nombre",
    text: "La Medalla se llamaba originalmente «de la Inmaculada Concepción», pero al expandirse la devoción y haber tantos milagros concedidos a través de ella, se le llamó popularmente «La Medalla Milagrosa».",
  },
];

export interface FeastRoot {
  year: string;
  place: string;
  text: string;
}

// Manual de JMV, «¿Cuándo y cómo nació JMV?»
export const FEAST_ROOTS: FeastRoot[] = [
  { year: "1830", place: "París", text: "JMV tiene su origen el 18 de julio de 1830, en París, a partir de las apariciones de la Santísima Virgen María a Santa Catalina Labouré." },
  { year: "1847", place: "Roma", text: "La Asociación de Hijas de María fue aprobada por el Romano Pontífice Pío IX el 20 de junio de 1847." },
  { year: "1995", place: "Ecuador", text: "Juventudes Marianas Vicencianas fue fundada en el Ecuador el 18 de julio de 1995." },
];

/** Manual de JMV, presentación */
export const FEAST_CHAIN =
  "En JMV no eres uno más, tú eres una pieza clave de esa cadena de esperanza y amor que empezó en París en 1830, llegando esa semilla al Ecuador en 1995.";

/**
 * El momento final: recibir la Medalla (no es la consagración mariana).
 * Textos de la novena: «Oración para todos los días» y «Al concluir la novena».
 */
export const FEAST_ACCEPT = {
  kicker: "El momento de todos",
  title: "Recibo la Medalla",
  button: "La llevo en mi corazón",
  done: "Ya la llevas en tu corazón. Tu estrella está en el cielo.",
  hint: "Reza despacio. Al terminar, toca el botón y se encenderá tu estrella junto a las de tu comunidad.",
  shareHeadline: "Llevo la Medalla en mi corazón",
  text: [
    "Que no busquemos en la medalla un amuleto, sino un recuerdo vivo de tu amor y una llamada a seguirte. Que al llevarla sobre nuestro pecho llevemos también tu Palabra a nuestras decisiones y tu caridad a nuestras obras.",
    "Que la medalla que portamos nos recuerde cada día que pertenecemos a Cristo y que estamos llamados a reconocerlo en nuestros hermanos.",
    "Oh María, sin pecado concebida, ruega por nosotros que recurrimos a ti.",
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
