function squareSvg(count,mode){
  const size=16;
  const gap=2;
  const cells=[];

  function add(x,y){cells.push({x,y});}

  if(mode==="bar"){
    for(let i=0;i<count;i++) add(i,0);
  }

  if(mode==="l"){
    for(let i=0;i<count;i++) add(i,0);
    for(let j=1;j<count;j++) add(0,j);
  }

  if(mode==="stair"){
    for(let r=0;r<count;r++){
      for(let c=0;c<=r;c++) add(c,r);
    }
  }

  if(mode==="frame"){
    for(let x=0;x<count;x++){
      for(let y=0;y<count;y++){
        if(x===0 || y===0 || x===count-1 || y===count-1) add(x,y);
      }
    }
  }

  const maxX=Math.max(...cells.map(c=>c.x),0);
  const maxY=Math.max(...cells.map(c=>c.y),0);
  const w=(maxX+1)*(size+gap)+gap;
  const h=(maxY+1)*(size+gap)+gap;

  return `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <g fill="currentColor">
        ${cells.map(c=>`<rect x="${gap+c.x*(size+gap)}" y="${gap+c.y*(size+gap)}" width="${size}" height="${size}" rx="3"></rect>`).join("")}
      </g>
    </svg>
  `;
}

function figureGallery(figures){
  return `
    <div class="figure-stage">
      <div class="figure-row">
        ${figures.map(f=>`
          <div class="figure-card">
            <strong>Figur ${f.n}</strong>
            ${f.svg}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function genFigureBarTerm(){
  const a=rand(3,6);
  const b=rand(-2,4);
  const values=makeLinearValues(a,b);

  const figures=[1,2,3].map(n=>({n,svg:squareSvg(values[n],"bar")}));

  return {
    badge:"G07 · Term",
    ziel:"Aus einer wachsenden Figur einen linearen Term bestimmen.",
    text:`
      <p>Die Figuren bestehen aus Quadraten.</p>
      ${figureGallery(figures)}
      ${sequenceTable(values,{columns:[1,2,3,10,50,"n"],hidden:["10","50","n"],label:"Quadrate"})}
    `,
    ask:"Bestimme den Term für Figur n.",
    answer:{kind:"linear",a,b},
    hint1:"Zähle die Quadrate in Figur 1, 2 und 3.",
    hint2:`Von Figur zu Figur kommen immer ${a} Quadrate dazu.`,
    hint3:`Der Term beginnt mit ${a}n. Prüfe dann Figur 1.`,
    solution:`Der Term lautet <strong>${values.n}</strong>.`
  };
}

function genFigureValue10(){
  const a=rand(3,7);
  const b=rand(-3,5);
  const values=makeLinearValues(a,b);
  const figures=[1,2,3].map(n=>({n,svg:squareSvg(values[n],"bar")}));

  return {
    badge:"G07 · Figur 10",
    ziel:"Die Anzahl in einer späteren Figur berechnen.",
    text:`
      <p>Die Figurenfolge wächst regelmässig.</p>
      ${figureGallery(figures)}
      ${sequenceTable(values,{columns:[1,2,3,10],hidden:["10"],label:"Quadrate"})}
    `,
    ask:"Wie viele Quadrate hat Figur 10?",
    answer:values[10],
    hint1:"Bestimme zuerst, wie viele Quadrate jedes Mal dazukommen.",
    hint2:`Es kommen immer ${a} Quadrate dazu.`,
    hint3:`Der Term ist ${values.n}. Setze n = 10 ein.`,
    solution:`T(10) = ${a} · 10 ${b>=0?"+ "+b:"- "+Math.abs(b)} = <strong>${values[10]}</strong>.`
  };
}

function genFigureNewPart(){
  const a=rand(3,7);
  const b=rand(0,5);
  const values=makeLinearValues(a,b);
  const figures=[1,2,3].map(n=>({n,svg:squareSvg(values[n],"bar")}));

  return {
    badge:"G07 · Neu dazu",
    ziel:"Erkennen, was von Schritt zu Schritt neu dazukommt.",
    text:`
      <p>Vergleiche die Figuren genau.</p>
      ${figureGallery(figures)}
      ${sequenceTable(values,{columns:[1,2,3,4],hidden:["4"],label:"Quadrate"})}
    `,
    ask:"Wie viele Quadrate kommen von einer Figur zur nächsten neu dazu?",
    answer:a,
    hint1:"Vergleiche Figur 1 und Figur 2.",
    hint2:`Figur 1 hat ${values[1]} Quadrate, Figur 2 hat ${values[2]} Quadrate.`,
    hint3:`Rechne ${values[2]} - ${values[1]}.`,
    solution:`Von Figur zu Figur kommen immer <strong>${a}</strong> Quadrate dazu.`
  };
}

function genFigureLTerm(){
  const values={};
  [1,2,3,4,5,10,50].forEach(n=>values[n]=2*n-1);
  values.n="2n-1";

  const figures=[1,2,3].map(n=>({n,svg:squareSvg(n,"l")}));

  return {
    badge:"G07 · L-Figur",
    ziel:"Eine L-Figur als Term beschreiben.",
    text:`
      <p>Die Figuren wachsen als L-Form.</p>
      ${figureGallery(figures)}
      ${sequenceTable(values,{columns:[1,2,3,10,50,"n"],hidden:["10","50","n"],label:"Quadrate"})}
    `,
    ask:"Bestimme den Term für Figur n.",
    answer:{kind:"linear",a:2,b:-1},
    hint1:"Die Ecke wird von beiden Armen gemeinsam benutzt.",
    hint2:"Zwei Arme mit Länge n ergeben 2n.",
    hint3:"Das Eckquadrat wurde doppelt gezählt.",
    solution:"Der Term lautet <strong>2n-1</strong>."
  };
}

function genFigureStairValue(){
  const values={};
  [1,2,3,4,5,10,50].forEach(n=>values[n]=n*(n+1)/2);
  values.n="n(n+1):2";

  const figures=[1,2,3,4].map(n=>({n,svg:squareSvg(n,"stair")}));

  return {
    badge:"G07 · Treppenfigur",
    ziel:"Eine treppenartige Figurenfolge berechnen.",
    text:`
      <p>Die Figur wächst treppenartig.</p>
      ${figureGallery(figures)}
      ${sequenceTable(values,{columns:[1,2,3,4,5,10,"n"],hidden:["5","10","n"],label:"Quadrate"})}
    `,
    ask:"Wie viele Quadrate hat Figur 10?",
    answer:values[10],
    hint1:"Zähle die Quadrate zeilenweise.",
    hint2:"Figur 4 besteht aus 1 + 2 + 3 + 4 Quadraten.",
    hint3:"Für Figur 10 rechnest du 1 + 2 + 3 + ... + 10.",
    solution:`Figur 10 hat 10 · 11 : 2 = <strong>${values[10]}</strong> Quadrate.`
  };
}

function genFigureFrameTerm(){
  const values={};
  [1,2,3,4,5,10,50].forEach(n=>values[n]=4*n+4);
  values.n="4n+4";

  const figures=[1,2,3].map(n=>({n,svg:squareSvg(n+2,"frame")}));

  return {
    badge:"G07 · Rahmenfigur",
    ziel:"Eine Rahmenfigur geschickt zerlegen.",
    text:`
      <p>Die Figuren bestehen aus einem quadratischen Rahmen.</p>
      ${figureGallery(figures)}
      ${sequenceTable(values,{columns:[1,2,3,10,50,"n"],hidden:["10","50","n"],label:"Quadrate"})}
    `,
    ask:"Bestimme den Term für Figur n.",
    answer:{kind:"linear",a:4,b:4},
    hint1:"Schau auf die vier Seiten des Rahmens.",
    hint2:"Von Figur zu Figur kommen immer 4 Quadrate dazu.",
    hint3:"Der Term beginnt mit 4n.",
    solution:"Der Term lautet <strong>4n+4</strong>."
  };
}

TRAINERS["figurenfolge"] = {
  title:"G07 · Figurenfolgen",
  info:"Dynamische Figurenfolgen mit Term, Figur 10, Tabelle und neu dazukommenden Teilen.",
  generators:[
    genFigureBarTerm,
    genFigureValue10,
    genFigureNewPart,
    genFigureLTerm,
    genFigureStairValue,
    genFigureFrameTerm
  ]
};
