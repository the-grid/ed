import {MenuItem} from 'prosemirror-menu'
import xtend from 'xtend'
import {toggleMark} from 'prosemirror-commands'
import EdSchema from '../schema/ed-schema'
import {TextField, openMenuPrompt} from './menu-prompt'
import {isUrlLike} from '../util/url'

const markType = EdSchema.marks.link

function markActive (state, type) {
  let {from, $from, to, empty} = state.selection
  if (empty) return type.isInSet(state.storedMarks || $from.marks())
  else return state.doc.rangeHasMark(from, to, type)
}

function makeToggleLink (toggleLink) {
  const spec = xtend(toggleLink.spec, {
    run: function (state, dispatch, view) {
      // HAHAHACK
      const menuEl = view.content.parentNode.querySelector('.ProseMirror-menubar')
      if (!menuEl) return false
      const buttonEl = menuEl.querySelector('[title="Add or remove link"]')
      if (!buttonEl) return false

      if (markActive(state, markType)) {
        toggleMark(markType)(state, dispatch)
        return true
      }

      const {from, to} = state.selection
      const selectedText = state.doc.textBetween(from, to)

      openMenuPrompt({
        title: 'Create a link',
        fields: {
          href: new TextField({
            label: 'Link target',
            placeholder: 'https://...',
            required: true,
            clean: (val) => {
              if (!/^https?:\/\//i.test(val)) {
                val = 'http://' + val
              }
              return val
            },
            value: (isUrlLike(selectedText) ? selectedText : '')
          }),
          title: new TextField({
            label: 'Hover Title',
          }),
        },
        callback (attrs) {
          toggleMark(markType, attrs)(view.state, view.dispatch)
          view.focus()
        },
        menuEl,
        buttonEl,
      })
    },
  })
  return new MenuItem(spec)
}

export default makeToggleLink


