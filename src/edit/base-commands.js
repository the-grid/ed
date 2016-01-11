export const baseCommands = Object.create(null)

let uploaderMount = document.createElement('div')
uploaderMount.innerHTML = `<input id="uploader" type="file" name="files[]" multiple style="width:0px; height:0px; display:none;"/>`
document.body.appendChild(uploaderMount)
let uploaderDom = uploaderMount.firstChild

baseCommands.upload_embed = {
  label: "upload something...",
  run(pm) {
    uploaderDom.click()
    //let node = nodeAboveSelection(pm)
    //if (!node) return false
    //pm.setNodeSelection(node)
  },
  menuGroup: "block(100)",
  display: {type: "icon", text: "upload", style: "font-weight: bold; vertical-align: 20%"}
  //keys: ["Esc"]
}


let widgetStoreDom = document.getElementById('widget-store')

baseCommands.insert_embed = {
  label: "insert something...",
  run(pm) {
    widgetStoreDom.classList.add('show')
    //let node = nodeAboveSelection(pm)
    //if (!node) return false
    //pm.setNodeSelection(node)
  },
  menuGroup: "block(100)",
  display: {type: "icon", text: "insert", style: "font-weight: bold; vertical-align: 20%"}
  //keys: ["Esc"]
}