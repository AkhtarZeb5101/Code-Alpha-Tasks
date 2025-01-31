const music = document.getElementById('music');
const playPauseBtn = document.getElementById('play-pause');
const playIcon = document.getElementById('play-icon');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const songImage = document.getElementById('song-image');
const playlistToggle = document.getElementById('playlist-toggle');
const playlist = document.getElementById('playlist');
const playlistItems = document.querySelectorAll('.playlist-item');

let isPlaying = false;
let currentSongIndex = 0;
let songs = Array.from(playlistItems);

const playPauseMusic = () => {
    if (isPlaying) {
        music.pause();
        playIcon.classList.replace('fa-pause', 'fa-play');
    } else {
        music.play();
        playIcon.classList.replace('fa-play', 'fa-pause');
    }
    isPlaying = !isPlaying;
};

const updateProgress = () => {
    progress.value = (music.currentTime / music.duration) * 100;
};

const setProgress = (e) => {
    music.currentTime = (e.target.value / 100) * music.duration;
};

const updateVolume = (e) => {
    music.volume = e.target.value;
};

const changeSong = (index) => {
    let song = songs[index];
    music.src = song.getAttribute('data-src');
    songTitle.textContent = song.getAttribute('data-title');
    artistName.textContent = song.getAttribute('data-artist');
    songImage.src = song.getAttribute('data-img');

    currentSongIndex = index;
    music.play();
    playIcon.classList.replace('fa-play', 'fa-pause');
    isPlaying = true;
};

const nextSong = () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    changeSong(currentSongIndex);
};

const prevSong = () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    changeSong(currentSongIndex);
};

playlistToggle.addEventListener('click', () => {
    playlist.style.display = playlist.style.display === 'block' ? 'none' : 'block';
});

playPauseBtn.addEventListener('click', playPauseMusic);
music.addEventListener('timeupdate', updateProgress);
progress.addEventListener('input', setProgress);
volume.addEventListener('input', updateVolume);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        changeSong(index);
        playlist.style.display = 'none';
    });
});
