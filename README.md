# NSB Fund Utilization Tracking Module — Demo

Demo of the Digital Fund Utilization Tracking Module for the Non-Salary Budget (NSB) of Punjab public schools (PMIU-PESRP, School Education Department, Government of the Punjab — GRADES Project, Trigger 2).

This is a standalone demo. It is NOT connected to the live SIS or IMIS systems. Real SIS/IMIS integration needs the PMIU SIS/IMIS API.

What it covers:
- School-wise NSB allocations via a configurable formula, with previous-year unspent balance carried forward
- Releases from SED to DEA to school, with bank reference and school acknowledgement
- School spending with mandatory receipt upload, automatic cash book, and automatic flags
- Post-facto district review
- Province, district and school dashboards and reports (CSV export, print to PDF)
- Deliverables D-1 to D-11 with 20% / 50% / 30% payment milestones
- Role-based access and audit trail

Sample data is labelled SAMPLE. Entries are stored in the browser (localStorage) in this demo. A shared database (Supabase) can be connected later.
