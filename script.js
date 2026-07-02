const questions = [
  { type: "text", text: "Name:",
      key: "name", remember: true },
  { type: "text", text: "Enter your email. A copy of your responses will be sent to this inbox.", 
      key: "userEmail", remember: true },
  { type: "text", text: "Enter your supervisor's email. A copy of your responses will be sent to this inbox.", 
      key: "supervisorEmail", remember: true },
  { type: "text", text: "Task:" },
  { type: "text", text: "Location:" },
  { type: "text", text: "Date (DD/MM/YYYY):" },  
  { type: "yesno", 
      text: "Can I strain or overexert myself?",
      controlOn: "yes",
      controlPrompt: "Describe the control for straining or overexerting yourself:",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Can I fall from a height?",
      controlOn: "yes",
      controlPrompt: "Describe the control for falling from height:",
      controlPromptNeeded: false },
  { type: "yesno",
      text: "Can I be trapped/caught by a plant?",
      controlOn: "yes",
      controlPrompt: "Describe the control for being trapped/caught by a plant:",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Can I contact chemicals or ignition sources?",
      controlOn: "yes",
      controlPrompt: "Describe the control for contacting chemicals or ignition sources:",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Can I receive burns (hot/cold)?",
      controlOn: "yes",
      controlPrompt: "Describe the control for receiving burns:",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Is there potential for slip, trip, and fall hazards?",
      controlOn: "yes",
      controlPrompt: "Describe the control for slip, trip, and fall hazards:",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Is there potential for stored energy needing isolation?",
      controlOn: "yes",
      controlPrompt: "Describe the control for stored energy needing isolation:",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Is there potential for sharp edges or rotating parts?",
      controlOn: "yes",
      controlPrompt: "Describe the control for sharp edges or rotating parts:",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Is there potential for work with radiation sources?",
      controlOn: "yes",
      controlPrompt: "Describe the control for working with radiation sources:",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Is there potential for unsafe atmospheric conditions?",
      controlOn: "yes",
      controlPrompt: "Describe the control for unsafe atmospheric conditions:",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Am I prepared if the weather changes?",
      controlOn: "no",
      controlPrompt: "How do I plan on preparing if the weather changes?",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Am I prepared if my work impacts on others around me?",
      controlOn: "no",
      controlPrompt: "How do I plan on preparing if my work impacts others around me?",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Am I fit for duty?", 
      controlOn: "no",
      controlPrompt: "You should go home.",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Am I fatigued and in need of a break?",
      controlOn: "yes",
      controlPrompt: "You should take a break.",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Am I trained and authorised?", 
      controlOn: "no",
      controlPrompt: "Please ensure you are trained and authorised.",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Am I following FPR Energy procedures for this task?",
      controlOn: "no",
      controlPrompt: "Please follow FPR Energy procedures for this task.",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Am I aware of site emergency procedures?",
      controlOn: "no",
      controlPrompt: "Please make yourself aware of site emergency procedures.",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Am I working above or below someone?",
      controlOn: "yes",
      controlPrompt: "Describe the control for working above or below someone:",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Do I have the correct PPE?",
      controlOn: "no",
      controlPrompt: "Please ensure you have the correct PPE.",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Do I need a Risk Management Plan?",
      controlOn: "yes",
      controlPrompt: "Briefly describe the Risk Management Plan:",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Do I need any work permits?",
      controlOn: "yes",
      controlPrompt: "Please ensure you have obtained the relevant work permits.",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Do I need to restrict access?",
      controlOn: "yes",
      controlPrompt: "Describe the control for restricting access:",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Do I have safe access & egress?",
      controlOn: "no",
      controlPrompt: "Please ensure you have safe access and egress before continuing.",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Do I have the required MSDS?",
      controlOn: "no",
      controlPrompt: "Please obtain the required MSDS.",
      controlPromptNeeded: false },
  { type: "yesno", 
      text: "Do I need assistance?",
      controlOn: "yes",
      controlPrompt: "What type of assistance do I need and can I readily obtain it?",
      controlPromptNeeded: false },
  { type: "textorno", text: "Any other concerns?" }
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
  
  function finishQuiz() {
    document.getElementById("card").innerHTML = `
      <h4>Thanks for answering! A copy of your responses has been sent to you and your supervisor.</h4>`;
    document.querySelector(".buttons").style.display = "none";
    confirmBtn.style.display = "none";
    backBtn.style.display = "none";
  
    const summary = document.createElement("div");
    summary.id = "result-summary";
    summary.innerHTML = answers.map((a, i) => {
      let html = `<p><strong>Q${i + 1}: ${a.question}</strong><br>${a.answer}`;
      if (a.control) html += `<br><em>Control:</em> ${a.control}`;
      html += "</p>";
      return html;
    }).join("");

  document.getElementById("app").appendChild(summary);

    const usersName = answers.find(a => a.question.includes("Name:"))?.answer || "";
    const todaysTask = answers.find(a => a.question.includes("Task:"))?.answer || "";
    const todaysDate = answers.find(a => a.question.includes("Date"))?.answer || "";
    const userEmail = answers.find(a => a.question.includes("your email"))?.answer || "";
    const supervisorEmail = answers.find(a => a.question.includes("supervisor"))?.answer || "";

    console.log("Sending to:", userEmail);
    console.log(`${userEmail}, ${supervisorEmail}`);

    const checklistText = answers.map((a, i) => {
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
  