import React from "react";
import {Carousel} from 'antd-mobile';
import axios from "axios";

export default class Index extends React.Component {
    state = {
        swipers: [],
    }

    async getSwipers() {
        const res = await axios.get("http://127.0.0.1:8080/home/swiper")
        console.log(res)
        this.setState({
            swipers: res.data.body
        })
    }

    renderSwipers() {
        return this.state.swipers.map(item => (
            <a
                key={item.id}
                href="http://www.alipay.com"
                style={{display: 'inline-block', width: '100%', height: 212}}
            >
                <img
                    src={`http://127.0.0.1:8080${item.imgSrc}`}
                    alt=""
                    style={{width: '100%', verticalAlign: 'top'}}
                />
            </a>
        ))
    }

    componentDidMount() {
        this.getSwipers()
    }

    render() {
        return (
            <div>
                <Carousel
                    autoplay
                    infinite
                    autoplayInterval={1000}
                >
                    {this.renderSwipers()}
                </Carousel>
            </div>
        )
    }
}