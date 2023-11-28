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
  promptmodal.classList.add("modal-open");
  document.body.appendChild(promptmodal);

  function submitPrompt() {
    task = document.getElementById("promptInput").value;
    interval = document.getElementById("intervalInput").value;
    console.log(task);
    console.log(interval);
    document.querySelector(".modal-header").innerHTML = task;
    promptmodal.style.display = "none";
    promptmodal.classList.remove("modal-open");
    localStorage.setItem('interval', interval);
    localStorage.setItem('counter', counter);

    if (youtubePlayer) {
      youtubePlayer.playVideo();
      youtubePlayer.addEventListener('onStateChange', onPlayerStateChange);
    }

    showTimeUpModal();
    delayedAction();
  }

  document.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('submitBtn')) {
      submitPrompt();
    }
  });
}

function showTimeUpModal() {
  modal = document.createElement("div");
  modal.style.display = "none";

  modal.classList.add("modal-container");
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">Time's Up! Would you like to extend? (New Timer is ${interval / 2} minutes)</div>
      <div class="modal-buttons">
        <button id="continueBtn">Continue Browsing</button>
        <button class="cancelBtn">Exit Youtube</button>
      </div>
    </div>
  `;
  modal.classList.add("modal-open");
  document.body.appendChild(modal);

  document.addEventListener('click', function (event) {
    if (event.target && event.target.id === 'continueBtn') {
      modal.style.display = "none";
      modal.classList.remove("modal-open");
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
  lastModal.classList.add("modal-open");
  document.body.appendChild(lastModal);
}

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
  if (counter + 1 < limit) {
    modal.classList.add("modal-container");
    const newInterval = interval / 2;
    if (counter + 1 == limit - 1) {
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
    showlastPrompt();
    setTimeout(end, 3000);
  }
}

function end() {
  lastModal.style.display = "none";
  location.href = "https://www.google.com/";
}



function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: 'YOUR_VIDEO_ID', // Replace with your actual YouTube video ID
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  // Start checking modal status asynchronously
  console.log("checking");
  modalCheckInterval = setInterval(checkModalStatus(event), 1000);
}

// Function called when YouTube player state changes
function onPlayerStateChange(event) {
  // You can handle player state changes if needed
}

// Function to check if the modal is open
function isModalOpen() {
  const modal = document.getElementById('modal');
  return modal.style.display !== 'none';
}

// Function to check modal status and pause/resume the YouTube player accordingly
function checkModalStatus() {
  const modals = [modal, promptmodal, lastModal];

  const isOpen = modals.some(modal => modal.classList.contains('modal-open'));

  if (isOpen) {
    player.pauseVideo(); // Pause the YouTube player
  } else {
    player.playVideo(); // Resume the YouTube player
  }
  onPlayerReady();
}

// Load YouTube API when the page is ready
document.addEventListener('DOMContentLoaded', () => {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

window.addEventListener('load', function () {
  // Check if the current page is under YouTube
  if (window.location.href.includes("youtube.com")) {
    // The current page is on YouTube
    console.log("YOUTUBE");

    if (youtubePlayer && youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) {
      youtubePlayer.pauseVideo();
    }
    
    onPlayerReady(event);
    showInitialPrompt();
  } else {
    // The current page is not on YouTube
    console.log("NOT YOUTUBE");
  }
});

// Load the YouTube I
