function makeQuadraticValues(a,b,c){
  const values={};
  [1,2,3,4,5,6,10,50,100,150].forEach(n=>values[n]=a*n*n+b*n+c);
  values.n = quadraticTermText(a,b,c);
  return values;
}

function genQuadraticFindTerm(){
  const a=1;
  const b=rand(1,7);
  const c=rand(-9,5);
  const values=makeQuadraticValues(a,b,c);

  return {
    badge:"G06 · Term bestimmen",
    ziel:"Aus einer quadratischen Folge den Term bestimmen.",
    text:`
      <p>Die Folge wächst nicht regelmässig. Untersuche die Differenzfolgen.</p>
      ${sequenceTable(values,{columns:[1,2,3,4,5,50,"n"],hidden:["5","50","n"]})}
    `,
    ask:"Bestimme den Term T(n). Beispiel: n²+4n-1",
    answer:{kind:"quadratic",a,b,c},
    hint1:"Bilde zuerst die 1. Differenzfolge.",
    hint2:"Bilde danach die 2. Differenzfolge. Sie bleibt konstant.",
    hint3:"Der Term beginnt mit n². Prüfe dann mit n = 1 und n = 2.",
    solution:`Der passende Term lautet <strong>T(n) = ${values.n}</strong>.`
  };
}

function genQuadraticValue50(){
  const a=1;
  const b=rand(2,9);
  const c=rand(-9,4);
  const values=makeQuadraticValues(a,b,c);

  return {
    badge:"G06 · Wert berechnen",
    ziel:"Einen grossen Wert einer quadratischen Folge berechnen.",
    text:`
      <p>Bestimme zuerst den Term und berechne dann den gesuchten Wert.</p>
      ${sequenceTable(values,{columns:[1,2,3,4,5,50],hidden:["5","50"]})}
    `,
    ask:"Wie gross ist T(50)?",
    answer:values[50],
    hint1:"Bilde die 1. Differenzfolge.",
    hint2:"Die 2. Differenzfolge zeigt: Der Term enthält n².",
    hint3:`Der Term ist ${values.n}. Setze n = 50 ein.`,
    solution:`Der Term lautet <strong>T(n) = ${values.n}</strong>.<br>T(50) = <strong>${values[50]}</strong>.`
  };
}

function genQuadraticDiffSequence(){
  const a=1;
  const b=rand(1,6);
  const c=rand(-5,5);
  const values=makeQuadraticValues(a,b,c);
  const columns=[1,2,3,4,5];

  return {
    badge:"G06 · Differenzfolgen",
    ziel:"1. und 2. Differenzfolge erkennen.",
    text:`
      <p>Untersuche die Folge mit Hilfe der Differenzfolgen.</p>
      ${diffTable(values,columns)}
    `,
    ask:"Welcher Wert steht in der 2. Differenzfolge?",
    answer:2,
    hint1:"Berechne zuerst die Unterschiede zwischen benachbarten Folgengliedern.",
    hint2:"Vergleiche danach die Werte der 1. Differenzfolge miteinander.",
    hint3:"Bei einem Term mit n² ist die 2. Differenzfolge konstant 2.",
    solution:"Die 2. Differenzfolge ist konstant <strong>2</strong>."
  };
}

TRAINERS["quadratisch"] = {
  title:"G06 · Quadratische Zahlenfolgen",
  info:"Quadratische Folgen mit 1. und 2. Differenzfolge.",
  generators:[genQuadraticFindTerm,genQuadraticValue50,genQuadraticDiffSequence]
};
