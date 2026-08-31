export type Locale = 'de' | 'en';

export type BootLogEntry = {
  /** Jahr oder Zeitmarke, monospace gerendert – Platzhalter: ‹Jahr› */
  time: string;
  status: 'OK' | 'INIT' | 'RUN';
  /** Modulname im Boot-Log-Stil, z. B. "mcse.cert" */
  module: string;
  title: string;
  detail: string;
  /** XP-Belohnung des Levels, z. B. "+250 XP" */
  xp: string;
};

export type ExpertiseArea = {
  tag: string;
  title: string;
  text: string;
  points: string[];
  /** Skill-Wert 0–100 für die Stat-Bar */
  stat: number;
};

export type Project = {
  tag: string;
  title: string;
  context: string;
  role: string;
  outcome: string;
  /** Quest-Badge, z. B. "MAIN QUEST" */
  quest: string;
};

export type Dict = {
  meta: {
    siteName: string;
    titleSuffix: string;
    description: string;
  };
  nav: {
    home: string;
    journey: string;
    expertise: string;
    projects: string;
    gallery: string;
    contact: string;
  };
  home: {
    eyebrow: string;
    claim: string;
    subline: string;
    /** Kommentarzeile unter dem Claim, z. B. der 127.0.0.1-Witz */
    comment: string;
    /** Antwort des Systems auf `sudo make coffee` */
    sudoResponse: string;
    ctaJourney: string;
    ctaContact: string;
    bootTeaserTitle: string;
    bootTeaserText: string;
    bootTeaserLink: string;
    photoCaption: string;
    pillars: { tag: string; title: string; text: string }[];
  };
  journey: {
    title: string;
    intro: string;
    logHeader: string;
    progressLabel: string;
    entries: BootLogEntry[];
    readyLine: string;
    outro: string;
  };
  expertise: {
    title: string;
    intro: string;
    areas: ExpertiseArea[];
  };
  projects: {
    title: string;
    intro: string;
    labels: { context: string; role: string; outcome: string };
    items: Project[];
  };
  gallery: {
    title: string;
    intro: string;
    hint: string;
  };
  contact: {
    title: string;
    intro: string;
    emailLabel: string;
    email: string;
    linkedinLabel: string;
    linkedinUrl: string;
    locationLabel: string;
    location: string;
    closing: string;
  };
  footer: {
    line: string;
  };
  hud: {
    levelLabel: string;
    xpLabel: string;
    unlockedLabel: string;
    konami: string;
    pages: {
      home: string;
      journey: string;
      expertise: string;
      projects: string;
      gallery: string;
      contact: string;
    };
  };
};
