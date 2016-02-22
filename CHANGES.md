## dev

* NEW -- tap under PM content to add and focus a new text block

## 0.4.0 - 2016-02-20

* NEW -- These changes make it possible for Ed to be responsible for all content array manipulation
  * `ed.insertPlaceholders(index, count)` will insert placeholders and return an array or new block ids
  * `ed.updatePlaceholder(id, status, progress)` will update a placeholder widget (`progress` is optional, 0-100)

## 0.3.2 - 2016-02-19

* PM is initialized with initialContent (simplifies constructor and tests)
* FIX -- Metadata changes also bounce onAutosave
* Reenable autoinput rules: >, #, ##, ###, *, 1.
* Tighten schema for types that can only be top-level blocks: media, heading, and blockquote.
  This means those commands don't show in menus when they shouldn't.
  Also, HTML paste goes through same schema for sanitization.
* NEW -- Placeholder blocks can now have `metadata.progress` (0-100) for a progress bar.
* Couple `ed.plugin.widget` events to make tests more solid.

## 0.3.1 - 2016-02-16

* Widgets now reinitialize when block type changes.

## 0.3.0 - 2016-02-16

* `ed.insertBlocks` for file share flow ([demo](./demo/demo.js)).
  (Convenience method: app can still `getContent`, splice blocks, `setContent`.)
* Tweak merging logic, add tests

## 0.2.0 - 2016-02-16

* Fixed placeholder merging logic: `setContent` can only add placeholders or convert them to real blocks.
* Tests!

## 0.1.1 - 2016-02-15

* Padding tweaks for menubar
* "Upload Image" button in menubar

## 0.1.0 - 2016-02-15

* Fix bug with fixing selection in `setContent`
* BREAKING -- `onShareUrl` is called with `{block, url}` (block id, url to share) now.
* BREAKING -- Ed is now responsible for creating and inserting the placeholder before hitting `.onShareUrl` ([demo](./demo/demo.js)).


## 0.0.40 - 2016-02-12

* Fix selection when `setContent` splices in non-focusable Media nodes.

## 0.0.39 - 2016-02-09

* Fix "Upload Image" in new line menu.

## 0.0.38 - 2016-02-09

* Ed `options.imgfloConfig = {server, key, secret}` for sizing and proxying images through imgflo
  * If not present (as in demo), will continue to load images directly
  * All images are proxied (currently `block.cover.src` and `block.metadata.author[n].avatar`)
* Metadata editing works, triggering same `ed.onChange` as other edits

## 0.0.37 - 2016-02-07

* [ProseMirror 0.3.0](https://discuss.prosemirror.net/t/release-0-3-0/160)

## 0.0.35 - 2016-02-02

* No interface changes. Tweaks to demo file input dance.

## 0.0.34 - 2016-01-31

* [Demo implementation](./demo/demo.js) of Ed's `options.onShareUrl`
* [Placeholder component](./src/plugins/components/placeholder.js) to show placeholder metadata.status for uploads and shares

## 0.0.33 - 2016-01-29

* Updated to [ProseMirror 0.2.0](https://discuss.prosemirror.net/t/release-0-2-0/154/1)

## 0.0.32 - 2016-01-29

* [Demo implementation](./demo/demo.js) of Ed's `options.onShareFile`
