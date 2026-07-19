
/* =========================================
   K01 · Räumliche Koordinaten
   Neutraler Koordinatenwürfel
   ========================================= */


/* -----------------------------------------
   Antworten
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

const K01_SIZE = 5;

function k01Project(x, y, z){
  const originX = 250;
  const originY = 345;

  return {
    x: originX + x * 62 - y * 35,
    y: originY - y * 25 - z * 52
  };
}

function k01Point(){
  return {
    x: pick([1, 2, 3, 4, 5]),
    y: pick([1, 2, 3, 4, 5]),
    z: pick([1, 2, 3, 4, 5])
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
   Würfelgitter
   ----------------------------------------- */

function k01FullGrid(){
  const lines = [];

  /*
    Linien parallel zur x-Achse:
    y und z bleiben konstant.
  */
  for(let y = 0; y <= K01_SIZE; y++){
    for(let z = 0; z <= K01_SIZE; z++){
      lines.push(
        k01Line(
          k01Project(0, y, z),
          k01Project(K01_SIZE, y, z),
          "k01-grid-line"
        )
      );
    }
  }

  /*
    Linien parallel zur y-Achse:
    x und z bleiben konstant.
  */
  for(let x = 0; x <= K01_SIZE; x++){
    for(let z = 0; z <= K01_SIZE; z++){
      lines.push(
        k01Line(
          k01Project(x, 0, z),
          k01Project(x, K01_SIZE, z),
          "k01-grid-line"
        )
      );
    }
  }

  /*
    Linien parallel zur z-Achse:
    x und y bleiben konstant.
  */
  for(let x = 0; x <= K01_SIZE; x++){
    for(let y = 0; y <= K01_SIZE; y++){
      lines.push(
        k01Line(
          k01Project(x, y, 0),
          k01Project(x, y, K01_SIZE),
          "k01-grid-line"
        )
      );
    }
  }

  return lines.join("");
}


/* -----------------------------------------
   Nur Aussenkanten
   ----------------------------------------- */

function k01OuterEdges(){
  const n = K01_SIZE;

  const vertices = {
    a: k01Project(0, 0, 0),
    b: k01Project(n, 0, 0),
    c: k01Project(n, n, 0),
    d: k01Project(0, n, 0),

    e: k01Project(0, 0, n),
    f: k01Project(n, 0, n),
    g: k01Project(n, n, n),
    h: k01Project(0, n, n)
  };

  return `
    ${k01Line(vertices.a, vertices.b, "k01-edge")}
    ${k01Line(vertices.b, vertices.c, "k01-edge")}
    ${k01Line(vertices.c, vertices.d, "k01-edge")}
    ${k01Line(vertices.d, vertices.a, "k01-edge")}

    ${k01Line(vertices.e, vertices.f, "k01-edge")}
    ${k01Line(vertices.f, vertices.g, "k01-edge")}
    ${k01Line(vertices.g, vertices.h, "k01-edge")}
    ${k01Line(vertices.h, vertices.e, "k01-edge")}

    ${k01Line(vertices.a, vertices.e, "k01-edge")}
    ${k01Line(vertices.b, vertices.f, "k01-edge")}
    ${k01Line(vertices.c, vertices.g, "k01-edge")}
    ${k01Line(vertices.d, vertices.h, "k01-edge")}
  `;
}


/* -----------------------------------------
   Achsen und Beschriftungen
   ----------------------------------------- */

function k01Axes(){
  const n = K01_SIZE;

  const origin = k01Project(0, 0, 0);
  const xEnd = k01Project(n + 0.65, 0, 0);
  const yEnd = k01Project(0, n + 0.8, 0);
  const zEnd = k01Project(0, 0, n + 0.65);

  const xLabels = [];
  const yLabels = [];
  const zLabels = [];

  for(let value = 1; value <= n; value++){
    const xPoint = k01Project(value, 0, 0);
    const yPoint = k01Project(0, value, 0);
    const zPoint = k01Project(0, 0, value);

    xLabels.push(`
      <text
        x="${xPoint.x}"
        y="${xPoint.y + 27}"
        text-anchor="middle"
        class="k01-axis-number">
        ${value}
      </text>
    `);

    yLabels.push(`
      <text
        x="${yPoint.x - 15}"
        y="${yPoint.y + 8}"
        text-anchor="end"
        class="k01-axis-number">
        ${value}
      </text>
    `);

    zLabels.push(`
      <text
        x="${zPoint.x - 15}"
        y="${zPoint.y + 6}"
        text-anchor="end"
        class="k01-axis-number">
        ${value}
      </text>
    `);
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
      y="${origin.y + 25}"
      class="k01-axis-number">
      0
    </text>

    ${xLabels.join("")}
    ${yLabels.join("")}
    ${zLabels.join("")}

    <text
      x="${xEnd.x + 15}"
      y="${xEnd.y + 7}"
      class="k01-axis-label">
      x
    </text>

    <text
      x="${yEnd.x - 10}"
      y="${yEnd.y - 8}"
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
   Hilfslinien eines Punktes
   ----------------------------------------- */

function k01PointGuides(point){
  const p = k01Project(point.x, point.y, point.z);

  const ground = k01Project(point.x, point.y, 0);
  const xBase = k01Project(point.x, 0, 0);
  const yBase = k01Project(0, point.y, 0);

  return `
    ${k01Line(p, ground, "k01-guide")}
    ${k01Line(ground, xBase, "k01-guide")}
    ${k01Line(ground, yBase, "k01-guide")}

    <circle
      cx="${ground.x}"
      cy="${ground.y}"
      r="4"
      class="k01-ground-point">
    </circle>
  `;
}


/* -----------------------------------------
   Einzelner Punkt
   ----------------------------------------- */

function k01PointMarkup(point, label = "A"){
  const p = k01Project(point.x, point.y, point.z);

  return `
    <circle
      cx="${p.x}"
      cy="${p.y}"
      r="13"
      class="k01-point-ring">
    </circle>

    <circle
      cx="${p.x}"
      cy="${p.y}"
      r="7"
      class="k01-point">
    </circle>

    <text
      x="${p.x + 14}"
      y="${p.y - 12}"
      class="k01-point-label">
      ${label}
    </text>
  `;
}


/* -----------------------------------------
   Komplettes SVG
   mode:
   easy = vollständiges Röntgengitter
   hard = nur Würfelkanten und Achsen
   ----------------------------------------- */

function k01CubeSvg(point, options = {}){
  const mode = options.mode || "easy";
  const label = options.label || "A";
  const showGuides = options.showGuides !== false;

  return `
    <div class="k01-svg-wrap">

      <svg
        class="k01-svg"
        viewBox="0 0 650 540"
        role="img"
        aria-label="Räumliches Koordinatensystem mit Punkt ${label}">

        ${
          mode === "easy"
            ? k01FullGrid()
            : k01OuterEdges()
        }

        ${k01Axes()}

        ${
          showGuides
            ? k01PointGuides(point)
            : ""
        }

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
   1. Einfach: vollständiges Gitter
   ----------------------------------------- */

function genK01ReadEasy(){
  const point = k01Point();
  const label = pick(["A", "B", "C"]);

  return {
    badge: "K01 · Koordinaten ablesen · einfach",

    ziel:
      "Die Koordinaten eines Punktes im vollständigen räumlichen Gitter ablesen.",

    text: `
      <p>
        Der Punkt <strong>${label}</strong> ist im Koordinatenwürfel markiert.
      </p>

      ${k01CubeSvg(point, {
        mode: "easy",
        label: label,
        showGuides: true
      })}
    `,

    ask:
      `Bestimme die Koordinaten von ${label}. Schreibe zum Beispiel: 2 / 4 / 3`,

    answer:
      coordinateAnswer(point.x, point.y, point.z),

    hint1:
      "Lies zuerst die x-Koordinate ab.",

    hint2:
      "Lies danach die y-Koordinate in der Tiefenrichtung ab.",

    hint3:
      `Die z-Koordinate gibt die Höhe an: ${point.z}.`,

    solution: `
      <strong>
        ${label} (${point.x} / ${point.y} / ${point.z})
      </strong>
    `
  };
}


/* -----------------------------------------
   2. Schwieriger: nur Würfelkanten
   ----------------------------------------- */

function genK01ReadHard(){
  const point = k01Point();
  const label = pick(["A", "B", "C"]);

  return {
    badge: "K01 · Koordinaten ablesen · schwierig",

    ziel:
      "Die Koordinaten eines Punktes ohne vollständiges räumliches Gitter ablesen.",

    text: `
      <p>
        Im Würfel sind nur die Achsen und Aussenkanten sichtbar.
      </p>

      ${k01CubeSvg(point, {
        mode: "hard",
        label: label,
        showGuides: true
      })}
    `,

    ask:
      `Bestimme die Koordinaten von ${label}.`,

    answer:
      coordinateAnswer(point.x, point.y, point.z),

    hint1:
      "Projiziere den Punkt gedanklich auf die Grundfläche.",

    hint2:
      "Bestimme auf der Grundfläche zuerst x und y.",

    hint3:
      `Die Höhe des Punktes beträgt ${point.z}.`,

    solution: `
      <strong>
        ${label} (${point.x} / ${point.y} / ${point.z})
      </strong>
    `
  };
}


/* -----------------------------------------
   3. Fehlende Koordinate
   ----------------------------------------- */

function genK01MissingCoordinate(){
  const point = k01Point();
  const label = "A";
  const missing = pick(["x", "y", "z"]);

  const displayed = {
    x:
      `( ? / ${point.y} / ${point.z} )`,

    y:
      `( ${point.x} / ? / ${point.z} )`,

    z:
      `( ${point.x} / ${point.y} / ? )`
  };

  return {
    badge: "K01 · Koordinate ergänzen",

    ziel:
      "Eine fehlende räumliche Koordinate bestimmen.",

    text: `
      <p>
        Eine Koordinate von Punkt <strong>${label}</strong> fehlt:
      </p>

      <p class="k01-given">
        <strong>
          ${label} ${displayed[missing]}
        </strong>
      </p>

      ${k01CubeSvg(point, {
        mode: "easy",
        label: label,
        showGuides: true
      })}
    `,

    ask:
      `Welche Zahl fehlt bei der ${missing}-Koordinate?`,

    answer:
      numberAnswer(point[missing]),

    hint1:
      `Gesucht ist die ${missing}-Koordinate.`,

    hint2:
      missing === "z"
        ? "Die z-Koordinate beschreibt die Höhe."
        : "Lies die Koordinate auf der Grundfläche ab.",

    hint3:
      `Die gesuchte Zahl ist ${point[missing]}.`,

    solution: `
      <strong>
        ${label} (${point.x} / ${point.y} / ${point.z})
      </strong>
    `
  };
}


/* -----------------------------------------
   4. Höhe bestimmen
   ----------------------------------------- */

function genK01Height(){
  const point = k01Point();

  return {
    badge: "K01 · z-Koordinate",

    ziel:
      "Die z-Koordinate als Höhe eines Punktes bestimmen.",

    text: `
      <p>
        Punkt <strong>A</strong> ist im Koordinatenwürfel markiert.
      </p>

      ${k01CubeSvg(point, {
        mode: "easy",
        label: "A",
        showGuides: true
      })}
    `,

    ask:
      "Wie gross ist die z-Koordinate von A?",

    answer:
      numberAnswer(point.z),

    hint1:
      "Die z-Achse zeigt senkrecht nach oben.",

    hint2:
      "Die z-Koordinate ist die dritte Koordinate.",

    hint3:
      `Punkt A liegt auf der Höhe ${point.z}.`,

    solution: `
      Die z-Koordinate beträgt

      <strong>${point.z}</strong>.
    `
  };
}


/* =========================================
   TRAINER
   ========================================= */

TRAINERS["koordinaten"] = {
  title: "K01 · Räumliche Koordinaten",

  info:
    "Koordinaten in einem Würfel ablesen und ergänzen.",

  generators: [
    genK01ReadEasy,
    genK01ReadHard,
    genK01MissingCoordinate,
    genK01Height
  ]
};
