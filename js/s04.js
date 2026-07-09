
function genWildspitzCombo(){
  const cases=[
    {start:"Steinerberg",ziel:"Wildspitz",horizKm:3.6,startH:615,zielH:1580},
    {start:"Talstation",ziel:"Bergstation",horizKm:2.8,startH:920,zielH:1370},
    {start:"Dorf",ziel:"Aussichtspunkt",horizKm:4.2,startH:740,zielH:1220},
    {start:"Seeufer",ziel:"Berghütte",horizKm:3.1,startH:560,zielH:1048}
  ];

  const c=pick(cases);
  const rise=c.zielH-c.startH;
  const horizM=c.horizKm*1000;
  const percent=Math.round((rise/horizM)*10000)/100;
  const air=Math.round(Math.sqrt(horizM*horizM+rise*rise));

  return{
    badge:"S04 · Kombi",
    ziel:"Höhendifferenz, Luftlinie und Steigung aus einer Situation bestimmen.",
    text:`
      <p><strong>${c.start} → ${c.ziel}</strong></p>
      <p>Start: <strong>${c.startH} m.ü.M.</strong></p>
      <p>Ziel: <strong>${c.zielH} m.ü.M.</strong></p>
      <p>Horizontaldistanz: <strong>${c.horizKm} km</strong></p>
      ${slopeTriangleSvg(c.horizKm,"?", "km")}
    `,
    ask:"Berechne die Höhendifferenz in m.",
    answer:numberAnswer(rise),
    hint1:"Die Höhendifferenz ist Zielhöhe minus Starthöhe.",
    hint2:`Rechne ${c.zielH} - ${c.startH}.`,
    hint3:"Achte darauf, dass beide Höhenangaben in Metern sind.",
    solution:`
      Höhendifferenz: ${c.zielH} - ${c.startH} = <strong>${rise} m</strong><br>
      Luftlinie: √(${horizM}² + ${rise}²) ≈ <strong>${air} m</strong><br>
      Steigung: ${rise} : ${horizM} · 100 ≈ <strong>${percent} %</strong>
    `
  };
}

TRAINERS["wildspitz"]={
  title:"S04 · Kombi-Aufgabe",
  info:"Höhendifferenz, Luftlinie und Steigung kombiniert.",
  generators:[genWildspitzCombo]
};
