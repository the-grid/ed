// TODO port these, if worth it
require('./editable-style-pm.css')
require('./editable-style-menu.css')

import cxs from 'cxs'

const className = cxs(
  { '.ProseMirror-content':
    { color: 'black' }
  }
)

export default className
