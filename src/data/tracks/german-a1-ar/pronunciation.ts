export const PRONUNCIATION_DATA = {
  title: "German Pronunciation System and Arabic Speaker Phonetic Guide",
  description: "Interactive pronunciation guide covering vowels, umlauts, diphthongs, consonant combinations, word rhythm, and specific phonetic traps for native Arabic speakers.",
  arabicTraps: [
    {
      id: "trap-p-b",
      sound: "P vs. B (حرف الـ P مقابل الـ B)",
      problem: "Arabic lacks a native 'P' sound. Arabic speakers often pronounce 'P' as 'B' (e.g. saying 'Basse' instead of 'Pässe').",
      fix: "Explode air through pressed lips for 'P' (unvoiced aspirated). Feel the air puff on your hand. 'Pass' (Passport) vs 'Bass' (Bass sound).",
      examples: ["der Pass (Passport)", "die Post (Post office)", "der Platz (Square/Place)", "die Prüfung (Exam)"]
    },
    {
      id: "trap-v-f",
      sound: "V sound (الـ V تنطق F في الألمانية)",
      problem: "In German, the letter 'V' is usually pronounced like an English 'F' (فاء) in native words (Vater = فاتر), but like 'V' in loan words (Visum = فيزوم).",
      fix: "Pronounce native German 'V' as 'F': Vater (Fater), viel (fiel), von (fon), vor (for).",
      examples: ["der Vater [Fater]", "viel [fiel]", "das Volk [Folk]", "das Visum [Visum - loanword]"]
    },
    {
      id: "trap-ch",
      sound: "CH: Ich-Laut vs. Ach-Laut (صوت الـ CH اللين والخشن)",
      problem: "Arabic speakers confuse the soft 'Ich-Laut' [ç] with the hard 'Ach-Laut' [x] (شابه بحرف خ في العربية).",
      fix: "Rule: After A, O, U, AU -> 'Ach-Laut' like Arabic 'خ' (Nacht, Buch, auch). After E, I, Ä, Ö, Ü, consonants -> 'Ich-Laut' whispery cat hiss (ich, sprechen, möchte).",
      examples: ["Ich [Soft hiss]", "das Buch [Hard خ]", "Sprechen [Soft hiss]", "auch [Hard خ]"]
    },
    {
      id: "trap-r",
      sound: "The German R (Vocalic R vs Uvular R)",
      problem: "Arabic 'ر' is rolled at the tip of the tongue. German 'R' is either spoken in the throat (غين خفيفة) or vocalized as an 'ah' sound at syllable ends.",
      fix: "At the end of words (-er, -ar, -or), do NOT roll the R. Pronounce it as a soft 'ah': Vater -> Vatah, Mutter -> Muttah, der -> dea.",
      examples: ["der Vater [Fatah]", "die Mutter [Muttah]", "das Wasser [Wassah]", "reisen [Gh-sound in throat]"]
    },
    {
      id: "trap-auslaut",
      sound: "Auslautverhärtung (قسوة نهاية الحروف الساكنة)",
      problem: "At the end of words, voiced consonants b, d, g turn into unvoiced p, t, k.",
      fix: "Pronounce word-final 'b' as 'p', 'd' as 't', and 'g' as 'k'.",
      examples: ["der Tag [Tack]", "das Brot [Brot]", "ab [Ap]", "der Hund [Hunt]"]
    }
  ],
  sounds: [
    { sound: "Ä (ä)", phonetic: "e (as in bed)", arabic: "مثل الفتحة الممدودة (إيه)", examples: ["Spät", "Äpfel", "Männer", "Mädchen"] },
    { sound: "Ö (ö)", phonetic: "eu (rounded lips saying e)", arabic: "اضبط شفتيك كأنك تنطق أُو ونطق إيه", examples: ["Österreich", "schön", "hören", "Möbel"] },
    { sound: "Ü (ü)", phonetic: "u-umlaut (rounded lips saying i)", arabic: "اضبط شفتيك كأنك تنطق أُو ونطق إي", examples: ["Über", "München", "Tschüss", "Fünf"] },
    { sound: "ß (Eszett)", phonetic: "ss (sharp s)", arabic: "سين مشددة حادة (SS)", examples: ["Groß", "Heißen", "Straße", "Fußball"] },
    { sound: "EI / EY", phonetic: "ai (as in my)", arabic: "أي (مثل كلمة ماي)", examples: ["Mein", "Nein", "Heidelberg", "Eis"] },
    { sound: "IE", phonetic: "ee (long i)", arabic: "إي ممدودة (مثل كلمة ديب)", examples: ["Sie", "Hier", "Lied", "Befehl"] },
    { sound: "EU / ÄU", phonetic: "oy (as in boy)", arabic: "أوي (مثل كلمة بوي)", examples: ["Deutsch", "Euro", "Häuser", "Fräulein"] },
    { sound: "SCH", phonetic: "sh (as in shoe)", arabic: "شين (ش)", examples: ["Schule", "Sprechen", "Schreiben", "Tschüss"] },
    { sound: "ST / SP (Word initial)", phonetic: "sht / shp", arabic: "شت / شب في بداية الكلمة", examples: ["Straße [Shtraße]", "Sprechen [Shprechen]", "Stadt [Shtadt]"] }
  ]
};
