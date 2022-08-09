import React from "react";
import {Route} from "react-router-dom";

import "./index.css"

import Index from "../Index";
import HouseList from "../HouseList";
import News from "../News";
import Profile from "../Profile";
import {TabBar} from 'antd-mobile';


const tabItems = [
    {
        title: "首页",
        icon: "icon-ind",
        path: "/home"
    },
    {
        title: "导航",
        icon: "icon-findHouse",
        path: "/home/list"
    },
    {
        title: "资讯",
        icon: "icon-infom",
        path: "/home/news"
    },
    {
        title: "我的",
        icon: "icon-my",
        path: "/home/profile"
    },
]

export default class Home extends React.Component {
    state = {
        selectedTab: this.props.location.pathname,
        hidden: false,
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(prevProps, prevState, snapshot)
        // 比较前后两次的路由是否相同，如果不同，更新当前的路由，使得对应Tabbar高亮
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.setState({
                selectedTab: this.props.location.pathname
            })
        }
    }

    renderTabBarItem() {
        return tabItems.map(item =>
            <TabBar.Item
                title={item.title}
                key={item.title}
                icon={<i className={`iconfont ${item.icon}`}></i>}
                selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
                selected={this.state.selectedTab === item.path}
                onPress={() => {
                    this.setState({
                        selectedTab: item.path,
                    });
                    this.props.history.push(item.path)
                }}
            >
            </TabBar.Item>)
    }

    render() {
        return (
            <div className="home">
                <Route exact path="/home" component={Index}></Route>
                <Route path="/home/list" component={HouseList}></Route>
                <Route path="/home/news" component={News}></Route>
                <Route path="/home/profile" component={Profile}></Route>

                <div>
                    <TabBar
                        noRenderContent
                        unselectedTintColor="#888"
                        tintColor="#21b97a"
                        barTintColor="white"
                        hidden={this.state.hidden}
                    >
                        {this.renderTabBarItem()}
                    </TabBar>
                </div>
            </div>
        )
    }
}
