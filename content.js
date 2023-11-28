const styles = `
  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
  }

  .modal-header {
    font-size: 1.2em;
    margin-bottom: 15px;
  }

  .modal-buttons button {
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 1em;
  }
`;

// Append styles to the head of the document
const styleTag = document.createElement('style');
styleTag.innerHTML = styles;
document.head.appendChild(styleTag);


let interval = 20; // minutes
let limit = 3;
let counter = 0;
let modal;
let promptmodal;
let lastModal;
let reminderInterval;
let task;
let youtubePlayer;

// Function to show the "What were you supposed to do?" modal
function showInitialPrompt() {
  promptmodal = document.createElement("div");
  promptmodal.classList.add("modal-container");
  promptmodal.innerHTML = `
    <div class="modal">
      <div class="modal-header">Set your reminder</div>
      <input type="text" id="promptInput" placeholder="Enter your reminder" required>
      <input type="text" id="intervalInput" placeholder="Set interval (minutes)" required>
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
    // document.getElementById("promptText").innerHTML = task;
    document.querySelector(".modal-header").innerHTML = task;
    promptmodal.style.display = "none";

    localStorage.setItem('interval', interval);
    localStorage.setItem('counter', counter);

    if (youtubePlayer){
      youtubePlayer.playVideo()
      youtubePlayer.addEventListener('onStateChange', onPlayerStateChange);
    }

    showTimeUpModal()
    delayedAction()
  }

  document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('submitBtn')) {
      submitPrompt();
    }
  });
}

function showTimeUpModal() {
  modal = document.createElement("div");
  modal.style.display = "none"

  modal.classList.add("modal-container");
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">Time's Up! Would you like to extend? (New Timer is ${interval/2} minutes)</div>
      <div class="modal-buttons">
        <button id="continueBtn">Continue Browsing</button>
        <button class="cancelBtn">Exit Youtube</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'continueBtn') {
      modal.style.display = "none";
      interval /= 2;
      counter++;
      localStorage.setItem('counter', counter);
      localStorage.setItem('interval', interval);
      console.log("Add NUMBER:  " + counter);
      delayedAction(); 
    }
    if (event.target && event.target.classList.contains('cancelBtn')) {
      modal.style.display = "none";
      counter = 99;
      location.href = "https://www.google.com/";
    }
  });
}

function showlastPrompt() {
  lastModal = document.createElement("div");
  lastModal.classList.add("modal-container");
  lastModal.innerHTML = `
    <div class="modal">
      <div class="modal-header">Your Time is Up !! Exiting Youtube</div>
    </div>
  `;
  document.body.appendChild(lastModal);
}

// function delayedAction() {
//   setTimeout(action, interval * 1000); // Wait for 'newinterval' seconds before executing action()
// }

function delayedAction() {
  let secondsRemaining = interval;

  function countDown() {
    if (secondsRemaining > 0) {
      console.log(`Seconds remaining: ${secondsRemaining}`);
      secondsRemaining--;
      setTimeout(countDown, 1000); // Log every second
    } else {
      action();
    }
  }

  setTimeout(countDown, 1000); // Initial log
}


function action() {
  if (counter+1 < limit) {
    modal.classList.add("modal-container");
    const newInterval = interval / 2;
    if(counter+1 == limit-1){
      modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">Time's Up! Would you like to extend? This is your Last Extension! (New Timer is ${newInterval} minute/s)</div>
        <div class="modal-buttons">
          <button id="continueBtn">Continue Browsing</button>
          <button class="cancelBtn">Exit Youtube</button>
        </div>
      </div>
    `;
    } else {
      modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">Time's Up! Would you like to extend? (New Timer is ${newInterval} minute/s)</div>
        <div class="modal-buttons">
          <button id="continueBtn">Continue Browsing</button>
          <button class="cancelBtn">Exit Youtube</button>
        </div>
      </div>
    `;
    }
    modal.style.display = "flex";
    } else {
      showlastPrompt()
      setTimeout(end, 2000);
  }
}

function end(){
  lastModal.style.display = "none";
  location.href = "https://www.google.com/"
}


function onPlayerStateChange(event) {
  // Check if the player is playing
  if (event.data === YT.PlayerState.PLAYING) {
    // Pause the YouTube player when the modal is displayed
    if (modal && modal.style.display === "flex") {
      youtubePlayer.pauseVideo();
    }
  }
}


window.addEventListener('load', function () {
  // Check if the current page is under YouTube
  if (window.location.href.includes("youtube.com")) {
    // The current page is on YouTube
    console.log("YOUTUBE");

    if (youtubePlayer && youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) {
      youtubePlayer.pauseVideo();
    }

    showInitialPrompt();
  } else {
    // The current page is not on YouTube
    console.log("NOT YOUTUBE");
  }
});



// Load the YouTube IFrame API after DOM content has loaded
document.addEventListener('DOMContentLoaded', function () {
  // Create a meta tag for Content Security Policy
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = "script-src 'self' 'wasm-unsafe-eval' 'inline-speculation-rules' http://localhost:* http://127.0.0.1:* https://www.youtube.com;";
  
  // Append the meta tag to the head of the document
  document.head.appendChild(cspMeta);

  // Load the YouTube IFrame API script
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

// // Event listener for when the YouTube player is ready
function onPlayerReady(event) {

  console.log("READY PLAYER")
  // Pause the YouTube player initially
  event.target.pauseVideo();
  
  // Store the YouTube player in the global variable
  youtubePlayer = event.target;

  youtubePlayer.addEventListener('onStateChange', onPlayerStateChange);
}
