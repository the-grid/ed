import Listen from 'bean'

export default {
  initialize: function (ed) {
    console.log(ed)
    Listen.on(ed.pm.content, 'click', 'figure, div', event => console.log(event))
  },
  teardown: function () {
	
  }
}