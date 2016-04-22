import rebassDefaults from 'rebass/dist/config'

export const sans = '-apple-system, ".SFNSText-Regular", "San Francisco", "Roboto", "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif'
// const serif = 'Georgia, Times, serif'

export const colors =
  { background: 'white'
  }
const theme =
  { name: 'Ed Theme'
  , fontFamily: sans
  , colors: rebassDefaults.colors
  , Base:
    { fontFamily: sans
    }
  , Button:
    { fontFamily: sans
    }
  , ButtonOutline:
    { fontFamily: sans
    , boxShadow: 'inset 0 0 0 0px'
    , border: '1px solid'
    }
  , NavItem:
    { fontFamily: sans
    }
  , Panel:
    { fontFamily: sans
    }
  , Message:
    { fontFamily: sans
    }
  }

export default theme
