const questions = [
  { type: "text", text: "Name:",
      key: "name", remember: true },
  { type: "text", text: "Enter your email. A copy of your responses will be sent to this inbox.", 
      key: "userEmail", remember: true },
  { type: "text", text: "Enter your supervisor's email. A copy of your responses will be sent to this inbox.", 
      key: "supervisorEmail", remember: true },
  { type: "text", text: "Task:" },
  { type: "text", text: "Location:" },
  { type: "yesno",
      text: "Could I strain or injure myself physically? e.g. overexertion, manual handling, being caught in/on/between something, sharp edges, rotating parts, uncontrolled movement or falling objects",
      controlOn: "yes",
      controlPrompt: "Describe the control for the physical strain or injury risk:",
      controlPromptNeeded: false },
  { type: "yesno",
      text: "Could I fall, or could something fall on me? e.g. working at height, unstable surfaces, dropped objects",
      controlOn: "yes",
      controlPrompt: "Describe the control for the risk of falling or objects falling:",
      controlPromptNeeded: false },
  { type: "yesno",
      text: "Could I slip or trip? e.g. wet surfaces, uneven ground, poor lighting, obstructions in my path",
      controlOn: "yes",
      controlPrompt: "Describe the control for the slip or trip risk:",
      controlPromptNeeded: false },
  { type: "yesno",
      text: "Could I contact something harmful? e.g. hazardous chemicals (do I have the SDS?), electricity, ignition sources, hot/cold surfaces, radiation, stored energy requiring isolation, unsafe atmospheric conditions",
      controlOn: "yes",
      controlPrompt: "Describe the control for contacting something harmful:",
      controlPromptNeeded: false },
  { type: "yesno",
      text: "Could my work affect others, or could others affect me? e.g. nearby activities, working above/below someone, spills or pollution — do I need to restrict access?",
      controlOn: "yes",
      controlPrompt: "Describe the control for how your work and others nearby may affect each other:",
      controlPromptNeeded: false },
  { type: "yesno",
      text: "Could conditions make this task less safe? e.g. weather changes, poor visibility, time pressure",
      controlOn: "yes",
      controlPrompt: "Describe how you will manage the changing conditions:",
      controlPromptNeeded: false },
  { type: "yesno",
      text: "Am I fit for duty and free of fatigue? If unsure, take a break or speak to my supervisor",
      controlOn: "no",
      controlPrompt: "Take a break or speak to your supervisor before continuing.",
      controlPromptNeeded: false },
  { type: "yesno",
      text: "Am I trained and authorised for this task, and have I gathered all the assistance I need?",
      controlOn: "no",
      controlPrompt: "Ensure you are trained and authorised for this task, and arrange the assistance you need before proceeding.",
      controlPromptNeeded: false },
  { type: "yesno",
      text: "Do I have the correct PPE?",
      controlOn: "no",
      controlPrompt: "Please ensure you have the correct PPE.",
      controlPromptNeeded: false },
  { type: "yesno",
      text: "Is there an FPR Energy procedure or Risk Management Plan for this task, and am I following it? If this task is unusual and no procedure exists — STOP and escalate to my supervisor",
      controlOn: "no",
      controlPrompt: "STOP and escalate to your supervisor if no procedure exists, or otherwise ensure you are following the applicable FPR Energy procedure or Risk Management Plan.",
      controlPromptNeeded: false },
  { type: "yesno",
      text: "Do I need a work permit?",
      controlOn: "yes",
      controlPrompt: "Please ensure you have obtained the relevant work permit.",
      controlPromptNeeded: false },
  { type: "yesno",
      text: "Do I have safe access and egress, and have I restricted access for others (where required)?",
      controlOn: "no",
      controlPrompt: "Ensure you have safe access and egress, and put in place any access restrictions needed for others.",
      controlPromptNeeded: false },
  { type: "yesno",
      text: "Am I aware of the site emergency procedures?",
      controlOn: "no",
      controlPrompt: "Please make yourself aware of the site emergency procedures.",
      controlPromptNeeded: false },
  { type: "textorno", text: "Any other hazards or concerns?" }
];

  let currentIndex = 0;
  let answers = [];
  let waitingForControl = false;
  let currentAnswer = null;
  let editingStorageItem = false;
  let editingKey = null;
  let controlIndex = 0;
  let storageCheckIndex = 0;
  let inStorageCheck = true; // initially true to start checking stored values
  let controlsNeeded = []; // stores {id, text}

  const storedKeysToCheck = ["name", "userEmail", "supervisorEmail"];
  const questionText = document.getElementById("question-text");
  const textInput = document.getElementById("text-input");
  const confirmBtn = document.getElementById("confirm-btn");
  const yesBtn = document.getElementById("yes-btn");
  const noBtn = document.getElementById("no-btn");
  const backBtn = document.getElementById("back-btn");
  const progressText = document.getElementById("progress-text");

  function updateProgress(current, total) {
    progressText.textContent = `Question ${current} of ${total}`;
  }

  function showStorageCheck() {
    if (storageCheckIndex >= storedKeysToCheck.length) {
        console.log("THIS PART MEANS WE WENT BACK TO NORMAL QUESTION?")
      // Done checking storage, start normal quiz
      inStorageCheck = false;
      currentIndex = 3; // start asking from "Task" since storedkeystocheck are all checked
      showQuestion();
      return;
    }

    // edge case if only name is filled but email, supervisor email not filled

    const key = storedKeysToCheck[storageCheckIndex]; 
    const saved = localStorage.getItem(key);

    if (saved) {
        // if there is a saved item then ask
      questionText.innerHTML = `Your last entered ${key === "userEmail" ? "email" : key === "supervisorEmail" ? "supervisor's email" : "name"} was <b>${saved}</b>. Do you want to change it?`;
      textInput.style.display = "none";
      confirmBtn.style.display = "none";
      yesBtn.style.display = "inline-block";
      noBtn.style.display = "inline-block";
      if (currentIndex == 0) {
        backBtn.style.display = "none"; // nowhere to go on first card
      } else {
        backBtn.style.display = "inline-block";
      }
      updateProgress(currentIndex + 1, questions.length);
    } else {
        console.log("THIS PART MEANS WE did the weird?")

        // if there is not a saved item then skip all of this storage checking
        inStorageCheck = false;
        currentIndex = 0; // start asking from regular name since nothing checked yet
        showQuestion();
        return;
    }
  }

  function showNextControl() {
    if (controlIndex >= controlsNeeded.length) { // done showing controls
      finishQuiz();
      return;
    }

    const { questionIndex, prompt } = controlsNeeded[controlIndex];
    questionText.textContent = prompt;
    textInput.style.display = "block";
    confirmBtn.style.display = "inline-block";
    yesBtn.style.display = "none";
    noBtn.style.display = "none";
    backBtn.style.display = controlIndex > 0 ? "inline-block" : "none"; // if it's the first control question then don't offer a back button

    textInput.value = answers[questionIndex]?.control || "";
    updateProgress(questions.length + controlIndex + 1, questions.length + controlsNeeded.length);
  }
  
  function showQuestion() {

    // if yes/no qs are finished
    if (currentIndex >= questions.length) {
      if (controlsNeeded.length > 0) { // if any questions need control then show controls
        waitingForControl = true;
        currentIndex = 0;
        showNextControl();
        return;
      } else { // no questions need controls. finish the quiz
        finishQuiz();
        return;
      }
    }

    // normal showing the next question
    const q = questions[currentIndex];

    if (q.remember && q.key) {
        const saved = localStorage.getItem(q.key);
        if (saved) textInput.value = saved;
    }
  
    // Control input step
    // DON'T NEED THIS ANYMORE
    // if (waitingForControl) {
    //   questionText.textContent = q.controlPrompt || "Please enter the control:";
    //   textInput.style.display = "block";
    //   confirmBtn.style.display = "inline-block";
    //   yesBtn.style.display = "none";
    //   noBtn.style.display = "none";
    //   textInput.value = answers[currentIndex]?.control || "";
    // } else 
    
    if (q.type === "text") {
      questionText.textContent = q.text;
      textInput.style.display = "block";
      confirmBtn.style.display = "inline-block";
      yesBtn.style.display = "none";
      noBtn.style.display = "none";
      textInput.value = answers[currentIndex]?.answer || "";
    } else if (q.type === "textorno") {
      questionText.textContent = q.text;
      textInput.style.display = "block";
      confirmBtn.style.display = "inline-block";
      textInput.value = answers[currentIndex]?.answer || "";
      yesBtn.style.display = "none";
      noBtn.style.display = "inline-block";
    } else if (q.type === "yesno") {
      questionText.textContent = q.text;
      textInput.style.display = "none";
      confirmBtn.style.display = "none";
      yesBtn.style.display = "inline-block";
      noBtn.style.display = "inline-block";
    }
  
    backBtn.style.display = currentIndex > 0 || waitingForControl ? "inline-block" : "none";
    updateProgress(currentIndex + 1, questions.length);
  }
  
  function handleControlRequired(response, q) {
    if (
      (q.controlOn === "yes" && response === "Yes") ||
      (q.controlOn === "no" && response === "No") // ||
      // (q.controlOn === "both")
    ) {
      return true;
    }
    return false;
  }
  
  yesBtn.onclick = () => {
    const q = questions[currentIndex];

    if (inStorageCheck) {
        const key = storedKeysToCheck[storageCheckIndex];
        editingStorageItem = true;
        editingKey = key;

        // ask user to input new value

        questionText.textContent = questions[currentIndex].text;
        textInput.style.display = "block";
        confirmBtn.style.display = "inline-block";
        yesBtn.style.display = "none";
        noBtn.style.display = "none";
        backBtn.style.display = "inline-block";
        textInput.value = "";

        // answers[currentIndex] = {
        //     question: q.text,
        //     answer: "Yes"
        // }
        // // done, go next
        // currentIndex++;
        // storageCheckIndex++;
        // showStorageCheck();
        // return; // THIS MIGHT BE IMPORTANT


    // Move to normal question that matches this key
    // currentIndex = questions.findIndex(q => q.key === key);
    // inStorageCheck = false;
    // // Show input card for that question
    // questionText.textContent = questions[currentIndex].text;
    // textInput.style.display = "block";
    // confirmBtn.style.display = "inline-block";
    // yesBtn.style.display = "none";
    // noBtn.style.display = "none";
    // backBtn.style.display = currentIndex > 0 || waitingForControl ? "inline-block" : "none";
    // textInput.value = "";

    } else {
      answers[currentIndex] = {
        question: q.text,
        answer: "Yes"
      };

      if (q.type === "yesno" && handleControlRequired("Yes", q)) {
        console.log(controlsNeeded);
        console.log(`current index of this q that needs control ${currentIndex}`);
        // check if duplicate exists
        if (!controlsNeeded.some(item => item.questionIndex === currentIndex)) {
          
          // if not already in the array then add it
          console.log("added");
          controlsNeeded.push({
            questionIndex: currentIndex,
            prompt: q.controlPrompt
          });
          q.controlPromptNeeded = true;
        } // else if in the array do nothing
      } else { // if handlecontrolrequired is FALSE then check if it's in controlsNeeded
        if (controlsNeeded.some(item => item.questionIndex === currentIndex)) { // check if in controlsNeeded
          console.log("Removed");
          controlsNeeded = controlsNeeded.filter(item => item.questionIndex != currentIndex); // delete it from controlsNeeded
        } // if it's not then do nothing
      }
      currentIndex++;
      showQuestion();
    }
  };
  //console.log("NO button clicked");
  noBtn.onclick = () => {
    const q = questions[currentIndex];
    console.log("NO button clicked");

    if (inStorageCheck) {
        console.log("Storage check NO clicked for index:", storageCheckIndex);

        const key = storedKeysToCheck[storageCheckIndex];
        const saved = localStorage.getItem(key) || "";

        // Find question index with this key
        const qIndex = questions.findIndex(q => q.key === key);

        if (qIndex !== -1) {
            answers[qIndex] = {
                question: questions[qIndex].text,
                answer: saved
            };
        }

        currentIndex++;
        storageCheckIndex++;
        showStorageCheck();
        return;
    // NORMAL NO BUTTON!
    } else {
      console.log("Normal NO clicked at quiz index:", currentIndex);

      // record answer as no
      answers[currentIndex] = {
      question: q.text,
      answer: "No"
      };

      // if control is required then record the control required question and its index, then go next
      if (q.type === "yesno" && handleControlRequired("No", q)) {
          // check if duplicate exists
        if (!controlsNeeded.some(item => item.questionIndex === currentIndex)) {
          controlsNeeded.push({
            questionIndex: currentIndex,
            prompt: q.controlPrompt
          });
          q.controlPromptNeeded = true;
        } // else if in the array do nothing
      } else { // if handlecontrolrequired is FALSE then check if it's in controlsNeeded
        if (controlsNeeded.some(item => item.questionIndex === currentIndex)) { // check if in controlsNeeded
          controlsNeeded = controlsNeeded.filter(item => item.questionIndex != currentIndex); // delete it from controlsNeeded
        } // if it's not then do nothing
      }
        currentIndex++;
        showQuestion();
    }
  };
  
  
  confirmBtn.onclick = () => {
    const val = textInput.value.trim();
    if (!val) return;
  
    const q = questions[currentIndex];

    if (editingStorageItem && editingKey) {
        localStorage.setItem(editingKey, val);
        editingStorageItem = false;
        editingKey = null;

        answers[currentIndex] = {
            question: q.text,
            answer: val
        };

        currentIndex++;
        storageCheckIndex++;
        showStorageCheck();
        return;
    }
  
    if (waitingForControl) {
      const qIndex = controlsNeeded[controlIndex].questionIndex;
      answers[qIndex].control = val;
      controlIndex++;
      showNextControl();
      return; 
      // answers[currentIndex].control = val;
      // waitingForControl = false;
      // currentIndex++;
      // showQuestion();
    } else {
      answers[currentIndex] = {
        question: q.text,
        answer: val
      };
      currentIndex++;
      showQuestion();
    }

    if (q.remember && q.key) {
        localStorage.setItem(q.key, val);
    }
  
    textInput.value = "";
    textInput.style.height = "auto";

  };

  textInput.addEventListener("input", function () {
    this.style.height = "auto"; // Reset height
    this.style.height = (this.scrollHeight) + "px"; // Set new height
  });
  
  textInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      confirmBtn.onclick();
    }
  });
  
  backBtn.onclick = () => {
    const q = questions[currentIndex];
    if (inStorageCheck) {
      if (editingStorageItem) {
      // if editing/confirming and going back then nothing in particular, that is handled by "Yes" button on click? no
        editingStorageItem = false;
        editingKey = null;
        showStorageCheck();
        return;
      } else {
      // if wanting to go back to the previous page
        currentIndex--;
        storageCheckIndex--;
        showStorageCheck();
        return;
      }
    }

    console.log(`storagecheck: ${inStorageCheck} and waitingforcontrol: ${waitingForControl}`)
    if (waitingForControl && controlIndex > 0) {
      // if we are at the control stage
      controlIndex--;
      showNextControl();
      return;
      //console.log("waaat");
      // waitingForControl = false;
      // showQuestion();
    } else if (currentIndex > 0) {
      console.log(`curreny index ${currentIndex}`);
      // if last was a storage but you've gone to tasks and now want to change something
      if (currentIndex == 3) { // i.e. is TASK question
        console.log("this happened");
        inStorageCheck = true;
        currentIndex--;
        storageCheckIndex--;
        showStorageCheck();
        return;
      }
      currentIndex--;

      //controlsNeeded.pop();
      q.controlPromptNeeded = false;
      //const lastAns = answers[currentIndex];
  
      // If control is expected based on last answer, go to control step 
      // i think this was from ages ago delete this...?

      // if (q.type === "yesno" && handleControlRequired(lastAns.answer, q)) {
      //   waitingForControl = true;
      // }
      showQuestion();
    }
  };
  
  function getFormattedDate() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  function finishQuiz() {
    document.getElementById("card").innerHTML = `
      <h4>Thanks for answering! A copy of your responses has been sent to you and your supervisor.</h4>`;
    document.querySelector(".buttons").style.display = "none";
    confirmBtn.style.display = "none";
    backBtn.style.display = "none";
    progressText.textContent = "";

    const todaysDate = getFormattedDate();

    // insert the auto-filled date right after "Location" so it still appears in the record
    const locationIdx = answers.findIndex(a => a.question.includes("Location"));
    const displayAnswers = [...answers];
    displayAnswers.splice(locationIdx + 1, 0, { question: "Date (DD/MM/YYYY):", answer: todaysDate });

    const summary = document.createElement("div");
    summary.id = "result-summary";
    summary.innerHTML = displayAnswers.map((a, i) => {
      let html = `<p><strong>Q${i + 1}: ${a.question}</strong><br>${a.answer}`;
      if (a.control) html += `<br><em>Control:</em> ${a.control}`;
      html += "</p>";
      return html;
    }).join("");

  document.getElementById("app").appendChild(summary);

    const usersName = answers.find(a => a.question.includes("Name:"))?.answer || "";
    const todaysTask = answers.find(a => a.question.includes("Task:"))?.answer || "";
    const userEmail = answers.find(a => a.question.includes("your email"))?.answer || "";
    const supervisorEmail = answers.find(a => a.question.includes("supervisor"))?.answer || "";

    console.log("Sending to:", userEmail);
    console.log(`${userEmail}, ${supervisorEmail}`);

    const checklistText = displayAnswers.map((a, i) => {
        let str = `Q${i + 1}: ${a.question}\n${a.answer}`;
        if (a.control) str += `\nControl: ${a.control}`;
        return str;
      }).join("\n\n");
      
      emailjs.send('service_ueuknbt', 'template_maenl8s', {
        name: usersName,
        task: todaysTask, 
        date: todaysDate, 
        supervisoremail: supervisorEmail,
        responses: checklistText,
        youremail: userEmail
      }).then(function(response) {
        console.log("Email sent!", response.status, response.text);
      }, function(err) {
        console.error("Failed to send email:", err);
      });
  }

showStorageCheck();
  