let score=0;
let solved=0;
let total=6;
let questions=[];
let tries=[];
let done=[];

const url = new URL(window.location.href);
const typ = url.searchParams.get("typ") || "linear-folge";
const nParam = Number(url.searchParams.get("n"));

if(Number.isInteger(nParam) && nParam>0 && nParam<=20){
  total=nParam;
}

TRAINERS["startklar"] = {
  title:"Startklar · Vom Bild zum Term",
  info:"Vorläufiger Mix.",
  generators:[
    genLinearFindTerm,
    genQuadraticFindTerm,
    genQuadraticDiffSequence,
    genFigureBarTerm,
    genFigureValue10,
    genFigureNewPart,
    genFigureLTerm
  ]
};

TRAINERS["lk"] = {
  title:"Lernkontrolle · Vom Bild zum Term",
  info:"Vorläufiger Mix.",
  generators:[
    genLinearFindTerm,
    genQuadraticFindTerm,
    genQuadraticValue50,
    genFigureBarTerm,
    genFigureValue10,
    genFigureLTerm,
    genFigureFrameTerm
  ]
};

TRAINERS["test"] = {
  title:"Test · Vom Bild zum Term",
  info:"Vorläufiger Mix.",
  generators:[
    genLinearFindTerm,
    genQuadraticFindTerm,
    genQuadraticValue50,
    genQuadraticDiffSequence,
    genFigureBarTerm,
    genFigureValue10,
    genFigureNewPart,
    genFigureStairValue,
    genFigureFrameTerm
  ]
};

function getPool(){
  return TRAINERS[typ] || TRAINERS["linear-folge"];
}

function newTraining(){
  const pool=getPool();

  document.getElementById("pageTitle").innerText=pool.title;
  document.getElementById("trainerTitle").innerText=pool.title;
  document.getElementById("trainerInfo").innerText=pool.info;

  score=0;
  solved=0;
  questions=[];
  tries=Array(total).fill(0);
  done=Array(total).fill(false);

  document.getElementById("aufgaben").innerHTML="";
  document.getElementById("result").hidden=true;
  document.getElementById("bar").style.width="0%";
  document.getElementById("progressText").innerText=`0 / ${total}`;

  for(let i=0;i<total;i++){
    const q=pick(pool.generators)();
    questions.push(q);

    const el=document.createElement("article");
    el.className="task";

    el.innerHTML=`
      <div class="task-top">
        <div>
          <span class="badge">${q.badge}</span>
          <h2>Übung ${i+1}</h2>
          <p class="goal">${q.ziel}</p>
        </div>
      </div>

      <div class="prompt">${q.text}</div>

      <p><strong>${q.ask}</strong></p>

      <div class="answer-row">
        <input id="input${i}" autocomplete="off" placeholder="Antwort eingeben">
        <button id="btn${i}" type="button" onclick="check(${i})">Überprüfen</button>
      </div>

      <div id="feedback${i}" class="feedback" hidden></div>
    `;

    document.getElementById("aufgaben").appendChild(el);
  }
}

function check(i){
  if(done[i]) return;

  const input=document.getElementById("input"+i);
  const button=document.getElementById("btn"+i);
  const feedback=document.getElementById("feedback"+i);
  const q=questions[i];

  feedback.hidden=false;
  feedback.className="feedback";

  if(input.value.trim()===""){
    feedback.classList.add("hint");
    feedback.innerHTML="Bitte zuerst eine Antwort eingeben.";
    return;
  }

  if(ok(input.value,q.answer)){
    done[i]=true;
    solved++;
    if(tries[i]===0) score++;

    feedback.classList.add("good");
    feedback.innerHTML="✅ Richtig!";
    input.disabled=true;
    button.disabled=true;
  }else{
    tries[i]++;

    if(tries[i]===1){
      feedback.classList.add("hint");
      feedback.innerHTML="❌ Noch nicht.<br><strong>Tipp 1:</strong> "+q.hint1;
    }else if(tries[i]===2){
      feedback.classList.add("hint");
      feedback.innerHTML="❌ Noch nicht.<br><strong>Tipp 2:</strong> "+q.hint2;
    }else if(tries[i]===3){
      feedback.classList.add("hint");
      feedback.innerHTML="❌ Noch nicht.<br><strong>Tipp 3:</strong> "+q.hint3;
    }else{
      feedback.classList.add("bad");
      feedback.innerHTML="❌ Noch nicht.<div class='solution'>✅ "+q.solution+"</div>";
    }

    input.focus();
    input.select();
  }

  document.getElementById("bar").style.width=(solved/total*100)+"%";
  document.getElementById("progressText").innerText=`${solved} / ${total}`;

  if(solved===total){
    const result=document.getElementById("result");
    result.hidden=false;
    result.innerHTML=`
      <h2>Training abgeschlossen!</h2>
      <p>${score} von ${total} Aufgaben beim ersten Versuch richtig.</p>
      <button type="button" onclick="newTraining()">Nochmals trainieren</button>
    `;
  }
}

window.onload=newTraining;
