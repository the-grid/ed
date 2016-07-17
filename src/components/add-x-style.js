import cxs from 'cxs'

export const containerClassName = cxs(
  { margin: '0 auto'
  , position: 'relative'
  , textAlign: 'center'
  , padding: '0.75em'
  , '> button':
    { textTransform: 'uppercase'
    , borderRadius: 4
    , padding: '10px 16px'
    , margin: '0.25em 0.5em'
    , '@media screen and (max-width: 500px)':
      { 'width': '100%' }
    }
  }
)
