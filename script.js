let albumCover = false;
let cd = false;
let mbNextBtn = false;
let mbPreviousBtn = false;
let nextBtn = false;
let previousBtn = false;
let currSong = 0;
let songInfo = [];
let lyricsE = false;
let titleE = false;
let genreE = false;
let downloadE = false;
let tarackListE = false;

// Fetch the song info and init the player state
fetch('./songInfo.json')
.then((r) => r.json())
.then((json) => {
  songInfo = json;
  initTrack();
  switchTrack(0);
  populateTrackList();
});

// Init DOM element variables (called when DOM is built)
function init() {
  albumCover = document.getElementById('album-cover');
  lyricsE = document.getElementById('lyrics');
  titleE = document.getElementById('title');
  genreE = document.getElementById('genre');
  downloadE = document.getElementById('download-song');
  tarackListE = document.getElementById('track-list');
  cd = document.getElementById('cd');
  mbNextBtn = document.getElementById('mb-next');
  mbPreviousBtn = document.getElementById('mb-previous');
  nextBtn = document.getElementById('next');
  previousBtn = document.getElementById('previous');

  mbNextBtn.addEventListener('click', () => { switchTrack(1); });
  mbPreviousBtn.addEventListener('click', () => { switchTrack(-1); });
  nextBtn.addEventListener('click', () => { switchTrack(1); });
  previousBtn.addEventListener('click', () => { switchTrack(-1); });
  albumCover.addEventListener('click', () => { mbPlayPause(); });
}

// Sets currSong to the one in the URL hash (default: 0)
function initTrack() {
  currSong = 0;
  const hash = window.location.hash;
  songInfo.forEach((s, i) => {
    if (s['title'] === hash.substring(1)) currSong = i;
  });
}

// Adds linked tracks to the Album Info tab
function populateTrackList() {
  if (!tarackListE) {
    setTimeout(() => populateTrackList());
    return
  }
  songInfo.forEach((s, i) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.innerHTML = s['title'];
    a.href = '#' + s['title'];
    a.onclick = () => { currSong = i ; switchTrack(0); };
    li.appendChild(a);
    tarackListE.appendChild(li);
  })
}

// Toggles the playing animation for the album cover and cd
function toggleAlbum(isPlaying) {
  albumCover.style.transform = isPlaying ? 'translateX(-50px)' : 'translateX(0)';
  cd.style.transform = isPlaying ? 'translateX(20%)' : 'translateX(0)';
}

// moves along the tracklist via +1 or -1;
function switchTrack(d) {
  if (d === -1) {
    if (mbResetPlayback()) return;
  }
  currSong += d;
  if (currSong >= songInfo.length) currSong = 0;
  if (currSong < 0) currSong = songInfo.length-1;
  if (typeof mbLoadTrack === 'function' && mbAudio !== null) {
    mbLoadTrack('album/' + songInfo[currSong].path);
  } else {
    setTimeout(() => {switchTrack(0)},50);
    return
  }
  lyricsE.innerHTML = songInfo[currSong].lyrics;
  titleE.innerHTML = songInfo[currSong].title;
  genreE.innerHTML = songInfo[currSong].genre;
  downloadE.href = 'album/' + songInfo[currSong].path;
  history.replaceState(undefined, undefined, '#' + songInfo[currSong].title)
}

window.addEventListener("load", () => {
  init();
});