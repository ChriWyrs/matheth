function genAirDistance(){
  const cases=[
    {ctx:"Skilift",h:1200,rise:300,unit:"m"},
    {ctx:"Standseilbahn",h:900,rise:120,unit:"m"},
    {ctx:"Materialseilbahn",h:600,rise:80,unit:"m"},
    {ctx:"Wanderweg",h:400,rise:30,unit:"m"},
    {ctx:"Bergweg",h:1500,rise:450,unit:"m"},
    {ctx:"Seilbahn",h:2500,rise:700,unit:"m"}
  ];

  const c=pick(cases);
  const hyp=Math.round(Math.sqrt(c.h*c.h+c.rise*c.rise)*10)/10;

  return{
    badge:"S03 · Luftlinie",
    ziel:"Die Luftlinie im Steigungsdreieck berechnen.",
    text:`
      <p><strong>${c.ctx}</strong></p>
      ${slopeTriangleSvg(c.h,c.rise,c.unit)}
      <p>Gesucht ist die schräge Strecke im Steigungsdreieck.</p>
    `,
    ask:`Wie lang ist die Luftlinie in ${c.unit}?`,
    answer:numberAnswer(hyp),
    hint1:"Die Luftlinie ist die schräge Seite des rechtwinkligen Dreiecks.",
    hint2:"Verwende den Satz des Pythagoras.",
    hint3:`Luftlinie = √(${c.h}² + ${c.rise}²)`,
    solution:`
      Luftlinie = √(${c.h}² + ${c.rise}²)<br>
      = <strong>${hyp} ${c.unit}</strong>
    `
  };
}

TRAINERS["luftlinie"]={
  title:"S03 · Luftlinie",
  info:"Die schräge Strecke im Steigungsdreieck berechnen.",
  generators:[
    genAirDistance
  ]
};
