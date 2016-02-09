## dev

* Ed `options.imgfloConfig = {server, key, secret}` for sizing and proxying images through imgflo
  * If not present (as in demo), will continue to load images directly
  * All images are proxied (currently `block.cover.src` and `block.metadata.author[n].avatar`)

## 0.0.37 - 2016-02-07

* PM 0.3.0

## 0.0.35 - 2016-02-02

* No interface changes. Tweaks to demo file input dance.

## 0.0.34 - 2016-01-31

* [Demo implementation](./demo/demo.js) of Ed's `options.onShareUrl`
* [Placeholder component](./src/plugins/components/placeholder.js) to show placeholder metadata.status for uploads and shares

## 0.0.33 - 2016-01-29

* Updated to [ProseMirror 0.2.0](https://discuss.prosemirror.net/t/release-0-2-0/154/1)

## 0.0.32 - 2016-01-29

* [Demo implementation](./demo/demo.js) of Ed's `options.onShareFile`
