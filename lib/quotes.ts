export type Quote = {
  id: string;
  text: string;
  source: string;
  theme: 'recuerdo' | 'observacion' | 'aim' | 'centros' | 'trabajo';
};

/** Citas breves y máximas del Trabajo — para estudio personal. */
export const QUOTES: Quote[] = [
  {
    id: 'q1',
    text: 'Recuérdate a ti mismo.',
    source: 'Enseñanza del Cuarto Camino',
    theme: 'recuerdo',
  },
  {
    id: 'q2',
    text: 'El hombre no puede hacer. Todo le sucede.',
    source: 'Enseñanza del Cuarto Camino',
    theme: 'trabajo',
  },
  {
    id: 'q3',
    text: 'Conócete a ti mismo.',
    source: 'Enseñanza del Cuarto Camino',
    theme: 'observacion',
  },
  {
    id: 'q4',
    text: 'La observación de sí es el comienzo del despertar.',
    source: 'Enseñanza del Cuarto Camino',
    theme: 'observacion',
  },
  {
    id: 'q5',
    text: 'Sin aim no hay Trabajo.',
    source: 'Enseñanza del Cuarto Camino',
    theme: 'aim',
  },
  {
    id: 'q6',
    text: 'Somos una multiplicidad. No hay un solo “yo”.',
    source: 'Enseñanza del Cuarto Camino',
    theme: 'observacion',
  },
  {
    id: 'q7',
    text: 'Identificarse es perderse.',
    source: 'Enseñanza del Cuarto Camino',
    theme: 'observacion',
  },
  {
    id: 'q8',
    text: 'El trabajo sobre uno mismo es trabajo en la vida.',
    source: 'Enseñanza del Cuarto Camino',
    theme: 'trabajo',
  },
  {
    id: 'q9',
    text: 'Los centros hablan lenguajes distintos. Escúchalos sin juzgar.',
    source: 'Enseñanza del Cuarto Camino',
    theme: 'centros',
  },
  {
    id: 'q10',
    text: 'Un momento de presencia vale más que horas de sueño despierto.',
    source: 'Enseñanza del Cuarto Camino',
    theme: 'recuerdo',
  },
  {
    id: 'q11',
    text: 'Ver es ya un acto. No corrijas demasiado pronto.',
    source: 'Enseñanza del Cuarto Camino',
    theme: 'observacion',
  },
  {
    id: 'q12',
    text: 'El aim debe ser concreto, posible y sentido.',
    source: 'Enseñanza del Cuarto Camino',
    theme: 'aim',
  },
];

export function quoteOfDay(date = new Date()): Quote {
  const day = Math.floor(date.getTime() / 86_400_000);
  return QUOTES[day % QUOTES.length];
}
