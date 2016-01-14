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

* [ ] API communication layer
* [x] iframe widgets
* [ ] native widgets
* [ ] handle image, video, article, quote types
  * [ ] edit attribution
* [ ] Integrate into web app
* [ ] Integrate into mobile apps
* [ ] Read-only mode

# use

```
  ed = new Ed({
    // Where ed will mount
    container: document.querySelector('#ed'),
    // Content array from post
    content: [],
    menutip: true,
    menubar: false,
    // Hit with each change
    onChange: function () { console.log('change') }
  })  
```

* You can only set `ed.content` once, after which ed has responsibility for the content.
* If you need to load new content in, you must make a `new Ed`.
* Getting `ed.content` takes some processing and should not be done on every change.

Demo: [./demo/demo.js](./demo/demo.js)

# dev

## server

`npm start` and open [http://localhost:8080/](http://localhost:8080/)

In development mode, webpack builds and serves the targets in memory from /webpack/

Changes will trigger a browser refresh.

## plugins

[Plugins](./src/plugins) are ES2015 classes with 2 required methods:

* `constructor (ed) {}` gets a reference to the main `ed`, where you can
  * listen to PM events: `ed.pm.on('flushed', ...)`
  * and set up UI: `ed.pluginContainer.appendChild(...)`
* `teardown () {}` where all listeners and UI should be removed

## widgets

Widgets are mini-editors built to edit specific media types

### iframe

Run in iframe and communicate via postMessage 

Example: [ced - widget for code editing](https://github.com/the-grid/ced)

### native

Example: WIP

## code style

Feross [standard](https://github.com/feross/standard#rules) checked by ESLint with `npm test` or `npm run lint`

* no unneeded semicolons
* no trailing spaces
* single quotes

## test

`npm test`

## build

`npm build`

Outputs minified ed.js to /lib