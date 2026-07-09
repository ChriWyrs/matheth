function slopeTriangleSvg(horizontal, rise, unit="m"){
  return `
    <div class="slope-svg-wrap">
      <svg viewBox="0 0 520 260" class="slope-svg">
        <polygon points="70,200 410,200 410,70" class="slope-fill"></polygon>
        <line x1="70" y1="200" x2="410" y2="200" class="slope-line-horizontal"></line>
        <line x1="410" y1="200" x2="410" y2="70" class="slope-line-vertical"></line>
        <line x1="70" y1="200" x2="410" y2="70" class="slope-line-hyp"></line>
        <path d="M382 200 L382 172 L410 172" class="slope-right-angle"></path>

        <text x="240" y="235" text-anchor="middle" class="slope-text-horizontal">${horizontal} ${unit}</text>
        <text x="240" y="255" text-anchor="middle" class="slope-label">Horizontaldistanz</text>

        <text x="430" y="130" class="slope-text-vertical">${rise} ${unit}</text>
        <text x="430" y="152" class="slope-label">Höhendifferenz</text>
      </svg>
    </div>
  `;
}

function numberAnswer(value){
  return {kind:"number",value:value};
}

function genSlopeBase(){
  const cases=[
    {ctx:"Garageneinfahrt",h:8,rise:0.8,unit:"m"},
    {ctx:"Garageneinfahrt",h:12,rise:1.8,unit:"m"},
    {ctx:"Garageneinfahrt",h:15,rise:3,unit:"m"},
    {ctx:"Rampe",h:10,rise:1,unit:"m"},
    {ctx:"Rampe",h:20,rise:3,unit:"m"},
    {ctx:"Strasse",h:40,rise:6,unit:"m"},
    {ctx:"Veloweg",h:30,rise:3,unit:"m"},
    {ctx:"Wanderweg",h:250,rise:50,unit:"m"},
    {ctx:"Skilift",h:1200,rise:300,unit:"m"}
  ];

  const c=pick(cases);
  c.percent=Math.round((c.rise/c.h)*10000)/100;
  return c;
}

function slopeJudgement(percent){
  if(percent<=10){
    return {
      word:"flach",
      text:"Diese Steigung ist eher flach und gut machbar."
    };
  }

  if(percent<=20){
    return {
      word:"steil",
      text:"Diese Steigung ist deutlich spürbar, aber für eine Garageneinfahrt noch etwa im üblichen Bereich."
    };
  }

  return {
    word:"zu steil",
    text:"Diese Steigung ist sehr steil und wäre für eine Garageneinfahrt kritisch."
  };
}

function genSlopePercent(){
  const c=genSlopeBase();
  const judgement=slopeJudgement(c.percent);

  return {
    badge:"S01 · Steigung",
    ziel:"Steigung in Prozent berechnen.",
    text:`
      <p><strong>${c.ctx}</strong></p>
      ${slopeTriangleSvg(c.h,c.rise,c.unit)}
    `,
    ask:"Wie gross ist die Steigung in Prozent?",
    answer:numberAnswer(c.percent),
    hint1:"Du brauchst die Höhendifferenz und die Horizontaldistanz.",
    hint2:"Steigung = Höhendifferenz ÷ Horizontaldistanz × 100",
    hint3:`${c.rise} ÷ ${c.h} × 100`,
    solution:`
      ${c.rise} ÷ ${c.h} × 100 = <strong>${c.percent} %</strong><br><br>
      ${judgement.text}
    `
  };
}

function genSlopeRise(){
  const c=genSlopeBase();

  return {
    badge:"S01 · Höhendifferenz",
    ziel:"Aus Steigung und Horizontaldistanz die Höhendifferenz berechnen.",
    text:`
      <p><strong>${c.ctx}</strong></p>
      ${slopeTriangleSvg(c.h,"?",c.unit)}
      <p>Die Steigung beträgt <strong>${c.percent} %</strong>.</p>
    `,
    ask:`Wie gross ist die Höhendifferenz in ${c.unit}?`,
    answer:numberAnswer(c.rise),
    hint1:"Gesucht ist die Höhe im Steigungsdreieck.",
    hint2:"Höhendifferenz = Horizontaldistanz · Steigung ÷ 100",
    hint3:`${c.h} · ${c.percent} ÷ 100`,
    solution:`
      ${c.h} · ${c.percent} ÷ 100 = <strong>${c.rise} ${c.unit}</strong>
    `
  };
}

function genSlopeHorizontal(){
  const c=genSlopeBase();

  return {
    badge:"S01 · Horizontaldistanz",
    ziel:"Aus Steigung und Höhendifferenz die Horizontaldistanz berechnen.",
    text:`
      <p><strong>${c.ctx}</strong></p>
      ${slopeTriangleSvg("?",c.rise,c.unit)}
      <p>Die Steigung beträgt <strong>${c.percent} %</strong>.</p>
    `,
    ask:`Wie gross ist die Horizontaldistanz in ${c.unit}?`,
    answer:numberAnswer(c.h),
    hint1:"Gesucht ist die waagrechte Strecke im Steigungsdreieck.",
    hint2:"Horizontaldistanz = Höhendifferenz · 100 ÷ Steigung",
    hint3:`${c.rise} · 100 ÷ ${c.percent}`,
    solution:`
      ${c.rise} · 100 ÷ ${c.percent} = <strong>${c.h} ${c.unit}</strong>
    `
  };
}

function genSlopeJudge(){
  const c=genSlopeBase();
  const judgement=slopeJudgement(c.percent);

  return {
    badge:"S02 · Beurteilen",
    ziel:"Eine Steigung sinnvoll einordnen.",
    text:`
      <p><strong>${c.ctx}</strong></p>
      ${slopeTriangleSvg(c.h,c.rise,c.unit)}
      <p>Die Steigung beträgt <strong>${c.percent} %</strong>.</p>
    `,
    ask:"Wie beurteilst du diese Steigung? Schreibe: flach, steil oder zu steil.",
    answer:judgement.word,
    hint1:"Vergleiche die Steigung mit 10 % und 20 %.",
    hint2:"Bis etwa 10 % wirkt eher flach. Um 20 % ist schon deutlich steil.",
    hint3:`Hier sind es ${c.percent} %.`,
    solution:`
      Richtige Einordnung: <strong>${judgement.word}</strong><br><br>
      ${judgement.text}
    `
  };
}

TRAINERS["steigung"]={
  title:"S01/S02 · Steigungsdreieck",
  info:"Steigung, Höhendifferenz, Horizontaldistanz und Beurteilung.",
  generators:[
    genSlopePercent,
    genSlopeRise,
    genSlopeHorizontal,
    genSlopeJudge
  ]
};
