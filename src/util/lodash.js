// Build in minimal version, only _.functions we use

import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/clonedeep'
const _ = {debounce, cloneDeep}

export default _
