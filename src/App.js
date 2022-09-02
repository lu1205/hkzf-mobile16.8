import React, {lazy, Suspense} from 'react'

import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";

import Home from "./pages/Home";

import AuthRoute from "./components/AuthRoute";
// import CityList from "./pages/CityList";
// import Map from "./pages/Map";
// import HouseDetail from "./pages/HouseDetail";
// import Login from './pages/Login'
// import Rent from './pages/rent'
// import RentAdd from './pages/rent/Add'
// import RentSearch from './pages/rent/Search'

const CityList = lazy(() => import('./pages/CityList'))
const Map = lazy(() => import('./pages/Map'))
const HouseDetail = lazy(() => import('./pages/HouseDetail'))
const Login = lazy(() => import('./pages/Login'))
const Rent = lazy(() => import('./pages/rent'))
const RentAdd = lazy(() => import('./pages/rent/Add'))
const RentSearch = lazy(() => import('./pages/rent/Search'))


function App() {
    return (
        <Router>
            <Suspense fallback={<div className='route-loading'>loading...</div>}>
                <div className="App">
                    <Route exact path="/" render={() => <Redirect to="/home"/>}></Route>
                    {/* 配置路由 */}
                    <Route path="/home" component={Home}></Route>
                    <Route path="/cityList" component={CityList}></Route>
                    <Route path="/map" component={Map}></Route>

                    {/*<AuthRoute path='/map' component={Map} />*/}
                    <Route path="/detail/:id" component={HouseDetail}></Route>
                    <Route path="/login" component={Login}></Route>
                    <AuthRoute exact path='/rent' component={Rent}/>
                    <AuthRoute path='/rent/add' component={RentAdd}/>
                    <AuthRoute path='/rent/search' component={RentSearch}/>
                </div>
            </Suspense>
        </Router>
    )
}

export default App
