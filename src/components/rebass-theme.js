import rebassDefaults from 'rebass/dist/config'

export const sans = '-apple-system, ".SFNSText-Regular", "San Francisco", "Roboto", "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif'
// const serif = 'Georgia, Times, serif'

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
    }
  , NavItem:
    { fontFamily: sans
    }
  }

export default theme
