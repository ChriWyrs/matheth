let score = 0;
let solved = 0;
let total = 5;
let questions = [];
let tries = [];
let done = [];

const url = new URL(window.location.href);
const typ = url.searchParams.get("typ") || "startklar";
const nParam = Number(url.searchParams.get("n"));
if(Number.isInteger(nParam) && nParam > 0 && nParam <= 20){
  total = nParam;
}

function rand(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

function sum1(n){
  return n*(n+1)/2;
}

function clean(s){
  return String(s)
    .toLowerCase()
    .replaceAll(" ","")
    .replaceAll("·","*")
    .replaceAll("−","-")
    .replaceAll("²","^2");
}

function ok(value, answer){
  if(Array.isArray(answer)){
    return answer.some(a => ok(value,a));
  }
  if(typeof answer === "number"){
    return Number(value) === answer;
  }
  return clean(value) === clean(answer);
}

/* 1 · Figur → Term */
function genFigurLinear(){
  let d = rand(3,7);
  let c = rand(-2,5);
  let f1 = d + c;
  let f2 = 2*d + c;
  let f3 = 3*d + c;
  let n = [20,50,75,100,150][rand(0,4)];
  let ans = d*n + c;
  let term = c >= 0 ? `${d}n+${c}` : `${d}n${c}`;

  return {
    ziel:"Figurmuster erkennen und mit einem Term beschreiben.",
    text:`Eine Figur wächst regelmässig:<br><br>
          Figur 1 → ${f1} Plättchen<br>
          Figur 2 → ${f2} Plättchen<br>
          Figur 3 → ${f3} Plättchen`,
    ask:`Wie viele Plättchen hat Figur ${n}?`,
    answer:ans,
    hint1:"Finde zuerst heraus, wie viele Plättchen von Figur zu Figur dazukommen.",
    hint2:`Es kommen immer ${d} Plättchen dazu. Der Term lautet ${term}.`,
    solution:`${term}; also ${d} · ${n} ${c>=0?"+":"-"} ${Math.abs(c)} = ${ans}`
  };
}

/* 2 · Term auswählen */
function genTermAuswahl(){
  let d = rand(3,8);
  let c = rand(-5,5);
  let vals = [1,2,3,4].map(x => d*x+c);
  let term = c >= 0 ? `${d}x+${c}` : `${d}x${c}`;

  return {
    ziel:"Aus einer Wertetabelle den passenden Term erkennen.",
    text:`Gegeben ist die Tabelle:<br><br>
          x: &nbsp;&nbsp; 1 | 2 | 3 | 4<br>
          Tₓ: ${vals.join(" | ")}`,
    ask:"Welcher Term passt? Schreibe ihn ohne Leerzeichen, z. B. 4x+1",
    answer:[term, term.replace("+"," + ").replace("-"," - ")],
    hint1:"Schau zuerst, um wie viel die Werte jeweils zunehmen.",
    hint2:`Die Differenz ist ${d}. Der Term beginnt also mit ${d}x.`,
    solution:`Der passende Term ist ${term}.`
  };
}

/* 3 · Quadratische Folge */
function genQuadratisch(){
  let b = rand(1,5);
  let c = rand(-4,6);
  let vals = [1,2,3,4].map(x => x*x + b*x + c);
  let n = [10,20,30,50][rand(0,3)];
  let ans = n*n + b*n + c;
  let term = c >= 0 ? `x²+${b}x+${c}` : `x²+${b}x${c}`;

  return {
    ziel:"Quadratische Folgen erkennen und berechnen.",
    text:`Diese Folge entsteht nicht durch immer gleiches Addieren:<br><br>
          x: &nbsp;&nbsp; 1 | 2 | 3 | 4<br>
          Tₓ: ${vals.join(" | ")}`,
    ask:`Berechne T_${n}.`,
    answer:ans,
    hint1:"Die Differenzen verändern sich. Es ist eine quadratische Folge.",
    hint2:`Der Term lautet ${term}. Setze x = ${n} ein.`,
    solution:`${n}² + ${b}·${n} ${c>=0?"+":"-"} ${Math.abs(c)} = ${ans}`
  };
}

/* 4 · Gauß Summe */
function genGauss(){
  let n = [50,75,100,120,150,200,250][rand(0,6)];
  let ans = sum1(n);

  return {
    ziel:"Eine lange Summe geschickt mit der Gauß-Idee berechnen.",
    text:`Berechne geschickt:<br><br>1 + 2 + 3 + … + ${n}`,
    ask:"Wie gross ist die Summe?",
    answer:ans,
    hint1:"Addiere die erste und letzte Zahl paarweise.",
    hint2:`Nutze die Formel: ${n} · ${n+1} : 2`,
    solution:`${n} · ${n+1} : 2 = ${ans}`
  };
}

/* 5 · Summendifferenz */
function genSummenDifferenz(){
  let a = rand(120,280);
  let b = rand(3,15);
  let c = rand(20,40);
  let ans = sum1(a) - (sum1(c)-sum1(b-1));

  return {
    ziel:"Zwei Summen geschickt voneinander subtrahieren.",
    text:`Berechne:<br><br>
          Summe aller Zahlen von 1 bis ${a}<br>
          minus<br>
          Summe aller Zahlen von ${b} bis ${c}`,
    ask:"Wie gross ist die Differenz?",
    answer:ans,
    hint1:"Berechne zuerst die Summe von 1 bis zur oberen Zahl.",
    hint2:`Summe ${b} bis ${c} = S_${c} − S_${b-1}.`,
    solution:`S_${a} − (S_${c} − S_${b-1}) = ${sum1(a)} − (${sum1(c)} − ${sum1(b-1)}) = ${ans}`
  };
}

/* 6 · Würfelfolge */
function genWuerfel(){
  let n = [5,10,20,50][rand(0,3)];
  let ans = n*n+n+1;

  return {
    ziel:"Ein Würfelmuster mit einem quadratischen Term beschreiben.",
    text:`Eine Würfelfolge hat die Anzahlen:<br><br>
          Schritt 1 → 3<br>
          Schritt 2 → 7<br>
          Schritt 3 → 13<br>
          Schritt 4 → 21`,
    ask:`Wie viele Würfel hat Schritt ${n}?`,
    answer:ans,
    hint1:"Die Zuwächse sind 4, 6, 8, 10, …",
    hint2:"Der Term lautet n² + n + 1.",
    solution:`${n}² + ${n} + 1 = ${ans}`
  };
}

/* 7 · Gleichung */
function genGleichung(){
  let x = rand(3,18);
  let a = rand(2,8);
  let b = rand(-12,12);
  let rhs = a*x+b;
  let sign = b >= 0 ? "+" : "-";

  return {
    ziel:"Eine lineare Gleichung lösen.",
    text:`Löse die Gleichung:<br><br>${a}x ${sign} ${Math.abs(b)} = ${rhs}`,
    ask:"Wie lautet x?",
    answer:x,
    hint1:"Bringe zuerst die Zahl ohne x auf die andere Seite.",
    hint2:`Danach durch ${a} teilen.`,
    solution:`${a}x = ${rhs-b}; also x = ${x}`
  };
}

/* 8 · Textgleichung */
function genTextgleichung(){
  let x = rand(4,14);
  let a = rand(2,5);
  let c = rand(2,6);
  let b = rand(3,12);
  let d = a*x+b-c*x;

  return {
    ziel:"Eine Textaufgabe in eine Gleichung übersetzen.",
    text:`Addiert man zum ${a}-Fachen einer Zahl ${b}, so erhält man ${d} mehr als das ${c}-Fache der Zahl.`,
    ask:"Welche Zahl ist gesucht?",
    answer:x,
    hint1:"Setze für die gesuchte Zahl x.",
    hint2:`Die Gleichung lautet: ${a}x + ${b} = ${c}x + ${d}`,
    solution:`${a}x + ${b} = ${c}x + ${d}; x = ${x}`
  };
}

/* 9 · Faktorisieren */
function genFaktorisieren(){
  let a = rand(2,9);
  let b = rand(2,8);

  return {
    ziel:"Einen gemeinsamen Faktor ausklammern.",
    text:`Faktorisiere:<br><br>${a}x + ${a*b}`,
    ask:"Schreibe die faktorisierte Form, z. B. 3(x+4)",
    answer:[`${a}(x+${b})`, `${a}*(x+${b})`],
    hint1:"Suche den gemeinsamen Faktor.",
    hint2:`Beide Terme sind durch ${a} teilbar.`,
    solution:`${a}x + ${a*b} = ${a}(x+${b})`
  };
}

/* 10 · Geometrische Folge */
function genGeometrisch(){
  let start = rand(1,6);
  let q = rand(2,4);
  let vals = [start,start*q,start*q*q,start*q*q*q];
  let ans = start*q*q*q*q;

  return {
    ziel:"Eine geometrische Folge erkennen.",
    text:`${vals.join(" · ")} · ...`,
    ask:"Wie lautet die nächste Zahl?",
    answer:ans,
    hint1:"Hier wird nicht addiert, sondern multipliziert.",
    hint2:`Der Faktor ist ×${q}.`,
    solution:`${start*q*q*q} · ${q} = ${ans}`
  };
}

/* PROFILE */
const pools = {
  startklar:{
    title:"Startklar · Vom Bild zum Term",
    info:"Aufgaben passend zur Lernstanderfassung: Figurmuster, Terme, Summen, Gleichungen und Folgen.",
    generators:[genFigurLinear, genTermAuswahl, genQuadratisch, genGauss, genGleichung]
  },
  lk:{
    title:"Lernkontrolle · Vom Bild zum Term",
    info:"Aufgaben passend zur Lernkontrolle: Gleichungen, Ungleichungen, Folgen, Terme und Figurenzahlen.",
    generators:[genGleichung, genFigurLinear, genTermAuswahl, genQuadratisch, genGauss]
  },
  test:{
    title:"Test · Vom Bild zum Term",
    info:"Anspruchsvollere Nachbearbeitung: quadratische Folgen, Summendifferenz, Würfelmuster, Textgleichungen und Faktorisieren.",
    generators:[genQuadratisch, genSummenDifferenz, genWuerfel, genTextgleichung, genFaktorisieren]
  },

  "figur-linear":{title:"Repetition · Figur → Term",info:"Figurenfolgen mit linearem Wachstum.",generators:[genFigurLinear]},
  "term-auswahl":{title:"Repetition · Tabelle → Term",info:"Aus Wertetabellen passende Terme bestimmen.",generators:[genTermAuswahl]},
  "quadratisch":{title:"Repetition · Quadratische Folge",info:"Quadratische Folgen erkennen und berechnen.",generators:[genQuadratisch]},
  "gauss":{title:"Repetition · Gauß-Summe",info:"Summen geschickt berechnen.",generators:[genGauss]},
  "summendifferenz":{title:"Repetition · Summendifferenz",info:"Differenz zweier Summen berechnen.",generators:[genSummenDifferenz]},
  "wuerfel":{title:"Repetition · Würfelmuster",info:"Würfelfolgen mit quadratischem Term.",generators:[genWuerfel]},
  "gleichung":{title:"Repetition · Gleichung",info:"Lineare Gleichungen lösen.",generators:[genGleichung]},
  "textgleichung":{title:"Repetition · Textgleichung",info:"Text in Gleichung übersetzen.",generators:[genTextgleichung]},
  "faktorisieren":{title:"Repetition · Faktorisieren",info:"Terme faktorisieren.",generators:[genFaktorisieren]},
  "geometrisch":{title:"Repetition · Geometrische Folge",info:"Folgen mit konstantem Faktor.",generators:[genGeometrisch]}
};

function chooseGenerator(){
  const pool = pools[typ] || pools.startklar;
  return pool.generators[rand(0,pool.generators.length-1)];
}

function newTest(){
  const pool = pools[typ] || pools.startklar;

  document.getElementById("pageTitle").innerText = pool.title;
  document.getElementById("pageSub").innerText = "adaptive Nachbearbeitung";
  document.getElementById("trainerTitle").innerText = pool.title;
  document.getElementById("trainerInfo").innerText = pool.info;

  score = 0;
  solved = 0;
  questions = [];
  tries = Array(total).fill(0);
  done = Array(total).fill(false);

  document.getElementById("aufgaben").innerHTML = "";
  document.getElementById("result").style.display = "none";
  document.getElementById("bar").style.width = "0%";

  for(let i=0;i<total;i++){
    const q = chooseGenerator()();
    questions.push(q);

    document.getElementById("aufgaben").innerHTML += `
      <div class="card">
        <div class="small">🎯 Lernziel: ${q.ziel}</div>
        <h3>Übung ${i+1}</h3>
        <p class="question">${q.text}</p>
        <p>${q.ask}</p>
        <input id="input${i}" type="text" autocomplete="off">
        <br>
        <button id="btn${i}" onclick="check(${i})">Überprüfen</button>
        <p id="feedback${i}"></p>
      </div>
    `;
  }
}

function check(i){
  if(done[i]) return;

  const input = document.getElementById("input"+i);
  const btn = document.getElementById("btn"+i);
  const feedback = document.getElementById("feedback"+i);
  const q = questions[i];

  if(input.value.trim()===""){
    feedback.innerHTML = "<span class='fail'>Bitte zuerst eine Antwort eingeben.</span>";
    return;
  }

  if(ok(input.value,q.answer)){
    done[i]=true;
    solved++;
    if(tries[i]===0) score++;

    feedback.innerHTML = "<span class='ok'>✅ Richtig!</span>";
    input.disabled=true;
    btn.disabled=true;
  } else {
    tries[i]++;
    if(tries[i]===1){
      feedback.innerHTML = "<span class='fail'>❌ Noch nicht.</span><br><span class='hint'>💡 Tipp 1:</span> " + q.hint1;
    } else if(tries[i]===2){
      feedback.innerHTML = "<span class='fail'>❌ Noch nicht.</span><br><span class='hint'>💡 Tipp 2:</span> " + q.hint2;
    } else {
      feedback.innerHTML = "<span class='fail'>❌ Noch nicht.</span><br>✅ " + q.solution + "<br>Du kannst die richtige Antwort trotzdem noch eintippen.";
    }
    input.focus();
    input.select();
  }

  document.getElementById("bar").style.width = (solved/total*100) + "%";

  if(solved===total){
    let stars = score >= Math.ceil(total*.9) ? "⭐⭐⭐" : score >= Math.ceil(total*.6) ? "⭐⭐" : "⭐";
    document.getElementById("result").style.display="block";
    document.getElementById("result").innerHTML =
      "🏁 Training abgeschlossen!<br><br>" +
      stars + "<br><br>" +
      score + " von " + total + " Aufgaben beim ersten Versuch richtig.";
  }
}

window.onload = newTest;
