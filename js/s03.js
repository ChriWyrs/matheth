
function genAirDistance(){

  const cases=[
    {ctx:"Skilift",h:1200,rise:300,unit:"m"},
    {ctx:"Standseilbahn",h:900,rise:120,unit:"m"},
    {ctx:"Materialseilbahn",h:600,rise:80,unit:"m"},
    {ctx:"Wanderweg",h:400,rise:30,unit:"m"}
  ];

  const c=pick(cases);

  const hyp=Math.round(Math.sqrt(c.h*c.h+c.rise*c.rise)*10)/10;

  return{

    badge:"S03 · Pythagoras",

    ziel:"Die Luftlinie mit dem Satz des Pythagoras berechnen.",

    text:`
      <p><strong>${c.ctx}</strong></p>
      ${slopeTriangleSvg(c.h,c.rise,c.unit)}
    `,

    ask:`Wie lang ist die Luftlinie in ${c.unit}?`,

    answer:numberAnswer(hyp),

    hint1:"Es handelt sich um ein rechtwinkliges Dreieck.",

    hint2:"Verwende den Satz des Pythagoras.",

    hint3:`√(${c.h}² + ${c.rise}²)`,

    solution:`
      √(${c.h}² + ${c.rise}²)
      =
      <strong>${hyp} ${c.unit}</strong>
    `
  };

}

TRAINERS["luftlinie"]={

  title:"S03 · Luftlinie",

  info:"Satz des Pythagoras im Steigungsdreieck.",

  generators:[
    genAirDistance
  ]

};
