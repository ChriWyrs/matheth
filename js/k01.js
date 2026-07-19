/* =========================================
   K01 · 3D-Koordinaten im Gelände
   Thema 2 · Stuckli – Nüsell – Wildspitz
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
   Projektion
   ----------------------------------------- */

function project3D(x, y, z){
  const originX = 305;
  const originY = 330;

  return {
    x: originX + x * 4.4 - y * 2.9,
    y: originY - y * 1.55 - z * 0.5
  };
}


/* -----------------------------------------
   Zufälliger Koordinatenpunkt
   ----------------------------------------- */

function createCoordinateCase(){
  const horizontalValues = [10, 20, 30, 40, 50];
  const heightValues = [50, 100, 150, 200, 250, 300];

  return {
    x: pick(horizontalValues),
    y: pick(horizontalValues),
    z: pick(heightValues)
  };
}


/* -----------------------------------------
   Mehrere verschiedene Punkte erzeugen
   ----------------------------------------- */

function createCoordinatePoints(count = 4){
  const labels = ["A", "B", "C", "D"];
  const points = [];
  const used = new Set();

  while(points.length < count){
    const point = createCoordinateCase();
    const key = `${point.x}-${point.y}-${point.z}`;

    if(!used.has(key)){
      used.add(key);

      points.push({
        ...point,
        label: labels[points.length]
      });
    }
  }

  return points;
}


/* -----------------------------------------
   SVG-Hilfsfunktionen
   ----------------------------------------- */

function svgLine(a, b, className){
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

function mountainDecoration(){
  return `
    <g class="coord-mountains" aria-hidden="true">

      <path
        d="M84 286
           L130 225
           L155 254
           L194 199
           L243 283
           Z">
      </path>

      <path
        d="M390 285
           L433 224
           L458 254
           L487 213
           L548 286
           Z">
      </path>

      <path
        d="M174 283
           L212 241
           L245 265
           L278 219
           L327 284
           Z">
      </path>

    </g>
  `;
}


/* -----------------------------------------
   Einzelner Punkt
   ----------------------------------------- */

function terrainCoordinateSvg(point, options = {}){
  const label = options.label || point.label || "A";
  const showGuides = options.showGuides !== false;
  const showNote = options.showNote !== false;

  const xValues = [0, 10, 20, 30, 40, 50];
  const yValues = [0, 10, 20, 30, 40, 50];
  const zValues = [50, 100, 150, 200, 250, 300];

  const origin = project3D(0, 0, 0);
  const point3D = project3D(point.x, point.y, point.z);
  const groundPoint = project3D(point.x, point.y, 0);
  const xProjection = project3D(point.x, 0, 0);
  const yProjection = project3D(0, point.y, 0);

  const xGrid = xValues.map(x => {
    return svgLine(
      project3D(x, 0, 0),
      project3D(x, 50, 0),
      "coord-grid-line"
    );
  }).join("");

  const yGrid = yValues.map(y => {
    return svgLine(
      project3D(0, y, 0),
      project3D(50, y, 0),
      "coord-grid-line"
    );
  }).join("");

  const xLabels = xValues.slice(1).map(x => {
    const p = project3D(x, 0, 0);

    return `
      <text
        x="${p.x}"
        y="${p.y + 25}"
        text-anchor="middle"
        class="coord-axis-number">
        ${x}
      </text>
    `;
  }).join("");

  const yLabels = yValues.slice(1).map(y => {
    const p = project3D(0, y, 0);

    return `
      <text
        x="${p.x - 15}"
        y="${p.y + 5}"
        text-anchor="end"
        class="coord-axis-number">
        ${y}
      </text>
    `;
  }).join("");

  const heightMarks = zValues.map(z => {
    const p = project3D(0, 0, z);

    return `
      <line
        x1="${p.x - 7}"
        y1="${p.y}"
        x2="${p.x + 7}"
        y2="${p.y}"
        class="coord-height-mark">
      </line>

      <text
        x="${p.x - 13}"
        y="${p.y + 5}"
        text-anchor="end"
        class="coord-axis-number">
        ${z}
      </text>
    `;
  }).join("");

  const guides = showGuides
    ? `
      ${svgLine(point3D, groundPoint, "coord-guide coord-guide-height")}
      ${svgLine(groundPoint, xProjection, "coord-guide")}
      ${svgLine(groundPoint, yProjection, "coord-guide")}

      <circle
        cx="${groundPoint.x}"
        cy="${groundPoint.y}"
        r="4"
        class="coord-ground-point">
      </circle>
    `
    : "";

  return `
    <div class="coordinate-svg-wrap">

      <svg
        class="coordinate-svg"
        viewBox="0 0 620 410"
        role="img"
        aria-label="Dreidimensionales Koordinatensystem mit Punkt ${label}">

        <defs>
          <marker
            id="coord-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse">

            <path
              d="M 0 0 L 10 5 L 0 10 z"
              class="coord-arrow-head">
            </path>
          </marker>
        </defs>

        ${mountainDecoration()}

        <polygon
          points="
            ${project3D(0,0,0).x},${project3D(0,0,0).y}
            ${project3D(50,0,0).x},${project3D(50,0,0).y}
            ${project3D(50,50,0).x},${project3D(50,50,0).y}
            ${project3D(0,50,0).x},${project3D(0,50,0).y}
          "
          class="coord-ground">
        </polygon>

        ${xGrid}
        ${yGrid}

        ${svgLine(
          origin,
          project3D(56, 0, 0),
          "coord-axis coord-axis-arrow"
        )}

        ${svgLine(
          origin,
          project3D(0, 56, 0),
          "coord-axis coord-axis-arrow"
        )}

        ${svgLine(
          origin,
          project3D(0, 0, 335),
          "coord-axis coord-axis-arrow"
        )}

        ${xLabels}
        ${yLabels}
        ${heightMarks}

        <text
          x="${project3D(57,0,0).x + 4}"
          y="${project3D(57,0,0).y + 20}"
          class="coord-axis-label">
          x
        </text>

        <text
          x="${project3D(0,57,0).x - 12}"
          y="${project3D(0,57,0).y - 2}"
          class="coord-axis-label">
          y
        </text>

        <text
          x="${project3D(0,0,337).x + 12}"
          y="${project3D(0,0,337).y + 4}"
          class="coord-axis-label">
          Höhe
        </text>

        <text
          x="${origin.x + 11}"
          y="${origin.y + 19}"
          class="coord-origin-label">
          0
        </text>

        ${guides}

        <circle
          cx="${point3D.x}"
          cy="${point3D.y}"
          r="15"
          class="coord-point-ring">
        </circle>

        <circle
          cx="${point3D.x}"
          cy="${point3D.y}"
          r="8"
          class="coord-point">
        </circle>

        <text
          x="${point3D.x + 18}"
          y="${point3D.y - 13}"
          class="coord-point-label">
          ${label}
        </text>

      </svg>

      ${
        showNote
          ? `
            <p class="coordinate-note">
              Lies zuerst x und y auf der Grundfläche und danach die Höhe ab.
            </p>
          `
          : ""
      }

    </div>
  `;
}


/* -----------------------------------------
   Darstellung mit vier Punkten
   ----------------------------------------- */

function terrainMultiplePointsSvg(points){
  const xValues = [0, 10, 20, 30, 40, 50];
  const yValues = [0, 10, 20, 30, 40, 50];
  const zValues = [50, 100, 150, 200, 250, 300];

  const origin = project3D(0, 0, 0);

  const xGrid = xValues.map(x => {
    return svgLine(
      project3D(x, 0, 0),
      project3D(x, 50, 0),
      "coord-grid-line"
    );
  }).join("");

  const yGrid = yValues.map(y => {
    return svgLine(
      project3D(0, y, 0),
      project3D(50, y, 0),
      "coord-grid-line"
    );
  }).join("");

  const xLabels = xValues.slice(1).map(x => {
    const p = project3D(x, 0, 0);

    return `
      <text
        x="${p.x}"
        y="${p.y + 25}"
        text-anchor="middle"
        class="coord-axis-number">
        ${x}
      </text>
    `;
  }).join("");

  const yLabels = yValues.slice(1).map(y => {
    const p = project3D(0, y, 0);

    return `
      <text
        x="${p.x - 15}"
        y="${p.y + 5}"
        text-anchor="end"
        class="coord-axis-number">
        ${y}
      </text>
    `;
  }).join("");

  const heightMarks = zValues.map(z => {
    const p = project3D(0, 0, z);

    return `
      <line
        x1="${p.x - 7}"
        y1="${p.y}"
        x2="${p.x + 7}"
        y2="${p.y}"
        class="coord-height-mark">
      </line>

      <text
        x="${p.x - 13}"
        y="${p.y + 5}"
        text-anchor="end"
        class="coord-axis-number">
        ${z}
      </text>
    `;
  }).join("");

  const pointElements = points.map(point => {
    const p = project3D(point.x, point.y, point.z);
    const ground = project3D(point.x, point.y, 0);

    return `
      ${svgLine(p, ground, "coord-guide coord-guide-height")}

      <circle
        cx="${p.x}"
        cy="${p.y}"
        r="13"
        class="coord-point-ring">
      </circle>

      <circle
        cx="${p.x}"
        cy="${p.y}"
        r="7"
        class="coord-point">
      </circle>

      <text
        x="${p.x + 15}"
        y="${p.y - 11}"
        class="coord-point-label">
        ${point.label}
      </text>
    `;
  }).join("");

  return `
    <div class="coordinate-svg-wrap">

      <svg
        class="coordinate-svg"
        viewBox="0 0 620 410"
        role="img"
        aria-label="Dreidimensionales Koordinatensystem mit vier Punkten">

        <defs>
          <marker
            id="coord-arrow-multiple"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse">

            <path
              d="M 0 0 L 10 5 L 0 10 z"
              class="coord-arrow-head">
            </path>
          </marker>
        </defs>

        ${mountainDecoration()}

        <polygon
          points="
            ${project3D(0,0,0).x},${project3D(0,0,0).y}
            ${project3D(50,0,0).x},${project3D(50,0,0).y}
            ${project3D(50,50,0).x},${project3D(50,50,0).y}
            ${project3D(0,50,0).x},${project3D(0,50,0).y}
          "
          class="coord-ground">
        </polygon>

        ${xGrid}
        ${yGrid}

        <line
          x1="${origin.x}"
          y1="${origin.y}"
          x2="${project3D(56,0,0).x}"
          y2="${project3D(56,0,0).y}"
          class="coord-axis"
          marker-end="url(#coord-arrow-multiple)">
        </line>

        <line
          x1="${origin.x}"
          y1="${origin.y}"
          x2="${project3D(0,56,0).x}"
          y2="${project3D(0,56,0).y}"
          class="coord-axis"
          marker-end="url(#coord-arrow-multiple)">
        </line>

        <line
          x1="${origin.x}"
          y1="${origin.y}"
          x2="${project3D(0,0,335).x}"
          y2="${project3D(0,0,335).y}"
          class="coord-axis"
          marker-end="url(#coord-arrow-multiple)">
        </line>

        ${xLabels}
        ${yLabels}
        ${heightMarks}
        ${pointElements}

        <text
          x="${project3D(57,0,0).x + 4}"
          y="${project3D(57,0,0).y + 20}"
          class="coord-axis-label">
          x
        </text>

        <text
          x="${project3D(0,57,0).x - 12}"
          y="${project3D(0,57,0).y - 2}"
          class="coord-axis-label">
          y
        </text>

        <text
          x="${project3D(0,0,337).x + 12}"
          y="${project3D(0,0,337).y + 4}"
          class="coord-axis-label">
          Höhe
        </text>

      </svg>

      <p class="coordinate-note">
        Vergleiche alle drei Koordinaten sorgfältig.
      </p>

    </div>
  `;
}


/* =========================================
   GENERATOREN
   ========================================= */


/* -----------------------------------------
   1. Alle Koordinaten ablesen
   ----------------------------------------- */

function genCoordinateRead(){
  const point = createCoordinateCase();
  const label = pick(["A", "B", "C", "D"]);

  return {
    badge: "K01 · Koordinaten ablesen",

    ziel:
      "Die drei Koordinaten eines Punktes in einer räumlichen Darstellung ablesen.",

    text: `
      <p>
        Im Gelände ist der Punkt <strong>${label}</strong> markiert.
      </p>

      ${terrainCoordinateSvg(point, { label })}
    `,

    ask:
      `Bestimme die Koordinaten von ${label}. Schreibe zum Beispiel: 20 / 30 / 150`,

    answer:
      coordinateAnswer(point.x, point.y, point.z),

    hint1:
      "Die erste und die zweite Koordinate liest du auf der Grundfläche ab.",

    hint2:
      "Verfolge die gestrichelten Linien bis zu den x- und y-Achsen.",

    hint3:
      `Die dritte Koordinate ist die Höhe ${point.z} m.`,

    solution: `
      Der Punkt liegt bei

      <strong>
        ${label} (${point.x} / ${point.y} / ${point.z})
      </strong>.
    `
  };
}


/* -----------------------------------------
   2. Höhe ablesen
   ----------------------------------------- */

function genCoordinateHeight(){
  const point = createCoordinateCase();
  const label = pick(["A", "B", "C", "D"]);

  return {
    badge: "K01 · Höhe ablesen",

    ziel:
      "Die Höhenkoordinate eines Punktes ablesen.",

    text: `
      <p>
        Der Punkt <strong>${label}</strong> liegt im dargestellten Gelände.
      </p>

      ${terrainCoordinateSvg(point, { label })}
    `,

    ask:
      `Wie gross ist die Höhenkoordinate von ${label}?`,

    answer:
      numberAnswer(point.z),

    hint1:
      "Die Höhenkoordinate ist die dritte Koordinate.",

    hint2:
      "Verfolge die senkrechte gestrichelte Linie.",

    hint3:
      "Vergleiche den Punkt mit der Höhenskala links.",

    solution: `
      Die Höhenkoordinate von ${label} beträgt

      <strong>${point.z} m</strong>.
    `
  };
}


/* -----------------------------------------
   3. Fehlende x- oder y-Koordinate
   ----------------------------------------- */

function genCoordinateMissing(){
  const point = createCoordinateCase();
  const label = pick(["A", "B", "C", "D"]);
  const missing = pick(["x", "y"]);

  const shownCoordinates =
    missing === "x"
      ? `( ? / ${point.y} / ${point.z} )`
      : `( ${point.x} / ? / ${point.z} )`;

  const correctValue =
    missing === "x"
      ? point.x
      : point.y;

  return {
    badge: "K01 · Fehlende Koordinate",

    ziel:
      "Eine fehlende Koordinate aus der räumlichen Darstellung bestimmen.",

    text: `
      <p>
        Vom Punkt <strong>${label}</strong> sind zwei Koordinaten bekannt:
      </p>

      <p class="coordinate-given">
        <strong>${label} ${shownCoordinates}</strong>
      </p>

      ${terrainCoordinateSvg(point, { label })}
    `,

    ask:
      `Welche Zahl fehlt an der Stelle der ${missing}-Koordinate?`,

    answer:
      numberAnswer(correctValue),

    hint1:
      `Gesucht ist die ${missing}-Koordinate.`,

    hint2:
      "Verfolge die passende Hilfslinie auf der Grundfläche.",

    hint3:
      `Die gesuchte Koordinate beträgt ${correctValue}.`,

    solution: `
      Der Punkt lautet vollständig:

      <strong>
        ${label} (${point.x} / ${point.y} / ${point.z})
      </strong>.
    `
  };
}


/* -----------------------------------------
   4. Richtigen Punkt auswählen
   ----------------------------------------- */

function genCoordinateChoosePoint(){
  const points = createCoordinatePoints(4);
  const target = pick(points);

  return {
    badge: "K01 · Punkt erkennen",

    ziel:
      "Einen Punkt anhand seiner drei Koordinaten erkennen.",

    text: `
      <p>
        Vier Punkte sind im Gelände eingezeichnet.
      </p>

      <p class="coordinate-given">
        Gesucht ist der Punkt bei
        <strong>
          (${target.x} / ${target.y} / ${target.z})
        </strong>.
      </p>

      ${terrainMultiplePointsSvg(points)}
    `,

    ask:
      "Welcher Punkt besitzt diese Koordinaten? Gib A, B, C oder D ein.",

    answer:
      target.label,

    hint1:
      "Vergleiche zuerst die x-Koordinaten.",

    hint2:
      "Vergleiche danach die y-Koordinaten auf der Grundfläche.",

    hint3:
      `Der gesuchte Punkt liegt auf einer Höhe von ${target.z} m.`,

    solution: `
      Die Koordinaten gehören zum Punkt

      <strong>${target.label}</strong>.
    `
  };
}


/* =========================================
   TRAINER
   ========================================= */

TRAINERS["koordinaten"] = {
  title: "K01 · Koordinaten im Gelände",

  info:
    "Dreidimensionale Koordinaten lesen, ergänzen und zuordnen.",

  generators: [
    genCoordinateRead,
    genCoordinateHeight,
    genCoordinateMissing,
    genCoordinateChoosePoint
  ]
};
