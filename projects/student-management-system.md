# Project: Student Management System — a Programming Fundamentals (PF) Java console app: student record CRUD in a single file

## Facts
- Repo: `abduIwahid/Student-management-System`, `main`. Root holds a
  2-line README + folder `Student Management System/` containing
  `pfproject.java` (5.8 KB, the entire program), plus the coursework
  report as .docx (31 KB) and .pdf (195 KB).
- The program: one public class, static parallel `ArrayList`s for ids,
  names, ages, programs, semesters and per-student marks arrays.
  Console menu: 1 Add, 2 View All, 3 Search by ID, 4 Delete by ID,
  5 Exit, with try/catch input validation.
- Two README-vs-code mismatches, verified in source: the README says
  the project uses **File Handling** — the code contains no file I/O
  at all, records vanish when the program exits. The README also
  promises **Update** — the menu has no update option.
- No LICENSE, no run instructions, no screenshot.

## Strengths
- Exactly what a PF project should be: readable, menu-driven,
  defensive about bad input (InputMismatchException handled, invalid
  menu choices rejected) — appropriate scope for a first-semester
  programming course, and the full report (PDF + DOCX) is included.
- It is an honest marker of where he started; kept alongside his
  current ML work it quietly shows growth.

## Weaknesses / risks
- The two README overclaims (file handling, update) are the kind of
  detail a teacher or recruiter can falsify in 30 seconds — they cost
  more credibility than the modest scope ever would.
- Single-file, parallel-array design is correct for PF level but reads
  as a beginner artifact next to his 2026 projects; it should be
  framed as coursework, not presented as a "system".
- Data structure smell for anyone skimming: parallel lists instead of
  a Student class — normal at PF stage, worth one line of context.

## Improvement plan (prioritized)
1. **Correct the README** — either drop "File Handling" and "Update"
   from the description, or (better, ~1 hour) actually add them:
   save/load records to a text/CSV file on exit/start and an
   Update-by-ID menu option. Then the README is true and the project
   is genuinely complete for its level.
2. Add run instructions (`javac pfproject.java && java pfproject`)
   and one console screenshot.
3. Add an MIT LICENSE.
4. Then archive as PF coursework — no refactoring into classes/DB;
   its value is as an honest early milestone, and his portfolio's
   front line is his ML work now.

## Audit — 2026-10-24 (GitHub-wide review)
Verdict: fine first-semester coursework with a README that promises
two features the code doesn't have. Fix the words (or add the two
small features), add a license, and let it rest as an archived
milestone.
