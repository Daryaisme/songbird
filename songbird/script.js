//    ПЛЕЕР НАЧАЛО

let audio = new Audio('https://www.xeno-canto.org/sounds/uploaded/VOLIQOYWKG/XC489247-190724_09.10h_huiszwaluw_biesbosch_amaliahoeve_roep_100%2Bex_fouragerend_gezien_%20%282%29.mp3')

let range = document.getElementsByClassName('range-time')[0]
let timePicker = document.getElementsByClassName('timer')[0]
let playImg = document.getElementsByClassName("play-audio")[0]

audio.addEventListener('loadedmetadata', () => {
  range.max = audio.duration
  range.min = 0
  range.step = 0.1
})

playImg.onclick = function (){
  if (audio.paused) {
    audio.play()
    this.src = "./images/play.png"
  } else {
    audio.pause()
    this.src = "./images/pause.png"
  }
}
audio.addEventListener('ended', function () {
  audio.currentTime = 0
  playImg.src = "./images/pause.png"
})

audio.addEventListener('timeupdate', () => {
  let date = new Date(0)
  date.setSeconds(audio.currentTime)
  timePicker.innerHTML = date.toISOString().substring(11, 19)
  range.value = audio.currentTime
})

range.addEventListener('input', () => {         
  audio.currentTime = range.value
})

let volumeControl = document.getElementsByClassName('range-volume')[0]
let volume = document.getElementsByClassName("volume")[0]

volumeControl.addEventListener('input', () => {         
  audio.volume = volumeControl.value
  if(audio.volume == 0) 
    volume.src = "images/no-audio.png"
  else 
    volume.src = "images/audio.png"
})
volume.addEventListener('click', () => {
  if (audio.volume != 0) {
    audio.volume = 0
    volume.src = './images/no-audio.png'
  }
  else {
    audio.volume = volumeControl.value
    volume.src = './images/audio.png'
  }
})

//    ПЛЕЕР КОНЕЦ
