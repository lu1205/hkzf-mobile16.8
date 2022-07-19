import React from 'react'
import {Button} from "antd-mobile"

import {BrowserRouter as Router, Route, Link} from "react-router-dom";

import Home from "./pages/Home";
import CityList from "./pages/CityList";

function App() {
    return (
        <Router>
            <div className="App">
                {/* 根组件
                <Button>登录</Button>*/}

                {/* 配置导航菜单 */}
                <ul>
                    <li>
                        <Link to="/home">首页</Link>
                    </li>
                    <li>
                        <Link to="/cityList">城市选择</Link>
                    </li>
                </ul>


                {/* 配置路由 */}
                <Route path="/home" component={Home}></Route>
                <Route path="/cityList" component={CityList}></Route>
            </div>
        </Router>
    )
}

export default App
