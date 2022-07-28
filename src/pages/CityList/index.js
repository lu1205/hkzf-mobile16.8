import React from "react";
import {NavBar} from "antd-mobile";
import axios from "axios";
import './index.scss'
import {getCurrentCity} from "../../utils";

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

export default class CityList extends React.Component {
    componentDidMount() {
        this.getCityList()
    }

    state = {
        cityList: {},
        cityIndex: [],
    }

    async getCityList() {
        const res = await axios.get("http://127.0.0.1:8080/area/city?level=1")
        const {cityList, cityIndex} = formatCityList(res.data.body);

        const hotCityList = await axios.get("http://127.0.0.1:8080/area/hot")
        cityList['hot'] = hotCityList.data.body
        cityIndex.unshift('hot')

        const curCity = await getCurrentCity()
        cityList['#'] = curCity
        cityIndex.unshift('#')

        this.setState({
            cityList,
            cityIndex
        })
    }


    render() {
        return (
            <div>
                <NavBar
                    className='navbar'
                    mode="light"
                    icon={<i className='iconfont icon-back'/>}
                    onLeftClick={() => this.props.history.go(-1)}
                >城市选择</NavBar>
            </div>
        )
    }
}