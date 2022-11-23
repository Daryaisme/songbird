import birdsData from './birds.js'

let question = 0
let sum = 0
let currentAudio

function createFirstPlayer (bird) {
  let src = bird.audio
  let audio = new Audio(src)

  let range = document.getElementsByClassName('range-time')[0]
  let timePicker = document.getElementsByClassName('timer')[0]
  let playImg = document.getElementsByClassName('play-audio')[0]

  audio.addEventListener('loadedmetadata', () => {
    range.max = Math.floor(audio.duration)
    range.min = 0
    range.step = 0.1
  })

  playImg.onclick = () => {
    if (currentAudio && currentAudio != audio) {
      currentAudio.pause()
    }
    if (audio.paused) {
      audio.play()
      currentAudio = audio
      playImg.src = "./images/play.png"
    } else {
      audio.pause()
    }
  }
  audio.addEventListener('ended', () => {
    audio.currentTime = 0
    playImg.src = "./images/pause.png"
  })
  audio.addEventListener('pause', () => {
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
}

function clearFirstPlayer () {
  let range = document.getElementsByClassName('range-time')[0]
  let timePicker = document.getElementsByClassName('timer')[0]
  let playImg = document.getElementsByClassName("play-audio")[0]
  let birdImg = document.querySelector('.image')
  let birdName = document.querySelector('.question h2')
  let timer = document.querySelector('.range-time')

  range.value = 0
  timePicker = "00:00:00"
  playImg.src = './images/pause.png'
  birdImg.src = './images/unknown_bird.jpg'
  birdName.innerHTML = 'Какая птица?'
  timer.innerHTML = '00:00:00'
}

async function createSecondPlayer (bird) {
  clearSecondPlayer()

  let src = await bird.audio
  let audio = new Audio(src)

  let birdImg = document.querySelector('.image-2')
  let birdName = document.querySelector('.bird h2')
  let birdSpecies = document.querySelector('.bird h3')
  let aboutBird = document.querySelector('.about')

  let range = document.getElementsByClassName('range-time-2')[0]
  let timePicker = document.getElementsByClassName('timer-2')[0]
  let playImg = document.getElementsByClassName("play-audio-2")[0]
  
  birdImg.src = bird.image
  birdName.innerHTML = bird.name
  birdSpecies.innerHTML = bird.species
  aboutBird.innerHTML = bird.description

  audio.addEventListener('loadedmetadata', () => {
    range.max = Math.floor(audio.duration)
    range.min = 0
    range.step = 0.1
  })

  playImg.onclick = function () {
    if (currentAudio && currentAudio != audio) {
      currentAudio.pause()
    }
    if (audio.paused) {
      audio.play()
      currentAudio = audio
      currentAudio.classList.add('active')
      playImg.src = "./images/play.png"
    } else {
      audio.pause()
    }
  }
  audio.addEventListener('ended', function () {
    audio.currentTime = 0
    playImg.src = "./images/pause.png"
  })
  audio.addEventListener('pause', function () {
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
}

function clearSecondPlayer () {
  let range = document.querySelector('.range-time-2')
  let timePicker = document.querySelector('.timer-2')
  let playImg = document.querySelector('.play-audio-2')

  range.value = 0
  timePicker.innerHTML = "00:00:00"
  playImg.src = './images/pause.png'

  currentAudio && currentAudio.classList.contains('active') ? currentAudio.pause() && currentAudio.classList.remove('active') : true
}

function clearBullets () {
  let markers = document.getElementsByClassName('marker')

  Array.from(markers).forEach((marker) => {
    marker.style.backgroundColor = "rgba(0, 0, 0, 0.449)"
  })
}

function createAnswer (question) {
  let answer = {}

  let random = Math.floor(Math.random() * 6)
  answer = birdsData[question][random]

  return answer
}

function nav (question) {
  let nav = document.querySelectorAll('.questions p')
  if (question > 0)
    nav[question - 1].style.transform = 'scale(1)'
  nav[question].style.transform = 'scale(1.2)'
}

function createVariants (question) {
  let box = document.querySelector('.answers')
  box.innerHTML = ''

  for (let i = 0; i < 6; i++) {
    let variant = document.createElement('div')
    if (i == 0) variant.classList.add('top')
    if (i == 5) variant.classList.add('bottom')

    let marker = document.createElement('div')
    marker.classList.add('marker')
    let paragraph = document.createElement('p')
    paragraph.innerHTML = birdsData[question][i].name
    paragraph.classList.add('ans')

    variant.append(marker, paragraph)
    box.append(variant)
  }
}

function playCorrect () {
  let audio = new Audio('./audios/correct.mp3')

  audio.play()
}

function playIncorrect () {
  let audio = new Audio('./audios/incorrect.mp3')

  audio.play()
}

let buttonNext = document.querySelector('.next-level')

buttonNext.addEventListener('click', () => {
  let s = document.querySelector('.score span')
  if (question != 5) {
    question++
    clearBullets()
    clearFirstPlayer()
    clearSecondPlayer()
    clearBullets()
    createPage(question, parseInt(s.innerHTML))
  }
  else {
    congratulations(parseInt(s.innerHTML))
  }
})

let res = 5
function createPage(question, sum) {
  console.log(sum)
  nav(question)
  createVariants (question)

  let answer = createAnswer(question)
  console.log(answer)

  createFirstPlayer(answer)

  buttonNext.setAttribute('disabled', 'disabled')

  let variants = document.getElementsByClassName('ans')

  let k = 0
  birdsData[question].forEach((bird) => {
    variants[k].innerHTML = ''
    variants[k].innerHTML = bird.name
    k++
  })

  let markers = document.getElementsByClassName('marker')
  let birdName = document.querySelector('.question h2')
  let birdImg = document.querySelector('.image')

  let score = document.querySelector('.score span')

  res = 5 
  console.log(res)
  Array.from(variants).forEach((variant, i) => {
    variant.parentElement.addEventListener('click', () => {
      createSecondPlayer(birdsData[question][i])
      if (answer.name != variant.innerHTML) {
        if (markers[i].style.backgroundColor != 'red') {
          if (Array.from(markers).filter((marker) => (marker.style.backgroundColor == 'green')).length == 0)
            markers[i].style.backgroundColor = 'red'
            res--
            if (Array.from(markers).filter((marker) => (marker.style.backgroundColor == 'green')).length == 0)
              playIncorrect()
        }
      }
      else {        
        markers[i].style.backgroundColor = 'green'
        birdImg.src = answer.image
        birdName.innerHTML = answer.name
        sum = sum + res
        score.innerHTML = sum
        buttonNext.disabled = false
        currentAudio?.pause()
        playCorrect()
      }
      console.log(res)
    })
  })
}

function congratulations(sum) {
  let main = document.querySelector('.quize')
  let nav = document.querySelectorAll('.questions p')

  main.innerHTML = ''
  nav.innerHTML = ''
  
  let paragraph = document.createElement('h3')
  paragraph.innerHTML = 'Поздравляем, вы набрали ' + sum + ' баллов!'

  paragraph.classList.add('congratulations')

  main.append(paragraph)
}

createPage(question, sum)
