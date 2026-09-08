export type Language = "es" | "en";

export type Localized = Record<Language, string>;

export type Option = Localized & { value: number };

export type Question = {
    id: string;
    category: CategoryId;
    text: Localized;
    options: Option[];
};

export type CategoryId = "market" | "business" | "engineering";

export type Category = {
    id: CategoryId;
    name: Localized;
    shortName: Localized;
    focus: Localized;
    diagnosis: Localized;
};

export type MaturityId = "restricted" | "localized" | "aspirations" | "company" | "competitor";

export const categories: Record<CategoryId, Category> = {
    market: {
        id: "market",
        name: { es: "Inteligencia de mercado", en: "Market Intelligence" },
        shortName: { es: "Mercado", en: "Market" },
        focus: {
            es: "Decisiones de expansión, clientes y competencia.",
            en: "Expansion, customer, and competitive decisions.",
        },
        diagnosis: {
            es: "sus decisiones de negocio más relevantes y crecimiento podrían depender de la intuición interna en lugar de los datos del mundo real de sus competidores y clientes",
            en: "your most relevant business and growth decisions might depend on internal intuition rather than real-world data about your competitors and customers",
        },
    },
    business: {
        id: "business",
        name: { es: "Inteligencia de negocios", en: "Business Intelligence" },
        shortName: { es: "Negocio", en: "Business" },
        focus: {
            es: "Pronósticos, clientes y decisiones operativas.",
            en: "Forecasts, customers, and operational decisions.",
        },
        diagnosis: {
            es: "su organización podría estar estancada analizando lo que ocurrió en el pasado en lugar de usar sus datos para predecir riesgos y determinar sus mejores próximos movimientos comerciales",
            en: "your organization might be stuck analyzing what happened in the past instead of using your data to predict risks and determine your next best business moves",
        },
    },
    engineering: {
        id: "engineering",
        name: { es: "Ingeniería de datos", en: "Data Engineering" },
        shortName: { es: "Datos", en: "Data" },
        focus: {
            es: "Integración, calidad y disponibilidad de datos.",
            en: "Data integration, quality, and availability.",
        },
        diagnosis: {
            es: "su equipo podría estar perdiendo valiosas horas estratégicas en silos de datos manuales, dedicando más tiempo a trabajar los datos que a decidir con ellos",
            en: "your team might be losing valuable strategic hours to manual data silos, spending more time working the data than deciding with it",
        },
    },
};

const options = (es: string[], en: string[]): Option[] =>
    es.map((label, index) => ({ es: label, en: en[index], value: index + 1 }));

export const questions: Question[] = [
    {
        id: "MIQ1", category: "market",
        text: { es: "¿Qué tan rápido pueden detectar un cambio de precios de un competidor?", en: "How quickly can you detect a competitor price change?" },
        options: options(
            ["No lo rastreamos", "Mensualmente, a través de revisiones manuales", "Semanalmente, pero es inconsistente", "Diariamente, a través de algunas alertas", "Casi en tiempo real, a través de monitoreo automatizado"],
            ["We do not track it", "Monthly, through manual reviews", "Weekly, but inconsistently", "Daily, through some alerts", "Near real-time, through automated monitoring"],
        ),
    },
    {
        id: "MIQ2", category: "market",
        text: { es: "Al planificar una expansión o lanzamiento de nuevo producto ¿usan datos para el análisis (competencia, necesidades del sector, condiciones de importación)?", en: "When planning an expansion or new product launch, do you use data for the analysis (competition, sector needs, import conditions)?" },
        options: options(
            ["Nada, confiamos casi por completo en intuición", "Poco, usamos algunos datos públicos", "Algo, miramos tendencias", "Principalmente, los datos apoyan nuestras decisiones pero no son los mejores", "Absolutamente, cada movimiento está respaldado por datos de primer nivel"],
            ["Not at all, we rely almost entirely on intuition", "A little, we use some public data", "Some, we look at trends", "Mostly, data supports our decisions but is not the best", "Absolutely, every move is backed by top-tier data"],
        ),
    },
    {
        id: "MIQ3", category: "market",
        text: { es: "¿Conocen quiénes son sus clientes de mayor valor, dónde encontrarlos y cuál es su cadena de valor?", en: "Do you know who your highest-value customers are, where to find them, and their value chain?" },
        options: options(
            ["Seguimos explorando quién es nuestro cliente ideal", "Conocemos nuestro cliente ideal, pero no sabemos dónde encontrarlo", "Conocemos nuestro cliente ideal y tenemos una idea dónde encontrarlo", "Tengo mapeado el mercado y he ubicado mi cliente ideal", "Tengo mapeado el mercado, ubicado mi cliente ideal y analizado la cadena de valor para identificar más oportunidades de negocio"],
            ["We are still exploring our ideal customer", "We know our ideal customer but not where to find them", "We know our ideal customer and have an idea where to find them", "I have mapped the market and located my ideal customer", "I have mapped the market, located my ideal customer, and analyzed the value chain to identify more business opportunities"],
        ),
    },
    {
        id: "MIQ4", category: "market",
        text: { es: "¿Cómo validan el potencial de un nuevo producto antes de comprometer una inversión de lanzamiento a escala?", en: "How do you validate a new product's potential before committing to a full-scale launch investment?" },
        options: options(
            ["Simplemente lanzamos y esperamos", "Solo comentarios del equipo interno", "Grupos focales a pequeña escala", "Pruebas piloto manuales", "Pruebas A/B y modelado rigurosos"],
            ["We simply launch and hope", "Internal team feedback only", "Small-scale focus groups", "Manual pilot tests", "Rigorous A/B testing and modeling"],
        ),
    },
    {
        id: "MIQ5", category: "market",
        text: { es: "Ante una fluctuación del mercado imprevista, ¿disponen de escenarios proyectados y respaldados por datos?", en: "Facing an unforeseen market fluctuation, do you have projected, data-backed scenarios?" },
        options: options(
            ["No, solo reaccionaríamos", "Empezaríamos una reunión", "Tenemos un plan básico", "Tenemos algunas estimaciones", "Sí, usamos modelado de impacto económico"],
            ["No, we would just react", "We would start a meeting", "We have one basic plan", "We have a few estimates", "Yes, we use economic impact modeling"],
        ),
    },
    {
        id: "BIQ1", category: "business",
        text: { es: "¿Con qué eficacia puede su equipo pronosticar ventas u otra variable a futuro?", en: "How effectively can your team forecast sales or another future variable?" },
        options: options(
            ["En absoluto, solo miramos resultados pasados o no tenemos buenos datos", "Rara vez, tenemos los datos, pero no hay forma de modelar el futuro", "Ocasionalmente, tenemos pronósticos básicos que a menudo son manuales", "Frecuentemente, la analítica nos ayuda a planificar, aunque no está automatizada", "Siempre, modelos institucionalizados guían la toma de decisión"],
            ["Not at all, we only look at past results or lack good data", "Rarely, we have the data but no way to model the future", "Occasionally, we have basic forecasts that are often manual", "Frequently, analytics helps us plan, though it is not automated", "Always, institutionalized models guide decision-making"],
        ),
    },
    {
        id: "BIQ2", category: "business",
        text: { es: "¿Qué proporción del tiempo del equipo directivo se destina a buscar, cruzar y conciliar datos en hojas de cálculo (Excel)?", en: "What proportion of leadership's time is spent searching, cross-referencing, and reconciling data in spreadsheets (Excel)?" },
        options: options(
            ["Casi todo", "La mayor parte, es una lucha", "Aproximadamente la mitad de su tiempo", "Muy poco, la generación de informes está estandarizada", "Nada, la generación de informes está estandarizada y automatizada"],
            ["Almost all of it", "Most of it, it is a struggle", "About half of their time", "Very little, reporting is standardized", "None, reporting is standardized and automated"],
        ),
    },
    {
        id: "BIQ3", category: "business",
        text: { es: "¿Pueden identificar con precisión qué clientes específicos tienen alta probabilidad de abandonar la relación comercial el próximo mes?", en: "Can you precisely identify which specific customers are highly likely to end the business relationship next month?" },
        options: options(
            ["No hay forma de saberlo, descubrimos esto días después", "Lo notamos cuando se van", "Tenemos una puntuación de riesgo básica", "Tenemos un modelo de abandono (churn), pero se ejecuta manualmente", "Tenemos un modelo de abandono capaz de aprender"],
            ["There is no way to know, we discover this days later", "We notice when they leave", "We have a basic risk score", "We have a churn model, but it runs manually", "We have a learning-capable churn model"],
        ),
    },
    {
        id: "BIQ4", category: "business",
        text: { es: "¿Aprovechan soluciones de Inteligencia Artificial (IA) para optimizar tareas operativas repetitivas o la atención a clientes?", en: "Do you leverage Artificial Intelligence (AI) solutions to optimize repetitive operational tasks or customer service?" },
        options: options(
            ["No, lo hacemos manualmente", "Lo estamos investigando", "Usamos herramientas de IA genéricas como ChatGPT", "Usamos herramientas de IA genéricas o plataformas low-code no-code", "Sí, tenemos agentes de IA entrenados a medida o modelos RPA"],
            ["No, we do it manually", "We are researching it", "We use generic AI tools like ChatGPT", "We use generic AI tools or low-code/no-code platforms", "Yes, we have custom-trained AI agents or RPA models"],
        ),
    },
    {
        id: "BIQ5", category: "business",
        text: { es: "¿El equipo genera análisis bajo demanda con agilidad, o enfrenta barreras para realizar análisis de alto impacto (actionable insights)?", en: "Does the team generate on-demand analysis with agility, or does it face barriers to producing high-impact analysis (actionable insights)?" },
        options: options(
            ["No, los datos tienen vacíos o no existen", "Hay datos pero toma mucho tiempo prepararlos", "Los datos están disponibles, pero nos cuesta decidir qué enfoque o herramienta es más adecuado", "Producimos análisis de calidad, pero es difícil comunicarlos a los tomadores de decisiones", "Nuestros equipos de datos y analítica pueden producir análisis de calidad con impacto"],
            ["No, the data has gaps or does not exist", "There is data but it takes a long time to prepare", "Data is available, but we struggle to decide which approach or tool is best suited", "We produce quality analysis, but it is difficult to communicate it to decision-makers", "Our data and analytics teams can produce quality analysis with impact"],
        ),
    },
    {
        id: "DEQ1", category: "engineering",
        text: { es: "¿Qué tan ágil y confiable es analizar datos procedentes de diferentes sistemas (CRM, POS, ERP, SAP, Excel)?", en: "How agile and reliable is it to analyze data coming from different systems (CRM, POS, ERP, SAP, Excel)?" },
        options: options(["Pesadilla total", "Difícil, necesitamos hacer mucho trabajo", "Un poco desordenado", "Aceptable, pero podría ser más fácil", "Fácil"], ["A total nightmare", "Difficult, we need to do a lot of work", "A little messy", "Acceptable, but it could be easier", "Easy"]),
    },
    {
        id: "DEQ2", category: "engineering",
        text: { es: "¿Con qué periodicidad se presentan discrepancias en métricas o indicadores clave (KPI) entre diferentes departamentos?", en: "How often do discrepancies in metrics or key indicators (KPIs) appear between different departments?" },
        options: options(["Constantemente, es un desastre", "A menudo, discutimos sobre los datos", "A veces, usualmente en Excel", "Rara vez, estamos mayormente alineados", "Nunca, tenemos KPI consistentes"], ["Constantly, it is a mess", "Often, we argue about the data", "Sometimes, usually in Excel", "Rarely, we are mostly aligned", "Never, we have consistent KPIs"]),
    },
    {
        id: "DEQ3", category: "engineering",
        text: { es: "¿Cuánto tiempo demanda el cierre contable/financiero o la consolidación del informe mensual de desempeño?", en: "How long does the accounting/financial close or the consolidation of the monthly performance report take?" },
        options: options(["Semanas de trabajo manual", "Más de 5 días, mayormente pasados limpiando datos", "Unos pocos días revisando archivos", "Uno o dos días para actualizar y revisar resultados", "Solo horas o instantáneamente"], ["Weeks of manual work", "More than 5 days, mostly spent cleaning data", "A few days reviewing files", "One or two days to update and review results", "Only hours or instantly"]),
    },
    {
        id: "DEQ4", category: "engineering",
        text: { es: "¿Cuál es el nivel de calidad, completitud y confiabilidad del flujo de datos entrante en sus sistemas?", en: "What is the level of quality, completeness, and reliability of the incoming data flow in your systems?" },
        options: options(["No confiables y desordenados", "Necesitan una fuerte limpieza manual", "Mayormente bien, algunos errores", "Buenos y predecibles, mecanismos de QA en juego", "Excelentes, son oportunos, rastreables y limpios"], ["Unreliable and messy", "They need heavy manual cleaning", "Mostly good, some errors", "Good and predictable, QA mechanisms are in play", "Excellent, they are timely, traceable, and clean"]),
    },
    {
        id: "DEQ5", category: "engineering",
        text: { es: "¿Cuenta su organización con un almacén de datos (Data Warehouse) o comprende su relevancia técnica?", en: "Does your organization have a data warehouse (Data Warehouse), or understand its technical relevance?" },
        options: options(["No, no tengo conocimiento de qué es", "Tengo alguna idea de qué es", "Sí, necesitamos uno en nuestra firma", "Sí, tenemos uno pero necesita trabajo", "Sí, es una piedra angular de nuestro proceso analítico"], ["No, I have no knowledge of what it is", "I have some idea of what it is", "Yes, we need one in our firm", "Yes, we have one but it needs work", "Yes, it is a cornerstone of our analytical process"]),
    },
];

export const maturityLevels: { id: MaturityId; label: Localized }[] = [
    { id: "restricted", label: { es: "Restringido analíticamente", en: "Analytically restricted" } },
    { id: "localized", label: { es: "Analítica localizada", en: "Localized analytics" } },
    { id: "aspirations", label: { es: "Aspiraciones analíticas", en: "Analytical aspirations" } },
    { id: "company", label: { es: "Empresa analítica", en: "Analytical company" } },
    { id: "competitor", label: { es: "Competidor analítico", en: "Analytical competitor" } },
];

export function maturityFor(score: number): MaturityId {
    if (score < 2) return "restricted";
    if (score < 3) return "localized";
    if (score < 4) return "aspirations";
    if (score < 5) return "company";
    return "competitor";
}

const spanishResults: Record<CategoryId, Record<MaturityId, { description: string; suggestion: string }>> = {
    market: {
        restricted: {
            description: "El perfil de su empresa encaja en la etapa de Restringido Analíticamente para Inteligencia de Mercado. Esto significa que las decisiones—como dónde abrir una nueva sucursal o lanzar un producto—se guían casi en su totalidad por el \"instinto\" y la intuición. Sin datos externos, está volando a ciegas ante los movimientos de los competidores y los patrones cambiantes del consumidor, dejando su crecimiento al azar.",
            suggestion: "Pase a Analítica Localizada realizando un único proyecto de Estudio de Mercado o Mapeo Competitivo de alto impacto para ver el valor inmediato de los datos externos",
        },
        localized: {
            description: "Está en la etapa de Analítica Localizada. Si bien algunos equipos pueden usar datos públicos básicos, a menudo están desactualizados o se usan de manera inconsistente en toda la empresa. Tiene la \"intención\" de guiarse por datos, pero carece de una visión unificada del mercado, lo que a menudo resulta en oportunidades perdidas que sus competidores ya podrían estar viendo.",
            suggestion: "Avance a Aspiraciones Analíticas integrando Geointeligencia (Analítica Espacial) para unificar cómo su equipo ve el tamaño del mercado y el tráfico peatonal.",
        },
        aspirations: {
            description: "Su perfil refleja Aspiraciones Analíticas. Ha invertido en algunas investigaciones de mercado, pero un \"bloqueo\" impide que estos datos guíen verdaderamente su estrategia. Para avanzar, debe dejar de tratar la investigación como un proyecto único y comenzar a integrar herramientas como la Geointeligencia para hacer de la certeza respaldada por datos un hábito diario.",
            suggestion: "Alcance la etapa de Empresa Analítica utilizando Modelado de Impacto Económico para convertir la investigación en una estrategia repetible para cada nueva inversión.",
        },
        company: {
            description: "Es una Empresa Analítica. Los datos respaldan constantemente sus estrategias de expansión y competitividad. Probablemente use herramientas sofisticadas como imágenes satelitales o seguimiento de movilidad, pero los datos aún están \"siguiendo\" su estrategia en lugar de moldearla activamente. El siguiente paso es hacer de estos conocimientos el motor central de su crecimiento.",
            suggestion: "Conviértase en un Competidor Analítico implementando Monitoreo Automatizado de Precios y Análisis de Sentimiento Digital para giros estratégicos en tiempo real.",
        },
        competitor: {
            description: "En esta etapa, la Inteligencia de Mercado es su estrategia. Utiliza monitoreo en tiempo real y modelos predictivos para anticipar cambios antes de que ocurran, lo que le da una ventaja masiva sobre los rivales que todavía están mirando los informes del mes pasado.",
            suggestion: "Manténgase a la vanguardia utilizando Imágenes Satelitales y Seguimiento de Ubicación de Teléfonos Celulares para predecir microcambios en el mercado antes de que sean visibles para los rivales",
        },
    },
    business: {
        restricted: {
            description: "Usted está Restringido Analíticamente en BI. Sus datos son actualmente una \"caja negra\"—dispersos, faltantes o no confiables. Pasa más tiempo cuestionando los números que usándolos para tomar decisiones, lo que significa que probablemente solo se da cuenta de que un cliente se ha ido o que las ventas han caído después de que ya ha sucedido.",
            suggestion: "Pase a Analítica Localizada creando un piloto de Informes Personalizados para su KPI más crítico para demostrar que se puede confiar en los datos.",
        },
        localized: {
            description: "Su perfil encaja en Analítica Localizada. Tiene paneles e informes, pero están aislados dentro de departamentos específicos y rara vez llegan al nivel ejecutivo a tiempo para actuar. Está capturando lo que sucedió en el pasado, pero carece de los modelos predictivos necesarios para ver qué sucederá a continuación.",
            suggestion: "Alcance las Aspiraciones Analíticas implementando Segmentación de Clientes para encontrar qué 20% de sus clientes proporciona el 80% de su valor.",
        },
        aspirations: {
            description: "Tiene Aspiraciones Analíticas. Reconoce el valor de ML/IA, pero su equipo probablemente esté estancado en el \"modo de creación de informes\" en lugar del \"modo de generación de información\". Necesita cerrar la brecha entre tener datos y usarlos para predecir aspectos como el abandono de clientes o la demanda de ventas.",
            suggestion: "Avance a una Empresa Analítica implementando su primer Modelo de Predicción de Abandono para salvar proactivamente a los clientes en riesgo",
        },
        company: {
            description: "Es una Empresa Analítica. Los datos aportan valor en todo su negocio, y probablemente use la analítica para optimizar las operaciones. Su próximo desafío es automatizar estos conocimientos para que los modelos de IA—como las recomendaciones de \"Próxima Mejor Acción\"—puedan guiar a sus equipos de ventas y marketing sin intervención manual.",
            suggestion: "Haga la transición a Competidor Analítico utilizando Agentes de IA (RAG) para automatizar el intercambio de conocimiento interno y las tareas de expertos repetitivas.",
        },
        competitor: {
            description: "Es un Competidor Analítico. Su negocio está impulsado por el modelado predictivo. No solo reacciona al mercado; simula decisiones antes de gastar un dólar. Su entorno de datos es una máquina de alto rendimiento que señala riesgos y optimiza los ingresos automáticamente en tiempo real.",
            suggestion: "Perfeccione su ventaja con Simulaciones Predictivas para \"probar\" decisiones presupuestarias importantes en un entorno virtual antes de su ejecución.",
        },
    },
    engineering: {
        restricted: {
            description: "Su perfil es Restringido Analíticamente. Sus datos están atrapados en hojas de cálculo manuales y sistemas desconectados. Esta cultura de \"copiar y pegar manual\" es un cuello de botella de alto riesgo; si su persona clave de datos se fuera, todo su proceso de informes probablemente colapsaría.",
            suggestion: "Pase a Analítica Localizada realizando un ejercicio de Mapeo de Procesos para identificar los cuellos de botella manuales más peligrosos.",
        },
        localized: {
            description: "Está en la etapa de Analítica Localizada. Algunos procesos están automatizados, pero todavía lucha con los \"Silos de Datos\"—diferentes departamentos a menudo tienen números diferentes para el mismo KPI. Necesita avanzar hacia un \"Data Warehouse\" central para asegurarse de que todos estén mirando una sola versión de la verdad.",
            suggestion: "Avance a Aspiraciones Analíticas construyendo su primera Canalización de Datos Automatizada para conectar dos sistemas que antes no estaban relacionados.",
        },
        aspirations: {
            description: "Tiene Aspiraciones Analíticas. Ha comenzado a invertir en almacenamiento en la nube o mejores canalizaciones, pero la ejecución está bloqueada. Probablemente tenga las herramientas pero no haya automatizado completamente las \"tuberías\" entre su CRM, POS y sitio web, lo que lleva a informes inconsistentes y lentos.",
            suggestion: "Alcance el estado de Empresa Analítica estableciendo un Data Warehouse para crear una \"versión de la verdad\" única y automatizada.",
        },
        company: {
            description: "Es una Empresa Analítica. Sus canalizaciones de datos son profesionales, rastreables y respaldan el crecimiento. La mayor parte de sus informes están automatizados, pero aún puede estar perfeccionando la escalabilidad de su infraestructura para manejar los complejos requisitos de implementaciones avanzadas de IA.",
            suggestion: "Conviértase en un Competidor Analítico implementando Sincronización de Datos en Tiempo Real y Aseguramiento de Calidad Automatizado para la toma de decisiones sin retrasos.",
        },
        competitor: {
            description: "Es un Competidor Analítico. Su ingeniería de datos es un \"sistema nervioso\" nativo de la nube y sin fisuras. Con sincronización en tiempo real y controles de calidad automatizados, su infraestructura no solo almacena datos: impulsa su ventaja competitiva al entregar datos perfectos exactamente cuando se necesitan.",
            suggestion: "Mantenga su liderazgo utilizando la Orquestación de Canalizaciones de Extremo a Extremo para impulsar implementaciones de IA de alta frecuencia y optimización continua.",
        },
    },
};

export function resultCopy(category: CategoryId, maturity: MaturityId, language: Language) {
    if (language === "es") return spanishResults[category][maturity];

    const categoryName = categories[category].name[language];
    const descriptions: Record<MaturityId, string> = {
        restricted: `In ${categoryName}, decisions rely heavily on manual processes, intuition, or incomplete data. There is a clear opportunity to create a reliable foundation.`,
        localized: `In ${categoryName}, valuable efforts already exist, but they are isolated or inconsistent. The next step is turning them into a shared practice.`,
        aspirations: `In ${categoryName}, the organization recognizes data's value and has begun investing. The challenge now is making those capabilities repeatable in decisions.`,
        company: `In ${categoryName}, data already supports important decisions. The next opportunity is automating and scaling that impact.`,
        competitor: `In ${categoryName}, analytics is a competitive advantage. Maintaining it requires monitoring, experimentation, and continuous improvement.`,
    };
    const suggestions: Record<MaturityId, string> = {
        restricted: "Start with a high-impact diagnostic to identify the data source, process, or decision that can unlock the most value.",
        localized: "Unify critical sources and definitions so teams work from one trusted version of the information.",
        aspirations: "Turn current initiatives into a prioritized roadmap with owners, metrics, and progressive automation.",
        company: "Automate recurring insights and use predictive models to get ahead of high-impact decisions.",
        competitor: "Extend your advantage through real-time monitoring, experimentation, and models that evolve with the business.",
    };

    return { description: descriptions[maturity], suggestion: suggestions[maturity] };
}
