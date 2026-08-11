export const ASSESSMENTS_DATA = {
  title: "8-Week Interactive Goethe A1 and FAU Erlangen Assessment System",
  description: "Weekly comprehensive tests modeled after Goethe-Zertifikat A1 (Start Deutsch 1) and FAU Erlangen-Nürnberg Sprachenzentrum course exams (Hören, Lesen, Schreiben, Sprechen).",
  assessments: [
    {
      weekNumber: 1,
      title: "Week 1 Assessment: Goethe A1 Part 1 (Sprechen and Foundations)",
      timeMinutes: 20,
      questions: [
        {
          id: "w1-q1",
          topicTag: "g2_pronouns",
          topicTitle: "Personal Pronouns and Formal Address",
          question: "Goethe A1 Sprechen Part 1 (Self Intro): How do you politely introduce yourself to a FAU Erlangen administrator?",
          options: ["Mein Name ist... Ich komme aus...", "Ich du heisse...", "Mein Name bist...", "Ich aus Kairo wohnen..."],
          correctIndex: 0,
          explanation: "In Goethe A1 Sprechen Part 1, introduce yourself cleanly: 'Mein Name ist... Ich komme aus Ägypten.'"
        },
        {
          id: "w1-q2",
          topicTag: "g1_v2_rule",
          topicTitle: "V2 Rule Sentence Structure",
          question: "Which of the following sentences correctly follows the German V2 Rule?",
          options: [
            "Heute ich lerne Deutsch.",
            "Heute lerne ich Deutsch.",
            "Heute Deutsch lerne ich.",
            "Ich heute lerne Deutsch."
          ],
          correctIndex: 1,
          explanation: "When starting with 'Heute' (Position 1), the verb 'lerne' must occupy Position 2 -> 'Heute lerne ich Deutsch.'"
        },
        {
          id: "w1-q3",
          topicTag: "g5_articles",
          topicTitle: "Indefinite Articles",
          question: "Choose the correct article: 'Das ist ___ Buch' (Neuter noun)",
          options: ["ein", "eine", "einen", "der"],
          correctIndex: 0,
          explanation: "Neuter nouns (das Buch) take the indefinite article 'ein' in Nominative."
        },
        {
          id: "w1-q4",
          topicTag: "g7_negation",
          topicTitle: "Nicht vs. Kein",
          question: "Select the correct negation: 'Ich habe ___ Zeit.'",
          options: ["nicht", "keine", "kein", "nein"],
          correctIndex: 1,
          explanation: "'Zeit' is a feminine noun without article in this context, so it takes 'keine' -> 'keine Zeit'."
        }
      ]
    },
    {
      weekNumber: 2,
      title: "Week 2 Assessment: Accusative, Supermarket and Time (Spektrum A1 / Goethe Hören)",
      timeMinutes: 25,
      questions: [
        {
          id: "w2-q1",
          topicTag: "g8_accusative",
          topicTitle: "Accusative Case Articles",
          question: "Complete the sentence: 'Ich kaufe ___ Apfel' (der Apfel).",
          options: ["der", "den", "dem", "ein"],
          correctIndex: 1,
          explanation: "Masculine 'der' changes to 'den' in the Accusative case."
        },
        {
          id: "w2-q2",
          topicTag: "g9_separable_verbs",
          topicTitle: "Separable Verbs Structure",
          question: "Where does the prefix 'ein' go in: 'Ich kaufe im Supermarkt ___'?",
          options: ["before kaufe", "after ich", "at the very end of the sentence", "after Supermarkt"],
          correctIndex: 2,
          explanation: "Separable prefixes (like 'ein' in einkaufen) move to the absolute end of a main clause."
        },
        {
          id: "w2-q3",
          topicTag: "v_food",
          topicTitle: "Restaurant Ordering Phrase",
          question: "How do you politely ask for separate bills at a German restaurant?",
          options: ["Zusammen bitte!", "Zahlen bitte getrennt!", "Alles auf eine Rechnung!", "Danke schön!"],
          correctIndex: 1,
          explanation: "'Getrennt' means paying separately, a common practice in Germany."
        }
      ]
    },
    {
      weekNumber: 3,
      title: "Week 3 Assessment: Goethe A1 Schreiben (Form and Landlord Letter)",
      timeMinutes: 25,
      questions: [
        {
          id: "w3-q1",
          topicTag: "g11_modal_verbs",
          topicTitle: "Modal Verbs and Main Verb Position",
          question: "Which sentence correctly places the main verb when using modal verb 'müssen'?",
          options: [
            "Ich muss heute anmelden mich.",
            "Ich muss mich heute anmelden.",
            "Ich anmelden muss mich heute.",
            "Ich muss anmelden mich heute."
          ],
          correctIndex: 1,
          explanation: "Modal verb 'muss' goes in Position 2, while the infinitive 'anmelden' goes to the end."
        },
        {
          id: "w3-q2",
          topicTag: "v_housing",
          topicTitle: "Warmmiete vs Kaltmiete",
          question: "What does 'Warmmiete' include in German housing listings?",
          options: ["Only the cold rent", "Rent plus estimated utilities like heating and water", "Only electricity and internet", "Security deposit"],
          correctIndex: 1,
          explanation: "'Warmmiete' includes basic rent plus Nebenkosten (heating, hot water, waste management)."
        }
      ]
    },
    {
      weekNumber: 4,
      title: "Week 4 Assessment: Dative Case, Prepositions and Directions (Goethe Lesen)",
      timeMinutes: 25,
      questions: [
        {
          id: "w4-q1",
          topicTag: "g12_dative",
          topicTitle: "Dative Case Articles",
          question: "Complete the Dative sentence: 'Ich danke ___ Lehrerin' (die Lehrerin).",
          options: ["die", "den", "der", "dem"],
          correctIndex: 2,
          explanation: "Feminine article 'die' changes to 'der' in the Dative case."
        },
        {
          id: "w4-q2",
          topicTag: "g13_dative_prepositions",
          topicTitle: "Fixed Dative Prepositions",
          question: "Fill in the blank: 'Ich fahre mit ___ U-Bahn zum Campus' (die U-Bahn).",
          options: ["die", "der", "dem", "den"],
          correctIndex: 1,
          explanation: "'mit' always takes Dative. Feminine 'die U-Bahn' becomes 'der U-Bahn'."
        }
      ]
    },
    {
      weekNumber: 5,
      title: "Week 5 Assessment: FAU Erlangen University Enrollment and Student Office",
      timeMinutes: 25,
      questions: [
        {
          id: "w5-q1",
          topicTag: "v_university",
          topicTitle: "University Terms",
          question: "What is 'Immatrikulation' at FAU Erlangen-Nürnberg?",
          options: ["Graduation ceremony", "Official student enrollment / registration", "Exam retake", "Library fine"],
          correctIndex: 1,
          explanation: "'Immatrikulation' is the official university enrollment process."
        }
      ]
    },
    {
      weekNumber: 6,
      title: "Week 6 Assessment: Das Perfekt (Past Tense Master Test and Goethe Reading)",
      timeMinutes: 30,
      questions: [
        {
          id: "w6-q1",
          topicTag: "g16_perfekt",
          topicTitle: "Haben vs Sein Auxiliary",
          question: "Choose the correct past sentence for 'gehe nach Hause':",
          options: [
            "Ich habe nach Hause gegangen.",
            "Ich bin nach Hause gegangen.",
            "Ich werde nach Hause gegangen.",
            "Ich war nach Hause gegangen."
          ],
          correctIndex: 1,
          explanation: "Movement verb 'gehen' takes auxiliary 'SEIN' -> 'Ich bin nach Hause gegangen.'"
        }
      ]
    },
    {
      weekNumber: 7,
      title: "Week 7 Assessment: Visas, Goethe Start Deutsch 1 Prep and Subordinate Clauses",
      timeMinutes: 30,
      questions: [
        {
          id: "w7-q1",
          topicTag: "g17_subordinate_clauses",
          topicTitle: "Weil and Verb End Rule",
          question: "Complete the sentence correctly: 'Ich lerne Deutsch, weil ich in Erlangen ___.'",
          options: ["wohne", "wohnen möchte", "möchte wohnen", "wohnen"],
          correctIndex: 1,
          explanation: "In subordinate clause with 'weil', modal verb 'möchte' goes to the absolute end after infinitive 'wohnen'."
        }
      ]
    },
    {
      weekNumber: 8,
      title: "Week 8 Graduation Test: Goethe-Zertifikat A1 and FAU Academic Readiness Exam",
      timeMinutes: 45,
      questions: [
        {
          id: "w8-q1",
          topicTag: "final_mastery",
          topicTitle: "Goethe A1 Certification Blueprint",
          question: "Goethe A1 Sprechen Part 2: You receive a card with keyword 'Wohnung' and symbol '?'. How do you ask a question?",
          options: [
            "Suchen Sie eine Wohnung in Erlangen?",
            "Wohnung ist schön.",
            "Ich nicht Wohnung.",
            "Wo du wohnst?"
          ],
          correctIndex: 0,
          explanation: "Formulate a polite formal question: 'Suchen Sie eine Wohnung in Erlangen?'"
        },
        {
          id: "w8-q2",
          topicTag: "final_mastery",
          topicTitle: "FAU Erlangen Campus Protocol",
          question: "Which response is appropriate when a German landlord asks: 'Haben Sie die Wohnungsgeberbestätigung dabei?'",
          options: [
            "Ja, ich habe das Dokument hier.",
            "Nein, ich trinke keinen Kaffee.",
            "Guten Abend, Herr Landlord.",
            "Ich wohne am Bahnhof."
          ],
          correctIndex: 0,
          explanation: "'Ja, ich habe das Dokument hier' directly answers the landlord's question regarding registration paperwork."
        }
      ]
    }
  ]
};
