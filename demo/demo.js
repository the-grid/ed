import Ed from '../src/'
import fixture from './fixture'

let content = fixture.content

// ProseMirror setup
let ed = new Ed({
  container: document.querySelector('#mirror'),
  onChange: onPostChange,
  content: content
})
console.log(ed)

function onPostChange () {
  // console.log('change', ed.content)
}


// Debug buttons

// Hydrate
let apiJSON = document.querySelector('#api')
apiJSON.value = JSON.stringify(content, null, 2)
function APIToEditor () {
  let json
  try {
    json = JSON.parse(apiJSON.value)
  } catch (e) {
    return console.warn('bad json')
  }
  ed.content = json
}
document.querySelector('#hydrate').onclick = APIToEditor

// Dehydrate
function EditorToAPI () {
  apiJSON.value = JSON.stringify(ed.content, null, 2)
}
document.querySelector('#dehydrate').onclick = EditorToAPI

// Simulate changes from API
let timeout
const letters = 'pskzfgtaaiioo   '.split('')
let randomLetter = function () {
  return letters[ Math.floor(Math.random()*letters.length) ]
}
let toggleUpdates = function () {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
    document.querySelector('#sim').textContent = 'Simulate changes from API ▶'
  } else {
    timeout = setTimeout(simulateUpdates, 500)
    document.querySelector('#sim').textContent = 'Simulate changes from API ◼︎'
  }
}
let simulateUpdates = function () {
  // Loop
  timeout = setTimeout(simulateUpdates, 500)
  // Mutate
  let content = ed.content
  let html = content[0].html
  html = html.slice(0, -4) + randomLetter() + '</p>'
  content[0].html = html
  ed.content = content
}
document.querySelector('#sim').onclick = toggleUpdates
