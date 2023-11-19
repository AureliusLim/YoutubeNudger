// Set the default interval and limit values
let interval = 10; // minutes
let limit = 5;
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
        <div class="modal-buttons">
            <button class="submitBtn">Submit</button>
        </div>
    
    </div>
  `;
  document.body.appendChild(promptmodal);

  function submitPrompt() {
    task = document.getElementById("promptInput").value;
    console.log(task)
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
showPromptModal();
document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'continueBtn') {
      modal.style.display = "none";
      counter++;
      localStorage.setItem('counter', counter);
      console.log(counter)
    }
    if (event.target && event.target.classList.contains('cancelBtn')) {
      modal.style.display = "none";
      counter = 99;
    }
  });

reminderInterval = setInterval(function () {
    if (counter < limit) {
        modal.style.display="flex"
    } else {
      location.href = "https://www.google.com/";
      clearInterval(reminderInterval);
    }
  }, interval * 1 * 1000); // modify this from times 60 to times 1 so it will be 10 seconds instead of 10 minutes