/* MATHE adaptive Nachbearbeitung
   Phase 1: Goldstandard-Generator G05 · Lineare Zahlenfolgen
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
  const s = clean(input).replace(",", ".");
  if (s === "") return null;
  const value = Number(s);
  return Number.isFinite(value) ? value : null;
}

function parseLinearTerm(input) {
  let s = clean(input);
  if (s === "") return null;

  s = s.replaceAll("*x", "x");

  if (!s.startsWith("+") && !s.startsWith("-")) {
    s = "+" + s;
  }

  const parts = s.match(/[+-][^+-]+/g);
  if (!parts) return null;

  let a = 0;
  let b = 0;

  for (const part of parts) {
    const sign = part[0] === "-" ? -1 : 1;
    const body = part.slice(1);

    if (body.includes("x")) {
      let coeff = body.replace("x", "");
      if (coeff === "" || coeff === "*") coeff = "1";
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

function parseQuadraticTerm(input) {
  let s = clean(input);
  if (s === "") return null;

  s = s.replaceAll("*x^2", "x^2").replaceAll("*x", "x");

  if (!s.startsWith("+") && !s.startsWith("-")) {
    s = "+" + s;
  }

  const parts = s.match(/[+-][^+-]+/g);
  if (!parts) return null;

  let a = 0;
  let b = 0;
  let c = 0;

  for (const part of parts) {
    const sign = part[0] === "-" ? -1 : 1;
    const body = part.slice(1);

    if (body.includes("x^2")) {
      let coeff = body.replace("x^2", "");
      if (coeff === "") coeff = "1";
      const num = Number(coeff);
      if (Number.isNaN(num)) return null;
      a += sign * num;
    } else if (body.includes("x")) {
      let coeff = body.replace("x", "");
      if (coeff === "") coeff = "1";
      const num = Number(coeff);
      if (Number.isNaN(num)) return null;
      b += sign * num;
    } else {
      const num = Number(body);
      if (Number.isNaN(num)) return null;
      c += sign * num;
    }
  }

  return { a, b, c };
}

function ok(value, answer) {
  if (typeof answer === "object" && answer.kind === "linear") {
    const got = parseLinearTerm(value);
    return got && got.a === answer.a && got.b === answer.b;
  }

  if (typeof answer === "object" && answer.kind === "quadratic") {
    const got = parseQuadraticTerm(value);
    return got && got.a === answer.a && got.b === answer.b && got.c === answer.c;
  }

  if (Array.isArray(answer)) {
    return answer.some((singleAnswer) => ok(value, singleAnswer));
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
  else if (a !== 0) s = a + variable;

  if (b > 0) s += "+" + b;
  if (b < 0) s += b;

  return s || "0";
}

function quadraticTermText(a, b, c, variable = "n") {
  let s = "";

  if (a !== 0) {
    if (a === 1) s += variable + "²";
    else if (a === -1) s += "-" + variable + "²";
    else s += a + variable + "²";
  }

  if (b !== 0) {
    if (s !== "" && b > 0) s += "+";
    if (b === 1) s += variable;
    else if (b === -1) s += "-" + variable;
    else s += b + variable;
  }

  if (c !== 0) {
    if (s !== "" && c > 0) s += "+";
    s += c;
  }

  return s || "0";
}

function sum1(n) {
  return (n * (n + 1)) / 2;
}

function sequenceTable(values, options = {}) {
  const columns = options.columns || [1, 2, 3, 4, 5, 50, "n"];
  const label = options.label || "T(n)";
  const hidden = new Set(options.hidden || []);

  const top = columns.map((col) => `<th>${col}</th>`).join("");
  const bottom = columns.map((col) => {
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

function makeLinearValues(a, b) {
  const values = {};
  [1, 2, 3, 4, 5, 6, 10, 50, 100, 150].forEach((n) => {
    values[n] = a * n + b;
  });
  values.n = linearTermText(a, b);
  return values;
}

/* G05 · Lineare Zahlenfolgen */

function genLinearFindTerm() {
  const a = rand(2, 8);
  const b = rand(-9, 9);
  const values = makeLinearValues(a, b);

  return {
    badge: "G05 · Term bestimmen",
    ziel: "Aus einer Wertetabelle den Term einer linearen Folge bestimmen.",
    text: `
      <p>Die Folge wächst regelmässig. Ergänze den Term für die x-te bzw. n-te Zahl.</p>
      ${sequenceTable(values, { hidden: ["5", "50", "n"] })}
    `,
    ask: "Bestimme den Term T(n). Beispiel: 4n-1",
    answer: { kind: "linear", a, b },
    hint1: "Vergleiche zwei benachbarte Werte. Die Differenz ist der Faktor vor n.",
    hint2: `Die Differenz ist ${a}. Der Term beginnt also mit ${a}n.`,
    hint3: `Setze n = 1 ein: ${a} · 1 = ${a}. Der erste Wert ist ${values[1]}. Was muss noch dazu oder weg?`,
    solution: `
      Die Differenz ist immer ${a}. Deshalb beginnt der Term mit ${a}n.<br>
      Für n = 1 gilt: ${a} · 1 = ${a}. Der erste Wert soll ${values[1]} sein.<br>
      Darum ist der Term <strong>T(n) = ${values.n}</strong>.
    `
  };
}

function genLinearFindValue() {
  const a = rand(2, 8);
  const b = rand(-9, 9);
  const values = makeLinearValues(a, b);
  const target = pick([5, 6, 10, 50, 100, 150]);

  return {
    badge: "G05 · Wert berechnen",
    ziel: "Einen fehlenden Wert einer linearen Folge berechnen.",
    text: `
      <p>Die ersten Werte einer linearen Folge sind gegeben.</p>
      ${sequenceTable(values, { columns: [1, 2, 3, 4, target], hidden: [String(target)] })}
    `,
    ask: `Berechne T(${target}).`,
    answer: values[target],
    hint1: "Bestimme zuerst, um wie viel die Folge jedes Mal wächst.",
    hint2: `Die Folge wächst jedes Mal um ${a}.`,
    hint3: `Der passende Term ist T(n) = ${values.n}. Setze nun n = ${target} ein.`,
    solution: `
      Die Differenz ist immer ${a}. Der Term lautet <strong>T(n) = ${values.n}</strong>.<br>
      T(${target}) = ${a} · ${target} ${b >= 0 ? "+ " + b : "- " + Math.abs(b)} = <strong>${values[target]}</strong>.
    `
  };
}

function genLinearCompleteTable() {
  const a = rand(2, 8);
  const b = rand(-9, 9);
  const values = makeLinearValues(a, b);
  const target = pick([5, 50]);

  return {
    badge: "G05 · Tabelle ergänzen",
    ziel: "Eine Wertetabelle zu einer linearen Folge vervollständigen.",
    text: `
      <p>Ergänze den fehlenden Tabellenwert.</p>
      ${sequenceTable(values, { hidden: [String(target)] })}
    `,
    ask: `Welcher Wert gehört zu n = ${target}?`,
    answer: values[target],
    hint1: "Schau auf die Veränderung von links nach rechts.",
    hint2: `Von einem Feld zum nächsten kommt immer ${a} dazu.`,
    hint3: `Für grosse n-Werte ist Rechnen besser als Weiterzählen. Verwende T(n) = ${values.n}.`,
    solution: `
      Die Folge hat die Differenz ${a}. Der Term lautet <strong>T(n) = ${values.n}</strong>.<br>
      Für n = ${target} erhält man <strong>${values[target]}</strong>.
    `
  };
}

/* Bestehende weitere Generatoren bleiben einfach, bis sie später einzeln verbessert werden. */

function genQuadraticTerm() {
  const a = 1;
  const b = rand(1, 6);
  const c = rand(-5, 6);
  const values = {};
  [1, 2, 3, 4, 5, 50].forEach((n) => values[n] = a * n * n + b * n + c);
  values.n = quadraticTermText(a, b, c);

  return {
    badge: "G06 · Quadratische Folge",
    ziel: "Einen quadratischen Term aus einer Tabelle erkennen.",
    text: sequenceTable(values, { hidden: ["5", "50", "n"] }),
    ask: "Bestimme den Term T(n). Beispiel: n²+4n-1",
    answer: { kind: "quadratic", a, b, c },
    hint1: "Die Differenzen sind nicht gleich. Schau auf die zweiten Differenzen.",
    hint2: "Bei diesen Aufgaben beginnt der Term mit n².",
    hint3: `Prüfe n = 1, 2 und 3 mit einem Term der Form n²+bn+c.`,
    solution: `Der Term lautet <strong>T(n) = ${values.n}</strong>.`
  };
}

function genGauss() {
  const n = pick([50, 75, 100, 120, 150, 200, 250]);
  const ans = sum1(n);

  return {
    badge: "G08 · Gauss-Summe",
    ziel: "Eine lange Summe geschickt berechnen.",
    text: `<p>Berechne geschickt:</p><p><strong>1 + 2 + 3 + … + ${n}</strong></p>`,
    ask: "Wie gross ist die Summe?",
    answer: ans,
    hint1: "Bilde Paare: erste Zahl + letzte Zahl.",
    hint2: `Verwende die Formel ${n} · ${n + 1} : 2.`,
    hint3: `Die Hälfte von ${n} · ${n + 1} ergibt die Summe.`,
    solution: `${n} · ${n + 1} : 2 = <strong>${ans}</strong>.`
  };
}

function genEquation() {
  const x = rand(2, 16);
  const a = rand(2, 8);
  const b = rand(-12, 12);
  const rhs = a * x + b;

  return {
    badge: "G03 · Gleichung",
    ziel: "Eine lineare Gleichung lösen.",
    text: `<p>Löse die Gleichung:</p><p><strong>${a}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)} = ${rhs}</strong></p>`,
    ask: "Wie lautet x?",
    answer: x,
    hint1: "Bringe zuerst die Zahl ohne x auf die andere Seite.",
    hint2: `Danach teilst du durch ${a}.`,
    hint3: "Prüfe am Schluss durch Einsetzen.",
    solution: `${a}x = ${rhs - b}, also <strong>x = ${x}</strong>.`
  };
}

const pools = {
  "linear-folge": {
    title: "G05 · Lineare Zahlenfolgen",
    info: "Goldstandard-Prototyp: Wertetabellen, Termbildung, Tipps und Schritt-für-Schritt-Lösung.",
    generators: [genLinearFindTerm, genLinearFindValue, genLinearCompleteTable]
  },
  "startklar": {
    title: "Startklar · Vom Bild zum Term",
    info: "Vorläufiger Mix passend zur Lernstanderfassung. Die einzelnen Generatoren werden nun Schritt für Schritt verbessert.",
    generators: [genLinearFindTerm, genLinearFindValue, genLinearCompleteTable, genQuadraticTerm, genGauss, genEquation]
  },
  "lk": {
    title: "Lernkontrolle · Vom Bild zum Term",
    info: "Vorläufiger Mix passend zur Lernkontrolle.",
    generators: [genLinearFindTerm, genLinearFindValue, genLinearCompleteTable, genQuadraticTerm, genGauss, genEquation]
  },
  "test": {
    title: "Test · Vom Bild zum Term",
    info: "Vorläufiger Mix passend zum Test.",
    generators: [genLinearFindTerm, genLinearFindValue, genLinearCompleteTable, genQuadraticTerm, genGauss, genEquation]
  },
  "quadratisch": {
    title: "G06 · Quadratische Zahlenfolgen",
    info: "Vorläufige Version. Dieser Generator wird als Nächstes fachlich verbessert.",
    generators: [genQuadraticTerm]
  },
  "gauss": {
    title: "G08 · Gauss-Summen",
    info: "Summen geschickt berechnen.",
    generators: [genGauss]
  },
  "gleichung": {
    title: "G03 · Gleichungen",
    info: "Lineare Gleichungen lösen.",
    generators: [genEquation]
  }
};

function getPool() {
  return pools[typ] || pools["linear-folge"];
}

function newTraining() {
  const pool = getPool();

  document.getElementById("pageTitle").innerText = pool.title;
  document.getElementById("pageSub").innerText = "adaptive Nachbearbeitung";
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
    const generator = pick(pool.generators);
    const q = generator();
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
        <input id="input${i}" autocomplete="off" inputmode="text" placeholder="Antwort eingeben">
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
      feedback.innerHTML = "❌ Noch nicht.<div class='solution'>✅ " + q.solution + "</div>Du kannst die richtige Antwort trotzdem noch eintippen.";
    }

    input.focus();
    input.select();
  }

  document.getElementById("bar").style.width = (solved / total * 100) + "%";
  document.getElementById("progressText").innerText = `${solved} / ${total}`;

  if (solved === total) {
    const stars = score >= Math.ceil(total * 0.9) ? "⭐⭐⭐" : score >= Math.ceil(total * 0.6) ? "⭐⭐" : "⭐";
    const result = document.getElementById("result");
    result.hidden = false;
    result.innerHTML = `
      <h2>Training abgeschlossen!</h2>
      <p style="font-size:2rem;margin:.5rem 0">${stars}</p>
      <p>${score} von ${total} Aufgaben beim ersten Versuch richtig.</p>
      <button type="button" onclick="newTraining()">Nochmals trainieren</button>
    `;
  }
}

window.onload = newTraining;
