const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const uuid = () => crypto.randomUUID();

const OUT = path.join(__dirname, "intents");
fs.mkdirSync(OUT, { recursive: true });

function msg(lang, speech) {
  return { type: "0", title: "", textToSpeech: "", lang, speech, condition: "" };
}

function intent(name, opts) {
  return {
    id: uuid(),
    name,
    auto: true,
    contexts: [],
    responses: [
      {
        resetContexts: false,
        action: opts.action || "",
        affectedContexts: [],
        parameters: [],
        messages: opts.messages,
        speech: [],
      },
    ],
    priority: 500000,
    webhookUsed: false,
    webhookForSlotFilling: false,
    fallbackIntent: opts.fallback || false,
    events: opts.events || [],
    conditionalResponses: [],
    condition: "",
    conditionalFollowupEvents: [],
  };
}

function usersays(lang, phrases) {
  return phrases.map((text) => ({
    id: uuid(),
    data: [{ text, userDefined: false }],
    isTemplate: false,
    count: 0,
    lang,
    updated: 0,
  }));
}

const intents = [
  {
    name: "Default Welcome Intent",
    action: "input.welcome",
    events: [{ name: "WELCOME" }],
    messages: [
      msg("en", [
        "Hi! I'm João's assistant. Ask me about his services, pricing, projects, or availability!",
        "Hey there! What would you like to know about João's work?",
      ]),
      msg("pt", [
        "Olá! Sou o assistente do João. Pergunta-me sobre serviços, preços, projetos ou disponibilidade!",
        "Olá! Como posso ajudar?",
      ]),
    ],
    phrases_en: ["Hi", "Hello", "Hey", "Hey there", "Good morning", "Howdy", "Hi there", "Greetings"],
    phrases_pt: ["Olá", "Bom dia", "Oi", "Olá, bom dia", "Boa tarde"],
  },
  {
    name: "Default Fallback Intent",
    action: "input.unknown",
    fallback: true,
    messages: [
      msg("en", [
        "Sorry, I didn't quite catch that. Try asking about services, pricing, projects, or how to get in touch!",
        "I'm not sure I understood. Ask me about João's services, timeline, or portfolio!",
      ]),
      msg("pt", [
        "Desculpe, não percebi muito bem. Tenta perguntar sobre serviços, preços, projetos ou contacto!",
        "Não entendi bem. Podes perguntar sobre serviços, prazo ou portfólio!",
      ]),
    ],
    phrases_en: [],
    phrases_pt: [],
  },
  {
    name: "services",
    messages: [
      msg("en", [
        "João offers three core services: Web Design (modern, conversion-focused websites), Web Development (Next.js, React, custom builds), and Digital Marketing (SEO, branding, strategy). Want to know more about any of these?",
      ]),
      msg("pt", [
        "O João oferece três serviços principais: Web Design (websites modernos e focados em conversão), Desenvolvimento Web (Next.js, React, soluções personalizadas) e Marketing Digital (SEO, branding, estratégia). Queres saber mais?",
      ]),
    ],
    phrases_en: [
      "What services do you offer",
      "What do you do",
      "What can you help me with",
      "Tell me about your services",
      "What kind of work do you do",
      "Do you do web design",
      "Do you do marketing",
      "Can you build a website for me",
      "What do you specialize in",
    ],
    phrases_pt: [
      "Que serviços ofereces",
      "O que fazes",
      "Em que te especializas",
      "Fazes web design",
      "Fazes marketing digital",
      "Podes criar um site para mim",
    ],
  },
  {
    name: "pricing",
    messages: [
      msg("en", [
        "Pricing depends on the project scope. A typical website starts from €800. João offers custom quotes — reach out via the contact form or email Jssgmrs22@gmail.com for a free consultation!",
      ]),
      msg("pt", [
        "O preço depende do âmbito do projeto. Um website típico começa a partir de €800. O João faz orçamentos personalizados — usa o formulário de contacto ou envia email para Jssgmrs22@gmail.com!",
      ]),
    ],
    phrases_en: [
      "How much does it cost",
      "What are your rates",
      "How much do you charge",
      "What is the price",
      "How much for a website",
      "What is your pricing",
      "Is it expensive",
      "What does a website cost",
    ],
    phrases_pt: [
      "Quanto custa",
      "Quais são os preços",
      "Quanto cobras",
      "Qual é o preço de um site",
      "É caro",
      "Qual é o teu orçamento",
    ],
  },
  {
    name: "timeline",
    messages: [
      msg("en", [
        "Most website projects are completed in 2–4 weeks from kickoff. Larger projects may take 4–8 weeks. João works fast and keeps clients updated throughout the process!",
      ]),
      msg("pt", [
        "A maioria dos projetos fica pronta em 2 a 4 semanas. Projetos mais complexos podem demorar 4 a 8 semanas. O João trabalha com rapidez e mantém os clientes informados!",
      ]),
    ],
    phrases_en: [
      "How long does it take",
      "What is the timeline",
      "How long for a website",
      "When can you deliver",
      "What is your turnaround time",
      "How fast do you work",
      "How quickly can you build a website",
    ],
    phrases_pt: [
      "Quanto tempo demora",
      "Qual é o prazo",
      "Em quanto tempo consegues fazer um site",
      "Qual é o tempo de entrega",
    ],
  },
  {
    name: "contact",
    messages: [
      msg("en", [
        "You can reach João at Jssgmrs22@gmail.com, or use the contact form at the bottom of this page. He's also on LinkedIn and GitHub — links are in the sidebar!",
      ]),
      msg("pt", [
        "Podes contactar o João em Jssgmrs22@gmail.com, ou usar o formulário de contacto no fundo da página. Também está no LinkedIn e GitHub — os links estão na barra lateral!",
      ]),
    ],
    phrases_en: [
      "How can I contact you",
      "What is your email",
      "How do I reach you",
      "How do I get in touch",
      "I want to hire you",
      "How do I start a project with you",
      "Send you a message",
    ],
    phrases_pt: [
      "Como posso contactar-te",
      "Qual é o teu email",
      "Como entro em contacto",
      "Quero contratar-te",
      "Como inicio um projeto contigo",
    ],
  },
  {
    name: "portfolio",
    messages: [
      msg("en", [
        "João has built 6+ websites including Cascais Volley Cup, Koya's Bistro, SorrisoPlus Dental Clinic, AquaFix Plumbing, Revicar Auto Repair, and Bella Hair Salon. Check out the Work section on this page!",
      ]),
      msg("pt", [
        "O João construiu mais de 6 websites, incluindo Cascais Volley Cup, Koya's Bistro, SorrisoPlus Clínica Dentária, AquaFix Canalizações, Revicar Oficina e Bella Hair Salon. Vê a secção de Trabalhos nesta página!",
      ]),
    ],
    phrases_en: [
      "Can I see your work",
      "What projects have you done",
      "Show me your portfolio",
      "What have you built",
      "Do you have examples",
      "What websites have you made",
      "Do you have a portfolio",
    ],
    phrases_pt: [
      "Posso ver o teu trabalho",
      "Que projetos já fizeste",
      "Mostra-me o teu portfólio",
      "Que sites já criaste",
      "Tens exemplos de trabalho",
    ],
  },
  {
    name: "availability",
    messages: [
      msg("en", [
        "Yes, João is currently available for new projects! He's open to freelance web design, development, and marketing work. Use the contact form to discuss your project!",
      ]),
      msg("pt", [
        "Sim, o João está disponível para novos projetos! Está aberto a trabalho freelance em web design, desenvolvimento e marketing. Usa o formulário de contacto para discutir o teu projeto!",
      ]),
    ],
    phrases_en: [
      "Are you available",
      "Are you taking new clients",
      "Are you free to take on a project",
      "Are you open for work",
      "Can you take on new projects",
      "Do you have availability",
      "Are you busy",
    ],
    phrases_pt: [
      "Estás disponível",
      "Estás a aceitar novos clientes",
      "Tens disponibilidade",
      "Aceitas novos projetos",
      "Estás ocupado",
    ],
  },
  {
    name: "about",
    messages: [
      msg("en", [
        "João Guimarães is a Web Designer, Developer, and Marketing Strategist based in Cascais, Portugal. With 3+ years of experience, he has launched 10+ websites for local businesses — helping them convert visitors into clients.",
      ]),
      msg("pt", [
        "João Guimarães é um Web Designer, Programador e Estrategista de Marketing baseado em Cascais, Portugal. Com mais de 3 anos de experiência, já lançou mais de 10 websites para empresas locais.",
      ]),
    ],
    phrases_en: [
      "Who are you",
      "Tell me about yourself",
      "Who is João",
      "What is your background",
      "Who is the designer",
      "How many years of experience do you have",
      "What is your experience",
    ],
    phrases_pt: [
      "Quem és tu",
      "Fala-me sobre ti",
      "Quem é o João",
      "Qual é a tua experiência",
      "Quantos anos de experiência tens",
    ],
  },
  {
    name: "location",
    messages: [
      msg("en", [
        "João is based in Cascais, Portugal (GMT+1). He works with clients both locally and remotely across Europe and beyond — location is no barrier!",
      ]),
      msg("pt", [
        "O João está baseado em Cascais, Portugal (GMT+1). Trabalha com clientes localmente e remotamente em toda a Europa!",
      ]),
    ],
    phrases_en: [
      "Where are you based",
      "Where are you from",
      "Where do you work",
      "What is your location",
      "Are you in Portugal",
      "Do you work remotely",
      "Can you work with clients outside Portugal",
    ],
    phrases_pt: [
      "Onde é que estás",
      "De onde és",
      "Onde trabalhas",
      "Estás em Portugal",
      "Trabalhas remotamente",
    ],
  },
  {
    name: "tech-stack",
    messages: [
      msg("en", [
        "João builds with Next.js, React, TypeScript, and Tailwind CSS — deployed on Vercel. For design, he uses Figma. For marketing, he handles SEO, branding, and analytics.",
      ]),
      msg("pt", [
        "O João desenvolve com Next.js, React, TypeScript e Tailwind CSS — com deploy na Vercel. Para design usa Figma. Para marketing faz SEO, branding e análise de dados.",
      ]),
    ],
    phrases_en: [
      "What technologies do you use",
      "What is your tech stack",
      "What do you code in",
      "Do you use React",
      "What tools do you use",
      "Do you use WordPress",
      "What programming languages do you know",
    ],
    phrases_pt: [
      "Que tecnologias usas",
      "Qual é o teu stack",
      "Em que linguagens programas",
      "Usas React",
      "Que ferramentas usas",
      "Usas WordPress",
    ],
  },
];

for (const def of intents) {
  const intentObj = intent(def.name, {
    action: def.action,
    fallback: def.fallback,
    events: def.events,
    messages: def.messages,
  });
  fs.writeFileSync(path.join(OUT, `${def.name}.json`), JSON.stringify(intentObj, null, 2));

  if (def.phrases_en && def.phrases_en.length > 0) {
    fs.writeFileSync(
      path.join(OUT, `${def.name}_usersays_en.json`),
      JSON.stringify(usersays("en", def.phrases_en), null, 2)
    );
  }
  if (def.phrases_pt && def.phrases_pt.length > 0) {
    fs.writeFileSync(
      path.join(OUT, `${def.name}_usersays_pt.json`),
      JSON.stringify(usersays("pt", def.phrases_pt), null, 2)
    );
  }
}

console.log(`Generated ${intents.length} intents in ${OUT}`);
