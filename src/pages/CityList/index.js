import React from "react";
import {Toast} from "antd-mobile";
import axios from "axios";

import {getCurrentCity} from "../../utils";
import {List, AutoSizer} from 'react-virtualized';
import NavHeader from "../../components/NavHeader";

import './index.scss'

// 格式化数据
const formatCityList = (data) => {
    const cityList = {}
    // const cityIndex = []

    data.forEach(item => {
        const first = item.short.substr(0, 1)
        if (cityList[first]) {
            cityList[first].push(item)
        } else {
            cityList[first] = [item]
        }
    })

    const cityIndex = Object.keys(cityList).sort()

    return {
        cityList,
        cityIndex,
    }
}


const formatCityIndex = (letter) => {
    switch (letter) {
        case '#':
            return '当前定位'
        case 'hot':
            return '热门城市'
        default:
            return letter.toUpperCase()
    }
}

const TITLEHEIGHT = 36
const NAME_HEIGHT = 50
const HOUSE_CITY = ['北京','深圳','广州','上海']

export default class CityList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cityList: {},
            cityIndex: [],
            activeIndex: 0,
        }

        // 创建ref对象
        this.cityListComponent = React.createRef()
    }

    async componentDidMount() {
        await this.getCityList()

        // 调用 measureAllRows，提前计算 List 中每一行的高度，实现 scrollToRow 的精确跳转
        // 注意：调用这个方法的时候，需要保证List组件已经有数据，不然会报错
        this.cityListComponent.current.measureAllRows()
    }

    changeCity(city) {
        let {label, value} = city
        if (HOUSE_CITY.includes(label)) {
            localStorage.setItem('hkzf_city', JSON.stringify({label, value}));
            this.props.history.go(-1);
        } else {
            Toast.info('该城市暂无房源数据',1,null,false)
        }
    }

    async getCityList() {
        const res = await axios.get("http://127.0.0.1:8080/area/city?level=1")
        const {cityList, cityIndex} = formatCityList(res.data.body);

        const hotCityList = await axios.get("http://127.0.0.1:8080/area/hot")
        cityList['hot'] = hotCityList.data.body
        cityIndex.unshift('hot')

        const curCity = await getCurrentCity()
        cityList['#'] = [curCity]
        cityIndex.unshift('#')

        this.setState({
            cityList,
            cityIndex
        })
    }

    rowRenderer = (
        {
            key, // Unique key within array of rows
            index, // Index of row within collection
            isScrolling, // The List is currently being scrolled
            isVisible, // This row is visible within the List (eg it is not an overscanned row)
            style, // Style object to be applied to row (to position it)
        }
    ) => {
        // 获取字母索引
        const {cityIndex, cityList} = this.state
        const letter = cityIndex[index]
        const cities = cityList[letter]
        return (
            <div key={key} style={style} className='city'>
                <div className='title'>{formatCityIndex(letter)}</div>
                {
                    cities.map(item => {
                        return (<div onClick={()=>this.changeCity(item)} key={item.value} className='name'>{item.label}</div>)
                    })
                }
            </div>
        );
    }

    getRowHeight = ({index}) => {
        const {cityIndex, cityList} = this.state
        return TITLEHEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    }

    renderCityIndex = () => {
        const {cityIndex, activeIndex} = this.state
        return cityIndex.map((item, index) =>
            (
                <li onClick={() => {
                    this.cityListComponent.current.scrollToRow(index)
                    this.setState({activeIndex: index})
                }} key={item} className='city-index-item'>
                    <span
                        className={activeIndex === index ? 'index-active' : ''}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
                </li>
            )
        )
    }

    onRowsRendered = ({startIndex}) => {
        if (startIndex !== this.state.activeIndex) {
            this.setState({
                activeIndex: startIndex
            })
        }
    }


    render() {
        return (
            <div className='cityList'>
                <NavHeader>城市选择</NavHeader>
{/*                <NavBar
                    className='navbar'
                    mode="light"
                    icon={<i className='iconfont icon-back'/>}
                    onLeftClick={() => this.props.history.go(-1)}
                >城市选择</NavBar>*/}
                <AutoSizer>
                    {
                        ({width, height}) => {
                            return (<List
                                ref={this.cityListComponent}
                                width={width}
                                height={height}
                                rowCount={this.state.cityIndex.length}
                                rowHeight={this.getRowHeight}
                                rowRenderer={this.rowRenderer}
                                onRowsRendered={this.onRowsRendered}
                                scrollToAlignment='start'
                            />)
                        }
                    }
                </AutoSizer>

                <ul className='city-index'>
                    {this.renderCityIndex()}
                </ul>

            </div>
        )
    }
}