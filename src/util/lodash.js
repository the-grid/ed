// Build in minimal version, only _.functions we use

import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
const _ = {debounce, cloneDeep, isEqual}

export default _
