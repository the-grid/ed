`npm start`

# ed

:warning: WIP; not in production yet. :warning: [![Build Status](https://travis-ci.org/the-grid/ed.svg?branch=master)](https://travis-ci.org/the-grid/ed)

Using [ProseMirror](http://prosemirror.net/) with data from [the Grid API](http://developer.thegrid.io/)

Demo: [the-grid.github.io/ed/](https://the-grid.github.io/ed/)

The demo shows translating from ProseMirror to the the Grid API JSON and back.

## purpose

ProseMirror provides a high-level schema-based interface for interacting with `contenteditable`, taking care of that pain. This project is focused on:

* Schema to translate between the Grid API data and ProseMirror doc type
* Coordinating widgets (block editors specialized by type) ([example](https://github.com/the-grid/ced))

## todo

* [x] test crucial parts
* [x] iframe widgets
* [x] native widgets
* [x] handle image, video, article, quote types
  * [x] edit attribution
* [x] Integrate into web app
* [x] Integrate into mobile apps
* [x] Remove / change cover image

# use

Ed exposes a React component by default. 

``` jsx
import Ed from '@the-grid/ed'

export default class PostEditor extends React.Component {
  render() {
    return (
      <Ed key='item-uuid' initialContent={...} onChange={...} ... />
    )
  }
}
```

There are also `{mountApp, unmountApp}` helper methods
available to use like this:

``` js
  import {mountApp, unmountApp} from '@the-grid/ed'

  ed = mountApp(document.querySelector('#ed'), {
    // REQUIRED -- Content array from post
    initialContent: [],
    // Bar is designed for touch, Tip for mouse
    menuTip: true,
    menuBar: false,
    // REQUIRED -- Hit on every change
    onChange: function () {
      /* App can show "unsaved changes" in UI */
    },
    // REQUIRED
    onShareFile: function (index) {
      /* App triggers native file picker */
      /* App calls ed.insertPlaceholders(index, count) and gets array of ids back */
      /* App uploads files and sets status on placeholder blocks with ed.updatePlaceholder */
      /* On upload / measurement finishing, app replaces placeholder blocks with ed.setContent */
    },
    // REQUIRED
    onRequestCoverUpload: function (id) {
      /* Similar to onShareFile, but hit with block id instead of index */
      /* App uploads files and sets status on blocks with ed.updatePlaceholder */
      /* Once upload is complete, app hits ed.setCoverSrc */
    },
    // REQUIRED
    onShareUrl: function ({block, url}) {
      /* Ed made the placeholder with block id */
      /* App shares url with given block id */
      /* App updates status on placeholder blocks with ed.updatePlaceholder */
      /* On share / measurement finishing, app replaces placeholder blocks with ed.setContent */
    },
    // REQUIRED
    onPlaceholderCancel: function (id) {
      /* Ed removed the placeholder if you call ed.getContent() now */
      /* App should cancel the share or upload */
    },
    // OPTIONAL
    onDropFiles: function (index, files) {
      /* App calls ed.insertPlaceholders(index, files.length) and gets array of ids back */
      /* App uploads files and sets status on placeholder blocks with ed.updatePlaceholder */
      /* On upload / measurement finishing, app replaces placeholder blocks with ed.setContent */
    },
    // OPTIONAL
    onDropFileOnBlock: function (id, file) {
      /* App uploads files and sets status on block with ed.updatePlaceholder */
      /* Once upload is complete, app hits ed.setCoverSrc */
    },
    // OPTIONAL
    onMount: function () {
      /* Called once PM and widgets are mounted */
    },
    // OPTIONAL
    onCommandsChanged: function (commands) {
      /* Object with commandName keys and one of inactive, active, disabled */
    },
    // OPTIONAL -- imgflo image proxy config
    imgfloConfig: {
      server: 'https://imgflo.herokuapp.com/',
      key: 'key',
      secret: 'secret'
    },
    // OPTIONAL -- where iframe widgets live relative to app
    widgetPath: './node_modules/'
  })
  
  // Returns array of inserted placeholder ids
  ed.insertPlaceholders(index, count)
  
  // Update placeholder metadata
  // {status (string), progress (number 0-100), failed (boolean)}
  ed.updatePlaceholder(id, metadata)
  
  // Once block cover upload completes
  // `cover` is object with {src, width, height}
  ed.setCover(id, cover)

  // For placeholder or media block with uploading cover
  // `src` should be blob: or data: url of a
  // sized preview of the local image
  ed.setCoverPreview(id, src)

  // Returns content array
  // Expensive, so best to debounce and not call this on every change
  // Above the fold block is index 0, and starred
  ed.getContent()
  
  // Only inserts/updates placeholder blocks and converts placeholder blocks to media
  ed.setContent(contentArray)
  
  // Returns true if command applies successfully with current selection
  ed.execCommand(commandName)
```

Demo: [./demo/demo.js](./demo/demo.js)

## commands

Apps can apply formatting / editing commands with `ed.execCommand(commandName)`

Supported `commandName` keys:

```
strong:toggle
em:toggle
link:unset
link:set
paragraph:make
heading:make1
heading:make2
heading:make3
bullet_list:wrap
ordered_list:wrap
blockquote:wrap
lift
ed_upload_image
undo
redo
```

# dev

## server

`npm start` and open [http://localhost:8080/](http://localhost:8080/)

In development mode, webpack builds and serves the targets in memory from /webpack/

Changes will trigger a browser refresh.

## plugins

[Plugins](./src/plugins) are ES2015 classes with 2 required methods:

* `constructor (ed) {}` gets a reference to the main `ed`, where you can
  * listen to PM events: `ed.pm.on('draw', ...)`
  * and set up UI: `ed.pluginContainer.appendChild(...)`
* `teardown () {}` where all listeners and UI should be removed

## widgets

Widgets are mini-editors built to edit specific media types

### iframe

Run in iframe and communicate via postMessage 

Example: [ced - widget for code editing](https://github.com/the-grid/ced)

### native

Example: WIP

## styling

1. Primary: [Rebass](http://jxnblk.com/rebass/) defaults and [rebass-theme](./src/components/rebass-theme.js) for global overrides
2. Secondary: inlined JS `style` objects ([example](./src/components/textarea-autosize.js))
3. Deprecating: `require('./component-name.css')` style includes, but needed for some responsive hacks and ProseMirror overrides

## code style

Feross [standard](https://github.com/feross/standard#rules) checked by ESLint with `npm test` or `npm run lint`

* no unneeded semicolons
* no trailing spaces
* single quotes

To automatically fix easy stuff like trailing whitespace: `npm run lintfix`

## test

`npm test`

[Karma is set up](./karma.conf.js) to run tests in local Chrome and Firefox.

Tests will also run in mobile platforms via [BrowserStack](https://www.browserstack.com/), if you have these environment variables set up:

```
BROWSERSTACK_USERNAME
BROWSERSTACK_ACCESSKEY
```

## build

`npm run build`

Outputs minified dist/ed.js and copies widgets defined in [package.json](./package.json).

## deploying

`npm version patch` - style tweaks, hot bug fixes

`npm version minor` - adding features, backwards-compatible changes

`npm version major` - removing features, non-backwards-compatible changes

These shortcuts will run tests, tag, change package version, and push changes and tags to GH.

Travis will then publish new tags to [npm](https://www.npmjs.com/package/@the-grid/ed)
and build the demo to publish to [gh-pages](https://the-grid.github.io/ed/).