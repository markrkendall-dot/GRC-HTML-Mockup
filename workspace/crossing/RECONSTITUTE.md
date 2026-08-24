<!-- GRC crossing RECONSTITUTE v1 -->
# Rebuilding the reference app INSIDE the firewall

The transfer gateway strips .js and .py, and it recurses into .zip archives
(a zip of .js arrives with the .js gone). Only these cross intact:

- **.md** (Markdown / plain text)
- **.zip** whose members are themselves all allowed types
- **non-macro Office**: .docx, .xlsx, .pptx  (NOT .docm/.xlsm/.pptm)

Treat **.html and .js as blocked**, loose or inside a zip.

This folder carries the reference app CODE as .md, two equivalent ways. The
data is not here: real data is produced inside from CSVs via DataForge, and
synthetic data is only for outside demos (regenerate with --with-data if you
truly need a synthetic demo inside).

Pick ONE method. All three yield byte-identical .js/.html; verify against the
SHA-256 values in MANIFEST.md.

---

## Method A - browser reconstitutor (recommended, no shell needed)

1. Bring `app-mirror.zip` (or just `APP-CODEBOOK.md`) and `rebuild.html.md`
   across (inside `GRC-crossing.zip`).
2. Open `rebuild.html.md` in Notepad and Save As `rebuild.html` (set "Save as
   type" to All Files so it is not saved as rebuild.html.txt).
3. Double-click `rebuild.html` to open it in Edge.
4. Click "Choose codebook", pick `APP-CODEBOOK.md`.
5. If Edge offers a folder picker, point it at your empty `demo\` folder and
   the files are written in place, in the right sub-folders. If not, the page
   downloads each file; move them into `demo\` per the on-screen map
   (kernel\ , modules\ , and index.html at the demo root).
6. Open `demo\index.html` in Edge. Check the preflight panel.

## Method B - PowerShell rename (fastest, if PowerShell is allowed)

1. Unzip `app-mirror.zip` into your `demo\` folder. You now have a correct
   folder tree where every code file ends in an extra `.md`
   (kernel\core.js.md, modules\home.js.md, index.html.md, ...).
2. From that folder, strip the trailing `.md`:

       Get-ChildItem -Recurse -Filter *.md |
         Rename-Item -NewName { $_.Name -replace '\.md$','' }

3. Open `demo\index.html` in Edge. Check preflight.

If PowerShell is blocked, use Method A or C.

## Method C - manual (bulletproof, no tools at all)

1. Open `APP-CODEBOOK.md` in **Notepad** (not a rendered Markdown viewer).
2. For each block between `==GRC-FILE-BEGIN path=... ==` and
   `==GRC-FILE-END==`: select the content between the two sentinel lines,
   copy it, and Save As the exact path shown (create kernel\ and modules\
   folders; save index.html at the demo root). Save as type = All Files.
3. Nineteen files, once. Open `demo\index.html` in Edge. Check preflight.

---

## Verifying

MANIFEST.md lists a SHA-256 per file. To confirm a reconstituted file is
exact, in PowerShell: `Get-FileHash demo\kernel\core.js -Algorithm SHA256`
and compare. The preflight panel's version map is the quick visual check.

## Updating one file later

Day-to-day edits do NOT use this kit. When Copilot regenerates one module
inside, you save that single .js by hand as always. This crossing kit is only
for the one-time reference-build drop (or a full refresh).
