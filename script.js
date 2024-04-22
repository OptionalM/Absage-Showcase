let albumCover = false;
let cd = false;
let nextBtn = false;
let previousBtn = false;
let currSong = 0;
let songInfo = [];
let lyricsE = false;
let titleE = false;
let genreE = false;
let downloadE = false;

fetch('./songInfo.json')
.then((r) => r.json())
.then((json) => {songInfo = json; switchTrack(0)});

function init() {
  albumCover = document.getElementById('album-cover');
  lyricsE = document.getElementById('lyrics');
  titleE = document.getElementById('title');
  genreE = document.getElementById('genre');
  downloadE = document.getElementById('download-song');
  cd = document.getElementById('cd');
  nextBtn = document.getElementById('mb-next');
  previousBtn = document.getElementById('mb-previous');

  nextBtn.addEventListener('click', () => { switchTrack(1); });
  previousBtn.addEventListener('click', () => { switchTrack(-1); });
  albumCover.addEventListener('click', () => { mbPlayPause(); });
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
}

window.addEventListener("load", () => {
  init();
});