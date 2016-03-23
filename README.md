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
* [ ] Integrate into web app
* [ ] Integrate into mobile apps
* [ ] Read-only mode

# use

``` javascript
  ed = new Ed({
    // Where ed will mount
    container: document.querySelector('#ed'),
    // REQUIRED -- Content array from post
    initialContent: [],
    menuTip: true,
    menuBar: false,
    // REQUIRED -- Hit on every change
    onChange: function () {
      /* App can show "unsaved changes" in UI */
      /* Don't call ed.getContent() here */
    },
    // OPTIONAL -- imgflo image proxy config
    imgfloConfig: {
      server: 'https://imgflo.herokuapp.com/',
      key: 'key',
      secret: 'secret'
    },
    onShareFile: function (index) {
      /* App makes placeholder block(s) and calls ed.insertPlaceholders(index, count) */
      /* App uploads files and sets status on placeholder blocks with ed.setContent */
      /* On upload / measurement finishing, app replaces placeholder blocks with ed.setContent */
    },
    onShareUrl: function ({block, url}) {
      /* Ed made the placeholder with block id */
      /* App shares url with given block id */
      /* On share / measurement finishing, app replaces placeholder blocks with ed.setContent */
    },
    onPlaceholderCancel: function (id) {
      /* Ed removed the placeholder if you call ed.getContent() now */
      /* App should cancel the share or upload */
    }
  })
  
  // Returns array of inserted placeholder ids
  ed.insertPlaceholders(index, count)
  
  // Update placeholder metadata
  // {status (string), progress (number 0-100), failed (boolean)}
  ed.updatePlaceholder(id, metadata)

  // Returns content array
  // Expensive, so best to debounce and not call this on every change
  // Above the fold block is index 0, and starred
  ed.getContent()
  
  // Only inserts/updates placeholder blocks and converts placeholder blocks to media
  ed.setContent(contentArray)
```

Demo: [./demo/demo.js](./demo/demo.js)

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

Travis will publish tags to [npm](https://www.npmjs.com/package/@the-grid/ed)
and build the demo to publish to [gh-pages](https://the-grid.github.io/ed/).