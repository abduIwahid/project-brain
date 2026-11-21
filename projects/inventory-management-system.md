# Project: Inventory Management System — an OOP-course Java console app (NetBeans) with warehouses, suppliers and stock issue/receive

## Facts
- Repo: `abduIwahid/Inventory-Management-System`, `main`. Root holds a
  2-line README + one folder `Inventory Management System/` with a
  classic NetBeans project layout (`build.xml`, `nbproject/`,
  `manifest.mf`, `src/`, committed `build/` and `dist/` folders).
- Source: `src/project/` — 8 small classes (~7 KB total):
  InventorySystem (core logic), Inventory_Management_System (main),
  Product (encapsulated: SKU, name, category, quantity, price),
  Warehouse, Supplier, Person → Manager (inheritance),
  AppConstants. Plus a `UML/` folder and a 521 KB Report.pdf.
- Behaviour (from code): in-memory only. Warehouses keyed by name in a
  LinkedHashMap; issueProduct validates warehouse/product/stock
  before decrementing; receiveStock increments. Console output —
  **no GUI and no persistence**, despite the README claiming a
  "structured GUI" and "real-time inventory tracking".
- No LICENSE, no run instructions, no screenshots.

## Strengths
- Clean textbook OOP, honestly structured: encapsulation in Product,
  inheritance Person→Manager, composition in InventorySystem, and
  defensive checks in issue/receive logic. Reads well as coursework.
- Includes the project report PDF and UML diagrams — the full
  coursework package, not just code.

## Weaknesses / risks
- README overclaims (GUI, real-time tracking) against a console,
  in-memory program — the fastest way to lose a reviewer's trust.
- NetBeans build output (`build/`, `dist/`) is committed to git —
  repo hygiene noise; no `.gitignore`.
- Data evaporates on exit: no file/DB persistence caps its usefulness
  as anything beyond an OOP demonstration.
- 2-line README tells a visitor none of the above.

## Improvement plan (prioritized)
1. **Fix the README to tell the truth, well:** console-based OOP
   demonstration; class list with what each demonstrates (inheritance,
   encapsulation, composition); how to run (open in NetBeans or
   `javac` the `src/project` package); one console screenshot.
2. Add `.gitignore` and remove `build/` + `dist/` from tracking.
3. Add an MIT LICENSE.
4. Optional, only if he wants a Java piece with life beyond
   coursework: add CSV file persistence for products/stock — a
   half-day change that makes it a real (if small) tool. Otherwise
   archive proudly as OOP coursework; do not build a GUI for it.

## Audit — 2026-10-24 (GitHub-wide review)
Verdict: tidy OOP coursework wearing an inflated README. An honest
README + .gitignore makes it a clean, credible archive piece; further
features are optional, not needed.
