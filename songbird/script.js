import birdsData from './birds.js'

let question = 0
let sum = 0

async function createPage (question = 0, sum = 0) {
  console.log(question, sum)
  let nav = document.querySelectorAll('.questions p')
  if (question > 0)
    nav[question - 1].style.transform = 'scale(1)'
  nav[question].style.transform = 'scale(1.4)'

  let birdImg = document.getElementsByClassName('image')[0]
  let birdName = document.querySelector('.question h2')

  birdImg.src = './images/unknown_bird.jpg'
  birdName.innerHTML = 'Какая птица?'

  let birdImg_2 = document.getElementsByClassName('image-2')[0]
  let birdName_2 = document.querySelector('.bird h2')
  let birdSpecies = document.querySelector('.bird h3')

  let range_2 = document.getElementsByClassName('range-time-2')[0]
  let timePicker_2 = document.getElementsByClassName('timer-2')[0]
  let playImg_2 = document.getElementsByClassName("play-audio-2")[0]

  birdImg_2.src = './images/unknown_bird.jpg'
  birdName_2.innerHTML = 'Какая птица?'
  birdSpecies.innerHTML = ''

  let markers = Array.from(document.getElementsByClassName('marker'))
  markers.forEach((marker) => {
    console.log(marker)
    marker.style.backgroundColor = "rgba(0, 0, 0, 0.449)"
  })

  let answer = {}

  let random = Math.floor(Math.random() * 6) + 1
  console.log(random)
  birdsData[question].forEach((bird) => {
    if (bird.id == random)
      answer = bird
  })

  console.log(answer)

  let src_1 = answer.audio
  let audio = new Audio(src_1)

  let range = document.getElementsByClassName('range-time')[0]
  let timePicker = document.getElementsByClassName('timer')[0]
  let playImg = document.getElementsByClassName("play-audio")[0]

  audio.addEventListener('loadedmetadata', () => {
    range.max = Math.floor(audio.duration)
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

  let answers = document.getElementsByClassName('ans')

  let k = 0
  birdsData[question].forEach((bird) => {
    answers[k].innerHTML = bird.name
    k++
  })

  let names = []
  let h = 0
  birdsData[question].forEach((bird) => {
    names[h] = bird.name
    h++
  })

  let buttonNext = document.querySelector('.next-level')
  buttonNext.disabled = true

  let res = 5
  let score = document.querySelector('.score span')
  Array.from(answers).forEach((ans) => {
    ans.parentElement.addEventListener('click', () => {
      createSecondAudio(birdsData[question][names.indexOf(ans.innerHTML)])
      if (answer.name == ans.innerHTML) {
        markers[answer.id - 1].style.backgroundColor = "rgb(0, 103, 69)"
        birdImg.src = answer.image
        birdName.innerHTML = answer.name
        sum = sum + res
        score.innerHTML = sum
        buttonNext.disabled = false
        buttonNext.addEventListener('click', () => {
          if (question != 5) {
            question++
            playImg.src = './images/pause.png'
            range.value = 0
            TimeRanges.innerHTML = '00:00:00'
            audio.pause()  
            range_2.value = 0
            timePicker_2.innerHTML = '00:00:00'
            playImg_2.src = './images/pause.png'
            createPage(question, sum)
          }
          else {
            congratulations(sum)
          }
        })
      }
      else {
        if (markers[answer.id - 1].style.backgroundColor != "rgb(0, 103, 69)") 
          markers[names.indexOf(ans.innerHTML)].style.backgroundColor = "red"
      }
      res--
    })
  })
}

function createSecondAudio(bird) {
  let src = bird.audio
  let audio = new Audio(src)

  let birdImg = document.getElementsByClassName('image-2')[0]
  let birdName = document.querySelector('.bird h2')
  let birdSpecies = document.querySelector('.bird h3')

  let range_2 = document.getElementsByClassName('range-time-2')[0]
  let timePicker_2 = document.getElementsByClassName('timer-2')[0]
  let playImg_2 = document.getElementsByClassName("play-audio-2")[0]

  birdImg.src = bird.image
  birdName.innerHTML = bird.name
  birdSpecies.innerHTML = bird.species

  audio.addEventListener('loadedmetadata', () => {
    range_2.max = Math.floor(audio.duration)
    range_2.min = 0
    range_2.step = 0.1
  })

  playImg_2.onclick = function (){
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
    playImg_2.src = "./images/pause.png"
  })

  audio.addEventListener('timeupdate', () => {
    let date = new Date(0)
    date.setSeconds(audio.currentTime)
    timePicker_2.innerHTML = date.toISOString().substring(11, 19)
    range_2.value = audio.currentTime
  })

  range_2.addEventListener('input', () => {         
    audio.currentTime = range_2.value
  })

  let aboutBird = document.querySelector('.about')
  aboutBird.innerHTML = bird.description
}

createPage(question)

function congratulations(sum) {
  let main = document.querySelector('.quize')
  let nav = document.querySelectorAll('.questions p')

  main.innerHTML = ''
  nav = ''
  
  let paragraph = document.createElement('h3')
  paragraph.innerHTML = 'Поздравляем, вы набрали ' + sum + ' баллов!'

  paragraph.classList.add('congratulations')

  main.append(paragraph)
}
