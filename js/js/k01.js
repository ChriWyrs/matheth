
/* =========================================
   K01 · 3D-Koordinaten im Gelände
   Thema 2 · Stuckli – Nüsell – Wildspitz
   ========================================= */

function coordinateAnswer(x, y, z){
  return {
    kind: "coordinates",
    values: [x, y, z]
  };
}

function project3D(x, y, z){
  const originX = 300;
  const originY = 300;

  return {
    x: originX + x * 4.2 - y * 2.8,
    y: originY - y * 1.55 - z * 0.48
  };
}

function terrainCoordinateSvg(point){
  const xValues = [0, 10, 20, 30, 40, 50];
  const yValues = [0, 10, 20, 30, 40, 50];

  const point3D = project3D(point.x, point.y, point.z);
  const groundPoint = project3D(point.x, point.y, 0);
  const xProjection = project3D(point.x, 0, 0);
  const yProjection = project3D(0, point.y, 0);

  const xGrid = xValues.map(x => {
    const start = project3D(x, 0, 0);
    const end = project3D(x, 50, 0);

    return `
      <line
        x1="${start.x}" y1="${start.y}"
        x2="${end.x}" y2="${end.y}"
        class="coord-grid-line">
      </line>
    `;
  }).join("");

  const yGrid = yValues.map(y => {
    const start = project3D(0, y, 0);
    const end = project3D(50, y, 0);

    return `
      <line
        x1="${start.x}" y1="${start.y}"
        x2="${end.x}" y2="${end.y}"
        class="coord-grid-line">
      </line>
    `;
  }).join("");

  const xLabels = xValues.slice(1).map(x => {
    const p = project3D(x, 0, 0);

    return `
      <text
        x="${p.x}"
        y="${p.y + 24}"
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

  const heightLines = [50, 100, 150, 200, 250, 300].map(z => {
    const p = project3D(0, 0, z);

    return `
      <line
        x1="${p.x - 6}" y1="${p.y}"
        x2="${p.x + 6}" y2="${p.y}"
        class="coord-height-mark">
      </line>

      <text
        x="${p.x - 12}"
        y="${p.y + 5}"
        text-anchor="end"
        class="coord-axis-number">
        ${z}
      </text>
    `;
  }).join("");

  return `
    <div class="coordinate-svg-wrap">

      <svg
        class="coordinate-svg"
        viewBox="0 0 620 390"
        role="img"
        aria-label="Dreidimensionales Koordinatensystem mit Punkt A">

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

        <!-- x-Achse -->
        <line
          x1="${project3D(0,0,0).x}"
          y1="${project3D(0,0,0).y}"
          x2="${project3D(55,0,0).x}"
          y2="${project3D(55,0,0).y}"
          class="coord-axis">
        </line>

        <!-- y-Achse -->
        <line
          x1="${project3D(0,0,0).x}"
          y1="${project3D(0,0,0).y}"
          x2="${project3D(0,55,0).x}"
          y2="${project3D(0,55,0).y}"
          class="coord-axis">
        </line>

        <!-- Höhenachse -->
        <line
          x1="${project3D(0,0,0).x}"
          y1="${project3D(0,0,0).y}"
          x2="${project3D(0,0,330).x}"
          y2="${project3D(0,0,330).y}"
          class="coord-axis">
        </line>

        ${xLabels}
        ${yLabels}
        ${heightLines}

        <text
          x="${project3D(56,0,0).x}"
          y="${project3D(56,0,0).y + 18}"
          class="coord-axis-label">
          x
        </text>

        <text
          x="${project3D(0,56,0).x - 10}"
          y="${project3D(0,56,0).y}"
          class="coord-axis-label">
          y
        </text>

        <text
          x="${project3D(0,0,335).x + 10}"
          y="${project3D(0,0,335).y}"
          class="coord-axis-label">
          Höhe
        </text>

        <!-- Hilfslinien -->
        <line
          x1="${point3D.x}"
          y1="${point3D.y}"
          x2="${groundPoint.x}"
          y2="${groundPoint.y}"
          class="coord-guide coord-guide-height">
        </line>

        <line
          x1="${groundPoint.x}"
          y1="${groundPoint.y}"
          x2="${xProjection.x}"
          y2="${xProjection.y}"
          class="coord-guide">
        </line>

        <line
          x1="${groundPoint.x}"
          y1="${groundPoint.y}"
          x2="${yProjection.x}"
          y2="${yProjection.y}"
          class="coord-guide">
        </line>

        <!-- Punkt A -->
        <circle
          cx="${point3D.x}"
          cy="${point3D.y}"
          r="9"
          class="coord-point">
        </circle>

        <circle
          cx="${point3D.x}"
          cy="${point3D.y}"
          r="15"
          class="coord-point-ring">
        </circle>

        <text
          x="${point3D.x + 17}"
          y="${point3D.y - 12}"
          class="coord-point-label">
          A
        </text>

      </svg>

      <p class="coordinate-note">
        Lies zuerst die x- und y-Koordinate am Boden und danach die Höhe ab.
      </p>

    </div>
  `;
}

function createCoordinateCase(){
  const horizontalValues = [10, 20, 30, 40, 50];
  const heightValues = [50, 100, 150, 200, 250, 300];

  return {
    x: pick(horizontalValues),
    y: pick(horizontalValues),
    z: pick(heightValues)
  };
}

function genCoordinateRead(){
  const point = createCoordinateCase();

  return {
    badge: "K01 · 3D-Koordinaten",

    ziel:
      "Die drei Koordinaten eines Punktes in einer räumlichen Darstellung ablesen.",

    text: `
      <p>
        Im Gelände ist der weisse Punkt <strong>A</strong> markiert.
      </p>

      ${terrainCoordinateSvg(point)}
    `,

    ask:
      "Bestimme die Koordinaten von A. Schreibe zum Beispiel: 20 / 30 / 150",

    answer:
      coordinateAnswer(point.x, point.y, point.z),

    hint1:
      "Die ersten beiden Koordinaten liest du auf der Grundfläche ab.",

    hint2:
      "Verfolge die gestrichelten Hilfslinien von A bis zur x- und y-Achse.",

    hint3:
      `Die Höhe des Punktes beträgt ${point.z} m.`,

    solution: `
      Der Punkt liegt bei

      <strong>
        A (${point.x} / ${point.y} / ${point.z})
      </strong>.
    `
  };
}

function genCoordinateHeight(){
  const point = createCoordinateCase();

  return {
    badge: "K01 · Höhe ablesen",

    ziel:
      "Die Höhenkoordinate eines Punktes in einer räumlichen Darstellung ablesen.",

    text: `
      <p>
        Der Punkt <strong>A</strong> liegt im dargestellten Gelände.
      </p>

      ${terrainCoordinateSvg(point)}
    `,

    ask:
      "Wie gross ist die Höhenkoordinate von A?",

    answer:
      numberAnswer(point.z),

    hint1:
      "Die Höhenkoordinate ist die dritte Koordinate.",

    hint2:
      "Verfolge die senkrechte Hilfslinie vom Boden bis zum Punkt A.",

    hint3:
      "Vergleiche die Höhe mit der senkrechten Skala links.",

    solution: `
      Die Höhenkoordinate beträgt

      <strong>${point.z} m</strong>.
    `
  };
}

TRAINERS["koordinaten"] = {
  title: "K01 · Koordinaten im Gelände",

  info:
    "Dreidimensionale Koordinaten und Höhenangaben ablesen.",

  generators: [
    genCoordinateRead,
    genCoordinateHeight
  ]
};
