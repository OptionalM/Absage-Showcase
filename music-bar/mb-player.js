let mbAudio = null;
let mbAudioSource = null;
let playBtn = null;
let pauseBtn = null;
let mbBar = null;
let mbBarNow = null;
let mbDuration = null;
let mbCurrent = null;
let animationId = null;

function mbInit() {
  mbAudio = document.getElementById("mb-audio");
  mbAudioSource = document.getElementById("mb-audio-source");
  mbAudio.addEventListener("ended", () => {switchTrack(1);});
  
  playBtn = document.getElementById("mb-play");
  pauseBtn = document.getElementById("mb-pause");
  playBtn.addEventListener("click", () => {mbPlayPause(true)});
  pauseBtn.addEventListener("click", () => {mbPlayPause()});
  mbUpdatePlayPause();

  mbBarNow = document.getElementsByClassName("mb-bar-now")[0];
  mbBar = document.getElementsByClassName("mb-bar")[0];
  mbBar.addEventListener("click", mbScrub);
  mbDuration = document.getElementById("mb-duration");
  mbCurrent = document.getElementById("mb-current-time");
  getDuration();
}

// Set correct btn visible
function mbUpdatePlayPause() {
  if (mbAudio.paused) {
    playBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
  } else {
    playBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
  }
}

// Turns e.g. 99 into '01:39'
function secondsToTime(s) {
  let minutes = '0' + Math.floor(s / 60);
  let seconds = '0' + Math.floor(s % 60);
  minutes = minutes.substring(minutes.length-2);
  seconds = seconds.substring(seconds.length-2);
  return minutes + ':' + seconds;
}

// Find out the duration of the current audio
function getDuration() {
  if (isNaN(mbAudio.duration)) {
    mbAudio.addEventListener('loadedmetadata', () => {
      getDuration();
    });
    return;
  }
  mbDuration.innerHTML = secondsToTime(mbAudio.duration);
}

// Update the bar and current time
function mbUpdate() {
  const audioCurrentTime = mbAudio.currentTime;

  const playingPercentage = (audioCurrentTime/mbAudio.duration)*mbBarNow.offsetWidth;
  mbBarNow.style.transform = `translateX(${playingPercentage}px)`;

  mbCurrent.innerHTML = secondsToTime(audioCurrentTime);
  animationId = requestAnimationFrame(mbUpdate);
};

// toggle playback
function mbPlayPause(force) {
  if (mbAudio.paused || force) {
    mbAudio.play();
    animationId = requestAnimationFrame(mbUpdate);
  } else {
    mbAudio.pause();
    cancelAnimationFrame(this.animationId);
  }
  toggleAlbum(!mbAudio.paused);
  mbUpdatePlayPause();
}

document.onkeydown = function(e) {
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      mbAudio.currentTime -= 5;
    break;
    case 'ArrowRight':
      e.preventDefault();
      mbAudio.currentTime += 5;
    break;
    case ' ':
      e.preventDefault();
      mbPlayPause();
    break;
  }
};

// If current time is more than 2s the track is reset, otherwise returns false
function mbResetPlayback() {
  if (mbAudio.currentTime > 2) {
    mbAudio.currentTime = 0;
    return true;
  }
  return false;
}

// Change current play on click
function mbScrub(event) {
  vCurrentBarWidth = event.clientX - mbBar.offsetLeft;
  mbAudio.currentTime = (((vCurrentBarWidth / mbBar.offsetWidth)*100)/100) * mbAudio.duration;
}

// Loads the track at given path and begins playback
function mbLoadTrack(path) {
  mbAudio.pause();
  mbAudioSource.setAttribute('src', path);
  mbAudio.load();
  mbPlayPause(true);
  getDuration();
}

window.addEventListener("load", () => {
  mbInit();
});