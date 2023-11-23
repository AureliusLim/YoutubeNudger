// Set the default interval and limit values
let interval = 20; // minutes
let limit = 3;
 let counter = 0;
let modal;
let promptmodal;
let reminderInterval;
let task;
// Function to show the "What were you supposed to do?" modal
function showPromptModal() {
  promptmodal = document.createElement("div");
  promptmodal.style.position = "fixed";
  promptmodal.style.top = "0";
  promptmodal.style.left = "0";
  promptmodal.style.width = "100%";
  promptmodal.style.height = "100%";
  promptmodal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  promptmodal.style.zIndex = "9999";
  promptmodal.innerHTML = `
    <div style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; border-radius: 10px; text-align: center;'>
      <div id="promptText">What were you supposed to do?</div>
        <input type="text" id="promptInput" required>

        <div id="promptInterval"> Interval: </div>
        <input type="text" id="intervalInput" required>
        <div class="modal-buttons">
            <button class="submitBtn">Submit</button>
        </div>
    
    </div>
  `;
  document.body.appendChild(promptmodal);

  function submitPrompt() {
    task = document.getElementById("promptInput").value;
    interval = document.getElementById("intervalInput").value;
    console.log(task)
    console.log(interval)
    document.getElementById("promptText").innerHTML = task;
    promptmodal.style.display = "none";
    localStorage.setItem('counter', counter);
  }

  document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('submitBtn')) {
      submitPrompt();
    }
  });
}


modal = document.createElement("div");
modal.style.position = "fixed";
modal.style.top = "0";
modal.style.display = "none"
modal.style.left = "0";
modal.style.width = "100%";
modal.style.height = "100%";
modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
modal.style.zIndex = "9999";
modal.innerHTML = `
    <div style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; border-radius: 10px; text-align: center;'>
    <div id="promptText"></div>
    <div class="modal-buttons">
        <button id="continueBtn">Continue Browsing</button>
        <button class="cancelBtn">Cancel</button>
    </div>
    </div>
`;
document.body.appendChild(modal);

function delayedAction() {
  setTimeout(action, newinterval * 1000); // Wait for 'newinterval' seconds before executing action()
}

function action() {
  if (counter < limit) {
    modal.style.display = "flex";
    newinterval /= 2;
    console.log(newinterval);
    delayedAction(); // Trigger next action after 'newinterval' seconds
  } else {
    location.href = "https://www.google.com/";
  }
}

showPromptModal(); 

document.addEventListener('click', function(event) {
  if (event.target && event.target.id === 'continueBtn') {
    modal.style.display = "none";
    counter++;
    localStorage.setItem('counter', counter);
    console.log(counter);
    delayedAction(); 
  }
  if (event.target && event.target.classList.contains('cancelBtn')) {
    modal.style.display = "none";
    counter = 99;
    location.href = "https://www.google.com/";
  }
});
let newinterval = interval;
// Initial call to delayed action
delayedAction();

// var newinterval = interval
// reminderInterval = setInterval(action(), newinterval * 1 * 1000); // modify this from times 60 to times 1 so it will be 10 seconds instead of 10 minutes