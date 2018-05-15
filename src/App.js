import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Home from './Containers/Home'
import Detail from './Containers/Detail'

const BasicExample = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home}/>
      <Route path='/detail' component={Detail}/>
    </div>
  </Router>
)

export default BasicExample