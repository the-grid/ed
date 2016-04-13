## dev

## 0.9.0 - 2016-04-13

* Simplify flow from an empty post
  * Paste a URL and type some commentary: URL is shared above fold and commentary becomes a paragraph below
  * Type above fold then share photo: photo is above fold and text becomes a paragraph below
  * Start typing above the fold, then click "Add More" to reveal full editor

## 0.8.3 - 2016-04-01

* Style above and below fold media @narrowdesign

## 0.8.2 - 2016-04-01

* Dependencies (react, babel, lodash)
* ced 0.1.2 -- fixes firefox not showing language dropdown, and overzealous encoding

## 0.8.1 - 2016-03-31

* FIX -- setCoverPreview was trigging fold block change when it shouldn't have (#150)

## 0.8.0 - 2016-03-28

* New UI component: NavItemConfirm
* "Remove block" in block "..." dropdown now asks for confirmation
* FIX -- removing fold media fixed
* NEW -- `ed.setCoverPreview(id, src)` (#92)
  * `src` is a `blob:` or `data:` url for the local image to show while uploading / measuring
  * Preview takes precedence over content array version of `cover.src`
  * Setting src `null` will show real cover

## 0.7.3 - 2016-03-24

* @narrowdesign 1st style/ux pass (#139)
* ProseMirror 0.5.1
* FIX -- iframe cut / paste works (#19)
* FIX -- all media copy / paste works (#140)

## 0.7.2 - 2016-03-22

* Hotfix demo for 0.7.0 change to `ed.updatePlaceholder` arguments

## 0.7.1 - 2016-03-22

* Update to [ProseMirror 0.5.0](https://discuss.prosemirror.net/t/release-0-5-0/246)
  * Fixes (re)focus showing empty block menu (#125)
  * ~~Fixes Android blockers (#29?) (#104?)~~

## 0.7.0 - 2016-03-22

* BREAKING - changed arguments for `ed.updatePlaceholder` to `id, {status, progress, failed}`
  * Placholder block `metadata.failed` will show in red and have an "×" button to remove

## 0.6.2 - 2016-03-20

* Hotfix `ed.getContent()` on :iphone: (#105)

## 0.6.1 - 2016-03-18

* Demo starts blank to test the initial flow
* Demo [/#fixture](https://the-grid.github.io/ed/#fixture) loads the fixture: useful for reloading and debugging
* Made [DropdownGroup](./src/components/dropdown-group.js) to make meta editors more responsive (#126)
* [Credit Add](./src/components/credit-add.js) "..." menu on media blocks to add attribution (and remove block)

## 0.6.0 - 2016-03-16

* Placeholder progress bar
  * `progress` 0-100 with `ed.updatePlaceholder(id, status, progress)` or `ed.setContent([{id, metadata: {status, progress}}])`
* NEW -- **X** button on the Placeholder component triggers `options.onPlaceholderCancel(id)`
  * When that is hit, `ed.getContent()` will already have removed the cancelled placeholder block
* Delete from under media block ignored

## 0.5.0 - The Fold - 2016-03-15

* **The Fold** view above main editable for sharing and editing one primary media block
* Didn't change the interface, so these should work as before:
  * `ed.setContent(content)`
  * `ed.insertPlaceholders(index, count)`
  * `ed.updatePlaceholder(id, status, progress)`
* Prepended some "internal" method names with `_` ... don't use those
* Main html structure now defined and initialized with React: [App](./src/components/app.js)
* Refactor internal dataflow
  * (React but not Flux, mainly because [Editable](./src/components/editable.js) should only be initialized once)
* BREAKING -- `options.[menuBar|menuTip]` made camelCase
* BREAKING -- no more `options.onAutosave`: apps will do that logic

## 0.4.7 - 2016-03-01

* Popovers don't autohide on scroll, makes meta editing easier on Android
* :apple: Pulldown negative scroll accounted for with menu (#98)

## 0.4.6 - 2016-02-29

* Space first, last, and subsequent media blocks with empty paragraphs (#94)
* Tap editable bottom padding focuses end... works better than tap-add-text plugin
* Tests and logic to convert irregular Grid types `quote` and `text` (#93)

## 0.4.5 - 2016-02-29

* :apple: Smoother "fixed" menu hack

## 0.4.4 - 2016-02-27

* :apple: FIX -- in iOS only menubar sticky by `absolute`, not `fixed` (#69 try again)

## 0.4.3 - 2016-02-26

* :apple: FIX -- menubar sticky by CSS, not JS (#69)

## 0.4.2 - 2016-02-25

* [ProseMirror 0.4.0](https://discuss.prosemirror.net/t/release-0-4-0/195)
* FIX -- `setContent` could merge with outdated cached version of content (#72)

## 0.4.1 - 2016-02-22

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
