/* =========================================
   K01 · Räumliche Koordinaten
   Einfache, robuste Würfel-Version
   ========================================= */

function coordinateAnswer(x, y, z){
  return {
    kind: "coordinates",
    values: [x, y, z]
  };
}

const K01_MAX = 5;


/* -----------------------------------------
   Projektion
   ----------------------------------------- */

function k01Project(x, y, z){
  return {
    x: 245 + x * 62 - y * 34,
    y: 400 - y * 25 - z * 56
  };
}

function k01RandomPoint(){
  return {
    x: pick([1, 2, 3, 4]),
    y: pick([1, 2, 3, 4]),
    z: pick([1, 2, 3, 4])
  };
}

function k01SvgLine(a, b, style){
  return `
    <line
      x1="${a.x}"
      y1="${a.y}"
      x2="${b.x}"
      y2="${b.y}"
      style="${style}">
    </line>
  `;
}


/* -----------------------------------------
   Außenkanten
   ----------------------------------------- */

function k01CubeEdges(){
  const n = K01_MAX;

  const p000 = k01Project(0, 0, 0);
  const p500 = k01Project(n, 0, 0);
  const p550 = k01Project(n, n, 0);
  const p050 = k01Project(0, n, 0);

  const p005 = k01Project(0, 0, n);
  const p505 = k01Project(n, 0, n);
  const p555 = k01Project(n, n, n);
  const p055 = k01Project(0, n, n);

  const edgeStyle =
    "stroke:#546875;stroke-width:2.4;fill:none;";

  return `
    ${k01SvgLine(p000, p500, edgeStyle)}
    ${k01SvgLine(p500, p550, edgeStyle)}
    ${k01SvgLine(p550, p050, edgeStyle)}
    ${k01SvgLine(p050, p000, edgeStyle)}

    ${k01SvgLine(p005, p505, edgeStyle)}
    ${k01SvgLine(p505, p555, edgeStyle)}
    ${k01SvgLine(p555, p055, edgeStyle)}
    ${k01SvgLine(p055, p005, edgeStyle)}

    ${k01SvgLine(p000, p005, edgeStyle)}
    ${k01SvgLine(p500, p505, edgeStyle)}
    ${k01SvgLine(p550, p555, edgeStyle)}
    ${k01SvgLine(p050, p055, edgeStyle)}
  `;
}


/* -----------------------------------------
   Ruhiges Gitter
   Nur drei Flächen
   ----------------------------------------- */

function k01FullGrid(){
  const lines = [];

  const gridStyle =
    "stroke:#c8d2d8;stroke-width:1.15;opacity:0.82;fill:none;";

  /*
    Grundfläche z = 0
  */
  for(let x = 0; x <= K01_MAX; x++){
    lines.push(
      k01SvgLine(
        k01Project(x, 0, 0),
        k01Project(x, K01_MAX, 0),
        gridStyle
      )
    );
  }

  for(let y = 0; y <= K01_MAX; y++){
    lines.push(
      k01SvgLine(
        k01Project(0, y, 0),
        k01Project(K01_MAX, y, 0),
        gridStyle
      )
    );
  }

  /*
    Vorderfläche y = 0
  */
  for(let x = 0; x <= K01_MAX; x++){
    lines.push(
      k01SvgLine(
        k01Project(x, 0, 0),
        k01Project(x, 0, K01_MAX),
        gridStyle
      )
    );
  }

  for(let z = 0; z <= K01_MAX; z++){
    lines.push(
      k01SvgLine(
        k01Project(0, 0, z),
        k01Project(K01_MAX, 0, z),
        gridStyle
      )
    );
  }

  /*
    Linke Seitenfläche x = 0
  */
  for(let y = 0; y <= K01_MAX; y++){
    lines.push(
      k01SvgLine(
        k01Project(0, y, 0),
        k01Project(0, y, K01_MAX),
        gridStyle
      )
    );
  }

  for(let z = 0; z <= K01_MAX; z++){
    lines.push(
      k01SvgLine(
        k01Project(0, 0, z),
        k01Project(0, K01_MAX, z),
        gridStyle
      )
    );
  }

  return lines.join("");
}


/* -----------------------------------------
   Achsen und Zahlen
   ----------------------------------------- */

function k01Axes(){
  const origin = k01Project(0, 0, 0);

  const xEnd = k01Project(5.8, 0, 0);
  const yEnd = k01Project(0, 5.9, 0);
  const zEnd = k01Project(0, 0, 5.8);

  const axisStyle =
    "stroke:#172c37;stroke-width:4;fill:none;marker-end:url(#k01-arrow);";

  let numbers = "";

  for(let value = 1; value <= K01_MAX; value++){
    const x = k01Project(value, 0, 0);
    const y = k01Project(0, value, 0);
    const z = k01Project(0, 0, value);

    numbers += `
      <text
        x="${x.x}"
        y="${x.y + 30}"
        text-anchor="middle"
        style="font-size:17px;font-weight:700;fill:#425563;">
        ${value}
      </text>

      <text
        x="${y.x - 15}"
        y="${y.y + 7}"
        text-anchor="end"
        style="font-size:17px;font-weight:700;fill:#425563;">
        ${value}
      </text>

      <text
        x="${z.x - 15}"
        y="${z.y + 6}"
        text-anchor="end"
        style="font-size:17px;font-weight:700;fill:#425563;">
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
          style="fill:#172c37;">
        </path>
      </marker>
    </defs>

    ${k01SvgLine(origin, xEnd, axisStyle)}
    ${k01SvgLine(origin, yEnd, axisStyle)}
    ${k01SvgLine(origin, zEnd, axisStyle)}

    <text
      x="${origin.x + 10}"
      y="${origin.y + 28}"
      style="font-size:17px;font-weight:700;fill:#425563;">
      0
    </text>

    ${numbers}

    <text
      x="${xEnd.x + 14}"
      y="${xEnd.y + 8}"
      style="font-size:27px;font-weight:900;fill:#173e51;">
      x
    </text>

    <text
      x="${yEnd.x - 11}"
      y="${yEnd.y - 8}"
      style="font-size:27px;font-weight:900;fill:#173e51;">
      y
    </text>

    <text
      x="${zEnd.x + 14}"
      y="${zEnd.y + 7}"
      style="font-size:27px;font-weight:900;fill:#173e51;">
      z
    </text>
  `;
}


/* -----------------------------------------
   Punkt und Hilfslinien
   ----------------------------------------- */

function k01PointDrawing(point, label, showGuides = true){
  const p = k01Project(point.x, point.y, point.z);

  const ground = k01Project(point.x, point.y, 0);
  const xProjection = k01Project(point.x, 0, 0);
  const yProjection = k01Project(0, point.y, 0);

  const guideStyle =
    "stroke:#e63946;stroke-width:2.6;stroke-dasharray:8 7;fill:none;";

  return `
    ${
      showGuides
        ? `
          ${k01SvgLine(p, ground, guideStyle)}
          ${k01SvgLine(ground, xProjection, guideStyle)}
          ${k01SvgLine(ground, yProjection, guideStyle)}

          <circle
            cx="${ground.x}"
            cy="${ground.y}"
            r="4"
            style="fill:#e63946;">
          </circle>
        `
        : ""
    }

    <circle
      cx="${p.x}"
      cy="${p.y}"
      r="14"
      style="
        fill:none;
        stroke:#e63946;
        stroke-width:3;
        opacity:0.28;
      ">
    </circle>

    <circle
      cx="${p.x}"
      cy="${p.y}"
      r="8"
      style="
        fill:#e63946;
        stroke:white;
        stroke-width:2;
      ">
    </circle>

    <text
      x="${p.x + 16}"
      y="${p.y - 13}"
      style="
        font-size:26px;
        font-weight:900;
        fill:#b21e2b;
        paint-order:stroke;
        stroke:white;
        stroke-width:5px;
      ">
      ${label}
    </text>
  `;
}


/* -----------------------------------------
   Gesamte Grafik
   easy  = Gitter + Hilfslinien
   medium = Kanten + Hilfslinien
   hard  = Kanten ohne Hilfslinien
   ----------------------------------------- */

function k01CubeSvg(point, mode = "easy", label = "A"){
  const showGrid = mode === "easy";
  const showGuides = mode !== "hard";

  return `
    <div style="
      max-width:720px;
      margin:18px auto;
      padding:14px;
      background:white;
      border:1px solid #e5ded3;
      border-radius:18px;
    ">

      <svg
        viewBox="0 0 650 520"
        style="
          display:block;
          width:100%;
          height:auto;
        "
        role="img"
        aria-label="Koordinatenwürfel mit Punkt ${label}">

        ${showGrid ? k01FullGrid() : ""}

        ${k01CubeEdges()}
        ${k01Axes()}
        ${k01PointDrawing(point, label, showGuides)}

      </svg>

      <p style="
        margin:8px 0 0;
        text-align:center;
        color:#607080;
        font-size:0.95rem;
      ">
        ${
          mode === "easy"
            ? "Vollständiges Gitter mit Hilfslinien."
            : mode === "medium"
              ? "Nur Aussenkanten mit Hilfslinien."
              : "Nur Aussenkanten ohne Hilfslinien."
        }
      </p>

    </div>
  `;
}


/* =========================================
   Generator 1 · Einfach
   ========================================= */

function genK01Easy(){
  const point = k01RandomPoint();
  const label = pick(["A", "B", "C"]);

  return {
    badge: "K01 · Koordinaten ablesen · einfach",

    ziel:
      "Die Koordinaten eines Punktes im räumlichen Gitter ablesen.",

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


/* =========================================
   Generator 2 · Mittel
   ========================================= */

function genK01Medium(){
  const point = k01RandomPoint();
  const label = pick(["A", "B", "C"]);

  return {
    badge: "K01 · Koordinaten ablesen · mittel",

    ziel:
      "Die Koordinaten eines Punktes mit wenigen Hilfslinien ablesen.",

    text: `
      <p>
        Im Würfel sind nur die Aussenkanten und Hilfslinien sichtbar.
      </p>

      ${k01CubeSvg(point, "medium", label)}
    `,

    ask:
      `Bestimme die Koordinaten von ${label}.`,

    answer:
      coordinateAnswer(point.x, point.y, point.z),

    hint1:
      "Projiziere den Punkt auf die Grundfläche.",

    hint2:
      "Bestimme auf der Grundfläche zuerst x und y.",

    hint3:
      `Die z-Koordinate beträgt ${point.z}.`,

    solution: `
      <strong>
        ${label} (${point.x} / ${point.y} / ${point.z})
      </strong>
    `
  };
}


/* =========================================
   Generator 3 · Schwer
   ========================================= */

function genK01Hard(){
  const point = k01RandomPoint();
  const label = pick(["A", "B", "C"]);

  return {
    badge: "K01 · Koordinaten ablesen · schwierig",

    ziel:
      "Die Koordinaten eines Punktes ohne eingezeichnete Hilfslinien bestimmen.",

    text: `
      <p>
        Im Würfel sind nur die Aussenkanten sichtbar.
      </p>

      ${k01CubeSvg(point, "hard", label)}
    `,

    ask:
      `Bestimme die Koordinaten von ${label}.`,

    answer:
      coordinateAnswer(point.x, point.y, point.z),

    hint1:
      "Stelle dir die senkrechte Projektion auf die Grundfläche vor.",

    hint2:
      "Bestimme zuerst x und y, danach z.",

    hint3:
      `Die z-Koordinate beträgt ${point.z}.`,

    solution: `
      <strong>
        ${label} (${point.x} / ${point.y} / ${point.z})
      </strong>
    `
  };
}


/* =========================================
   Generator 4 · Fehlende Koordinate
   ========================================= */

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
      "Eine fehlende räumliche Koordinate ergänzen.",

    text: `
      <p>
        Bei Punkt <strong>A</strong> fehlt eine Koordinate:
      </p>

      <p style="
        max-width:300px;
        margin:15px auto;
        padding:12px 18px;
        border:2px solid #cbd5df;
        border-radius:12px;
        background:#f5f8fa;
        text-align:center;
        font-size:1.3rem;
      ">
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
        ? "Die z-Koordinate beschreibt die Höhe."
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
   Trainer
   ========================================= */

TRAINERS["koordinaten"] = {
  title: "K01 · Räumliche Koordinaten",

  info:
    "Koordinaten in einem Würfel ablesen und ergänzen.",

  generators: [
    genK01Easy,
    genK01Medium,
    genK01Hard,
    genK01Missing
  ]
};
