import React from "react";
import NavHeader from "../../components/NavHeader";

// import './index.scss'

import style from './index.module.css'

export default class Map extends React.Component {

    componentDidMount() {
        // 初始化地图实例
        // 在React中，全局对象需要通过 window 来访问
        const map = new window.BMapGL.Map('container')  // 创建地图实例

        const point = new window.BMapGL.Point(116.404, 39.915); // 创建点坐标

        map.centerAndZoom(point, 15);   // 初始化地图，设置中心点坐标和地图级别
        // map.enableScrollWheelZoom(true);    //开启鼠标滚轮缩放
        // map.setHeading(64.5);   //设置地图旋转角度
        // map.setTilt(73);       //设置地图的倾斜角度

    }

    render() {
        return (
            <div className={style.map}>
                {/*<div className='test'>测试样式覆盖问题</div>*/}
                <NavHeader>
                    地图找房
                </NavHeader>
                <div id='container' className={style.container}></div>
            </div>
        )
    }
}