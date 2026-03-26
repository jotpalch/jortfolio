#!/usr/bin/env node
/**
 * Local admin UI for managing photos and metadata.
 * Run: npm run admin → http://localhost:3001
 */

import { createServer } from "node:http";
import { readdir, readFile, writeFile, copyFile, unlink } from "node:fs/promises";
import { join, parse, extname } from "node:path";
import { execSync } from "node:child_process";

const ROOT = new URL("..", import.meta.url).pathname;
const PHOTOS_DIR = join(ROOT, "public/images/photos");
const META_PATH = join(ROOT, "src/data/photos-meta.ts");
const MANIFEST_PATH = join(ROOT, "src/data/_photos-manifest.json");
const PORT = 3001;

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".tiff"]);

// ─── Parse photos-meta.ts ──────────────────────────────
async function readMeta() {
  const content = await readFile(META_PATH, "utf-8");
  const meta = {};
  // Match each entry: "filename.jpg": { key: "value", ... },
  const re = /"([^"]+)":\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const file = m[1];
    const fields = {};
    const fieldRe = /(\w+):\s*"([^"]*)"/g;
    let fm;
    while ((fm = fieldRe.exec(m[2])) !== null) {
      fields[fm[1]] = fm[2];
    }
    meta[file] = fields;
  }
  return meta;
}

async function writeMeta(meta) {
  const entries = Object.entries(meta)
    .map(([file, data]) => {
      const fields = Object.entries(data)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join(", ");
      return `  ${JSON.stringify(file)}: { ${fields} },`;
    })
    .join("\n");

  const content = `/**
 * Manual photo metadata.
 * Key = filename. Photos are auto-discovered — this file is optional enrichment.
 * Camera from EXIF will be overridden by values here.
 */
export const photosMeta: Record<
  string,
  { alt?: string; camera?: string; film?: string; location?: string }
> = {
${entries}
};
`;
  await writeFile(META_PATH, content);
}

// ─── List photos ────────────────────────────────────────
async function listPhotos() {
  const entries = await readdir(PHOTOS_DIR, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && IMAGE_EXTS.has(extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .sort();

  let manifest = [];
  try {
    manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf-8"));
  } catch {}

  const meta = await readMeta();

  return files.map((file) => {
    const m = manifest.find((e) => e.file === file) || {};
    const pm = meta[file] || {};
    return {
      file,
      src: `/images/photos/${file}`,
      width: m.width,
      height: m.height,
      camera: pm.camera || m.camera,
      film: pm.film,
      location: pm.location,
      alt: pm.alt,
      date: m.date,
      focalLength: m.focalLength,
      aperture: m.aperture,
      shutter: m.shutter,
      iso: m.iso,
    };
  });
}

// ─── HTML UI ────────────────────────────────────────────
function html() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>jotpac Photo Admin</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, system-ui, sans-serif; background: #0c0c0c; color: #e8e0d6; min-height: 100vh; }
  .container { max-width: 1400px; margin: 0 auto; padding: 32px; }
  h1 { font-size: 22px; font-weight: 600; color: #fff; }
  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
  .actions { display: flex; gap: 10px; }
  button { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); padding: 8px 16px; border-radius: 10px; cursor: pointer; font-size: 12px; transition: all 0.15s; backdrop-filter: blur(10px); }
  button:hover { background: rgba(255,255,255,0.12); color: #fff; }
  .btn-primary { background: rgba(196,114,90,0.25); border-color: rgba(196,114,90,0.4); }
  .btn-primary:hover { background: rgba(196,114,90,0.4); }
  .btn-danger { background: rgba(255,60,60,0.15); border-color: rgba(255,60,60,0.25); color: rgba(255,100,100,0.8); }
  .drop-zone { border: 2px dashed rgba(255,255,255,0.1); border-radius: 16px; padding: 48px; text-align: center; color: rgba(255,255,255,0.3); margin-bottom: 32px; transition: all 0.2s; font-size: 13px; cursor: pointer; }
  .drop-zone:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.5); }
  .drop-zone.over { border-color: rgba(196,114,90,0.5); background: rgba(196,114,90,0.08); color: #fff; }
  .drop-icon { font-size: 32px; margin-bottom: 8px; opacity: 0.4; }

  /* Roll groups */
  .roll-group { margin-bottom: 32px; }
  .roll-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding: 12px 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; cursor: pointer; transition: all 0.15s; }
  .roll-header:hover { background: rgba(255,255,255,0.06); }
  .roll-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8); }
  .roll-meta { font-size: 11px; color: rgba(255,255,255,0.35); }
  .roll-count { font-size: 10px; background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 10px; color: rgba(255,255,255,0.5); }
  .roll-select { margin-left: auto; font-size: 11px; }

  /* Photo grid */
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
  .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; transition: all 0.15s; position: relative; }
  .card:hover { border-color: rgba(255,255,255,0.12); background: rgba(255,255,255,0.05); }
  .card.selected { border-color: rgba(196,114,90,0.5); background: rgba(196,114,90,0.08); }
  .card img { width: 100%; height: 220px; object-fit: cover; display: block; }
  .card-check { position: absolute; top: 10px; left: 10px; width: 22px; height: 22px; border-radius: 6px; border: 2px solid rgba(255,255,255,0.3); background: rgba(0,0,0,0.5); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; z-index: 2; }
  .card-check:hover { border-color: rgba(255,255,255,0.6); }
  .card.selected .card-check { background: rgba(196,114,90,0.8); border-color: rgba(196,114,90,0.8); }
  .card.selected .card-check::after { content: "✓"; color: #fff; font-size: 12px; font-weight: bold; }
  .card-body { padding: 14px; }
  .card-body .filename { font-size: 10px; color: rgba(255,255,255,0.2); margin-bottom: 6px; font-family: monospace; }
  .card-body .exif { font-size: 10px; color: rgba(255,255,255,0.35); margin-bottom: 10px; }
  .field { margin-bottom: 8px; }
  .field label { display: block; font-size: 10px; color: rgba(255,255,255,0.4); margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.5px; }
  .field input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #fff; padding: 7px 10px; border-radius: 8px; font-size: 12px; transition: all 0.15s; }
  .field input:focus { outline: none; border-color: rgba(196,114,90,0.4); background: rgba(255,255,255,0.06); }
  .field input::placeholder { color: rgba(255,255,255,0.2); }
  .card-actions { display: flex; gap: 6px; margin-top: 10px; }
  .card-actions button { font-size: 10px; padding: 4px 10px; border-radius: 6px; }

  /* Batch bar */
  .batch-bar { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(15,15,15,0.95); backdrop-filter: blur(20px); border-top: 1px solid rgba(255,255,255,0.08); padding: 14px 32px; display: none; align-items: center; gap: 12px; z-index: 100; }
  .batch-bar.show { display: flex; }
  .batch-count { font-size: 12px; color: rgba(255,255,255,0.6); min-width: 100px; }
  .batch-bar .field { margin: 0; flex: 1; max-width: 200px; }
  .batch-bar .field input { font-size: 11px; padding: 6px 10px; }
  .batch-bar button { font-size: 11px; }

  /* Toast */
  .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(20px); background: rgba(20,20,20,0.95); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.1); padding: 10px 24px; border-radius: 12px; font-size: 12px; opacity: 0; transition: all 0.3s; z-index: 200; pointer-events: none; }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Photo Admin</h1>
    <div class="actions">
      <button onclick="optimize()" class="btn-primary">Optimize</button>
      <button onclick="publish()" class="btn-primary">Publish</button>
      <button onclick="location.reload()">Refresh</button>
    </div>
  </div>

  <div class="drop-zone" id="dropZone">
    <div class="drop-icon">+</div>
    Drop photos here or click to upload
  </div>

  <div id="photoGroups"></div>
</div>

<div class="batch-bar" id="batchBar">
  <span class="batch-count" id="batchCount">0 selected</span>
  <div class="field">
    <input id="batchFilm" list="filmList" placeholder="Set film...">
  </div>
  <div class="field">
    <input id="batchCamera" placeholder="Set camera...">
  </div>
  <div class="field">
    <input id="batchLocation" placeholder="Set location...">
  </div>
  <button class="btn-primary" onclick="applyBatch()">Apply</button>
  <button onclick="clearSelection()">Clear</button>
  <button class="btn-danger" onclick="deleteBatch()">Delete</button>
  <datalist id="filmList"></datalist>
</div>

<div class="toast" id="toast"></div>

<script>
const $ = (s) => document.querySelector(s);
const selected = new Set();

const FILM_STOCKS = [
  "Kodak Portra 400", "Kodak Portra 160", "Kodak Gold 200", "Kodak ColorPlus 200",
  "Kodak Ektar 100", "Kodak Ultramax 400", "Fuji Superia 400", "Fuji C200",
  "Fuji Pro 400H", "Ilford HP5 Plus 400", "Ilford Delta 3200",
];

function toast(msg, duration = 2500) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), duration);
}

function updateBatchBar() {
  const bar = $("#batchBar");
  if (selected.size > 0) {
    bar.classList.add("show");
    $("#batchCount").textContent = selected.size + " selected";
  } else {
    bar.classList.remove("show");
  }
  document.querySelectorAll(".card").forEach((c) => {
    c.classList.toggle("selected", selected.has(c.dataset.file));
  });
}

function toggleSelect(file) {
  if (selected.has(file)) selected.delete(file); else selected.add(file);
  updateBatchBar();
}

function selectRoll(prefix) {
  document.querySelectorAll(".card").forEach((c) => {
    if (c.dataset.file.startsWith(prefix)) selected.add(c.dataset.file);
  });
  updateBatchBar();
}

function clearSelection() {
  selected.clear();
  updateBatchBar();
}

async function applyBatch() {
  const film = $("#batchFilm").value;
  const camera = $("#batchCamera").value;
  const loc = $("#batchLocation").value;
  if (!film && !camera && !loc) return toast("Fill at least one field");
  for (const file of selected) {
    if (film) await fetch("/api/meta", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({file, field:"film", value:film}) });
    if (camera) await fetch("/api/meta", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({file, field:"camera", value:camera}) });
    if (loc) await fetch("/api/meta", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({file, field:"location", value:loc}) });
  }
  toast("Updated " + selected.size + " photos");
  $("#batchFilm").value = ""; $("#batchCamera").value = ""; $("#batchLocation").value = "";
  clearSelection();
  loadPhotos();
}

async function deleteBatch() {
  if (!confirm("Delete " + selected.size + " photos?")) return;
  for (const file of selected) {
    await fetch("/api/photos/" + encodeURIComponent(file), { method: "DELETE" });
  }
  toast("Deleted " + selected.size + " photos");
  clearSelection();
  loadPhotos();
}

function groupPhotos(photos) {
  const groups = {};
  for (const p of photos) {
    let key, prefix;
    if (p.file.match(/^[Rr]/)) {
      // GR3x: group by date
      key = p.date ? "GR3x — " + p.date : "GR3x";
      prefix = "R";
    } else if (p.file.match(/^\\d{6,}/)) {
      // Film scan: first 6 digits = roll number
      prefix = p.file.slice(0, 6);
      key = "Roll " + prefix;
    } else {
      prefix = p.file.replace(/\\.[^.]+$/, "");
      key = prefix;
    }
    if (!groups[key]) groups[key] = { photos: [], prefix, film: "" };
    groups[key].photos.push(p);
    if (p.film && !groups[key].film) groups[key].film = p.film;
  }
  return groups;
}

async function loadPhotos() {
  const res = await fetch("/api/photos");
  const photos = await res.json();
  const groups = groupPhotos(photos);

  // Film datalist
  const usedFilms = [...new Set(photos.map((p) => p.film).filter(Boolean))];
  const allFilms = [...new Set([...usedFilms, ...FILM_STOCKS])];
  $("#filmList").innerHTML = allFilms.map((f) => \`<option value="\${f}">\`).join("");

  // Sort groups by date descending (newest first)
  const sortedGroups = Object.entries(groups).sort(([, a], [, b]) => {
    const dateA = a.photos.reduce((d, p) => p.date && p.date > d ? p.date : d, "");
    const dateB = b.photos.reduce((d, p) => p.date && p.date > d ? p.date : d, "");
    return dateB.localeCompare(dateA) || 0;
  });

  const container = $("#photoGroups");
  container.innerHTML = sortedGroups.map(([name, group]) => \`
    <div class="roll-group">
      <div class="roll-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'grid' : 'none'">
        <span class="roll-title">\${name}</span>
        \${group.film ? \`<span class="roll-meta">\${group.film}</span>\` : ""}
        <span class="roll-count">\${group.photos.length}</span>
        <button class="roll-select" onclick="event.stopPropagation(); selectRoll('\${group.prefix}')">Select all</button>
      </div>
      <div class="grid">
        \${group.photos.map((p) => \`
          <div class="card \${selected.has(p.file) ? "selected" : ""}" data-file="\${p.file}">
            <div class="card-check" onclick="event.stopPropagation(); toggleSelect('\${p.file}')"></div>
            <img src="/photos/opt/\${p.file.replace(/\\.[^.]+$/, "")}-sm.webp"
                 onerror="this.src='/photos/\${p.file}'" loading="lazy">
            <div class="card-body">
              <div class="filename">\${p.file}</div>
              <div class="exif">\${[p.focalLength, p.aperture, p.shutter, p.iso, p.date].filter(Boolean).join(" · ")}</div>
              <div class="field">
                <label>Camera</label>
                <input value="\${p.camera || ""}" data-field="camera" onchange="saveMeta('\${p.file}', this)">
              </div>
              <div class="field">
                <label>Film</label>
                <input value="\${p.film || ""}" data-field="film" list="filmList" onchange="saveMeta('\${p.file}', this)" placeholder="Select or type">
              </div>
              <div class="field">
                <label>Location</label>
                <input value="\${p.location || ""}" data-field="location" onchange="saveMeta('\${p.file}', this)" placeholder="e.g. Taipei">
              </div>
              <div class="field">
                <label>Alt</label>
                <input value="\${p.alt || ""}" data-field="alt" onchange="saveMeta('\${p.file}', this)" placeholder="Description">
              </div>
              <div class="card-actions">
                <button class="btn-danger" onclick="deletePhoto('\${p.file}')">Delete</button>
              </div>
            </div>
          </div>
        \`).join("")}
      </div>
    </div>
  \`).join("");
}

async function saveMeta(file, input) {
  await fetch("/api/meta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file, field: input.dataset.field, value: input.value }),
  });
  toast("Saved");
}

async function deletePhoto(file) {
  if (!confirm("Delete " + file + "?")) return;
  await fetch("/api/photos/" + encodeURIComponent(file), { method: "DELETE" });
  toast("Deleted");
  loadPhotos();
}

async function optimize() {
  toast("Optimizing...", 0);
  const res = await fetch("/api/optimize", { method: "POST" });
  const data = await res.json();
  toast(data.message);
  loadPhotos();
}

async function publish() {
  toast("Publishing...", 0);
  const res = await fetch("/api/publish", { method: "POST" });
  const data = await res.json();
  toast(data.message);
}

// Upload
const dz = $("#dropZone");
dz.addEventListener("dragover", (e) => { e.preventDefault(); dz.classList.add("over"); });
dz.addEventListener("dragleave", () => dz.classList.remove("over"));
async function uploadFiles(files) {
  const imgs = files.filter((f) => f.type.startsWith("image/"));
  if (!imgs.length) return;
  toast("Uploading " + imgs.length + "...", 0);
  for (const f of imgs) {
    await fetch("/api/upload/" + encodeURIComponent(f.name), {
      method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: await f.arrayBuffer(),
    });
  }
  toast("Uploaded " + imgs.length + " — click Optimize");
  loadPhotos();
}
dz.addEventListener("drop", (e) => { e.preventDefault(); dz.classList.remove("over"); uploadFiles([...e.dataTransfer.files]); });
dz.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file"; input.multiple = true; input.accept = "image/*";
  input.onchange = () => uploadFiles([...input.files]);
  input.click();
});

loadPhotos();
</script>
</body>
</html>`;
}

// ─── Server ─────────────────────────────────────────────
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  try {
    // Static: serve photos
    if (path.startsWith("/photos/")) {
      const filePath = join(ROOT, "public/images", path.replace("/photos/", "photos/"));
      try {
        const data = await readFile(filePath);
        const ext = extname(filePath).toLowerCase();
        const types = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
        res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end("Not found");
      }
      return;
    }

    // API: list photos
    if (path === "/api/photos" && req.method === "GET") {
      const photos = await listPhotos();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(photos));
      return;
    }

    // API: save meta field
    if (path === "/api/meta" && req.method === "POST") {
      const body = await readBody(req);
      const { file, field, value } = JSON.parse(body);
      const meta = await readMeta();
      if (!meta[file]) meta[file] = {};
      if (value) {
        meta[file][field] = value;
      } else {
        delete meta[file][field];
      }
      await writeMeta(meta);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    // API: upload photo
    if (path.startsWith("/api/upload/") && req.method === "POST") {
      const filename = decodeURIComponent(path.split("/").pop());
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const buf = Buffer.concat(chunks);
      await writeFile(join(PHOTOS_DIR, filename), buf);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, file: filename }));
      return;
    }

    // API: delete photo
    if (path.startsWith("/api/photos/") && req.method === "DELETE") {
      const filename = decodeURIComponent(path.split("/").pop());
      try {
        await unlink(join(PHOTOS_DIR, filename));
        // Also remove optimized versions
        const name = parse(filename).name;
        await unlink(join(PHOTOS_DIR, "opt", `${name}-sm.webp`)).catch(() => {});
        await unlink(join(PHOTOS_DIR, "opt", `${name}-lg.webp`)).catch(() => {});
        // Remove from meta
        const meta = await readMeta();
        delete meta[filename];
        await writeMeta(meta);
      } catch {}
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    // API: optimize
    if (path === "/api/optimize" && req.method === "POST") {
      try {
        execSync("npm run optimize", { cwd: ROOT, stdio: "pipe" });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Optimized!" }));
      } catch (e) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Optimize failed: " + e.message }));
      }
      return;
    }

    // API: publish
    if (path === "/api/publish" && req.method === "POST") {
      try {
        execSync("npm run optimize", { cwd: ROOT, stdio: "pipe" });
        execSync('git add public/images/photos src/data && git commit -m "Update photos" && git push', { cwd: ROOT, stdio: "pipe" });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Published!" }));
      } catch (e) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Publish failed: " + e.stderr?.toString() || e.message }));
      }
      return;
    }

    // Default: serve HTML
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html());
  } catch (e) {
    res.writeHead(500);
    res.end("Error: " + e.message);
  }
});

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => resolve(body));
  });
}

server.listen(PORT, () => {
  console.log(`\n  Photo Admin → http://localhost:${PORT}\n`);
});
