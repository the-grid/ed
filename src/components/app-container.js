import {connect} from 'react-redux'

import App from './app'


const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
export default VisibleTodoList

function mapStateToProps (state) {
  return {widgets: state}
}

function mapDispatchToProps (dispatch) {
  return {
    onUpdateBlock: function (id, block) {
      console.log(id, block)
    }
  }
}
