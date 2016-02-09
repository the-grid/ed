// Used to define what fields are available in metadata editor

const blockMetaSchema = {
  image: {
    title: true,
    description: true,
    isBasedOnUrl: true,
    cover: true,
    author: true,
    publisher: true
  },
  video: {
    title: true,
    description: true,
    isBasedOnUrl: true,
    cover: true,
    author: true,
    publisher: true
  },
  quote: {
    title: false,
    description: false,
    isBasedOnUrl: true,
    cover: false,
    author: true,
    publisher: true
  },
  default: {
    title: true,
    description: true,
    isBasedOnUrl: true,
    cover: true,
    author: true,
    publisher: true
  }
}

export default blockMetaSchema
