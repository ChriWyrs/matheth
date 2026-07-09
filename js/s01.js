
function genSlopePercent(){
  const cases=[
    {ctx:"Garageneinfahrt",h:12,rise:1.8,unit:"m"},
    {ctx:"Rampe",h:8,rise:0.8,unit:"m"},
    {ctx:"Strasse",h:30,rise:4.5,unit:"m"},
    {ctx:"Veloweg",h:40,rise:2.4,unit:"m"},
    {ctx:"Wanderweg",h:250,rise:50,unit:"m"},
    {ctx:"Skilift",h:1200,rise:300,unit:"m"}
  ];

  const c=pick(cases);
  const percent=Math.round((c.rise/c.h)*10000)/100;

  return {
    badge:"S01 · Steigung",
    ziel:"Eine Steigung in Prozent berechnen.",
    text:`
      <p><strong>${c.ctx}</strong></p>
      <div class="prompt">
        <p>Horizontaldistanz: <strong>${c.h} ${c.unit}</strong></p>
        <p>Höhendifferenz: <strong>${c.rise} ${c.unit}</strong></p>
      </div>
    `,
    ask:"Wie gross ist die Steigung in Prozent?",
    answer:percent,
    hint1:"Du brauchst die Höhendifferenz und die Horizontaldistanz.",
    hint2:"Formel: Steigung = Höhendifferenz : Horizontaldistanz · 100",
    hint3:`Rechne: ${c.rise} : ${c.h} · 100`,
    solution:`
      ${c.rise} : ${c.h} · 100 = <strong>${percent} %</strong>.<br>
      ${percent<10 ? "Das ist eher flach." : percent<=20 ? "Das ist deutlich spürbar, aber noch im üblichen Bereich." : "Das ist sehr steil."}
    `
  };
}

TRAINERS["steigung"]={
  title:"S01 · Steigung berechnen",
  info:"Steigung in Prozent berechnen und einordnen.",
  generators:[genSlopePercent]
};
