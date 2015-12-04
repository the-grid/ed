# ed

:warning: WIP; not in production yet. :warning:

Early prototype to use [ProseMirror](http://prosemirror.net/) with data from [the Grid API](http://developer.thegrid.io/)

Demo: [the-grid.github.io/ed/](https://the-grid.github.io/ed/)

The demo shows translating from ProseMirror to the the Grid API JSON and back.

## purpose

ProseMirror provides a high-level schema-based interface for interacting with `contenteditable`, taking care of that pain. This project is focused on the schema to translate between the Grid API data and ProseMirror DOM.

## todo

* [ ] Properly handle image, video, article, other media types
* [ ] Integrate into web app
* [ ] Integrate into mobile apps

## dev

`npm start` and open [http://localhost:8080/](http://localhost:8080/)

In development mode, webpack builds and serves the targets in memory from /webpack/

Changes will trigger a browser refresh.

## test

`npm test`

## build

`npm build`

Outputs minified ed.js to /lib