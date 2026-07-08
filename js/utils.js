window.TRAINERS = {};

function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function pick(arr){return arr[rand(0,arr.length-1)];}

function clean(input){
  return String(input).toLowerCase()
    .replaceAll(" ","").replaceAll("·","*")
    .replaceAll("−","-").replaceAll("–","-")
    .replaceAll("²","^2").replaceAll("n","x");
}

function parseNumber(input){
  const value = Number(clean(input).replace(",","."));
  return Number.isFinite(value) ? value : null;
}

function parseLinearTerm(input){
  let s = clean(input).replaceAll("*x","x");
  if(!s.startsWith("+") && !s.startsWith("-")) s = "+" + s;
  const parts = s.match(/[+-][^+-]+/g);
  if(!parts) return null;

  let a=0,b=0;
  for(const part of parts){
    const sign = part[0]==="-" ? -1 : 1;
    const body = part.slice(1);

    if(body.includes("x")){
      let coeff = body.replace("x","");
      if(coeff==="") coeff="1";
      const num = Number(coeff);
      if(Number.isNaN(num)) return null;
      a += sign*num;
    }else{
      const num = Number(body);
      if(Number.isNaN(num)) return null;
      b += sign*num;
    }
  }
  return {a,b};
}

function parseQuadraticTerm(input){
  let s = clean(input).replaceAll("*x^2","x^2").replaceAll("*x","x");
  if(!s.startsWith("+") && !s.startsWith("-")) s = "+" + s;
  const parts = s.match(/[+-][^+-]+/g);
  if(!parts) return null;

  let a=0,b=0,c=0;
  for(const part of parts){
    const sign = part[0]==="-" ? -1 : 1;
    const body = part.slice(1);

    if(body.includes("x^2")){
      let coeff = body.replace("x^2","");
      if(coeff==="") coeff="1";
      const num = Number(coeff);
      if(Number.isNaN(num)) return null;
      a += sign*num;
    }else if(body.includes("x")){
      let coeff = body.replace("x","");
      if(coeff==="") coeff="1";
      const num = Number(coeff);
      if(Number.isNaN(num)) return null;
      b += sign*num;
    }else{
      const num = Number(body);
      if(Number.isNaN(num)) return null;
      c += sign*num;
    }
  }
  return {a,b,c};
}

function ok(value,answer){
  if(typeof answer==="object" && answer.kind==="linear"){
    const got = parseLinearTerm(value);
    return got && got.a===answer.a && got.b===answer.b;
  }

  if(typeof answer==="object" && answer.kind==="quadratic"){
    const got = parseQuadraticTerm(value);
    return got && got.a===answer.a && got.b===answer.b && got.c===answer.c;
  }

  if(typeof answer==="number") return parseNumber(value)===answer;
  return clean(value)===clean(answer);
}

function linearTermText(a,b,variable="n"){
  let s="";
  if(a===1) s=variable;
  else if(a===-1) s="-"+variable;
  else s=a+variable;
  if(b>0) s+="+"+b;
  if(b<0) s+=b;
  return s;
}

function quadraticTermText(a,b,c,variable="n"){
  let s="";
  if(a===1) s+=variable+"²";
  else if(a===-1) s+="-"+variable+"²";
  else if(a!==0) s+=a+variable+"²";

  if(b>0) s+="+"+(b===1 ? variable : b+variable);
  if(b<0) s+= b===-1 ? "-"+variable : b+variable;

  if(c>0) s+="+"+c;
  if(c<0) s+=c;

  return s;
}

function sequenceTable(values,options={}){
  const columns = options.columns || [1,2,3,4,5,50,"n"];
  const label = options.label || "T(n)";
  const hidden = new Set(options.hidden || []);

  return `
    <table class="sequence-table">
      <tr><th>n</th>${columns.map(c=>`<th>${c}</th>`).join("")}</tr>
      <tr><th>${label}</th>${columns.map(c=>hidden.has(String(c)) ? `<td class="question">?</td>` : `<td>${values[c]}</td>`).join("")}</tr>
    </table>
  `;
}

function diffTable(values,columns){
  const d1=[];
  const d2=[];

  for(let i=0;i<columns.length-1;i++){
    d1.push(values[columns[i+1]]-values[columns[i]]);
  }

  for(let i=0;i<d1.length-1;i++){
    d2.push(d1[i+1]-d1[i]);
  }

  return `
    <table class="sequence-table diff-table">
      <tr>
        <th>n</th>
        ${columns.map(n=>`<th>${n}</th>`).join("")}
      </tr>

      <tr>
        <th>Folge</th>
        ${columns.map(n=>`<td>${values[n]}</td>`).join("")}
      </tr>

      <tr>
        <th>1. Differenzfolge</th>
        ${d1.map(v=>`<td colspan="1">${v}</td>`).join("")}
        <td></td>
      </tr>

      <tr>
        <th>2. Differenzfolge</th>
        <td></td>
        ${d2.map(v=>`<td>${v}</td>`).join("")}
        <td></td>
      </tr>
    </table>
  `;
}
