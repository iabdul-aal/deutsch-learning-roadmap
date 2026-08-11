/**
 * A2 Weekly Assessments — 8 weeks, 4-6 questions each
 * Aligned with Goethe-Zertifikat A2 exam modules
 */
export const ASSESSMENTS_DATA_A2 = {
  title: "8-Week German A2 Assessments — Goethe-Zertifikat A2 Prep",
  description: "Weekly tests modeled after Goethe A2 exam sections. Covers subordinate clauses, reflexive verbs, comparative, Perfekt, Konjunktiv II, passive, and full mock exam.",
  assessments: [
    {
      weekNumber: 1,
      title: "Week 1: Subordinate Clauses — weil, dass, wenn, obwohl",
      timeMinutes: 25,
      questions: [
        { id: "a2-w1-q1", topicTag: "a2_weil", topicTitle: "WEIL Clause Verb-End Rule", question: "Which sentence correctly uses a WEIL clause?", options: ["Ich lerne Deutsch, weil ich will studieren.", "Ich lerne Deutsch, weil ich studieren will.", "Ich lerne weil Deutsch studieren ich will.", "Ich will studieren, weil Deutsch ich lerne."], correctIndex: 1, explanation: "In a WEIL subordinate clause, the conjugated verb goes to the absolute end: 'weil ich studieren will'." },
        { id: "a2-w1-q2", topicTag: "a2_dass", topicTitle: "DASS Clause Structure", question: "Complete: 'Er denkt, ___ Deutsch schwer ist.'", options: ["weil", "wenn", "dass", "obwohl"], correctIndex: 2, explanation: "'DASS' introduces an indirect statement. 'Er denkt, dass Deutsch schwer ist.'" },
        { id: "a2-w1-q3", topicTag: "a2_obwohl", topicTitle: "OBWOHL — Concessive Clause", question: "What does OBWOHL mean?", options: ["because", "when", "although / even though", "if"], correctIndex: 2, explanation: "'Obwohl' expresses contrast: 'Obwohl es kalt ist, gehe ich spazieren.'" },
        { id: "a2-w1-q4", topicTag: "a2_wenn", topicTitle: "WENN vs. ALS", question: "Which is correct for a repeated past event?", options: ["Wenn ich jung war, spielte ich Fußball.", "Als ich jung war, spielte ich Fußball.", "Weil ich jung war, spielte ich Fußball.", "Dass ich jung war, spielte ich Fußball."], correctIndex: 1, explanation: "ALS is used for a single or repeated event in the past. WENN is for present/future or habitual." },
      ]
    },
    {
      weekNumber: 2,
      title: "Week 2: Reflexive Verbs & Daily Routines",
      timeMinutes: 25,
      questions: [
        { id: "a2-w2-q1", topicTag: "a2_reflexive", topicTitle: "Akkusativ Reflexivpronomen", question: "Which pronoun completes: 'Ich wasche ___ jeden Morgen.'?", options: ["mir", "mich", "sich", "ich"], correctIndex: 1, explanation: "Direct reflexive action on oneself: 'Ich wasche mich' (Akkusativ reflexive pronoun)." },
        { id: "a2-w2-q2", topicTag: "a2_dativ_reflexive", topicTitle: "Dativ Reflexivpronomen", question: "Which is correct: 'Ich putze ___ die Zähne.'?", options: ["mich", "mir", "sich", "dich"], correctIndex: 1, explanation: "When another object follows (die Zähne), the reflexive takes Dativ: 'mir'." },
        { id: "a2-w2-q3", topicTag: "a2_reflexive_verbs", topicTitle: "Always-Reflexive Verbs", question: "Which verb is ALWAYS reflexive in German?", options: ["waschen", "freuen", "kaufen", "gehen"], correctIndex: 1, explanation: "'Sich freuen' is an inherently reflexive verb — it cannot exist without the reflexive pronoun." },
      ]
    },
    {
      weekNumber: 3,
      title: "Week 3: Comparative & Superlative + Adjective Endings",
      timeMinutes: 25,
      questions: [
        { id: "a2-w3-q1", topicTag: "a2_comparative", topicTitle: "Comparative Formation", question: "Form the comparative: 'schnell' → ___", options: ["schneller", "am schnellsten", "schnellste", "mehr schnell"], correctIndex: 0, explanation: "Comparative adds -er: 'schnell → schneller'. Superlative is 'am schnellsten'." },
        { id: "a2-w3-q2", topicTag: "a2_adjective_endings", topicTitle: "Adjective Endings After Definite Article", question: "Complete: 'Der ___ Mann trägt einen Hut.' (alt)", options: ["alte", "alter", "alten", "altem"], correctIndex: 0, explanation: "After definite article in Nominative masculine: the adjective ending is -e." },
        { id: "a2-w3-q3", topicTag: "a2_superlative", topicTitle: "Superlative with AM", question: "Which is the correct superlative of 'groß'?", options: ["am größer", "am größten", "größtest", "am größte"], correctIndex: 1, explanation: "Superlative predicate: 'am + adjective + -sten'. 'Groß' has umlaut: 'am größten'." },
      ]
    },
    {
      weekNumber: 4,
      title: "Week 4: Perfekt (Past Tense) — Regular & Irregular Verbs",
      timeMinutes: 30,
      questions: [
        { id: "a2-w4-q1", topicTag: "a2_perfekt_haben", topicTitle: "Perfekt with HABEN", question: "What is the Perfekt of 'kaufen'?", options: ["hat gekauft", "ist gekauft", "hat kaufte", "ist kaufen"], correctIndex: 0, explanation: "Regular transitive verb → HABEN + Partizip II (ge+stem+t): 'hat gekauft'." },
        { id: "a2-w4-q2", topicTag: "a2_perfekt_sein", topicTitle: "Perfekt with SEIN", question: "Which verb uses SEIN in the Perfekt?", options: ["schlafen", "essen", "fahren", "kaufen"], correctIndex: 2, explanation: "Motion/change-of-state verbs use SEIN: 'fahren → ist gefahren'." },
        { id: "a2-w4-q3", topicTag: "a2_partizip2", topicTitle: "Irregular Partizip II", question: "What is the Partizip II of 'schreiben'?", options: ["geschreibt", "geschrieben", "schrieben", "geskribt"], correctIndex: 1, explanation: "Strong verb: 'schreiben → geschrieben' (no -t, vowel change inside)." },
        { id: "a2-w4-q4", topicTag: "a2_perfekt_trennbar", topicTitle: "Partizip II of Separable Verbs", question: "Partizip II of 'aufmachen'?", options: ["aufgemacht", "gemachtauf", "aufmacht", "gemacht auf"], correctIndex: 0, explanation: "Separable verbs insert -ge- between prefix and stem: 'auf+ge+macht' = 'aufgemacht'." },
      ]
    },
    {
      weekNumber: 5,
      title: "Week 5: Konjunktiv II — würde, hätte, wäre",
      timeMinutes: 25,
      questions: [
        { id: "a2-w5-q1", topicTag: "a2_konjunktiv2", topicTitle: "Würde + Infinitiv", question: "How do you say politely 'I would like a coffee'?", options: ["Ich will einen Kaffee.", "Ich würde gerne einen Kaffee nehmen.", "Ich wäre einen Kaffee.", "Ich hätte Kaffee."], correctIndex: 1, explanation: "'Würde + Infinitiv' is the standard polite request form in German." },
        { id: "a2-w5-q2", topicTag: "a2_haette", topicTitle: "HÄTTE — Konjunktiv II of haben", question: "Which expresses an unreal wish? 'Ich ___ mehr Zeit.'", options: ["habe", "hatte", "hätte", "haben"], correctIndex: 2, explanation: "'Hätte' is the Konjunktiv II of 'haben' — used for unreal/hypothetical wishes." },
        { id: "a2-w5-q3", topicTag: "a2_waere", topicTitle: "WÄRE — Konjunktiv II of sein", question: "Translate: 'If I were you, I would study more.'", options: ["Wenn ich du wäre, würde ich mehr lernen.", "Wenn ich du bin, lerne ich mehr.", "Ob ich du wäre, lerne ich.", "Als ich du wäre, würde ich."], correctIndex: 0, explanation: "'Wäre' (Konj. II of sein) + 'würde' in result clause." },
      ]
    },
    {
      weekNumber: 6,
      title: "Week 6: Futur I & Appointments (Arzt, Bank, Amt)",
      timeMinutes: 25,
      questions: [
        { id: "a2-w6-q1", topicTag: "a2_futur1", topicTitle: "Futur I Formation", question: "Form Futur I: 'Ich komme morgen' → future:", options: ["Ich werde morgen kommen.", "Ich komme werden morgen.", "Morgen ich werde kommen.", "Ich bin morgen gekommen."], correctIndex: 0, explanation: "Futur I: 'werden' conjugated + Infinitiv at the end: 'Ich werde morgen kommen.'" },
        { id: "a2-w6-q2", topicTag: "a2_appointments", topicTitle: "Making Appointments", question: "How do you request a doctor's appointment on the phone?", options: ["Ich möchte einen Termin vereinbaren.", "Geben Sie mir Termin!", "Doktor, ich krank.", "Ich brauche Krankenhaus."], correctIndex: 0, explanation: "'Einen Termin vereinbaren' is the standard phrase for booking appointments." },
      ]
    },
    {
      weekNumber: 7,
      title: "Week 7: Passiv (Passive Voice) with werden + Partizip II",
      timeMinutes: 30,
      questions: [
        { id: "a2-w7-q1", topicTag: "a2_passiv", topicTitle: "Passive Voice Formation", question: "Convert to passive: 'Der Koch kocht das Essen.'", options: ["Das Essen ist gekocht.", "Das Essen wird gekocht.", "Das Essen kocht sich.", "Der Koch wird Essen kochen."], correctIndex: 1, explanation: "Passive: 'werden' + Partizip II. Present: 'Das Essen wird (vom Koch) gekocht.'" },
        { id: "a2-w7-q2", topicTag: "a2_passiv_agent", topicTitle: "Passive with VON (agent)", question: "How is the agent expressed in a German passive sentence?", options: ["with 'von' + Dativ", "with 'durch' + Akkusativ always", "with 'mit' + Dativ", "with 'für'"], correctIndex: 0, explanation: "The agent (doer) in passive is introduced with 'von' + Dativ: 'Das Buch wird von der Lehrerin gelesen.'" },
        { id: "a2-w7-q3", topicTag: "a2_passiv_modal", topicTitle: "Passive with Modal Verbs", question: "Which is correct for 'The window must be opened'?", options: ["Das Fenster muss öffnen.", "Das Fenster muss geöffnet werden.", "Das Fenster wird öffnen müssen.", "Das Fenster öffnet werden müssen."], correctIndex: 1, explanation: "Modal passive: Modal verb + Partizip II + 'werden' at the end." },
      ]
    },
    {
      weekNumber: 8,
      title: "Week 8: Goethe A2 Full Mock Exam — All 4 Modules",
      timeMinutes: 45,
      questions: [
        { id: "a2-w8-q1", topicTag: "a2_lesen", topicTitle: "Lesen — Reading Comprehension", question: "A notice says 'Bitte Schuhe ausziehen!' What does this mean?", options: ["Please take off your shoes.", "Please clean your shoes.", "Shoes must be bought.", "No shoes allowed in store."], correctIndex: 0, explanation: "'Schuhe ausziehen' = to take off shoes. Common sign in German homes and certain spaces." },
        { id: "a2-w8-q2", topicTag: "a2_hoeren", topicTitle: "Hören — Listening Context", question: "Someone says: 'Ich habe leider keinen Termin mehr frei.' What did they say?", options: ["They have no more appointments available.", "They are not feeling well.", "They want to make an appointment.", "They cancelled the appointment."], correctIndex: 0, explanation: "'Keinen Termin mehr frei' = no appointment slots remaining." },
        { id: "a2-w8-q3", topicTag: "a2_schreiben", topicTitle: "Schreiben — Writing Task", question: "For the A2 Schreiben module, what must you include in a formal email?", options: ["Greeting, reason, closing", "Only your name and signature", "Just bullet points", "Drawings and photos"], correctIndex: 0, explanation: "Goethe A2 writing requires Anrede (greeting), main content (reason/request), and Abschluss (closing)." },
        { id: "a2-w8-q4", topicTag: "a2_sprechen", topicTitle: "Sprechen — Oral Exam Strategy", question: "In A2 Sprechen Part 2, you must negotiate something. The best strategy is?", options: ["Make suggestions and respond to partner's ideas", "Only speak in your native language", "Stay silent until asked", "Argue and refuse all suggestions"], correctIndex: 0, explanation: "A2 Sprechen Part 2 tests interactive communication — make proposals and react to your partner's." },
        { id: "a2-w8-q5", topicTag: "a2_final", topicTitle: "A2 Level Mastery Check", question: "Translate: 'Obwohl es regnet, gehe ich spazieren.'", options: ["Although it's raining, I go for a walk.", "Because it rains, I go inside.", "When it rains, I walk faster.", "It rains while I walk."], correctIndex: 0, explanation: "'Obwohl' = although. The contrast clause shows determination despite the rain." },
      ]
    }
  ]
};
