import json
import os

weeks_data = [
    {"title": "Subordinate Clauses (weil, dass, wenn, obwohl)", "focus": "Grammar & Sentence Structure", "obj": "Master subordinate clauses and sentence connectors."},
    {"title": "Reflexive Verbs & Personal Care Routines", "focus": "Daily Life & Routine", "obj": "Learn to describe daily routines using reflexive verbs."},
    {"title": "Comparative & Superlative + Adjective Endings", "focus": "Describing & Comparing", "obj": "Compare things and people, and use correct adjective endings."},
    {"title": "Perfekt (Past Tense) & Regular/Irregular Verbs", "focus": "Past Events", "obj": "Talk about the past using Perfekt with haben and sein."},
    {"title": "Konjunktiv II (würde, hätte, wäre) + Polite Requests", "focus": "Politeness & Conditionals", "obj": "Make polite requests and express wishes using Konjunktiv II."},
    {"title": "Futur I & Future Plans + Appointments (Arzt, Bank)", "focus": "Future & Appointments", "obj": "Express future plans and handle appointments."},
    {"title": "Passive Voice (werden + Partizip II) + News & Media", "focus": "Media & Passive Action", "obj": "Understand passive voice in news and describe processes."},
    {"title": "Goethe A2 Exam Prep + Mock Exam + Oral Exam Practice", "focus": "Exam Preparation", "obj": "Prepare for all sections of the Goethe A2 exam."}
]

days_content = []

day_num = 1
weeks = []
for w in range(1, 9):
    week_info = weeks_data[w-1]
    week = {
        "weekNumber": w,
        "title": f"Week {w}: {week_info['title']}",
        "objective": week_info['obj'],
        "summary": f"This week focuses on {week_info['title'].lower()}.",
        "days": []
    }
    
    for d in range(1, 8):
        is_revision = (d == 7)
        if is_revision:
            title = f"Week {w} Revision & Mock Assessment"
            focus = "Revision"
        else:
            title = f"Day {d} - {week_info['title'].split('(')[0].strip()}"
            focus = week_info['focus']
            
        day = {
            "dayNumber": day_num,
            "weekNumber": w,
            "title": title,
            "focusSkill": focus,
            "objective": f"Practice {focus.lower()} for A2 level.",
            "standardTasks": [
                {"type": "Watch", "title": "Nicos Weg Episode", "duration": "40 min", "resourceType": "PRIMARY", "link": "https://learngerman.dw.com/de/nicos-weg/c-36519789"},
                {"type": "Grammar", "title": "Grammar Exercises", "duration": "30 min", "resourceType": "SUPPLEMENTARY", "link": "https://www.deutschakademie.de/online-deutschkurs/english"},
                {"type": "Vocabulary", "title": "Anki Deck A2", "duration": "20 min", "resourceType": "VOCAB", "link": "https://apps.ankiweb.net/"},
                {"type": "Listening", "title": "Easy German Video", "duration": "20 min", "resourceType": "SUPPLEMENTARY", "link": "https://www.youtube.com/@EasyGerman"}
            ],
            "intensiveTasks": [
                {"type": "Writing", "title": "Write a short paragraph about the daily topic", "duration": "30 min"},
                {"type": "Speaking", "title": "Shadowing Easy German", "duration": "20 min"},
                {"type": "Grammar", "title": "Deep dive into today's grammar rule", "duration": "30 min"}
            ],
            "targetMetrics": {"vocab": 20, "listeningMinutes": 60, "speakingMinutes": 20, "writingTasks": 1}
        }
        
        if is_revision:
            day["standardTasks"].append({
                "type": "Practice", "title": "Goethe A2 Practice Material", "duration": "60 min", "resourceType": "PRIMARY", "link": "https://www.goethe.de/en/spr/kup/prf/prf/ga2/ueb.html"
            })
            day["intensiveTasks"].append({
                "type": "Assessment", "title": "Weekly Mock Test", "duration": "45 min"
            })
            
        if w == 8 and d >= 5:
            day["standardTasks"] = [
                {"type": "Practice", "title": "Goethe A2 Mock Exam Complete", "duration": "90 min", "resourceType": "PRIMARY", "link": "https://www.goethe.de/en/spr/kup/prf/prf/ga2/ueb.html"}
            ]
            day["intensiveTasks"] = [
                {"type": "Speaking", "title": "Oral Exam Partner Practice", "duration": "60 min"}
            ]
            
        week["days"].append(day)
        day_num += 1
        
    weeks.append(week)

data = {
    "trackId": "german-a2-ar",
    "title": "56-Day German A2 Mastery Roadmap",
    "totalWeeks": 8,
    "totalDays": 56,
    "weeks": weeks
}

js_code = f"export const CURRICULUM_DATA_A2 = {json.dumps(data, indent=2, ensure_ascii=False)};\n"

os.makedirs(r"e:\German\src\data\tracks\german-a2-ar", exist_ok=True)
with open(r"e:\German\src\data\tracks\german-a2-ar\curriculum.ts", "w", encoding="utf-8") as f:
    f.write(js_code)

print("DONE")
