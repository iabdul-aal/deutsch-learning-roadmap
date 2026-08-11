import json

weeks_data = [
    {
        "weekNumber": 1,
        "title": "Genitive Case (des/der + N-Deklination)",
        "objective": "Master the genitive case endings and N-declension nouns.",
        "summary": "Focus on expressing possession and learning weak nouns in German.",
    },
    {
        "weekNumber": 2,
        "title": "Relative Clauses (Relativsätze)",
        "objective": "Form relative clauses in all cases (Nominative, Accusative, Dative).",
        "summary": "Learn to connect sentences and provide additional information using relative pronouns.",
    },
    {
        "weekNumber": 3,
        "title": "Partizip I & II as Adjectives + Participial Phrases",
        "objective": "Use participles as adjectives to create concise sentences.",
        "summary": "Master the transformation of relative clauses into participial constructions.",
    },
    {
        "weekNumber": 4,
        "title": "Reported Speech (Konjunktiv I) + Indirect Questions",
        "objective": "Report what others have said using Konjunktiv I and form indirect questions.",
        "summary": "Essential skills for reading news and reporting information formally.",
    },
    {
        "weekNumber": 5,
        "title": "Complex Connectors",
        "objective": "Use two-part connectors to build complex sentences.",
        "summary": "Learn connectors like nicht nur...sondern auch, sowohl...als auch, weder...noch.",
    },
    {
        "weekNumber": 6,
        "title": "Advanced Prepositions",
        "objective": "Master prepositions taking the genitive case.",
        "summary": "Focus on wegen, trotz, während, anstatt and their correct usage.",
    },
    {
        "weekNumber": 7,
        "title": "German for University & Professional Contexts",
        "objective": "Write formal emails, job applications, and understand academic texts.",
        "summary": "Prepare for the professional world in German-speaking countries.",
    },
    {
        "weekNumber": 8,
        "title": "Goethe B1 Zertifikat Full Exam Prep",
        "objective": "Practice all 4 modules (Lesen, Hören, Schreiben, Sprechen) under exam conditions.",
        "summary": "Intensive mock exams and review for the Goethe B1 certificate.",
    }
]

def generate_curriculum():
    output = []
    output.append("export const CURRICULUM_DATA_B1 = {")
    output.append('  trackId: "german-b1-ar",')
    output.append('  title: "56-Day German B1 Mastery Roadmap",')
    output.append('  totalWeeks: 8,')
    output.append('  totalDays: 56,')
    output.append('  weeks: [')
    
    for w in range(1, 9):
        w_data = weeks_data[w-1]
        output.append("    {")
        output.append(f'      weekNumber: {w_data["weekNumber"]},')
        output.append(f'      title: "{w_data["title"]}",')
        output.append(f'      objective: "{w_data["objective"]}",')
        output.append(f'      summary: "{w_data["summary"]}",')
        output.append('      days: [')
        
        for d in range(1, 8):
            day_num = (w - 1) * 7 + d
            is_revision = d == 7
            day_title = f"Day {day_num}: Revision & Mock Assessment" if is_revision else f"Day {day_num}: {w_data['title']} Practice {d}"
            focus = "Revision" if is_revision else w_data["title"]
            obj = "Assess progress" if is_revision else f"Master {w_data['title']} - part {d}"
            
            output.append("        {")
            output.append(f'          dayNumber: {day_num},')
            output.append(f'          weekNumber: {w},')
            output.append(f'          title: "{day_title}",')
            output.append(f'          focusSkill: "{focus}",')
            output.append(f'          objective: "{obj}",')
            
            # Standard Tasks
            output.append('          standardTasks: [')
            output.append('            { type: "Watch", title: "Nicos Weg Episode", duration: "40 min", resourceType: "PRIMARY", link: "https://learngerman.dw.com/de/nicos-weg/c-36519789" },')
            output.append('            { type: "Grammar", title: "DeutschAkademie Exercises", duration: "30 min", resourceType: "SUPPLEMENTARY", link: "https://www.deutschakademie.de/online-deutschkurs/english" },')
            output.append('            { type: "Vocabulary", title: "Anki Flashcards", duration: "20 min", resourceType: "VOCAB", link: "https://apps.ankiweb.net/" },')
            output.append('            { type: "Listening", title: "Easy German Video", duration: "20 min", resourceType: "SUPPLEMENTARY", link: "https://www.youtube.com/@EasyGerman" },')
            output.append('            { type: "Reading", title: "Goethe Practice Text", duration: "30 min", resourceType: "PRIMARY", link: "https://www.goethe.de/en/spr/kup/prf/prf/gb1/ueb.html" }')
            if is_revision:
                output.append('            , { type: "Mock Exam", title: "Goethe B1 Practice Exam", duration: "60 min", resourceType: "PRIMARY", link: "https://www.goethe.de/en/spr/kup/prf/prf/gb1/ueb.html" }')
            output.append('          ],')
            
            # Intensive Tasks
            output.append('          intensiveTasks: [')
            output.append('            { type: "Writing", title: "Write 150 words using daily grammar", duration: "40 min" },')
            output.append('            { type: "Speaking", title: "Record a 3-minute summary", duration: "30 min" },')
            output.append('            { type: "Analysis", title: "Grammar Deep Dive with Deutsch mit Marija", duration: "30 min", resourceType: "SUPPLEMENTARY", link: "https://www.youtube.com/@DeutschmitMarija" }')
            output.append('          ],')
            
            output.append('          targetMetrics: { vocab: 20, listeningMinutes: 60, speakingMinutes: 30, writingTasks: 1 }')
            output.append("        }" + ("," if d < 7 else ""))
        
        output.append('      ]')
        output.append("    }" + ("," if w < 8 else ""))
        
    output.append('  ]')
    output.append('};')
    
    with open(r'e:\German\src\data\tracks\german-b1-ar\curriculum.ts', 'w', encoding='utf-8') as f:
        f.write("\n".join(output))

if __name__ == "__main__":
    import os
    os.makedirs(r'e:\German\src\data\tracks\german-b1-ar', exist_ok=True)
    generate_curriculum()
    print("DONE")
