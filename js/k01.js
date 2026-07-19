/* =========================================
   K01 · Räumliche Koordinaten
   Koordinatenwürfel 0 bis 5
   ========================================= */


/* -----------------------------------------
   Antwortformat
   ----------------------------------------- */

function coordinateAnswer(x, y, z){
  return {
    kind: "coordinates",
    values: [x, y, z]
  };
}


/* -----------------------------------------
   Grundeinstellungen
   ----------------------------------------- */

const K01_MAX = 5;

function k01Project(x, y, z){
  const originX = 245;
  const originY = 395;

  return {
    x: originX + x * 64 - y * 34,
    y: originY - y * 25 - z * 58
  };
}

function k01RandomPoint(){
  return {
    x: pick([1, 2, 3, 4]),
    y: pick([1, 2, 3, 4]),
    z: pick([1, 2, 3, 4])
  };
}

function k01Line(a, b, className){
  return `
    <line
      x1="${a.x}"
      y1="${a.y}"
      x2="${b.x}"
      y2="${b.y}"
      class="${className}">
    </line>
  `;
}


/* -----------------------------------------
   Vollständiges Röntgengitter
   ----------------------------------------- */

function k01Grid(){
  const lines = [];

  for(let y = 0; y <= K01_MAX; y++){
    for(let z = 0; z <= K01_MAX; z++){
      lines.push(
        k01Line(
          k01Project(0, y, z),
          k01Project(K01_MAX, y, z),
          "k01-grid"
        )
      );
    }
  }

  for(let x = 0; x <= K01_MAX; x++){
    for(let z = 0; z <= K01_MAX; z++){
      lines.push(
        k01Line(
          k01Project(x, 0, z),
          k01Project(x, K01_MAX, z),
          "k01-grid"
        )
      );
    }
  }

  for(let x = 0; x <= K01_MAX; x++){
    for(let y = 0; y <= K01_MAX; y++){
      lines.push(
        k01Line(
          k01Project(x, y, 0),
          k01Project(x, y, K01_MAX),
          "k01-grid"
        )
      );
    }
  }

  return lines.join("");
}


/* -----------------------------------------
   Nur Aussenkanten
   ----------------------------------------- */

function k01Edges(){
  const n = K01_MAX;

  const p000 = k01Project(0, 0, 0);
  const p500 = k01Project(n, 0, 0);
  const p550 = k01Project(n, n, 0);
  const p050 = k01Project(0, n, 0);

  const p005 = k01Project(0, 0, n);
  const p505 = k01Project(n, 0, n);
  const p555 = k01Project(n, n, n);
  const p055 = k01Project(0, n, n);

  return `
    ${k01Line(p000, p500, "k01-edge")}
    ${k01Line(p500, p550, "k01-edge")}
    ${k01Line(p550, p050, "k01-edge")}
    ${k01Line(p050, p000, "k01-edge")}

    ${k01Line(p005, p505, "k01-edge")}
    ${k01Line(p505, p555, "k01-edge")}
    ${k01Line(p555, p055, "k01-edge")}
    ${k01Line(p055, p005, "k01-edge")}

    ${k01Line(p000, p005, "k01-edge")}
    ${k01Line(p500, p505, "k01-edge")}
    ${k01Line(p550, p555, "k01-edge")}
    ${k01Line(p050, p055, "k01-edge")}
  `;
}


/* -----------------------------------------
   Achsen
   ----------------------------------------- */

function k01Axes(){
  const origin = k01Project(0, 0, 0);
  const xEnd = k01Project(5.7, 0, 0);
  const yEnd = k01Project(0, 5.8, 0);
  const zEnd = k01Project(0, 0, 5.7);

  let labels = "";

  for(let value = 1; value <= K01_MAX; value++){
    const x = k01Project(value, 0, 0);
    const y = k01Project(0, value, 0);
    const z = k01Project(0, 0, value);

    labels += `
      <text
        x="${x.x}"
        y="${x.y + 29}"
        text-anchor="middle"
        class="k01-number">
        ${value}
      </text>

      <text
        x="${y.x - 14}"
        y="${y.y + 7}"
        text-anchor="end"
        class="k01-number">
        ${value}
      </text>

      <text
        x="${z.x - 14}"
        y="${z.y + 6}"
        text-anchor="end"
        class="k01-number">
        ${value}
      </text>
    `;
  }

  return `
    <defs>
      <marker
        id="k01-arrow"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto">

        <path
          d="M 0 0 L 10 5 L 0 10 z"
          class="k01-arrow-head">
        </path>
      </marker>
    </defs>

    ${k01Line(origin, xEnd, "k01-axis")}
    ${k01Line(origin, yEnd, "k01-axis")}
    ${k01Line(origin, zEnd, "k01-axis")}

    <text
      x="${origin.x + 10}"
      y="${origin.y + 26}"
      class="k01-number">
      0
    </text>

    ${labels}

    <text
      x="${xEnd.x + 14}"
      y="${xEnd.y + 7}"
      class="k01-axis-label">
      x
    </text>

    <text
      x="${yEnd.x - 10}"
      y="${yEnd.y - 7}"
      class="k01-axis-label">
      y
    </text>

    <text
      x="${zEnd.x + 13}"
      y="${zEnd.y + 7}"
      class="k01-axis-label">
      z
    </text>
  `;
}


/* -----------------------------------------
   Punkt und Hilfslinien
   ----------------------------------------- */

function k01PointMarkup(point, label){
  const p = k01Project(point.x, point.y, point.z);
  const ground = k01Project(point.x, point.y, 0);
  const xBase = k01Project(point.x, 0, 0);
  const yBase = k01Project(0, point.y, 0);

  return `
    ${k01Line(p, ground, "k01-guide")}
    ${k01Line(ground, xBase, "k01-guide")}
    ${k01Line(ground, yBase, "k01-guide")}

    <circle
      cx="${p.x}"
      cy="${p.y}"
      r="14"
      class="k01-point-ring">
    </circle>

    <circle
      cx="${p.x}"
      cy="${p.y}"
      r="8"
      class="k01-point">
    </circle>

    <text
      x="${p.x + 16}"
      y="${p.y - 13}"
      class="k01-point-label">
      ${label}
    </text>
  `;
}


/* -----------------------------------------
   Komplettes SVG
   easy = vollständiges Gitter
   hard = nur Aussenkanten
   ----------------------------------------- */

function k01CubeSvg(point, mode = "easy", label = "A"){
  return `
    <div class="k01-wrap">

      <svg
        class="k01-svg"
        viewBox="0 0 650 540"
        role="img"
        aria-label="Koordinatenwürfel mit Punkt ${label}">

        ${
          mode === "easy"
            ? k01Grid()
            : k01Edges()
        }

        ${k01Axes()}
        ${k01PointMarkup(point, label)}

      </svg>

      <p class="k01-note">
        ${
          mode === "easy"
            ? "Alle Gitterlinien sind eingezeichnet."
            : "Nur die Achsen und Aussenkanten sind eingezeichnet."
        }
      </p>

    </div>
  `;
}


/* =========================================
   GENERATOREN
   ========================================= */


/* -----------------------------------------
   Einfach
   ----------------------------------------- */

function genK01Easy(){
  const point = k01RandomPoint();
  const label = pick(["A", "B", "C"]);

  return {
    badge: "K01 · Koordinaten ablesen · einfach",

    ziel:
      "Die Koordinaten eines Punktes im vollständigen räumlichen Gitter ablesen.",

    text: `
      <p>
        Der Punkt <strong>${label}</strong> ist im Koordinatenwürfel markiert.
      </p>

      ${k01CubeSvg(point, "easy", label)}
    `,

    ask:
      `Bestimme die Koordinaten von ${label}. Schreibe zum Beispiel: 2 / 3 / 4`,

    answer:
      coordinateAnswer(point.x, point.y, point.z),

    hint1:
      "Lies zuerst die x-Koordinate ab.",

    hint2:
      "Lies danach die y-Koordinate in der Tiefenrichtung ab.",

    hint3:
      `Die z-Koordinate beträgt ${point.z}.`,

    solution: `
      <strong>
        ${label} (${point.x} / ${point.y} / ${point.z})
      </strong>
    `
  };
}


/* -----------------------------------------
   Schwierig
   ----------------------------------------- */

function genK01Hard(){
  const point = k01RandomPoint();
  const label = pick(["A", "B", "C"]);

  return {
    badge: "K01 · Koordinaten ablesen · schwierig",

    ziel:
      "Die Koordinaten eines Punktes ohne vollständiges Gitter ablesen.",

    text: `
      <p>
        Im Koordinatenwürfel sind nur die Aussenkanten sichtbar.
      </p>

      ${k01CubeSvg(point, "hard", label)}
    `,

    ask:
      `Bestimme die Koordinaten von ${label}.`,

    answer:
      coordinateAnswer(point.x, point.y, point.z),

    hint1:
      "Projiziere den Punkt gedanklich auf die Grundfläche.",

    hint2:
      "Bestimme auf der Grundfläche x und y.",

    hint3:
      `Die Höhe z beträgt ${point.z}.`,

    solution: `
      <strong>
        ${label} (${point.x} / ${point.y} / ${point.z})
      </strong>
    `
  };
}


/* -----------------------------------------
   Fehlende Koordinate
   ----------------------------------------- */

function genK01Missing(){
  const point = k01RandomPoint();
  const missing = pick(["x", "y", "z"]);

  const shown = {
    x: `( ? / ${point.y} / ${point.z} )`,
    y: `( ${point.x} / ? / ${point.z} )`,
    z: `( ${point.x} / ${point.y} / ? )`
  };

  return {
    badge: "K01 · Koordinate ergänzen",

    ziel:
      "Eine fehlende Koordinate ergänzen.",

    text: `
      <p>
        Vom Punkt <strong>A</strong> fehlt eine Koordinate:
      </p>

      <p class="k01-given">
        <strong>A ${shown[missing]}</strong>
      </p>

      ${k01CubeSvg(point, "easy", "A")}
    `,

    ask:
      `Welche Zahl fehlt bei der ${missing}-Koordinate?`,

    answer:
      numberAnswer(point[missing]),

    hint1:
      `Gesucht ist die ${missing}-Koordinate.`,

    hint2:
      missing === "z"
        ? "Die z-Koordinate gibt die Höhe an."
        : "Lies die Koordinate auf der Grundfläche ab.",

    hint3:
      `Die gesuchte Zahl ist ${point[missing]}.`,

    solution: `
      <strong>
        A (${point.x} / ${point.y} / ${point.z})
      </strong>
    `
  };
}


/* =========================================
   TRAINER
   ========================================= */

TRAINERS["koordinaten"] = {
  title: "K01 · Räumliche Koordinaten",

  info:
    "Koordinaten in einem räumlichen Gitter ablesen und ergänzen.",

  generators: [
    genK01Easy,
    genK01Hard,
    genK01Missing
  ]
};
