import React from 'react'
import ReactDOM from 'react-dom'

// import 'antd-mobile/dist/antd-mobile.css'

import "./assets/fonts/iconfont.css"

import 'react-virtualized/styles.css';

import './utils/url'

// 放在最后面，避免样式覆盖
import App from './App'

import './index.css'

ReactDOM.render(<App />, document.getElementById('root'))
