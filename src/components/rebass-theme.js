import rebassDefaults from 'rebass/dist/config'

export const sans = '-apple-system, ".SFNSText-Regular", "San Francisco", "Roboto", "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif'
// const serif = 'Georgia, Times, serif'

export const colors = rebassDefaults.colors

export const widgetStyle =
  { padding: '1rem 1rem 0'
  , background: '#fff'
  , border: '1px solid #ddd'
  , borderRadius: 2
  , position: 'relative'
  }

export const widgetLeftStyle =
  { paddingLeft: '1rem'
  , borderLeft: '1px solid #ddd'
  , background: '#fff'
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
    , boxShadow: 'inset 0 0 0 1px #ddd'
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
