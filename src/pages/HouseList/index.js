import React from "react";
import SearchHeader from "../../components/SearchHeader";
import {Flex} from "antd-mobile";

import styles from './index.module.css'

import Filter from "./components/Filter";
import {API} from "../../utils/api";
import {List} from "react-virtualized";
import HouseItem from "../../components/HouseItem";
import {BASE_URL} from "../../utils/url";

const {label, value} = JSON.parse(localStorage.getItem('hkzf_city'));


export default class HouseList extends React.Component {

    state = {
        list: [],
        count: 0,
    }

    filters = {}

    componentDidMount() {
        this.searchHouseList()
    }

    onFilter = async (filters) => {
        this.filters = filters
        await this.searchHouseList()
    }
    searchHouseList = async (data) => {
        const res = await API.get('/houses', {
            params: {
                cityId: value,
                ...this.filters,
                start: 1,
                end: 20
            }
        })
        console.log(11, res)
        const {list, count} = res.data.body

        this.setState({
            list,
            count
        })
    }

    // 渲染列表项的每一行
    renderHouseList = ({key, index, style,}) => {
        const {list} = this.state
        const house = list[index]
        console.log('house', house)
        return (
            <HouseItem
                key={key}
                style={style}
                src={BASE_URL + house.houseImg}
                title={house.title}
                desc={house.desc}
                tags={house.tags}
                price={house.price}
            />
        );
    }

    render() {
        return (
            <div>
                <Flex className={styles.header}>
                    <i className='iconfont icon-back' onClick={() => {
                        this.props.history.go(-1)
                    }}/>
                    <SearchHeader cityName={label} className={styles.searchHeader}/>
                </Flex>
                <Filter onFilters={this.onFilter}/>

                <div className={styles.houseItems}>
                    <List
                        width={300}
                        height={300}
                        rowCount={this.state.count}
                        rowHeight={120}
                        rowRenderer={this.renderHouseList}
                    />
                </div>
            </div>
        )
    }
}
