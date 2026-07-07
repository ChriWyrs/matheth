function makeLinearValues(a,b){
  const values={};
  [1,2,3,4,5,6,10,50,100,150].forEach(n=>values[n]=a*n+b);
  values.n = linearTermText(a,b);
  return values;
}

function genLinearFindTerm(){
  const a=rand(2,8);
  const b=rand(-9,9);
  const values=makeLinearValues(a,b);

  return {
    badge:"G05 · Term bestimmen",
    ziel:"Aus einer Wertetabelle den Term einer linearen Folge bestimmen.",
    text:`
      <p>Die Folge wächst regelmässig. Ergänze den Term.</p>
      ${sequenceTable(values,{hidden:["5","50","n"]})}
    `,
    ask:"Bestimme den Term T(n). Beispiel: 4n-1",
    answer:{kind:"linear",a,b},
    hint1:"Vergleiche zwei benachbarte Werte.",
    hint2:`Die 1. Differenzfolge ist immer ${a}. Der Term beginnt mit ${a}n.`,
    hint3:"Setze n = 1 ein und vergleiche mit dem ersten Wert.",
    solution:`Der Term lautet <strong>T(n) = ${values.n}</strong>.`
  };
}

TRAINERS["linear-folge"] = {
  title:"G05 · Lineare Zahlenfolgen",
  info:"Wertetabellen, Terme und fehlende Werte.",
  generators:[genLinearFindTerm]
};
