// AUTH
function signup(){
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;

  firebase.auth().createUserWithEmailAndPassword(email, pass)
  .then(()=>alert("Signup Success"))
  .catch(e=>alert(e.message));
}

function login(){
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, pass)
  .then(()=>window.location="dashboard.html")
  .catch(e=>alert(e.message));
}

function logout(){
  firebase.auth().signOut();
  window.location="login.html";
}

// NAVIGATION
function goToNotes(){
  window.location = "notes.html";
}

// SPEECH
let recognition;

function startRecording(){
  recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;

  recognition.onresult = function(event){
    let text = "";
    for(let i=0;i<event.results.length;i++){
      text += event.results[i][0].transcript;
    }
    document.getElementById("output").value = text;
  };

  recognition.start();
}

function stopRecording(){
  recognition.stop();
  saveNote();
}

// SAVE NOTES
function saveNote(){
  let text = document.getElementById("output").value;

  let notes = JSON.parse(localStorage.getItem("notes") || "[]");

  notes.push({
    text: text,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("notes", JSON.stringify(notes));
}

// LOAD NOTES
function loadNotes(){
  let notes = JSON.parse(localStorage.getItem("notes") || "[]");
  let list = document.getElementById("notesList");
  let search = document.getElementById("search")?.value.toLowerCase() || "";

  if(!list) return;

  list.innerHTML = "";

  notes.forEach((n,i)=>{
    if(n.text.toLowerCase().includes(search)){
      let div = document.createElement("div");

      div.innerHTML = `
        <p>${n.text}</p>
        <small>${n.date}</small><br>
        <button onclick="deleteNote(${i})">Delete</button>
      `;

      list.appendChild(div);
    }
  });
}

// DELETE
function deleteNote(i){
  let notes = JSON.parse(localStorage.getItem("notes"));
  notes.splice(i,1);
  localStorage.setItem("notes", JSON.stringify(notes));
  loadNotes();
}

// DOWNLOAD
function downloadNote(){
  let text = document.getElementById("output").value;

  let blob = new Blob([text], {type:"application/msword"});
  let a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "AI_Note.doc";
  a.click();
}