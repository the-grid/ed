import Ed from '../src/'
import fixture from './fixture'

// ProseMirror setup
let ed = new Ed({
  container: document.querySelector('#mirror'),
  onChange: onPostChange,
  post: fixture
})
console.log(ed)

function onPostChange () {
  console.log('change', ed.post)
}


// Debug buttons

// Hydrate
let apiJSON = document.querySelector('#api')
apiJSON.value = JSON.stringify(fixture, null, 2)
function APIToEditor () {
  let json
  try {
    json = JSON.parse(apiJSON.value)
  } catch (e) {
    return console.warn('bad json')
  }
  ed.post = json
}
document.querySelector('#hydrate').onclick = APIToEditor

// Dehydrate
function EditorToAPI () {
  apiJSON.value = JSON.stringify(ed.post, null, 2)
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
  } else {
    timeout = setTimeout(simulateUpdates, 500)
  }
}
let simulateUpdates = function () {
  // Loop
  timeout = setTimeout(simulateUpdates, 500)
  // Mutate
  let post = ed.post
  let html = post.content[0].html
  html = html.slice(0, -4) + randomLetter() + '</p>'
  post.content[0].html = html
  ed.post = post
}
document.querySelector('#sim').onclick = toggleUpdates
