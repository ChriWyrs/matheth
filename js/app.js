let score = 0;
let solved = 0;
let total = 10;
let questions = [];
let tries = [];
let done = [];

function rand(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

function makeQuestion(){
  let type = rand(1,4);

  if(type === 1){
    let start = rand(1,12), d = rand(2,8);
    let folge = [start, start+d, start+2*d, start+3*d];
    return {
      text: folge.join(" · ") + " · ...",
      ask: "Wie lautet die nächste Zahl?",
      answer: start + 4*d,
      hint1: "Vergleiche zwei benachbarte Zahlen.",
      hint2: "Die Differenz ist +" + d + ".",
      solution: "Rechnung: " + (start+3*d) + " + " + d + " = " + (start+4*d)
    };
  }

  if(type === 2){
    let start = rand(2,15), d = rand(2,9);
    let folge = [start, start+d, start+2*d, start+3*d];
    return {
      text: folge.join(" · ") + " · ...",
      ask: "Wie gross ist die Differenz?",
      answer: d,
      hint1: "Subtrahiere: zweite Zahl minus erste Zahl.",
      hint2: "Rechne " + (start+d) + " − " + start + ".",
      solution: "Differenz: " + (start+d) + " − " + start + " = " + d
    };
  }

  if(type === 3){
    let start = rand(1,8), q = rand(2,4);
    let folge = [start, start*q, start*q*q, start*q*q*q];
    return {
      text: folge.join(" · ") + " · ...",
      ask: "Wie lautet die nächste Zahl?",
      answer: start*q*q*q*q,
      hint1: "Hier wird multipliziert, nicht addiert.",
      hint2: "Der Faktor ist ×" + q + ".",
      solution: "Rechnung: " + (start*q*q*q) + " · " + q + " = " + (start*q*q*q*q)
    };
  }

  let start = rand(1,6), q = rand(2,5);
  let folge = [start, start*q, start*q*q, start*q*q*q];
  return {
    text: folge.join(" · ") + " · ...",
    ask: "Wie gross ist der Faktor?",
    answer: q,
    hint1: "Teile eine Zahl durch die vorherige Zahl.",
    hint2: "Rechne " + (start*q) + " : " + start + ".",
    solution: "Faktor: " + (start*q) + " : " + start + " = " + q
  };
}

function newTest(){
  score = 0;
  solved = 0;
  questions = [];
  tries = Array(total).fill(0);
  done = Array(total).fill(false);

  document.getElementById("aufgaben").innerHTML = "";
  document.getElementById("result").style.display = "none";
  document.getElementById("bar").style.width = "0%";

  for(let i=0;i<total;i++){
    let q = makeQuestion();
    questions.push(q);

    document.getElementById("aufgaben").innerHTML += `
      <div class="card">
        <h3>Frage ${i+1}</h3>
        <p class="question">${q.text}</p>
        <p>${q.ask}</p>
        <input id="input${i}" type="number">
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

  if(input.value.trim() === ""){
    feedback.innerHTML = "<span class='fail'>Bitte zuerst eine Zahl eingeben.</span>";
    return;
  }

  const value = Number(input.value);

  if(value === q.answer){
    done[i] = true;
    solved++;

    if(tries[i] === 0){
      score++;
    }

    feedback.innerHTML = "<span class='ok'>✅ Richtig!</span>";
    input.disabled = true;
    btn.disabled = true;
  } else {
    tries[i]++;

    if(tries[i] === 1){
      feedback.innerHTML = "<span class='fail'>❌ Noch nicht.</span><br><span class='hint'>💡 Tipp 1:</span> " + q.hint1;
    } else if(tries[i] === 2){
      feedback.innerHTML = "<span class='fail'>❌ Noch nicht.</span><br><span class='hint'>💡 Tipp 2:</span> " + q.hint2;
    } else {
      feedback.innerHTML = "<span class='fail'>❌ Noch nicht.</span><br>✅ " + q.solution + "<br>Du kannst die richtige Antwort trotzdem noch eintippen.";
    }

    input.focus();
    input.select();
  }

  document.getElementById("bar").style.width = (solved/total*100) + "%";

  if(solved === total){
    let stars = score >= 9 ? "⭐⭐⭐" : score >= 6 ? "⭐⭐" : "⭐";
    document.getElementById("result").style.display = "block";
    document.getElementById("result").innerHTML =
      "🏁 Fertig!<br><br>" + stars + "<br><br>" +
      score + " von " + total + " Punkten beim ersten Versuch.";
  }
}

window.onload = newTest;
