/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CyclePhase } from '../types/cycle';

export type ArticleCategory =
  | 'salud_menstrual'
  | 'fertilidad'
  | 'nutricion'
  | 'sintomas'
  | 'bienestar';

export interface EducationalArticle {
  id: string;
  category: ArticleCategory;
  categoryLabel: string;
  title: string;
  subtitle: string;
  readTime: string;
  phaseRelevance?: CyclePhase;
  summary: string;
  practicalTip: string;
  sections: Array<{
    heading: string;
    body: string[];
    tips?: string[];
  }>;
}

export const EDUCATIONAL_ARTICLES: EducationalArticle[] = [
  {
    id: 'fases-del-ciclo-hormonas',
    category: 'salud_menstrual',
    categoryLabel: 'Salud Menstrual',
    title: 'Las 4 Fases del Ciclo: Cómo cambian tus hormonas mes a mes',
    subtitle: 'Comprende el baile biológico entre estrógenos y progesterona',
    readTime: '5 min',
    summary: 'El ciclo menstrual no es solo la regla: es un ciclo neuroendocrino de cuatro fases donde la energía, el ánimo y la biología cambian constantemente.',
    practicalTip: 'Anota en FeminaCycle cómo varía tu energía en los días 7 y 21 para anticipar tus momentos de máxima creatividad y descanso.',
    sections: [
      {
        heading: '1. Fase Menstrual (Días 1 a 5 aproximadamente)',
        body: [
          'El ciclo comienza oficialmente el primer día de sangrado rojo visible. Durante estos días, tanto los estrógenos como la progesterona se encuentran en sus niveles basales más bajos.',
          'El cuerpo desprende la capa endometrial que preparó el ciclo anterior. Tu metabolismo desciende ligeramente y el sistema inmune trabaja de forma más reflexiva.',
        ],
        tips: [
          'Prioriza el descanso nocturno reparador.',
          'Aplica calor local en la zona suprapúbica para relajar el miometrio uterino.',
          'Evita exigirte entrenamientos de máxima intensidad si sientes fatiga.'
        ]
      },
      {
        heading: '2. Fase Folicular (Días 6 a 12)',
        body: [
          'La glándula pituitaria libera la hormona FSH (foliculoestimulante), estimulando varios folículos ováricos. A medida que crecen, comienzan a producir cantidades crecientes de estradiol (estrógeno principal).',
          'El estrógeno regenera el endometrio, mejora la síntesis de serotonina y dopamina, y promueve mayor resistencia física y agilidad cognitiva.'
        ],
        tips: [
          'Momento idóneo para iniciar proyectos, entrenar fuerza o aprender nuevas habilidades.',
          'Tu piel suele mostrarse más luminosa debido a la hidratación natural inducida por los estrógenos.'
        ]
      },
      {
        heading: '3. Fase Ovulatoria (Días 13 a 16)',
        body: [
          'Cuando el estrógeno alcanza su umbral máximo, desencadena una súbita descarga de LH (hormona luteinizante). Entre 24 y 36 horas después, el folículo maduro se abre y libera el óvulo hacia la trompa de Falopio.',
          'Es la ventana más fértil del mes. El moco cervical adquiere una consistencia transparente y elástica (como clara de huevo), ideal para alimentar y transportar los espermatozoides.'
        ],
        tips: [
          'La temperatura basal suele experimentar una ligera bajada previa al salto térmico.',
          'Pico de libido, confianza social y comunicación interpersonal.'
        ]
      },
      {
        heading: '4. Fase Lútea (Días 17 al inicio del nuevo ciclo)',
        body: [
          'El folículo que expulsó el óvulo se transforma en el cuerpo lúteo, una glándula endocrina temporal que secreta progesterona en grandes cantidades.',
          'La progesterona eleva la temperatura basal corporal entre 0.2°C y 0.5°C, estabiliza el endometrio y tiene un efecto relajante/calmante sobre el sistema nervioso central.',
          'Si no hay fecundación, el cuerpo lúteo decae a los 12-14 días, los niveles hormonales descienden y se desencadena la siguiente menstruación.'
        ],
        tips: [
          'El metabolismo basal aumenta entre 100 y 300 kcal al día: es normal sentir más apetito.',
          'Aumenta el consumo de magnesio y vitamina B6 para amortiguar los síntomas premenstruales.'
        ]
      }
    ]
  },
  {
    id: 'metodo-sintotermico-fertilidad',
    category: 'fertilidad',
    categoryLabel: 'Fertilidad',
    title: 'Guía del Método Sintotérmico: Moco Cervical y Temperatura Basal',
    subtitle: 'La forma más precisa y científica de identificar tus días fértiles',
    readTime: '6 min',
    summary: 'Aprende a cruzar dos biomarcadores naturales para saber con exactitud cuándo eres fértil, ya sea para buscar un embarazo o para planificar de forma natural.',
    practicalTip: 'Toma la temperatura siempre antes de poner un pie fuera de la cama, a la misma hora y con al menos 4 horas de sueño ininterrumpido.',
    sections: [
      {
        heading: 'Los dos pilares biológicos de la fertilidad',
        body: [
          'El método sintotérmico está respaldado por décadas de investigación clínica. A diferencia del método del ritmo (que asume que todas las mujeres ovulan mecánicamente el día 14), el método sintotérmico observa la respuesta fisiológica real de tu cuerpo en tiempo real.',
          'Combina dos signos primarios: el moco cervical (que avisa cuándo se abre la ventana fértil) y la temperatura basal corporal (que confirma que la ovulación ya ha sucedido y la ventana se ha cerrado).'
        ]
      },
      {
        heading: 'Cómo evoluciona el moco cervical',
        body: [
          'Días posteriores a la regla: Suelen ser secos o con una sensación de sequedad en la vulva.',
          'Aproximación a la ovulación: El moco se vuelve cremoso, blanco o lechoso (fertilidad intermedia).',
          'Pico fértil: Moco transparente, altamente extensible entre dos dedos, resbaladizo, idéntico a la clara de huevo cruda. Es el momento de máxima probabilidad de concepción.'
        ],
        tips: [
          'Los espermatozoides pueden vivir hasta 5 días en presencia de este moco fértil.',
          'En ambientes secos o ácidos, los espermatozoides sobreviven pocas horas.'
        ]
      },
      {
        heading: 'La regla del salto térmico (3 sobre 6)',
        body: [
          'La progesterona producida tras la ovulación calienta el cuerpo. Para confirmar que has ovulado, deben registrarse 3 temperaturas consecutivas que superen la más alta de los 6 días anteriores en al menos 0.2°C.',
          'FeminaCycle traza automáticamente tu línea base (coverline) en la pestaña "Temperatura Basal" para verificar esta regla matemática.'
        ]
      }
    ]
  },
  {
    id: 'nutricion-por-fases-ciclo',
    category: 'nutricion',
    categoryLabel: 'Nutrición',
    title: 'Nutrición Sincronizada: Qué comer en cada fase de tu ciclo',
    subtitle: 'Alimenta tus hormonas con nutrientes específicos y la técnica del Seed Cycling',
    readTime: '5 min',
    summary: 'Descubre qué minerales, grasas saludables y micronutrientes necesita tu cuerpo en cada semana para prevenir cólicos, regular el humor y estabilizar la energía.',
    practicalTip: 'Prueba el "Seed Cycling": semillas de calabaza y lino molidas en la primera mitad del ciclo, y girasol y sésamo en la segunda mitad.',
    sections: [
      {
        heading: 'Nutrición en la Fase Menstrual: Reposición de Hierro y Calor',
        body: [
          'Con la pérdida de sangre se pierde hierro, mineral clave para el transporte de oxígeno y la vitalidad celular. Además, el útero agradece alimentos calientes de fácil digestión.',
          'Prioriza caldos de huesos o de verduras enriquecidos, lentejas con pimientos (la vitamina C triplica la absorción de hierro vegetal), carnes magras o tofu, remolacha y espinacas cocidas.',
          'Incluye especias antiinflamatorias como el jengibre fresco y la cúrcuma.'
        ],
        tips: [
          'Evita el café en las 2 horas previas y posteriores a comidas ricas en hierro, ya que los taninos reducen su absorción.',
          'Infusión de hojas de frambuesa roja o manzanilla para calmar espasmos.'
        ]
      },
      {
        heading: 'Fase Folicular: Alimentos frescos, fermentados y zinc',
        body: [
          'El hígado trabaja activamente metabolizando estrógenos. Apóyalo con verduras crucíferas (brócoli, coliflor, coles de Bruselas, rúcula) ricas en sulforafano e indol-3-carbinol.',
          'Alimentos fermentados (kéfir, yogur natural, chucrut, kimchi) para nutrir el estroboloma, el conjunto de bacterias intestinales que regulan los estrógenos circulantes.'
        ]
      },
      {
        heading: 'Fase Ovulatoria: Antioxidantes y fibra soluble',
        body: [
          'Los ovarios necesitan glutatión y antioxidantes para proteger el folículo. Consume frutos rojos, granada, aguacate, espárragos y semillas de sésamo.',
          'Bebe abundante agua para mantener la óptima viscosidad del moco cervical.'
        ]
      },
      {
        heading: 'Fase Lútea: Magnesio, complejo B y carbohidratos complejos',
        body: [
          'El cuerpo requiere más energía basal y es más sensible a las caídas de glucosa en sangre, lo que genera los típicos antojos de azúcar.',
          'Satisface esa necesidad con carbohidratos complejos: batata, avena integral, calabaza asada, legumbres y quinoa.',
          'Añade chocolate negro (mínimo 75-85% cacao), rico en magnesio relajante muscular y precursor de endorfinas.'
        ]
      }
    ]
  },
  {
    id: 'manejo-calambres-dolor-menstrual',
    category: 'sintomas',
    categoryLabel: 'Alivio de Síntomas',
    title: 'Estrategias eficaces contra los calambres y cólicos menstruales',
    subtitle: 'Disminuye las prostaglandinas inflamatorias de raíz',
    readTime: '4 min',
    summary: 'La causa principal de los cólicos menstruales son las prostaglandinas (PGF2a). Aprende métodos comprobados para reducir la inflamación y relajar el miometrio uterino.',
    practicalTip: 'Aplica una almohadilla de calor a 40°C en el bajo vientre durante 20 minutos: ha demostrado igual eficacia analgésica que el ibuprofeno en estudios clínicos.',
    sections: [
      {
        heading: '¿Por qué duelen los cólicos?',
        body: [
          'Cuando el endometrio se desprende, las células liberan prostaglandinas. Estas sustancias provocan contracciones musculares en el útero para ayudar a expulsar el tejido menstrual.',
          'Si la producción de prostaglandinas es excesiva, las contracciones comprimen temporalmente los vasos sanguíneos cercanos, generando una falta momentánea de oxígeno que activa los receptores de dolor.'
        ]
      },
      {
        heading: 'Remedios naturales con evidencia científica',
        body: [
          '1. Calor térmico continuo: El calor dilata los vasos uterinos, restableciendo el flujo sanguíneo y relajando las fibras musculares tensas.',
          '2. Magnesio (Glicinato o Citrato): Mineral relajante de la musculatura lisa. Tomar 300-400 mg diarios durante la semana previa reduce la severidad de los espasmos.',
          '3. Ácidos grasos Omega-3 (EPA/DHA): Compiten con el ácido araquidónico, reduciendo la síntesis de prostaglandinas proinflamatorias. Presentes en pescados azules pequeños (sardinas, caballa), nueces y semillas de chía.',
          '4. Jengibre en polvo o infusión concentrada: Múltiples ensayos clínicos han encontrado que 1000 mg de jengibre al inicio del sangrado reducen el dolor de forma comparable a los AINEs.'
        ]
      },
      {
        heading: 'Cuándo consultar con tu ginecóloga/o',
        body: [
          'El dolor menstrual leve a moderado es común, pero el dolor incapacitante que no cede con analgésicos, te impide ir a trabajar o se acompaña de dolor profundo durante las relaciones sexuales o al defecar no debe normalizarse.',
          'Puede ser signo de afecciones como endometriosis, adenomiosis o miomas uterinos, las cuales tienen tratamientos específicos.'
        ]
      }
    ]
  },
  {
    id: 'dolor-pecho-cabeza-spm',
    category: 'sintomas',
    categoryLabel: 'Alivio de Síntomas',
    title: 'Dolor de Pecho, Migraña y Tensión Pre-menstrual',
    subtitle: 'Por qué ocurre la hipersensibilidad mamaria y los dolores de cabeza',
    readTime: '4 min',
    summary: 'Aprende por qué la fluctuación hormonal al final de la fase lútea desencadena retención de líquidos en las mamas y migrañas por caída brusca de estrógenos.',
    practicalTip: 'Reduce el sodio y la cafeína durante los 5 días previos a la regla y usa un sujetador de sujeción suave sin aros para dormir.',
    sections: [
      {
        heading: 'Dolor de pecho (Mastalgia cíclica)',
        body: [
          'Durante la fase lútea, la progesterona y los estrógenos estimulan la proliferación de conductos y lóbulos mamarios, provocando retención de líquidos intersticial y sensación de hinchazón o pesadez.',
          'El aceite de onagra (rico en ácido gamma-linolénico) y la vitamina E han mostrado beneficios notables tras 2 o 3 ciclos de uso continuo.',
          'Limitar las xantinas (café, té negro concentrado, bebidas energéticas) calma la respuesta de los receptores mamarios.'
        ]
      },
      {
        heading: 'Migraña y dolor de cabeza catamenial',
        body: [
          'Muchas mujeres experimentan cefalea 1 o 2 días antes de que baje la regla. El desencadenante químico es la rápida retirada de estrógenos, que afecta a los niveles cerebrales de serotonina y dilata los vasos sanguíneos meníngeos.',
          'Mantener niveles estables de glucosa en sangre evitando ayunos prolongados en la fase premenstrual previene el desencadenamiento de la crisis.',
          'La coenzima Q10 y el magnesio tomado de forma preventiva disminuyen la frecuencia e intensidad de los episodios.'
        ]
      }
    ]
  },
  {
    id: 'ejercicio-segun-tu-ciclo',
    category: 'bienestar',
    categoryLabel: 'Bienestar',
    title: 'Entrenar con tu Ciclo: Sincroniza tu actividad física',
    subtitle: 'Aprovecha tus picos de fuerza y respeta tus momentos de regeneración',
    readTime: '5 min',
    summary: 'Tu rendimiento atlético, fuerza máxima y capacidad de recuperación no son idénticos todos los días del mes. Sincroniza tus rutinas con tu mapa hormonal.',
    practicalTip: 'Programa tus entrenamientos de récord personal de fuerza en los días 8 a 14 del ciclo, cuando la tolerancia al esfuerzo es máxima.',
    sections: [
      {
        heading: 'Fase Menstrual: Movimiento suave y descarga articular',
        body: [
          'El útero pesa más y el cuerpo está consumiendo energía en el proceso de descamación endometrial.',
          'Mejores actividades: Caminatas al aire libre, yoga restaurativo, movilidad de caderas y estiramientos suaves.',
          'El movimiento ligero favorece la circulación pélvica y alivia la congestión.'
        ]
      },
      {
        heading: 'Fase Folicular y Ovulación: Máxima potencia y fuerza',
        body: [
          'El incremento de estrógenos mejora la captación de glucosa muscular, aumenta la síntesis de colágeno y acelera la recuperación post-entrenamiento.',
          'Mejores actividades: Levantamiento de pesas con sobrecarga progresiva, entrenamientos interválicos de alta intensidad (HIIT), carrera y deportes colectivos.'
        ]
      },
      {
        heading: 'Fase Lútea: Resistencia aeróbica moderada y pilates',
        body: [
          'La temperatura basal está más alta, la tasa de sudoración comienza antes y la progesterona promueve el uso de grasas como combustible primario.',
          'Mejores actividades: Natación continua, pilates reformer o suelo, ciclismo suave y entrenamiento de fuerza con más repeticiones y cargas medias.',
          'En los días previos a la regla, no fuerces el cuerpo si notas falta de energía: escucha a tu cuerpo sin culpa.'
        ]
      }
    ]
  },
  {
    id: 'privacidad-datos-salud',
    category: 'bienestar',
    categoryLabel: 'Bienestar & Privacidad',
    title: 'Por qué la privacidad absoluta de tus datos íntimos es vital',
    subtitle: 'FeminaCycle guarda todo al 100% en tu propio dispositivo móvil',
    readTime: '3 min',
    summary: 'La información de tu ciclo, fertilidad y relaciones sexuales nunca debe venderse ni subirse a servidores publicitarios desconocidos.',
    practicalTip: 'Guarda periódicamente una copia de seguridad en JSON desde los Ajustes para tener un respaldo seguro en caso de cambiar de móvil.',
    sections: [
      {
        heading: 'Arquitectura Local-First',
        body: [
          'FeminaCycle opera bajo una estricta política de soberanía de datos del usuario: tus registros de sangrado, temperatura basal, síntomas físicos y actividad íntima se almacenan en la base de datos local de tu navegador (LocalStorage / dispositivo).',
          'Ningún dato se transmite a servidores de terceros, redes de telemetría publicitaria ni algoritmos de rastreo.'
        ]
      },
      {
        heading: 'Protección en entornos compartidos',
        body: [
          'Para protegerte de miradas indiscretas cuando consultas la aplicación en el transporte público o con personas cerca, puedes activar el "Modo Discreto" (que oculta los detalles de intimidad) o activar el "Bloqueo por PIN de 4 dígitos".'
        ]
      }
    ]
  }
];
