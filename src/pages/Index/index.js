import React from "react";
import {Carousel, Flex, Grid} from 'antd-mobile';
import axios from "axios";

import Nav1 from "../../assets/images/nav-1.png"
import Nav2 from "../../assets/images/nav-2.png"
import Nav3 from "../../assets/images/nav-3.png"
import Nav4 from "../../assets/images/nav-4.png"

import "./index.scss"

const navs = [
    {
        id: 1,
        img: Nav1,
        title: '整租',
        path: '/home/list'
    },
    {
        id: 2,
        img: Nav2,
        title: '合租',
        path: '/home/list'
    },
    {
        id: 3,
        img: Nav3,
        title: '地图找房',
        path: '/home/list'
    },
    {
        id: 4,
        img: Nav4,
        title: '去出租',
        path: '/home/list'
    },
]

export default class Index extends React.Component {
    state = {
        swipers: [],
        isSwiperLoader: false, // 用于解决轮播图不自动播放及高度
        groups: [],
    }

    async getSwipers() {
        const res = await axios.get("http://127.0.0.1:8080/home/swiper")
        this.setState({
            swipers: res.data.body,
            isSwiperLoader: true
        })
    }

    async getGroups() {
        let res = await axios.get(`http://127.0.0.1:8080/home/groups`,
            {
                params: {
                    area: 'AREA%7C88cff55c-aaa4-e2e0'
                }
            })
        this.setState({
            groups: res.data.body
        })
        console.log(res.data.body)
    }

    renderSwipers() {
        return this.state.swipers.map(item => (<a
            key={item.id}
            href="http://www.alipay.com"
            style={{display: 'inline-block', width: '100%', height: 212}}
        >
            <img
                src={`http://127.0.0.1:8080${item.imgSrc}`}
                alt=""
                style={{width: '100%', verticalAlign: 'top'}}
            />
        </a>))
    }

    renderNavs() {
        return navs.map(item => (
            <Flex.Item key={item.id} onClick={() => {
                this.props.history.push(item.path)
            }}>
                <img src={item.img} alt=""/>
                <h2>{item.title}</h2>
            </Flex.Item>
        ))
    }

    componentDidMount() {
        this.getSwipers()
        this.getGroups()
    }

    render() {
        return (<div>
                <div className='swiper'>
                    {
                        this.state.isSwiperLoader ?
                            <Carousel
                                autoplay
                                infinite
                                autoplayInterval={1000}
                            >
                                {this.renderSwipers()}
                            </Carousel> : ''
                    }
                </div>

                <Flex className="nav">
                    {this.renderNavs()}
                </Flex>

                <div className="group">
                    <h3 className="group-title">
                        租房小组
                        <span className="more">更多</span>
                    </h3>

                    <Grid
                        data={this.state.groups}
                        columnNum={2}
                        square={false}
                        hasLine={false}
                        activeStyle={false}
                        renderItem={(item) => (
                            <Flex className="group-item" justify="around" key={item.id}>
                                <div className="desc">
                                    <div className="title">{item.title}</div>
                                    <div className="info">{item.desc}</div>
                                </div>
                                <img src={`http://127.0.0.1:8080${item.imgSrc}`} alt=""/>
                            </Flex>
                        )}
                    />
                </div>


            </div>
        )
    }
}