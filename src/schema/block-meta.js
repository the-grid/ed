// Used to define what fields are available in metadata editor
import encode from '../util/encode'

const blockMetaSchema =
  { image:
  { title: true,
    description: true,
    caption: false,
    isBasedOnUrl: true,
    cover: true,
    changeCover: true,
    removeCover: false,
    author: true,
    publisher: true,
    via: true,
    makeHtml: makeImage
  },
    video:
    { title: true,
      description: true,
      caption: false,
      isBasedOnUrl: true,
      cover: true,
      changeCover: false,
      removeCover: false,
      author: true,
      publisher: true,
      via: true
    },
    article:
    { title: true,
      description: true,
      caption: false,
      isBasedOnUrl: true,
      cover: true,
      changeCover: true,
      removeCover: true,
      author: true,
      publisher: true,
      via: true,
      makeHtml: makeArticle
    },
    quote:
    { title: false,
      description: true,
      caption: false,
      isBasedOnUrl: true,
      cover: false,
      changeCover: false,
      removeCover: false,
      author: true,
      publisher: true,
      via: true,
      makeHtml: makeQuote
    },
    cta:
    { label: true,
      link: true,
      canFrame: true,
      makeHtml: makeCTA
    },
    default:
    { title: true,
      description: true,
      caption: false,
      isBasedOnUrl: true,
      cover: true,
      changeCover: false,
      removeCover: false,
      author: true,
      publisher: true,
      via: true
    }
  }

function makeImage (block) {
  const {metadata, cover} = block
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

function makeArticle (block) {
  const {metadata, cover} = block
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

function makeCTA (block) {
  const {url} = block
  let {label} = block
  const dataString = makeDataString(block)
  label = label || 'Open'
  if (url) {
    return `<a href="${url}" data-role="cta"${dataString}>${encode(label)}</a>`
  }
  return `<button data-role="cta"${dataString}>${encode(label)}</button>`
}

function makeDataString (block) {
  const fields = ['cta', 'price'] // TODO type? item?
  let str = ''
  for (let i = 0, len = fields.length; i < len; i++) {
    const field = fields[i]
    if (!block[field]) continue
    str += ` data-${field}="${encode(block[field])}"`
  }
  return str
}

function makeQuote (block) {
  if (block.metadata && block.metadata.hasOwnProperty('description')) {
    return `<blockquote>${encode(block.metadata.description)}</blockquote>`
  }
  if (block.html) {
    return block.html
  }
  return '<blockquote></blockquote>'
}

export default blockMetaSchema
