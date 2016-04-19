// Used to define what fields are available in metadata editor
import encode from '../util/encode'

const blockMetaSchema =
  { image:
    { title: true
    , description: true
    , isBasedOnUrl: true
    , cover: true
    , author: true
    , publisher: true
    , makeHtml: makeImage
    }
  , video:
    { title: true
    , description: true
    , isBasedOnUrl: true
    , cover: true
    , author: true
    , publisher: true
    }
  , article:
    { title: true
    , description: true
    , isBasedOnUrl: true
    , cover: true
    , author: true
    , publisher: true
    , makeHtml: makeArticle
    }
  , quote:
    { title: false
    , description: false
    , isBasedOnUrl: true
    , cover: false
    , author: true
    , publisher: true
    }
  , default:
    { title: true
    , description: true
    , isBasedOnUrl: true
    , cover: true
    , author: true
    , publisher: true
    }
  }

function makeImage (metadata, cover) {
  let htmlString = '<img'
  if (cover && cover.src) {
    htmlString += ` src="${cover.src}"`
  }
  if (metadata && metadata.title) {
    htmlString += ` title="${encode(metadata.title)}"`
  }
  if (metadata && metadata.description) {
    htmlString += ` alt="${encode(metadata.description)}"`
  }
  htmlString += '>'
  return htmlString
}

// function makeFigure (metadata, cover) {
//   let htmlString = `<figure>`
//   if (cover && cover.src) {
//     htmlString += `<img src="${cover.src}">`
//   }
//   htmlString += makeTitleDescription('figcaption', metadata)
//   htmlString += `</figure>`
//   return htmlString
// }

// function makeQuote (metadata, _) {
//   return `<blockquote>${encode(metadata.description)}</blockquote>`
// }

function makeArticle (metadata, cover) {
  let htmlString = '<article>'
  if (cover && cover.src) {
    htmlString += `<img src="${cover.src}">`
  }
  htmlString += makeTitleDescription(null, metadata)
  htmlString += '</article>'
  return htmlString
}

function makeTitleDescription (tag, metadata) {
  let htmlString = ''
  if (metadata && metadata.title) {
    htmlString += `<h1>${encode(metadata.title)}</h1>`
  }
  if (metadata && metadata.description) {
    htmlString += `<p>${encode(metadata.description)}</p>`
  }
  if (tag && htmlString) {
    htmlString = `<${tag}>${htmlString}</${tag}>`
  }
  return htmlString
}

export default blockMetaSchema
