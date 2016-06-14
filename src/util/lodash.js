// Build in minimal version, only _.functions we use

import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import map from 'lodash/map'
import pick from 'lodash/pick'
const _ = {debounce, cloneDeep, isEqual, map, pick}

export default _
