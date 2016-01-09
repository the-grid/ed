`npm run start`

# ed

:warning: WIP; not in production yet. :warning:

Early prototype to use [ProseMirror](http://prosemirror.net/) with data from [the Grid API](http://developer.thegrid.io/)

Demo: [the-grid.github.io/ed/](https://the-grid.github.io/ed/)

The demo shows translating from ProseMirror to the the Grid API JSON and back.

## purpose

ProseMirror provides a high-level schema-based interface for interacting with `contenteditable`, taking care of that pain. This project is focused on:

* Schema to translate between the Grid API data and ProseMirror doc type
* Coordinating widgets (block editors specialized by type) ([example](https://github.com/the-grid/ced))

## todo

* [x] iframe widgets
* [ ] native widgets
* [ ] handle image, video, article, other media types
* [ ] API communication layer
* [ ] Integrate into web app
* [ ] Integrate into mobile apps

## plugins

[Plugins](./src/plugins) are ES2015 classes with 2 require methods:

* `constructor (ed) {}` gets a reference to the main ed, where you can listen to `ed.pm` events and set up UI
* `teardown () {}` where all listeners and UI should be removed

## code style

Feross [standard](https://github.com/feross/standard#rules) checked by ESLint with `npm test` or `npm run lint`

* no unneeded semicolons
* no trailing spaces
* single quotes

## dev

`npm start` and open [http://localhost:8080/](http://localhost:8080/)

In development mode, webpack builds and serves the targets in memory from /webpack/

Changes will trigger a browser refresh.

## test

`npm test`

## build

`npm build`

Outputs minified ed.js to /lib