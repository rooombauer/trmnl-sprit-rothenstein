import type { Dict } from './types';

// Alle Texte mit ‹spitzen Klammern› sind Platzhalter: bitte durch echte
// Stationen, Jahre und Namen ersetzen (siehe PORTFOLIO.md).
export const de: Dict = {
  meta: {
    siteName: 'R. Bauer',
    titleSuffix: 'Vom Microsoft-Ingenieur zum CXO',
    description:
      'Vom Microsoft-zertifizierten Systemingenieur zum CXO – Technologie, Führung und KI-Transformation aus einer Hand.',
  },
  nav: {
    home: 'Start',
    journey: 'Werdegang',
    expertise: 'Kompetenzen',
    projects: 'Projekte',
    gallery: 'Galerie',
    contact: 'Kontakt',
  },
  home: {
    eyebrow: '~/journey --from mcse --to cxo',
    claim: 'Vom Microsoft-Ingenieur zum CXO.',
    subline:
      'Ich habe Systeme aufgebaut, bevor ich Organisationen transformiert habe. Vom Server-Raum bis auf C-Level – und heute mittendrin in der KI-Transformation.',
    ctaJourney: 'Werdegang als Boot-Log lesen',
    ctaContact: 'Kontakt aufnehmen',
    bootTeaserTitle: 'System-Startprotokoll',
    bootTeaserText:
      'Jede Karriere hat eine Boot-Sequenz. Meine beginnt mit einem MCSE-Zertifikat und läuft heute auf einer ganz neuen Runtime: künstlicher Intelligenz.',
    bootTeaserLink: 'Vollständiges Log ansehen →',
    photoCaption: 'Startup-Momente: Technologie entsteht im Team.',
    pillars: [
      {
        tag: 'engineering',
        title: 'Vom Handwerk her gedacht',
        text: 'MCSE-Wurzeln: Server, Netzwerke, Infrastruktur. Wer Systeme selbst aufgebaut hat, trifft Technologie-Entscheidungen mit Bodenhaftung.',
      },
      {
        tag: 'leadership',
        title: 'Verantwortung auf C-Level',
        text: 'Als CXO übersetze ich zwischen Technologie und Geschäftsführung – Strategie, Budget, Teams und Roadmaps aus einer Hand.',
      },
      {
        tag: 'ai.runtime',
        title: 'KI als neue Runtime',
        text: 'KI-Transformation nicht als Buzzword, sondern als Betriebssystem-Wechsel: Prozesse, Produkte und Teams neu denken.',
      },
    ],
  },
  journey: {
    title: 'Werdegang',
    intro:
      'Kein Lebenslauf liest sich ehrlicher als ein Startprotokoll: Was wurde wann geladen, was läuft bis heute stabil. Hier ist meine Boot-Sequenz – vom ersten Netzwerk bis zur KI-Gegenwart.',
    logHeader: 'boot.log — journey v‹XX›.‹X› — R. Bauer',
    entries: [
      {
        time: '‹19XX›',
        status: 'OK',
        module: 'bios.post',
        title: 'System-Start',
        detail:
          'Erste Rechner, erste Netzwerke. Die Faszination, Dinge zum Laufen zu bringen, wird zum Berufswunsch. ‹Ausbildung/Einstieg eintragen›',
      },
      {
        time: '‹Jahr›',
        status: 'OK',
        module: 'mcse.cert',
        title: 'MCSE-Zertifizierung geladen',
        detail:
          'Microsoft Certified Systems Engineer – das Fundament: Windows-Server, Netzwerke, Verzeichnisdienste. Systeme nicht nur bedienen, sondern verstehen.',
      },
      {
        time: '‹Jahr›',
        status: 'OK',
        module: 'syseng.core',
        title: 'Systems Engineering',
        detail:
          'Verantwortung für Infrastruktur und Betrieb: planen, aufbauen, stabil halten. ‹Unternehmen/Station und Schwerpunkte eintragen›',
      },
      {
        time: '‹Jahr›',
        status: 'OK',
        module: 'leadership.init',
        title: 'Wechsel in die Führung',
        detail:
          'Vom Konfigurieren von Systemen zum Entwickeln von Teams. Die wichtigste Erkenntnis: Organisationen skalieren wie Architekturen – oder eben nicht. ‹Rolle/Station eintragen›',
      },
      {
        time: '‹Jahr›',
        status: 'RUN',
        module: 'cxo.mode',
        title: 'CXO',
        detail:
          'Technologie-Verantwortung auf C-Level: Strategie, Produkt, Teams und Budgets. Entscheidungen, die das ganze Unternehmen tragen muss. ‹Unternehmen eintragen›',
      },
      {
        time: 'heute',
        status: 'RUN',
        module: 'ai.runtime',
        title: 'KI-Gegenwart',
        detail:
          'Neue Runtime geladen: KI verändert, wie wir bauen, entscheiden und führen. Meine Aufgabe: die Brücke zwischen 25 Jahren Systemverständnis und dem, was jetzt möglich wird. ‹Zahl prüfen›',
      },
    ],
    readyLine: 'system ready — uptime: ‹XX› Jahre und läuft',
    outro:
      'Der rote Faden: Wer die unterste Schicht des Stacks selbst betrieben hat, kann die oberste – Strategie und Führung – glaubwürdig gestalten.',
  },
  expertise: {
    title: 'Kompetenzen',
    intro:
      'Vier Ebenen, ein Stack: von der Infrastruktur-Erfahrung bis zur KI-Strategie. Jede Ebene baut auf der darunter auf.',
    areas: [
      {
        tag: 'strategy',
        title: 'Technologie-Strategie',
        text: 'Technologie-Entscheidungen als Geschäftsentscheidungen: Roadmaps, Make-or-Buy, Architektur-Leitplanken – verständlich für Vorstand und Team.',
        points: [
          'Digitale Roadmaps mit klaren Prioritäten',
          'Architektur- und Plattform-Entscheidungen',
          'Budget- und Ressourcenverantwortung',
        ],
      },
      {
        tag: 'ai.transformation',
        title: 'KI-Transformation',
        text: 'KI dort einsetzen, wo sie Wert schafft – in Prozessen, Produkten und Arbeitsweisen. Mit realistischem Blick auf Aufwand, Risiko und Reifegrad.',
        points: [
          'KI-Use-Cases identifizieren und priorisieren',
          'Von Pilotprojekten zu produktivem Einsatz',
          'Teams für das Arbeiten mit KI befähigen',
        ],
      },
      {
        tag: 'engineering.dna',
        title: 'Engineering-Wurzeln',
        text: 'MCSE, Server-Räume, Netzwerke: Wer Infrastruktur selbst verantwortet hat, erkennt technische Risiken, bevor sie im Steering Committee landen.',
        points: [
          'Infrastruktur, Betrieb und IT-Sicherheit',
          'Microsoft-Ökosystem von NT bis Cloud',
          'Technische Due Diligence auf Augenhöhe',
        ],
      },
      {
        tag: 'people',
        title: 'Führung & Teams',
        text: 'Technologie liefert nur so gut wie die Organisation dahinter. Teams aufbauen, entwickeln und durch Veränderung führen – auch wenn es unbequem wird.',
        points: [
          'Aufbau und Entwicklung von Tech-Teams',
          'Führen in Transformationsphasen',
          'Brücke zwischen Fachbereich und Engineering',
        ],
      },
    ],
  },
  projects: {
    title: 'Projekte & Stationen',
    intro:
      'Ausgewählte Vorhaben, die den Weg vom Ingenieur zum CXO markieren. ‹Die drei Karten unten sind Struktur-Platzhalter – echte Projekte eintragen.›',
    labels: {
      context: 'Kontext',
      role: 'Rolle',
      outcome: 'Ergebnis',
    },
    items: [
      {
        tag: 'infrastructure',
        title: '‹Projekt: Infrastruktur / Migration›',
        context: '‹Ausgangslage in 1–2 Sätzen: Unternehmen, Größenordnung, Problem.›',
        role: '‹Deine Rolle: z. B. technische Leitung, Architektur, Umsetzung.›',
        outcome: '‹Messbares Ergebnis: Verfügbarkeit, Kosten, Zeit.›',
      },
      {
        tag: 'transformation',
        title: '‹Projekt: Digitalisierung / Organisation›',
        context: '‹Ausgangslage: gewachsene Strukturen, neue Anforderungen.›',
        role: '‹Deine Rolle: z. B. Programmverantwortung als Führungskraft.›',
        outcome: '‹Ergebnis: neue Prozesse, Team-Aufbau, Geschäftswirkung.›',
      },
      {
        tag: 'ai',
        title: '‹Projekt: KI-Einführung›',
        context: '‹Ausgangslage: wo sollte KI Wert schaffen?›',
        role: '‹Deine Rolle: Strategie, Auswahl, Einführung, Enablement.›',
        outcome: '‹Ergebnis: produktive Use-Cases, gehobene Effizienz.›',
      },
    ],
  },
  gallery: {
    title: 'Galerie',
    intro: 'Momente aus dem Arbeitsleben – vom Server-Raum bis zur Bühne.',
    hint: 'Eigene Fotos: einfach in den /assets-Ordner legen und in lib/content/gallery.ts eintragen.',
  },
  contact: {
    title: 'Kontakt',
    intro:
      'Ob KI-Strategie, Technologie-Führung oder ein zweites Paar Augen für eine schwierige Architektur-Entscheidung – ich freue mich über Nachrichten.',
    emailLabel: 'E-Mail',
    email: 'r.bauer@rooom.com',
    linkedinLabel: 'LinkedIn',
    linkedinUrl: '‹https://www.linkedin.com/in/dein-profil›',
    locationLabel: 'Standort',
    location: '‹Stadt, Deutschland›',
    closing: 'Antwort in der Regel innerhalb von 48 Stunden.',
  },
  footer: {
    line: 'Handgebaut mit Next.js — Anthrazit, Kupfer und einem Boot-Log.',
  },
};
