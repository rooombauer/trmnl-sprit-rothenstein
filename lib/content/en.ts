import type { Dict } from './types';

// Texts in ‹angle brackets› are placeholders: replace them with real
// positions, years and names (see PORTFOLIO.md).
export const en: Dict = {
  meta: {
    siteName: 'R. Bauer',
    titleSuffix: 'From Microsoft Engineer to CXO',
    description:
      'From Microsoft-certified systems engineer to CXO – technology, leadership and AI transformation from a single source.',
  },
  nav: {
    home: 'Home',
    journey: 'Journey',
    expertise: 'Expertise',
    projects: 'Projects',
    gallery: 'Gallery',
    contact: 'Contact',
  },
  home: {
    eyebrow: '~/journey --from mcse --to cxo',
    claim: 'From Microsoft engineer to CXO.',
    subline:
      'I built systems before I transformed organizations. From the server room to the C-suite – and right in the middle of the AI transformation today.',
    ctaJourney: '▶ Start quest: Journey',
    ctaContact: 'Get in touch',
    bootTeaserTitle: 'Career quest log',
    bootTeaserText:
      'Every career is a game with multiple levels. Mine starts with an MCSE certificate – and the current boss fight is called AI transformation.',
    bootTeaserLink: 'View all levels →',
    photoCaption: 'Startup moments: technology is built by teams.',
    pillars: [
      {
        tag: 'engineering',
        title: 'Grounded in the craft',
        text: 'MCSE roots: servers, networks, infrastructure. Having built systems myself, I make technology decisions with both feet on the ground.',
      },
      {
        tag: 'leadership',
        title: 'C-level responsibility',
        text: 'As CXO I translate between technology and the boardroom – strategy, budget, teams and roadmaps from a single source.',
      },
      {
        tag: 'ai.runtime',
        title: 'AI as the new runtime',
        text: 'AI transformation not as a buzzword but as an operating-system upgrade: rethinking processes, products and teams.',
      },
    ],
  },
  journey: {
    title: 'Journey',
    intro:
      'No résumé reads more honestly than a boot protocol: what was loaded when, and what still runs reliably today. Here is my boot sequence – from the first network to the AI present.',
    logHeader: 'quest.log — journey v‹XX›.‹X› — player: R. Bauer',
    progressLabel: 'Quest progress',
    entries: [
      {
        time: '‹19XX›',
        status: 'OK',
        module: 'bios.post',
        title: 'System start',
        detail:
          'First computers, first networks. The fascination of making things work becomes a career choice. ‹add education / first steps›',
        xp: '+50 XP',
      },
      {
        time: '‹year›',
        status: 'OK',
        module: 'mcse.cert',
        title: 'MCSE certification loaded',
        detail:
          'Microsoft Certified Systems Engineer – the foundation: Windows servers, networks, directory services. Not just operating systems, but understanding them.',
        xp: '+150 XP',
      },
      {
        time: '‹year›',
        status: 'OK',
        module: 'syseng.core',
        title: 'Systems engineering',
        detail:
          'Responsibility for infrastructure and operations: plan, build, keep it stable. ‹add company / position and focus areas›',
        xp: '+300 XP',
      },
      {
        time: '‹year›',
        status: 'OK',
        module: 'leadership.init',
        title: 'Moving into leadership',
        detail:
          'From configuring systems to developing teams. The key insight: organizations scale like architectures – or they don’t. ‹add role / position›',
        xp: '+500 XP',
      },
      {
        time: '‹year›',
        status: 'RUN',
        module: 'cxo.mode',
        title: 'CXO',
        detail:
          'Technology responsibility at C-level: strategy, product, teams and budgets. Decisions the whole company has to carry. ‹add company›',
        xp: '+800 XP',
      },
      {
        time: 'today',
        status: 'RUN',
        module: 'ai.runtime',
        title: 'The AI present',
        detail:
          'New runtime loaded: AI changes how we build, decide and lead. My job: bridging 25 years of systems understanding with what is becoming possible now. ‹verify number›',
        xp: '+∞ XP',
      },
    ],
    readyLine: 'system ready — uptime: ‹XX› years and counting',
    outro:
      'The common thread: whoever has operated the lowest layer of the stack can credibly shape the top one – strategy and leadership.',
  },
  expertise: {
    title: 'Expertise',
    intro:
      'Four layers, one stack: from hands-on infrastructure experience to AI strategy. Each layer builds on the one below.',
    areas: [
      {
        tag: 'strategy',
        title: 'Technology strategy',
        text: 'Technology decisions as business decisions: roadmaps, make-or-buy, architectural guardrails – intelligible for board and team alike.',
        points: [
          'Digital roadmaps with clear priorities',
          'Architecture and platform decisions',
          'Budget and resource responsibility',
        ],
        stat: 92,
      },
      {
        tag: 'ai.transformation',
        title: 'AI transformation',
        text: 'Applying AI where it creates value – in processes, products and ways of working. With a realistic view of effort, risk and maturity.',
        points: [
          'Identifying and prioritizing AI use cases',
          'From pilot projects to production use',
          'Enabling teams to work with AI',
        ],
        stat: 88,
      },
      {
        tag: 'engineering.dna',
        title: 'Engineering roots',
        text: 'MCSE, server rooms, networks: having owned infrastructure myself, I spot technical risks before they reach the steering committee.',
        points: [
          'Infrastructure, operations and IT security',
          'Microsoft ecosystem from NT to cloud',
          'Technical due diligence at eye level',
        ],
        stat: 95,
      },
      {
        tag: 'people',
        title: 'Leadership & teams',
        text: 'Technology only delivers as well as the organization behind it. Building, developing and leading teams through change – even when it gets uncomfortable.',
        points: [
          'Building and growing tech teams',
          'Leading through transformation',
          'Bridging business and engineering',
        ],
        stat: 90,
      },
    ],
  },
  projects: {
    title: 'Projects & positions',
    intro:
      'Selected initiatives that mark the path from engineer to CXO. ‹The three cards below are structural placeholders – add real projects.›',
    labels: {
      context: 'Context',
      role: 'Role',
      outcome: 'Outcome',
    },
    items: [
      {
        tag: 'infrastructure',
        title: '‹Project: infrastructure / migration›',
        context: '‹Starting point in 1–2 sentences: company, scale, problem.›',
        role: '‹Your role: e.g. technical lead, architecture, delivery.›',
        outcome: '‹Measurable result: availability, cost, time.›',
        quest: 'SIDE QUEST',
      },
      {
        tag: 'transformation',
        title: '‹Project: digitalization / organization›',
        context: '‹Starting point: legacy structures, new requirements.›',
        role: '‹Your role: e.g. program ownership as a leader.›',
        outcome: '‹Result: new processes, team build-up, business impact.›',
        quest: 'MAIN QUEST',
      },
      {
        tag: 'ai',
        title: '‹Project: AI adoption›',
        context: '‹Starting point: where should AI create value?›',
        role: '‹Your role: strategy, selection, rollout, enablement.›',
        outcome: '‹Result: production use cases, efficiency gains.›',
        quest: 'NEW GAME+',
      },
    ],
  },
  gallery: {
    title: 'Gallery',
    intro: 'Moments from working life – from the server room to the stage.',
    hint: 'Your own photos: drop them into the /assets folder and register them in lib/content/gallery.ts.',
  },
  contact: {
    title: 'Contact',
    intro:
      'Whether AI strategy, technology leadership or a second pair of eyes on a difficult architecture decision – I look forward to hearing from you.',
    emailLabel: 'Email',
    email: 'r.bauer@rooom.com',
    linkedinLabel: 'LinkedIn',
    linkedinUrl: '‹https://www.linkedin.com/in/your-profile›',
    locationLabel: 'Location',
    location: '‹City, Germany›',
    closing: 'Replies usually within 48 hours.',
  },
  footer: {
    line: 'Handcrafted with Next.js — black, white and a dash of petrol. ↑↑↓↓←→←→BA',
  },
  hud: {
    levelLabel: 'LVL',
    xpLabel: 'XP',
    unlockedLabel: 'Achievement unlocked',
    konami: 'God mode activated! You never forget a cheat code.',
    pages: {
      home: 'Visited the spawn point',
      journey: 'Opened the quest log',
      expertise: 'Inspected the skill tree',
      projects: 'Discovered the quest board',
      gallery: 'Activated photo mode',
      contact: 'Sent a multiplayer request',
    },
  },
};
