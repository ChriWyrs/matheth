// ===============================
// S01 – Steigung berechnen
// ===============================

function slopeTriangleSvg(horizontal, rise, unit = "m") {
  return `
  <div class="slope-svg-wrap">
    <svg viewBox="0 0 520 260" class="slope-svg">

      <polygon
        points="70,200 410,200 410,70"
        class="slope-fill"></polygon>

      <line
        x1="70" y1="200"
        x2="410" y2="200"
        class="slope-line-horizontal"></line>

      <line
        x1="410" y1="200"
        x2="410" y2="70"
        class="slope-line-vertical"></line>

      <line
        x1="70" y1="200"
        x2="410" y2="70"
        class="slope-line-hyp"></line>

      <circle cx="70" cy="200" r="5" class="slope-dot"></circle>
      <circle cx="410" cy="70" r="5" class="slope-dot"></circle>

      <path
        d="M382 200 L382 172 L410 172"
        class="slope-right-angle"></path>

      <text
        x="240"
        y="235"
        text-anchor="middle"
        class="slope-text-horizontal">
        ${horizontal} ${unit}
      </text>

      <text
        x="240"
        y="255"
        text-anchor="middle"
        class="slope-label">
        Horizontaldistanz
      </text>

      <text
        x="440"
        y="130"
        class="slope-text-vertical">
        ${rise} ${unit}
      </text>

      <text
        x="440"
        y="152"
        class="slope-label">
        Höhendifferenz
      </text>

    </svg>
  </div>
  `;
}



function genSlopePercent(){

  const cases=[

    {ctx:"Garageneinfahrt",h:8,rise:0.8,unit:"m"},
    {ctx:"Garageneinfahrt",h:12,rise:1.8,unit:"m"},
    {ctx:"Garageneinfahrt",h:15,rise:3,unit:"m"},

    {ctx:"Rampe",h:10,rise:1,unit:"m"},
    {ctx:"Rampe",h:20,rise:3,unit:"m"},

    {ctx:"Strasse",h:40,rise:6,unit:"m"},

    {ctx:"Veloweg",h:30,rise:3,unit:"m"},

    {ctx:"Wanderweg",h:250,rise:50,unit:"m"}

  ];

  const c=pick(cases);

  const percent=Math.round(c.rise/c.h*10000)/100;

  return{

    badge:"S01 · Steigung",

    ziel:"Steigung in Prozent berechnen.",

    text:`

      <p>
        <strong>${c.ctx}</strong>
      </p>

      ${slopeTriangleSvg(c.h,c.rise,c.unit)}

    `,

    ask:"Wie gross ist die Steigung in Prozent?",

    answer:percent,

    hint1:
      "Du brauchst die Höhendifferenz und die Horizontaldistanz.",

    hint2:
      "Steigung = Höhendifferenz ÷ Horizontaldistanz × 100",

    hint3:
      `${c.rise} ÷ ${c.h} × 100`,

    solution:`

      ${c.rise} ÷ ${c.h} × 100
      = <strong>${percent} %</strong>

      <br><br>

      ${
        percent<=10
        ? "Diese Steigung ist eher flach."

        : percent<=20
        ? "Diese Steigung ist gut befahrbar."

        : "Diese Steigung ist sehr steil."
      }

    `

  };

}



TRAINERS["steigung"]={

  title:"S01 · Steigung berechnen",

  info:"Steigungen in Prozent berechnen.",

  generators:[
    genSlopePercent
  ]

};
