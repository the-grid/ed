import Ed from '../src/main'
import fixture from './fixture'

// ProseMirror setup
let ed = new Ed({
  container: document.querySelector('#mirror'),
  onChange: (post) => console.log(post),
  post: fixture
})
console.log(ed)


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

// // Simulate changes from API
// let timeout
// const letters = 'pskzfgtaaiioo   '.split('')
// let randomLetter = function () {
//   return letters[ Math.floor(Math.random()*letters.length) ]
// }
// let toggleUpdates = function () {
//   if (timeout) {
//     clearTimeout(timeout)
//     timeout = null
//   } else {
//     timeout = setTimeout(simulateUpdates, 500)
//   }
// }
// let simulateUpdates = function () {
//   // Loop
//   timeout = setTimeout(simulateUpdates, 500)
//   // Mutate
//   let transform = pm.tr
//   let last = transform.before.content[0].content[0].text.length
//   let position = new Pos([0], last)
//   transform.insertText(position, randomLetter())
//   pm.apply(transform)
// }
// document.querySelector('#sim').onclick = toggleUpdates


// // Initial doc
// apiJSON.value = JSON.stringify(lastAPI, null, 2)
// APIToEditor()

