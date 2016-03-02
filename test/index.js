import chai from 'chai'
chai.config.truncateThreshold = 0

import {expect} from 'chai'
window.expect = expect

import './ed'
import './components/image'
import './convert/doc-to-grid.js'
import './convert/grid-to-doc.js'
import './plugins/widget'
import './schema/block-meta'
