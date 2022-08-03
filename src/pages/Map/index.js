import React from "react";
import NavHeader from "../../components/NavHeader";

// import './index.scss'

import style from './index.module.css'

// import axios from "axios";

import {API} from "../../utils/api";

import {Link} from "react-router-dom";
import {Toast} from "antd-mobile";
import {BASE_URL} from '../../utils/url'

// 覆盖物样式
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}

export default class Map extends React.Component {
    state = {
        houseList: [],
        isShowList: false,
    }

    componentDidMount() {
        this.initMap()
    }

    initMap() {
        let {label, value} = JSON.parse(localStorage.getItem('hkzf_city'))

        // 初始化地图实例
        // 在React中，全局对象需要通过 window 来访问
        const map = new window.BMapGL.Map('container')  // 创建地图实例

        // 用于其他方法使用map
        this.map = map
        const _this = this

        //创建地址解析器实例
        const myGeo = new window.BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(label, async function (point) {
            if (point) {

                map.centerAndZoom(point, 11);
                // map.addOverlay(new window.BMapGL.Marker(point))

                map.addControl(new window.BMapGL.ZoomControl())
                map.addControl(new window.BMapGL.ScaleControl())

                _this.renderOverlays(value)

                /*

                                let res = await axios.get(`http://localhost:8080/area/map?id=${value}`)
                                console.log(res)
                                res.data.body.forEach(item => {

                                    const {coord: {longitude, latitude}, label: areaName, count, value} = item

                                    const areaPoint = new window.BMapGL.Point(longitude, latitude)

                                    const label = new window.BMapGL.Label('', {
                                        position: areaPoint,                          // 设置标注的地理位置
                                        offset: new window.BMapGL.Size(-35, -35)
                                    })
                                    label.id = value

                                    label.setContent(`
                                        <div class="${style.bubble}">
                                            <p class="${style.name}">${areaName}</p>
                                            <p>${count}套</p>
                                            </div>
                                    `)

                                    label.setStyle(labelStyle)

                                    label.addEventListener('click', () => {
                                        console.log('触发点击')

                                        map.centerAndZoom(areaPoint, 13);

                                        map.clearOverlays()
                                    })
                                    map.addOverlay(label);
                                })

                                // let opts = {
                                //     position: point,                          // 设置标注的地理位置
                                //     offset: new window.BMapGL.Size(-35, -35)
                                // }
                */


            }
        }, label)

        map.addEventListener('movestart', () => {
            if (this.state.isShowList) {
                this.setState({
                    isShowList: false
                });
            }
        })

        // const point = new window.BMapGL.Point(116.404, 39.915); // 创建点坐标

        // map.centerAndZoom(point, 15);   // 初始化地图，设置中心点坐标和地图级别
        // map.enableScrollWheelZoom(true);    //开启鼠标滚轮缩放
        // map.setHeading(64.5);   //设置地图旋转角度
        // map.setTilt(73);       //设置地图的倾斜角度
    }

    async renderOverlays(id) {
        try {
            Toast.loading('加载中...', 0, null, false);
            const res = await API.get(`/area/map?id=${id}`);
            Toast.hide();

            const {nextZoom, type} = this.getTypeAndZoom();

            res.data.body.forEach(item => {
                this.createOverlays(item, nextZoom, type)
            });
        } catch (e) {
            Toast.hide();
        }
    }

    getTypeAndZoom() {
        const zoom = this.map.getZoom()
        console.log(zoom)
        let nextZoom, type
        if (zoom > 10 && zoom < 12) {
            // 下一个缩放级别
            nextZoom = 13;
            type = 'circle'
        } else if (zoom >= 12 && zoom < 14) {
            // 下一个缩放级别
            nextZoom = 15;
            type = 'circle'
        } else if (zoom >= 14 && zoom < 16) {
            type = 'rect'
        }

        return {nextZoom, type}
    }

    createOverlays(data, zoom, type) {
        const {coord: {longitude, latitude}, label: areaName, count, value} = data

        const areaPoint = new window.BMapGL.Point(longitude, latitude)

        if (type === 'circle') {
            // 区，镇
            this.createCircle(areaPoint, areaName, count, value, zoom)
        } else {
            // 小区
            this.createRect(areaPoint, areaName, count, value)
        }

    }

    createCircle(point, name, count, id, zoom) {
        const label = new window.BMapGL.Label('', {
            position: point,                          // 设置标注的地理位置
            offset: new window.BMapGL.Size(-35, -35)
        })
        label.id = id

        label.setContent(`
            <div class="${style.bubble}">
                <p class="${style.name}">${name}</p>
                <p>${count}套</p>
            </div>
        `)

        label.setStyle(labelStyle)

        label.addEventListener('click', async () => {
            this.map.centerAndZoom(point, zoom);
            this.map.clearOverlays()
            await this.renderOverlays(id)
        })
        this.map.addOverlay(label);
    }

    createRect(point, name, count, id) {
        const label = new window.BMapGL.Label('', {
            position: point,                          // 设置标注的地理位置
            offset: new window.BMapGL.Size(-50, -28)
        })
        label.id = id

        label.setContent(`
            <div class="${style.rect}">
                <span class="${style.housename}">${name}</span>
                <span class="${style.housenum}">${count}套</span>
                <i class="${style.arrow}"></i>
            </div>
        `)

        label.setStyle(labelStyle)

        label.addEventListener('click', async (e) => {
            const target = e.domEvent.changedTouches[0]
            this.map.panBy(
                window.innerWidth / 2 - target.clientX,
                (window.innerHeight - 330) / 2 - target.clientY,
            )

            await this.getHousesList(id)
        })
        this.map.addOverlay(label);

    }

    // 获取小区房源数据
    async getHousesList(id) {
        try {
            Toast.loading('加载中...', 0, null, false);
            const res = await API.get(`/houses?cityId=${id}`);
            Toast.hide();
            this.setState({
                houseList: res.data.body.list,

                isShowList: true
            });
        } catch (e) {
            Toast.hide();
        }
    }

    renderHousesList() {
        return this.state.houseList.map(item => (
                <div className={style.house} key={item.houseCode}>
                    <div className={style.imgWrap}>
                        <img
                            className={style.img}
                            src={`${BASE_URL}${item.houseImg}`}
                            alt=""/>
                    </div>
                    <div className={style.content}>
                        <h3 className={style.title}>{item.title}</h3>
                        <div className={style.desc}>{item.desc}</div>
                        <div>
                            {/* ['近地铁', '随时看房'] */}
                            {
                                item.tags.map((tag, index) => {
                                        const tagClass = 'tag' + (index + 1)
                                        return (
                                            <span className={[style.tag, style[tagClass]].join(' ')}
                                                  key={tag}>
                                        {tag}
                                    </span>
                                        )
                                    }
                                )
                            }
                        </div>
                        <div className={style.price}>
                            <span className={style.priceNum}>{item.price}</span> 元/月
                        </div>
                    </div>
                </div>
            )
        )

    }

    render() {
        return (
            <div className={style.map}>
                {/*<div className='test'>测试样式覆盖问题</div>*/}
                <NavHeader>
                    地图找房
                </NavHeader>
                <div id='container' className={style.container}></div>

                {/* 房源列表 */}
                {/* 添加 styles.show 展示房屋列表 */}
                <div
                    className={[
                        style.houseList,
                        this.state.isShowList ? style.show : ''
                    ].join(' ')}
                >
                    <div className={style.titleWrap}>
                        <h1 className={style.listTitle}>房屋列表</h1>
                        <Link className={style.titleMore} to="/home/list">
                            更多房源
                        </Link>
                    </div>

                    <div className={style.houseItems}>
                        {/* 房屋结构 */}

                        {
                            this.renderHousesList()
                        }

                    </div>
                </div>
            </div>
        )
    }
}