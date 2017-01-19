### dev

#### 2.0.0-8 prerelease - 2017-01-19

* Merge v1 patch
* Fix bug that sometimes focused top of doc on clicking block "edit"

#### 2.0.0-7 prerelease - 2017-01-19

* Blur editable on modal open. 
* Don't allow typing over node selection. Fixes bug that media view can be typed over and deleted after clicking "edit."

#### 2.0.0-6 prerelease - 2017-01-19

* Modal media block meta editing! :tada:
* Fixed menu hack _only_ on iOS

#### 2.0.0-5 prerelease - 2017-01-10

* Fix gh-pages widget serving (.nojekyll)
* Fix link menu form position
* Fix file drops: on both media blocks & text

#### 2.0.0-4 prerelease - 2017-01-10

* ProseMirror 0.17.0
* URL modal attached to menu
* URL pre-filled if selected text is link-like (#288)

#### 2.0.0-3 prerelease - 2017-01-05

* bump imgflo-url to ignore `blob:` URLs

#### 2.0.0-2 prerelease - 2017-01-05

* fix `menuBar: false`

#### 2.0.0-1 prerelease - 2017-01-05

* BREAKING -- `mountApp` is async because of a React change, and does not return `ed`
  * `props.onMount` callback is called with `ed` instance

#### 2.0.0-0 prerelease - 2017-01-02

* ProseMirror 0.16.0 -- big refactor to get up to date
  * Redo all plugins & everything we have built on PM
* Widgets are inline: major simplification
* h1-h3 empty block placeholders

### 1.3.4 - 2017-01-18

* Fix plugin `detach` to cleanup listener leaks :non-potable_water:

### 1.3.3 - 2016-12-11

* ed-location 2.0.1 fixes bug that lost coordinates in middle of ocean
* Nix react-tap-event-plugin

### 1.3.2 - 2016-10-26

* Fix doubled hr again (#299)

### 1.3.1 - 2016-10-26

* Fix doubled hr (#299)

## 1.3.0 - 2016-10-26

* Section divider support as `hr`
  * "Horizontal rule" added to "Add" menu
  * `horizontal_rule:insert` command added

### 1.2.2 - 2016-10-21

* Restore `menuBar` prop to enable/disable the menu bar.
* Align menu items with content

### 1.2.1 - 2016-10-19

* Don't show cover image if marked unsalvageable. (#294)

## 1.2.0 - 2016-09-29

* BREAKING - Remove `menuTip` and `menuBar` props and tooltip menu (to potentially revisit later) (#289)

### 1.1.3 - 2016-09-27

* Add needed margin-top when tooltip menu is enabled
* Don't hide image, add media menu items (less bounce in menu bar)

### 1.1.2 - 2016-09-27

* With tooltip menu, recommend >= 48px margin at top of host page / element (menu potentially offscreen with style tweaks in last patch)
* Allow bold, italic, link with whole block selected (#283)

### 1.1.1 - 2016-09-26

* Confirm remove attribution
* Menu:
  * move bold before italic
  * center icons
  * more compact for small screens (#281)

## 1.1.0 - 2016-09-19

* Fold wording - "Below this line will render on the item page."
* BREAKING - `quote` blocks treated as media, so we can read and write attribution; formatting will be lost (#279)
  * Remove `blockquote:wrap` command
  * Add `ed_add_quote` command
  * DEBT - the hack to get the text from `metadata.description` or `html` is 🙈 ... ideally we would support formatting and attribution, but for now it is a choice
    * (New "debt" tag in changelog: hopefully these items will be paid off (made nice) in later versions)

### 1.0.2 - 2016-09-12

* [ProseMirror 0.10.1](https://github.com/ProseMirror/prosemirror/blob/master/CHANGELOG.md#0101-2016-09-12)

### 1.0.1 - 2016-09-08

* ed-userhtml 0.2.1 adds height input, fixes text getting stripped by API
* Fix overeager menu dismissing (#277)

# 1.0.0 🎉 - 2016-09-07

Tagging 1.0.0 in celebration of launching The Grid

* CTA widget
  * Change checkbox wording to "Link can open in frame"
  * Change field to `block.metadata.canFrame`
* UNSUPPORTED widget - clients can have different versions of Ed, so it is important to show placeholders for unsupported blocks (#271)

### 0.21.2 - 2016-09-06

* Descriptive type labels: h1 - Main title, h2 - Section heading, h3 - Subsection heading, p - Body text

### 0.21.1 - 2016-09-06

* Fix menu sizing (#275)
* Show image title and description. Matches how DS uses image block title. (#275)

## 0.21.0 - 2016-09-05

* Whitelist of transformations that are accepted from `setContent` ... usually these updates were stale API data.

### 0.20.5 - 2016-09-05

* Fix image dropdown saving for 0.20.4 changes

### 0.20.4 - 2016-09-05

* Fix where CTA widget read / write metadata
* EXPERIMENTAL - Ignore updates "from above" in CTA widget (can be API data some keystrokes behind current state)

### 0.20.3 - 2016-09-04

* Link inputs `autocapitalize='none'` to help with (#272) on mobile

### 0.20.2 - 2016-09-04

* Attempt to suppress Safari contenteditable formatting ("BIU" tooltip)

### 0.20.1 - 2016-09-04

* JS safety with valid url testing

## 0.20.0 - 2016-08-31

* Menu to add & widget to edit basic link CTA. Command key `ed_add_cta`

### 0.19.5 - 2016-08-20

* [ed-userhtml 0.1.0](https://github.com/the-grid/ed-userhtml/blob/master/CHANGES.md#010-2016-08-23)

### 0.19.4 - 2016-08-20

* Whitelist `block.text` to match what ced outputs.

### 0.19.3 - 2016-08-16

* NEW -- [ed-userhtml](https://github.com/the-grid/ed-userhtml) widget for interactive/userhtml blocks

### 0.19.2 - 2016-08-04

* ▶ Link for video, audio, interactive in top-right of blocks, opens in new window. (#260)

### 0.19.1 - 2016-08-01

* FIX -- `ed.setCoverPreview` fixed

## 0.19.0 - 2016-07-30

* NEW -- optional `props.coverPrefs: {filter, crop, overlay}` for site-wide cover preferences. Boolean, default true. (#223)

### 0.18.2 - 2016-07-29

* FIX -- [ProseMirror 0.9.1](https://github.com/ProseMirror/prosemirror/blob/master/CHANGELOG.md#091-2016-07-29) -- fixes paste hr and media blocks (#252)
* Update React to 15.2.1
* Update more dependencies

### 0.18.1 - 2016-07-15

* Perf boost for when setContent is hit with old news

## 0.18.0 - 2016-07-15

* BREAKING -- `updatePlaceholder` is now `updateProgress`, with same arguments
* BREAKING -- `{status, progress, failed}` will not be set from initial content or `setContent`: you must call `updateProgress`
* BREAKING -- `ed.updateProgress` updates internally and does not change content block metadata (#237)
* Simplifying updates = perf improvements with `updateProgress`
* `ed.updateProgress(id, {progress: null})` will now remove progress bar
* `ed.updateProgress(id, {failed: true})` will now show an error message and retry button

### 0.17.8 - 2016-07-14

* Dismiss meta dropdown by clicking out of menu or focusing editable (#229)

### 0.17.7 - 2016-07-13

* Patch [ProseMirror 0.8.3](https://github.com/ProseMirror/prosemirror/blob/master/CHANGELOG.md#083-2016-06-28)

### 0.17.6 - 2016-06-27

* Updates ed-location to 2.0.0, which outputs block html as an iframe of a [simple map viewer](https://the-grid.github.io/ed-location/?latitude=68.55260186877743&longitude=22.666168212890625&zoom=5&address=Enonteki%C3%B6%2C%20Lappi%2C%20Finland)

### 0.17.5 - 2016-06-24

* Swallow file drop on iframe widgets (won't redirect editor to local image)
* Drop style tweak

### 0.17.4 - 2016-06-23

* NEW -- Images can be removed from `article` blocks (#243)
* Less-chunky metadata editing on small screens (#236)
* Disable ProseMirror format menu on media block selection
* Indicator to drop file on block (#235)

### 0.17.3 - 2016-06-22

* UI in menus add code and location blocks (#245)
  * `ed_add_code` and `ed_add_location` added to [commands](https://github.com/the-grid/ed#commands)
* Show coverPrefs when there is a cover. Show upload when that's allowed.
* `getContent` whitelist cover unsalvageable, so `{id, type, html, metadata, cover: {src, width, height, unsalvageable}}`

### 0.17.2 - 2016-06-21

* Use rsync for `npm run copycss`

### 0.17.1 - 2016-06-21

* Copy css to dist with build

## 0.17.0 - 2016-06-21

* Update to [ProseMirror 0.8.2](https://discuss.prosemirror.net/t/release-0-8-0/336)
* BREAKING -- changed dist directory
  * `dist/build.js` for all-inclusive built library that exposes `window.TheGridEd`
  * `dist/ed.js` (package main) for the React component
* BREAKING -- commands `link:set` and `link:unset` are replaced with `link:toggle`

## 0.16.0 - 2016-06-14

* Minimize `getContent` output to only include block `{id, type, html, metadata, cover: {src, width, height}}`

## 0.15.0 - 2016-06-14

* Refactor to easily [use Ed as React component](https://github.com/the-grid/ed#use).
* `props.widgetPath` for the iframe widget base directory. Defaults to `'./node_modules/'`
* Add `location` widget (no UI to add yet)

### 0.14.1 - 2016-06-08

* Focus new iframe widget (type ``` to test with code block)
* NEW -- optional `options.onDropFileOnBlock(id, file)` to a block's cover

## 0.14.0 - 2016-06-06

* NEW -- optional `options.onDropFiles(index, files)` to drop files into editor flow

### 0.13.2 - 2016-06-02

* Render image with hover `title`
* Attribution `via` can be added and edited (#114)
* Open urls in new tab (#130)
* Placeholder cancel button style tweak (#218)
* Media / attribution style tweak, put image back in box (#226)
* Remove attribution (#225)

### 0.13.1 - 2016-05-31

* "Image" menu on blocks
  * "Upload New Image" button moved here
  * `metadata.coverPrefs` checkboxen (#199)
  * Image hover title editing
* Image caption editing (#213)
* Message and upload button for `cover.unsalvageable` (#195)

## 0.13.0 - 2016-05-30

* FIX -- Upload Image Button disappears after cancel upload (#219)
* NEW -- Upload new cover for blocks that support it (only `image` and `article` now) (#71)
  * `options.onRequestCoverUpload(id)` - similar to onShareFile, but hit with block id instead of index
  * `ed.setCover(id, cover)` - once image uploads, cover object with `{src, width, height}`
  * Upload progress available in non-placeholder blocks
  * See Readme and Demo
* Added blocks with various states to [/#fixture](https://the-grid.github.io/ed/#fixture), to help with dev and styling

### 0.12.7 - 2016-05-28

* Build fix "It looks like you're using a minified copy of the development build of React" error.

### 0.12.6 - 2016-05-28

* Fix negative margin in block without cover
* Update block cover from app (#216)

### 0.12.5 - 2016-05-27

* On conversion to full post, scroll to focused title

### 0.12.4 - 2016-05-27

* Space media with blank `p`: easier focus on mobile
* Skip empty blocks with `getContent` (#204)
* Focus on load

### 0.12.3 - 2016-05-26

* Add label to Author & Publisher dropdown (#203)
* Validate urls added as attribution; don't trigger change events while invalid (#129)
* Widget layout now runs on a loop, so whack layouts shouldn't stay off for long (#208)
* Improvements to "Make Full Post" UX (#210)
  * put button after content
  * reshow buttons if `hr` or cover image is removed
  * focus editable after click

### 0.12.2 - 2016-05-25

* Style fix for attribution buttons (#205)
* Placeholder plugin for empty h1 and paragraph (#202)

### 0.12.1 - 2016-05-24

* Fix gh-pages code editor includes

## 0.12.0 - 2016-05-24

Major fixes, but API is stable from 0.10.x tag.

* Fix ``` shortcut to add a code block (#25)
* "Upload Image" button show logic: don't show on block selection
* Reverting 0.11.0 prototype
* Revert special-cased fold block
* Revert special-case media delete / joinBackward: default behavior selects media before deleting it now
* Don't space media with empty `p`: default behavior allows select media block + enter to add a block
* NEW fold behavior: Unstarred blocks render below `hr`
* FIX jumping cursors (#201)
  * All mounted doc changes now via [ProseMirror transforms](http://prosemirror.net/ref.html#transform)
* NEW -- button to add first image
* NEW -- button to add title and fold

## 0.11.0 - 2016-04-23

([archived](https://github.com/the-grid/ed/tree/archive/d4-mario-oh-eleven))

* Styling font sizing throughout
* Add image change/remove to all images and "upload" button to empty image
* Default to empty image/title/description above the fold
* Change fold copy
* Change integration-points for Webapp, so that attribution-editor can have updatetable progressbars (subject to change in future)

### 0.10.7 - 2016-04-22

* Styling small screen button 100% width

### 0.10.6 - 2016-04-21

* Styling for small screen first (#187)

### 0.10.5 - 2016-04-19

* FIX -- "Upload Image" button was triggering `onShareFile` callback twice (#179)

### 0.10.4 - 2016-04-19

* Functions in [block schema](./src/schema/block-meta.js) for regenerating html on metadata changes. (#182)
* Styling meta titles for small screens (#176)

### 0.10.3 - 2016-04-18

* Styling covers like cards (#177)

### 0.10.2 - 2016-04-17

* Autofocus fold textarea
* FIX -- React issue with fold textarea-autosize (#176)

### 0.10.1 - 2016-04-15

* [ProseMirror 0.6.1](https://github.com/ProseMirror/prosemirror/blob/master/CHANGELOG.md#061-2016-04-15) -- iOS and Android :heart:
* Fixed `ed.execCommand('ed_upload_image')`
* :apple: Double-space → period hack (#109)

## 0.10.0 - 2016-04-15

* NEW -- `options.onCommandsChanged` to get changing commands in a native toolbar (#173)
* NEW -- `ed.execCommand` to apply a command from an app

### 0.9.3 - 2016-04-15

* FIX -- Range errors around media divs 
* NEW -- `options.onMount` called once editable and widgets are initialized

### 0.9.2 - 2016-04-13

* FIX -- "Upload Image" button in Firefox works now

### 0.9.1 - 2016-04-13

* [ProseMirror 0.6.0](https://discuss.prosemirror.net/t/release-0-6-0/284)
* Upload image toolbar button doesn't need to be on blank line

## 0.9.0 - 2016-04-13

* Simplify flow from an empty post
  * Paste a URL and type some commentary: URL is shared above fold and commentary becomes a paragraph below
  * Type above fold then share photo: photo is above fold and text becomes a paragraph below
  * Start typing above the fold, then click "Add More" to reveal full editor

### 0.8.3 - 2016-04-01

* Style above and below fold media @narrowdesign

### 0.8.2 - 2016-04-01

* Dependencies (react, babel, lodash)
* ced 0.1.2 -- fixes firefox not showing language dropdown, and overzealous encoding

### 0.8.1 - 2016-03-31

* FIX -- setCoverPreview was trigging fold block change when it shouldn't have (#150)

## 0.8.0 - 2016-03-28

* New UI component: NavItemConfirm
* "Remove block" in block "..." dropdown now asks for confirmation
* FIX -- removing fold media fixed
* NEW -- `ed.setCoverPreview(id, src)` (#92)
  * `src` is a `blob:` or `data:` url for the local image to show while uploading / measuring
  * Preview takes precedence over content array version of `cover.src`
  * Setting src `null` will show real cover

### 0.7.3 - 2016-03-24

* @narrowdesign 1st style/ux pass (#139)
* ProseMirror 0.5.1
* FIX -- iframe cut / paste works (#19)
* FIX -- all media copy / paste works (#140)

### 0.7.2 - 2016-03-22

* Hotfix demo for 0.7.0 change to `ed.updatePlaceholder` arguments

### 0.7.1 - 2016-03-22

* Update to [ProseMirror 0.5.0](https://discuss.prosemirror.net/t/release-0-5-0/246)
  * Fixes (re)focus showing empty block menu (#125)
  * ~~Fixes Android blockers (#29?) (#104?)~~

## 0.7.0 - 2016-03-22

* BREAKING - changed arguments for `ed.updatePlaceholder` to `id, {status, progress, failed}`
  * Placholder block `metadata.failed` will show in red and have an "×" button to remove

### 0.6.2 - 2016-03-20

* Hotfix `ed.getContent()` on :iphone: (#105)

### 0.6.1 - 2016-03-18

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

### 0.4.7 - 2016-03-01

* Popovers don't autohide on scroll, makes meta editing easier on Android
* :apple: Pulldown negative scroll accounted for with menu (#98)

### 0.4.6 - 2016-02-29

* Space first, last, and subsequent media blocks with empty paragraphs (#94)
* Tap editable bottom padding focuses end... works better than tap-add-text plugin
* Tests and logic to convert irregular Grid types `quote` and `text` (#93)

### 0.4.5 - 2016-02-29

* :apple: Smoother "fixed" menu hack

### 0.4.4 - 2016-02-27

* :apple: FIX -- in iOS only menubar sticky by `absolute`, not `fixed` (#69 try again)

### 0.4.3 - 2016-02-26

* :apple: FIX -- menubar sticky by CSS, not JS (#69)

### 0.4.2 - 2016-02-25

* [ProseMirror 0.4.0](https://discuss.prosemirror.net/t/release-0-4-0/195)
* FIX -- `setContent` could merge with outdated cached version of content (#72)

### 0.4.1 - 2016-02-22

* NEW -- tap under PM content to add and focus a new text block

## 0.4.0 - 2016-02-20

* NEW -- These changes make it possible for Ed to be responsible for all content array manipulation
  * `ed.insertPlaceholders(index, count)` will insert placeholders and return an array or new block ids
  * `ed.updatePlaceholder(id, status, progress)` will update a placeholder widget (`progress` is optional, 0-100)

### 0.3.2 - 2016-02-19

* PM is initialized with initialContent (simplifies constructor and tests)
* FIX -- Metadata changes also bounce onAutosave
* Reenable autoinput rules: >, #, ##, ###, *, 1.
* Tighten schema for types that can only be top-level blocks: media, heading, and blockquote.
  This means those commands don't show in menus when they shouldn't.
  Also, HTML paste goes through same schema for sanitization.
* NEW -- Placeholder blocks can now have `metadata.progress` (0-100) for a progress bar.
* Couple `ed.plugin.widget` events to make tests more solid.

### 0.3.1 - 2016-02-16

* Widgets now reinitialize when block type changes.

## 0.3.0 - 2016-02-16

* `ed.insertBlocks` for file share flow ([demo](./demo/demo.js)).
  (Convenience method: app can still `getContent`, splice blocks, `setContent`.)
* Tweak merging logic, add tests

## 0.2.0 - 2016-02-16

* Fixed placeholder merging logic: `setContent` can only add placeholders or convert them to real blocks.
* Tests!

### 0.1.1 - 2016-02-15

* Padding tweaks for menubar
* "Upload Image" button in menubar

## 0.1.0 - 2016-02-15

* Fix bug with fixing selection in `setContent`
* BREAKING -- `onShareUrl` is called with `{block, url}` (block id, url to share) now.
* BREAKING -- Ed is now responsible for creating and inserting the placeholder before hitting `.onShareUrl` ([demo](./demo/demo.js)).


### 0.0.40 - 2016-02-12

* Fix selection when `setContent` splices in non-focusable Media nodes.

### 0.0.39 - 2016-02-09

* Fix "Upload Image" in new line menu.

### 0.0.38 - 2016-02-09

* Ed `options.imgfloConfig = {server, key, secret}` for sizing and proxying images through imgflo
  * If not present (as in demo), will continue to load images directly
  * All images are proxied (currently `block.cover.src` and `block.metadata.author[n].avatar`)
* Metadata editing works, triggering same `ed.onChange` as other edits

### 0.0.37 - 2016-02-07

* [ProseMirror 0.3.0](https://discuss.prosemirror.net/t/release-0-3-0/160)

### 0.0.35 - 2016-02-02

* No interface changes. Tweaks to demo file input dance.

### 0.0.34 - 2016-01-31

* [Demo implementation](./demo/demo.js) of Ed's `options.onShareUrl`
* [Placeholder component](./src/plugins/components/placeholder.js) to show placeholder metadata.status for uploads and shares

### 0.0.33 - 2016-01-29

* Updated to [ProseMirror 0.2.0](https://discuss.prosemirror.net/t/release-0-2-0/154/1)

### 0.0.32 - 2016-01-29

* [Demo implementation](./demo/demo.js) of Ed's `options.onShareFile`
