/**
 * B1 Weekly Assessments — 8 weeks, 4-6 questions each
 * Aligned with Goethe-Zertifikat B1 exam modules
 */
export const ASSESSMENTS_DATA_B1 = {
  title: "8-Week German B1 Assessments — Goethe-Zertifikat B1 Prep",
  description: "Weekly tests aligned with Goethe B1 exam. Covers Genitiv, Relativsätze, Partizip as adjective, Konjunktiv I, complex connectors, advanced prepositions, professional German, and full B1 mock exam.",
  assessments: [
    {
      weekNumber: 1,
      title: "Week 1: Genitiv — des/der + N-Deklination",
      timeMinutes: 25,
      questions: [
        { id: "b1-w1-q1", topicTag: "b1_genitiv_masc", topicTitle: "Genitiv Maskulin/Neutrum", question: "Which is correct? 'Das Büro ___ Direktors ist geschlossen.'", options: ["des", "dem", "der", "den"], correctIndex: 0, explanation: "Masculine/Neuter nouns take 'des' + noun ending '-s/-es' in Genitiv." },
        { id: "b1-w1-q2", topicTag: "b1_genitiv_fem", topicTitle: "Genitiv Feminin/Plural", question: "Complete: 'Die Meinung ___ Studentinnen ist wichtig.'", options: ["des", "der", "dem", "die"], correctIndex: 1, explanation: "Feminine and Plural use 'der' in Genitiv — same form as Nominative feminine, different function." },
        { id: "b1-w1-q3", topicTag: "b1_n_deklination", topicTitle: "N-Deklination (Weak Nouns)", question: "Which form is correct? 'Ich helfe ___ Studenten.' (der Student — N-Dekl.)", options: ["der Student", "des Studenten", "dem Studenten", "den Student"], correctIndex: 2, explanation: "N-Deklination: 'der Student' adds -en in ALL cases except Nominative Singular." },
        { id: "b1-w1-q4", topicTag: "b1_genitiv_prep", topicTitle: "Genitiv Prepositions", question: "Which preposition always takes Genitiv?", options: ["mit", "für", "wegen", "bei"], correctIndex: 2, explanation: "'Wegen' (because of) always takes Genitiv: 'wegen des schlechten Wetters'." },
      ]
    },
    {
      weekNumber: 2,
      title: "Week 2: Relativsätze — Relative Clauses",
      timeMinutes: 25,
      questions: [
        { id: "b1-w2-q1", topicTag: "b1_relativpronomen", topicTitle: "Relative Pronoun Agreement", question: "Choose the correct relative pronoun: 'Das ist der Mann, ___ ich kenne.'", options: ["der", "den", "dem", "dessen"], correctIndex: 1, explanation: "'Ich kenne ihn' → 'ihn' = Akkusativ masculine → relative pronoun = 'den'." },
        { id: "b1-w2-q2", topicTag: "b1_relativ_dativ", topicTitle: "Relative Clause with Dative", question: "Correct: 'Die Frau, ___ ich geholfen habe, ist meine Lehrerin.'", options: ["die", "der", "deren", "denen"], correctIndex: 1, explanation: "'Ich habe ihr geholfen' → 'ihr' = Dativ feminine → relative pronoun = 'der'." },
        { id: "b1-w2-q3", topicTag: "b1_relativ_genitiv", topicTitle: "Relative Clause with Genitiv (dessen/deren)", question: "Choose: 'Der Student, ___ Buch fehlt, sucht es.'", options: ["der", "den", "dessen", "dem"], correctIndex: 2, explanation: "Possession in relative clause = Genitiv → 'dessen' (masculine/neuter) = 'whose'." },
      ]
    },
    {
      weekNumber: 3,
      title: "Week 3: Partizip I & II as Adjectives",
      timeMinutes: 25,
      questions: [
        { id: "b1-w3-q1", topicTag: "b1_partizip1", topicTitle: "Partizip I Formation", question: "Form Partizip I of 'schlafen' used as adjective: 'das ___ Kind'", options: ["geschlafene", "schlafende", "schlafend", "geschlafen"], correctIndex: 1, explanation: "Partizip I = Infinitiv + d + adjective ending: 'schlafend-' → 'das schlafende Kind'." },
        { id: "b1-w3-q2", topicTag: "b1_partizip2_adj", topicTitle: "Partizip II as Adjective", question: "'Das ___ Fenster ist kalt.' (öffnen) — Choose correct form:", options: ["öffnende", "geöffnete", "geöffnet", "öffnet"], correctIndex: 1, explanation: "Partizip II as adjective takes endings: 'das geöffnete Fenster'." },
        { id: "b1-w3-q3", topicTag: "b1_partizip_meaning", topicTitle: "Partizip I vs II Meaning", question: "What's the difference between 'ein schlafendes Kind' and 'ein geschlafenes Kind'?", options: ["No difference", "Schlafendes = currently sleeping; geschlafenes = has already slept (rare)", "Geschlafendes is more polite", "Schlafendes is past tense"], correctIndex: 1, explanation: "Partizip I = active ongoing action. Partizip II = completed/passive state." },
      ]
    },
    {
      weekNumber: 4,
      title: "Week 4: Konjunktiv I — Reported Speech",
      timeMinutes: 30,
      questions: [
        { id: "b1-w4-q1", topicTag: "b1_konjunktiv1", topicTitle: "Konjunktiv I — er/sie/es Form", question: "Convert to reported speech: Er sagt: Ich bin muede.", options: ["Er sagt, dass er ist muede.", "Er sagt, er sei muede.", "Er sagt, er ist muede.", "Er sagt, er waere muede."], correctIndex: 1, explanation: "Konjunktiv I is used for indirect speech: sein → sei (3rd person singular)." },
        { id: "b1-w4-q2", topicTag: "b1_konjunktiv1_haben", topicTitle: "Konjunktiv I of haben", question: "Sie sagt: Ich habe Zeit. → reported speech:", options: ["Sie sagt, sie haette Zeit.", "Sie sagt, sie habe Zeit.", "Sie sagt, sie hat Zeit.", "Sie sagt, sie hatte Zeit."], correctIndex: 1, explanation: "Konjunktiv I of haben: habe (3rd person). Don't confuse with Konjunktiv II haette." },
        { id: "b1-w4-q3", topicTag: "b1_indirect_question", topicTitle: "Indirect Questions", question: "Transform: Wo wohnt er? → indirect:", options: ["Er fragt, wo wohnt er.", "Er fragt, ob er wohnt.", "Er fragt, wo er wohnt.", "Er fragt, wo er wohnt?"], correctIndex: 2, explanation: "Indirect questions use standard subordinate clause word order (verb at end), no question mark." },
      ]
    },
    {
      weekNumber: 5,
      title: "Week 5: Complex Connectors (nicht nur...sondern auch, sowohl...als auch)",
      timeMinutes: 25,
      questions: [
        { id: "b1-w5-q1", topicTag: "b1_connector_nicht_nur", topicTitle: "nicht nur...sondern auch", question: "Complete: 'Er spricht ___ Arabisch ___ Deutsch.'", options: ["sowohl...wie auch", "nicht nur...sondern auch", "weder...noch", "entweder...oder"], correctIndex: 1, explanation: "'Nicht nur...sondern auch' = not only...but also. Adds additional, stronger information." },
        { id: "b1-w5-q2", topicTag: "b1_sowohl", topicTitle: "sowohl...als auch", question: "'Sowohl Tee als auch Kaffee' means:", options: ["Neither tea nor coffee", "Either tea or coffee", "Both tea and coffee", "Only tea, not coffee"], correctIndex: 2, explanation: "'Sowohl...als auch' = both...and. Emphasizes inclusion of both options." },
        { id: "b1-w5-q3", topicTag: "b1_weder_noch", topicTitle: "weder...noch", question: "'Er trinkt weder Bier noch Wein.' means:", options: ["He drinks beer and wine.", "He drinks either beer or wine.", "He drinks neither beer nor wine.", "He sometimes drinks beer."], correctIndex: 2, explanation: "'Weder...noch' = neither...nor. Expresses complete negation of both options." },
      ]
    },
    {
      weekNumber: 6,
      title: "Week 6: Advanced Prepositions — wegen, trotz, während, anstatt",
      timeMinutes: 25,
      questions: [
        { id: "b1-w6-q1", topicTag: "b1_trotz", topicTitle: "TROTZ + Genitiv", question: "'___ des schlechten Wetters gingen wir spazieren.' (despite the bad weather)", options: ["Wegen", "Trotz", "Während", "Anstatt"], correctIndex: 1, explanation: "'Trotz' (despite/in spite of) + Genitiv shows contrast to the condition." },
        { id: "b1-w6-q2", topicTag: "b1_waehrend", topicTitle: "WÄHREND — during / while", question: "'Während ___ Vorlesung darf man nicht telefonieren.' Complete:", options: ["die", "der", "den", "dem"], correctIndex: 1, explanation: "'Während' takes Genitiv. 'die Vorlesung' → Genitiv feminine: 'der Vorlesung'." },
        { id: "b1-w6-q3", topicTag: "b1_anstatt", topicTitle: "ANSTATT + Genitiv (instead of)", question: "'Anstatt ___ Buches kaufte er ein Heft.' (das Buch)", options: ["dem", "des", "den", "die"], correctIndex: 1, explanation: "'Anstatt' (instead of) + Genitiv: 'das Buch' → Genitiv neuter: 'des Buches'." },
      ]
    },
    {
      weekNumber: 7,
      title: "Week 7: Professional German — University, Work, Formal Emails",
      timeMinutes: 30,
      questions: [
        { id: "b1-w7-q1", topicTag: "b1_formal_email", topicTitle: "Formal Email Opening", question: "Which is the correct formal email greeting in German?", options: ["Hallo lieber Herr Müller!", "Hey Müller!", "Sehr geehrter Herr Müller,", "Guten Tag Müller,"], correctIndex: 2, explanation: "'Sehr geehrter/Sehr geehrte' is the standard formal salutation in German professional writing." },
        { id: "b1-w7-q2", topicTag: "b1_bewerbung", topicTitle: "Job Application Phrase", question: "How do you express your motivation in a Bewerbung (application)?", options: ["Ich möchte mich für die Stelle bewerben, weil ich...", "Ich will den Job haben.", "Gib mir den Job bitte.", "Ich bin sehr gut, nehmen Sie mich."], correctIndex: 0, explanation: "Use 'sich bewerben für' + reason clause. Formal and structured." },
        { id: "b1-w7-q3", topicTag: "b1_university", topicTitle: "University Academic Vocabulary", question: "What does 'Sprechstunde' mean at a German university?", options: ["Exam period", "Office hours / consultation hours", "Lecture time", "Study group"], correctIndex: 1, explanation: "'Sprechstunde' = office hours — when professors are available for student consultations." },
      ]
    },
    {
      weekNumber: 8,
      title: "Week 8: Goethe B1 Full Mock Exam — Lesen, Hören, Schreiben, Sprechen",
      timeMinutes: 60,
      questions: [
        { id: "b1-w8-q1", topicTag: "b1_lesen", topicTitle: "Lesen Teil 1 — Newspaper Articles", question: "A headline reads: 'Steigende Mieten belasten Studenten.' What is the topic?", options: ["Rising rents burden students", "Student protests about quality", "New university buildings", "Cheaper housing solutions"], correctIndex: 0, explanation: "'Steigende Mieten' = rising rents. 'Belasten' = burden/strain. Classic B1 newspaper-style reading." },
        { id: "b1-w8-q2", topicTag: "b1_hoeren", topicTitle: "Hören — Radio Interview Context", question: "A radio guest says 'Die Digitalisierung verändert unsere Arbeitswelt grundlegend.' She means:", options: ["Digitalization fundamentally changes our work world", "Digital jobs are disappearing quickly", "Technology causes stress for workers", "The internet is a useful tool"], correctIndex: 0, explanation: "'Verändert grundlegend' = changes fundamentally. B1 listening tasks require understanding main statements." },
        { id: "b1-w8-q3", topicTag: "b1_schreiben", topicTitle: "Schreiben — Forum Post", question: "For the B1 Schreiben task (forum post), which elements are REQUIRED?", options: ["Introduce topic, give opinion with reason, respond to given statement, conclude", "Only write your personal story", "Just list vocabulary words", "Write a formal letter with full addresses"], correctIndex: 0, explanation: "B1 Schreiben: structured opinion text with introduction, argumentation, and conclusion (80–100 words)." },
        { id: "b1-w8-q4", topicTag: "b1_sprechen", topicTitle: "Sprechen Teil 2 — Presentation", question: "In B1 Sprechen Teil 2 you present a topic. What is the correct structure?", options: ["Einleitung (intro) → Hauptteil (main points) → Schluss (conclusion)", "Just say any sentences freely", "Read from prepared notes only", "Ask the examiner many questions"], correctIndex: 0, explanation: "B1 Sprechen Teil 2: structured 2-minute presentation with clear Einleitung, Hauptteil, and Schluss." },
        { id: "b1-w8-q5", topicTag: "b1_gesamtcheck", topicTitle: "Grammar Mastery Check", question: "Complete: 'Der Student, ___ Dissertation ausgezeichnet wurde, erhält ein Stipendium.'", options: ["dessen", "der", "dem", "den"], correctIndex: 0, explanation: "Relative pronoun in Genitiv to show possession: 'dessen Dissertation' = 'whose dissertation'." },
        { id: "b1-w8-q6", topicTag: "b1_final", topicTitle: "B1 Level Certification Readiness", question: "Goethe B1 passing score requires at least what percentage across all modules?", options: ["40%", "50%", "60%", "75%"], correctIndex: 2, explanation: "Goethe-Zertifikat B1 requires at least 60% overall across Lesen, Hören, Schreiben, and Sprechen modules." },
      ]
    }
  ]
};
