/* MATHE adaptive Nachbearbeitung
   Saubere Version mit G05 und G07
*/

let score = 0;
let solved = 0;
let total = 6;
let questions = [];
let tries = [];
let done = [];

const url = new URL(window.location.href);
const typ = url.searchParams.get("typ") || "linear-folge";
const nParam = Number(url.searchParams.get("n"));

if (Number.isInteger(nParam) && nParam > 0 && nParam <= 20) {
  total = nParam;
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[rand(0, arr.length - 1)];
}

function clean(input) {
  return String(input)
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("·", "*")
    .replaceAll("−", "-")
    .replaceAll("–", "-")
    .replaceAll("²", "^2")
    .replaceAll("n", "x");
}

function parseNumber(input) {
  const value = Number(clean(input).replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

function parseLinearTerm(input) {
  let s = clean(input).replaceAll("*x", "x");
  if (!s.startsWith("+") && !s.startsWith("-")) s = "+" + s;

  const parts = s.match(/[+-][^+-]+/g);
  if (!parts) return null;

  let a = 0;
  let b = 0;

  for (const part of parts) {
    const sign = part[0] === "-" ? -1 : 1;
    const body = part.slice(1);

    if (body.includes("x")) {
      let coeff = body.replace("x", "");
      if (coeff === "") coeff = "1";
      const num = Number(coeff);
      if (Number.isNaN(num)) return null;
      a += sign * num;
    } else {
      const num = Number(body);
      if (Number.isNaN(num)) return null;
      b += sign * num;
    }
  }

  return { a, b };
}

function ok(value, answer) {
  if (typeof answer === "object" && answer.kind === "linear") {
    const got = parseLinearTerm(value);
    return got && got.a === answer.a && got.b === answer.b;
  }

  if (typeof answer === "number") {
    return parseNumber(value) === answer;
  }

  return clean(value) === clean(answer);
}

function linearTermText(a, b, variable = "n") {
  let s = "";

  if (a === 1) s = variable;
  else if (a === -1) s = "-" + variable;
  else s = a + variable;

  if (b > 0) s += "+" + b;
  if (b < 0) s += b;

  return s;
}

function sequenceTable(values, options = {}) {
  const columns = options.columns || [1, 2, 3, 4, 5, 50, "n"];
  const label = options.label || "T(n)";
  const hidden = new Set(options.hidden || []);

  const top = columns.map(col => `<th>${col}</th>`).join("");
  const bottom = columns.map(col => {
    if (hidden.has(String(col))) return `<td class="question">?</td>`;
    return `<td>${values[col]}</td>`;
  }).join("");

  return `
    <table class="sequence-table">
      <tr><th>n</th>${top}</tr>
      <tr><th>${label}</th>${bottom}</tr>
    </table>
  `;
}

/* G05 LINEARE ZAHLENFOLGEN */

function makeLinearValues(a, b) {
  const values = {};
  [1, 2, 3, 4, 5, 6, 10, 50, 100, 150].forEach(n => {
    values[n] = a * n + b;
  });
  values.n = linearTermText(a, b);
  return values;
}

function genLinearFindTerm() {
  const a = rand(2, 8);
  const b = rand(-9, 9);
  const values = makeLinearValues(a, b);

  return {
    badge: "G05 · Term bestimmen",
    ziel: "Aus einer Wertetabelle den Term einer linearen Folge bestimmen.",
    text: `
      <p>Die Folge wächst regelmässig. Ergänze den Term.</p>
      ${sequenceTable(values, { hidden: ["5", "50", "n"] })}
    `,
    ask: "Bestimme den Term T(n). Beispiel: 4n-1",
    answer: { kind: "linear", a, b },
    hint1: "Vergleiche zwei benachbarte Werte.",
    hint2: `Die Differenz ist ${a}. Der Term beginnt mit ${a}n.`,
    hint3: `Setze n = 1 ein und vergleiche mit dem ersten Wert.`,
    solution: `Der Term lautet <strong>T(n) = ${values.n}</strong>.`
  };
}

/* G07 FIGURENFOLGEN */

function squareSvg(count, mode) {
  const size = 16;
  const gap = 2;
  const cells = [];

  function add(x, y) {
    cells.push({ x, y });
  }

  if (mode === "bar") {
    for (let i = 0; i < count; i++) add(i, 0);
  }

  if (mode === "l") {
    for (let i = 0; i < count; i++) add(i, 0);
    for (let j = 1; j < count; j++) add(0, j);
  }

  if (mode === "stair") {
    for (let r = 0; r < count; r++) {
      for (let c = 0; c <= r; c++) add(c, r);
    }
  }

  if (mode === "frame") {
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        if (x === 0 || y === 0 || x === count - 1 || y === count - 1) {
          add(x, y);
        }
      }
    }
  }

  const maxX = Math.max(...cells.map(c => c.x), 0);
  const maxY = Math.max(...cells.map(c => c.y), 0);
  const w = (maxX + 1) * (size + gap) + gap;
  const h = (maxY + 1) * (size + gap) + gap;

  const rects = cells.map(c =>
    `<rect x="${gap + c.x * (size + gap)}" y="${gap + c.y * (size + gap)}" width="${size}" height="${size}" rx="3"></rect>`
  ).join("");

  return `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <g fill="currentColor">${rects}</g>
    </svg>
  `;
}

function figureGallery(figures) {
  return `
    <div class="figure-stage">
      <div class="figure-row">
        ${figures.map(f => `
          <div class="figure-card">
            <strong>Figur ${f.n}</strong>
            ${f.svg}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function genFigureBar() {
  const a = rand(3, 6);
  const b = rand(-2, 4);
  const values = makeLinearValues(a, b);

  const figures = [1, 2, 3].map(n => ({
    n,
    svg: squareSvg(values[n], "bar")
  }));

  return {
    badge: "G07 · Figurenfolge",
    ziel: "Aus einer wachsenden Figur einen linearen Term bestimmen.",
    text: `
      <p>Die Figuren bestehen aus Quadraten.</p>
      ${figureGallery(figures)}
      ${sequenceTable(values, { columns: [1, 2, 3, 10, 50, "n"], hidden: ["10", "50", "n"], label: "Quadrate" })}
    `,
    ask: "Bestimme den Term für Figur n.",
    answer: { kind: "linear", a, b },
    hint1: "Zähle die Quadrate in Figur 1, 2 und 3.",
    hint2: `Von Figur zu Figur kommen immer ${a} Quadrate dazu.`,
    hint3: `Der Term beginnt mit ${a}n.`,
    solution: `Der Term lautet <strong>${values.n}</strong>.`
  };
}

function genFigureL() {
  const values = {};
  [1, 2, 3, 4, 5, 10, 50].forEach(n => values[n] = 2 * n - 1);
  values.n = "2n-1";

  const figures = [1, 2, 3].map(n => ({
    n,
    svg: squareSvg(n, "l")
  }));

  return {
    badge: "G07 · L-Figur",
    ziel: "Eine L-Figur als Term beschreiben.",
    text: `
      <p>Die Figuren wachsen als L-Form.</p>
      ${figureGallery(figures)}
      ${sequenceTable(values, { columns: [1, 2, 3, 10, 50, "n"], hidden: ["10", "50", "n"], label: "Quadrate" })}
    `,
    ask: "Bestimme den Term für Figur n.",
    answer: { kind: "linear", a: 2, b: -1 },
    hint1: "Die Ecke wird von beiden Armen gemeinsam benutzt.",
    hint2: "Zwei Arme mit Länge n ergeben 2n.",
    hint3: "Das Eckquadrat wurde doppelt gezählt.",
    solution: `Der Term lautet <strong>2n-1</strong>.`
  };
}

function genFigureStair() {
  const values = {};
  [1, 2, 3, 4, 5, 10, 50].forEach(n => {
    values[n] = n * (n + 1) / 2;
  });
  values.n = "n(n+1):2";

  const figures = [1, 2, 3, 4].map(n => ({
    n,
    svg: squareSvg(n, "stair")
  }));

  return {
    badge: "G07 · Treppenfigur",
    ziel: "Eine treppenartige Figurenfolge berechnen.",
    text: `
      <p>Die Figur wächst treppenartig.</p>
      ${figureGallery(figures)}
      ${sequenceTable(values, { columns: [1, 2, 3, 4, 5, 10, "n"], hidden: ["5", "10", "n"], label: "Quadrate" })}
    `,
    ask: "Wie viele Quadrate hat Figur 10?",
    answer: values[10],
    hint1: "Zähle die Quadrate zeilenweise.",
    hint2: "Figur 4 besteht aus 1+2+3+4 Quadraten.",
    hint3: "Für Figur 10 rechnest du 1+2+...+10.",
    solution: `Figur 10 hat 10·11:2 = <strong>${values[10]}</strong> Quadrate.`
  };
}

function genFigureFrame() {
  const values = {};
  [1, 2, 3, 4, 5, 10, 50].forEach(n => {
    values[n] = 4 * n + 4;
  });
  values.n = "4n+4";

  const figures = [1, 2, 3].map(n => ({
    n,
    svg: squareSvg(n + 2, "frame")
  }));

  return {
    badge: "G07 · Rahmenfigur",
    ziel: "Eine Rahmenfigur geschickt zerlegen.",
    text: `
      <p>Die Figuren bestehen aus einem quadratischen Rahmen.</p>
      ${figureGallery(figures)}
      ${sequenceTable(values, { columns: [1, 2, 3, 10, 50, "n"], hidden: ["10", "50", "n"], label: "Quadrate" })}
    `,
    ask: "Bestimme den Term für Figur n.",
    answer: { kind: "linear", a: 4, b: 4 },
    hint1: "Schau auf die vier Seiten des Rahmens.",
    hint2: "Von Figur zu Figur kommen immer 4 Quadrate dazu.",
    hint3: "Der Term beginnt mit 4n.",
    solution: `Der Term lautet <strong>4n+4</strong>.`
  };
}

/* TRAININGS */

const pools = {
  "linear-folge": {
    title: "G05 · Lineare Zahlenfolgen",
    info: "Wertetabellen, Terme und fehlende Werte.",
    generators: [genLinearFindTerm]
  },

  "figurenfolge": {
    title: "G07 · Figurenfolgen",
    info: "Dynamische Figurenfolgen mit Quadraten.",
    generators: [genFigureBar, genFigureL, genFigureStair, genFigureFrame]
  },

  "startklar": {
    title: "Startklar · Vom Bild zum Term",
    info: "Vorläufiger Mix.",
    generators: [genLinearFindTerm, genFigureBar, genFigureL, genFigureStair]
  },

  "lk": {
    title: "Lernkontrolle · Vom Bild zum Term",
    info: "Vorläufiger Mix.",
    generators: [genLinearFindTerm, genFigureBar, genFigureL, genFigureFrame]
  },

  "test": {
    title: "Test · Vom Bild zum Term",
    info: "Vorläufiger Mix.",
    generators: [genLinearFindTerm, genFigureBar, genFigureStair, genFigureFrame]
  }
};

function getPool() {
  return pools[typ] || pools["linear-folge"];
}

function newTraining() {
  const pool = getPool();

  document.getElementById("pageTitle").innerText = pool.title;
  document.getElementById("trainerTitle").innerText = pool.title;
  document.getElementById("trainerInfo").innerText = pool.info;

  score = 0;
  solved = 0;
  questions = [];
  tries = Array(total).fill(0);
  done = Array(total).fill(false);

  document.getElementById("aufgaben").innerHTML = "";
  document.getElementById("result").hidden = true;
  document.getElementById("bar").style.width = "0%";
  document.getElementById("progressText").innerText = `0 / ${total}`;

  for (let i = 0; i < total; i++) {
    const q = pick(pool.generators)();
    questions.push(q);

    const el = document.createElement("article");
    el.className = "task";

    el.innerHTML = `
      <div class="task-top">
        <div>
          <span class="badge">${q.badge}</span>
          <h2>Übung ${i + 1}</h2>
          <p class="goal">${q.ziel}</p>
        </div>
      </div>

      <div class="prompt">${q.text}</div>

      <p><strong>${q.ask}</strong></p>

      <div class="answer-row">
        <input id="input${i}" autocomplete="off" placeholder="Antwort eingeben">
        <button id="btn${i}" type="button" onclick="check(${i})">Überprüfen</button>
      </div>

      <div id="feedback${i}" class="feedback" hidden></div>
    `;

    document.getElementById("aufgaben").appendChild(el);
  }
}

function check(i) {
  if (done[i]) return;

  const input = document.getElementById("input" + i);
  const button = document.getElementById("btn" + i);
  const feedback = document.getElementById("feedback" + i);
  const q = questions[i];

  feedback.hidden = false;
  feedback.className = "feedback";

  if (input.value.trim() === "") {
    feedback.classList.add("hint");
    feedback.innerHTML = "Bitte zuerst eine Antwort eingeben.";
    return;
  }

  if (ok(input.value, q.answer)) {
    done[i] = true;
    solved++;
    if (tries[i] === 0) score++;

    feedback.classList.add("good");
    feedback.innerHTML = "✅ Richtig!";
    input.disabled = true;
    button.disabled = true;
  } else {
    tries[i]++;

    if (tries[i] === 1) {
      feedback.classList.add("hint");
      feedback.innerHTML = "❌ Noch nicht.<br><strong>Tipp 1:</strong> " + q.hint1;
    } else if (tries[i] === 2) {
      feedback.classList.add("hint");
      feedback.innerHTML = "❌ Noch nicht.<br><strong>Tipp 2:</strong> " + q.hint2;
    } else if (tries[i] === 3) {
      feedback.classList.add("hint");
      feedback.innerHTML = "❌ Noch nicht.<br><strong>Tipp 3:</strong> " + q.hint3;
    } else {
      feedback.classList.add("bad");
      feedback.innerHTML = "❌ Noch nicht.<div class='solution'>✅ " + q.solution + "</div>";
    }

    input.focus();
    input.select();
  }

  document.getElementById("bar").style.width = (solved / total * 100) + "%";
  document.getElementById("progressText").innerText = `${solved} / ${total}`;

  if (solved === total) {
    const result = document.getElementById("result");
    result.hidden = false;
    result.innerHTML = `
      <h2>Training abgeschlossen!</h2>
      <p>${score} von ${total} Aufgaben beim ersten Versuch richtig.</p>
      <button type="button" onclick="newTraining()">Nochmals trainieren</button>
    `;
  }
}

window.onload = newTraining;
