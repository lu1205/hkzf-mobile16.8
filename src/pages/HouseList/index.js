import React from "react";
import SearchHeader from "../../components/SearchHeader";
import {Flex, Toast} from "antd-mobile";
import Sticky from "../../components/Sticky";

import styles from './index.module.css'

import Filter from "./components/Filter";
import {API} from "../../utils/api";
import {List, WindowScroller, AutoSizer, InfiniteLoader} from "react-virtualized";
import HouseItem from "../../components/HouseItem";
import {BASE_URL} from "../../utils/url";
import NoHouse from "../../components/NoHouse";
import {getCurrentCity} from "../../utils";

//  切换路由是不会重新执行
// const {label, value} = JSON.parse(localStorage.getItem('hkzf_city'));

export default class HouseList extends React.Component {
    state = {
        list: [],
        count: 0,
        isLoading: false
    }
    label = ''
    value = ''

    filters = {}

    async componentDidMount() {
        const {label, value} = await getCurrentCity()
        this.label = label
        this.value = value
        await this.searchHouseList()
    }

    onFilter = async (filters) => {
        // 返回页面顶部
        window.scrollTo(0, 0)
        this.filters = filters
        await this.searchHouseList()
    }

    searchHouseList = async (data) => {
        this.setState({
            isLoading: true
        })
        Toast.loading('加载中...', 0, null, false);
        const res = await API.get('/houses', {
            params: {
                cityId: this.value,
                ...this.filters,
                start: 1,
                end: 20
            }
        })
        const {list, count} = res.data.body
        Toast.hide()
        if (count > 0) {
            Toast.info(`共找到${count}套房源`, 2, null, false)
        }
        this.setState({
            list,
            count,
            isLoading: false
        })
    }

    // 渲染列表项的每一行
    renderHouseList = ({key, index, style,}) => {
        const {list} = this.state
        const house = list[index]

        if (!house) {
            return (
                <div key={key} style={style}>
                    <p className={styles.loading}/>
                </div>
            )
        }

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

    isRowLoaded = ({index}) => {
        return !!this.state.list[index];
    }

    loadMoreRows = ({startIndex, stopIndex}) => {
        return new Promise((resolve, reject) => {
            API.get('/houses', {
                params: {
                    cityId: this.value,
                    ...this.filters,
                    start: startIndex,
                    end: stopIndex
                }
            }).then(res => {
                this.setState({
                    list: [...this.state.list, ...res.data.body.list],
                })
                resolve()
            })
        })
    }

    renderList = () => {
        const {count,isLoading} = this.state;
        if (count === 0 && !isLoading) {
            return <NoHouse>没有找到房源，请您换一个搜索条件吧~</NoHouse>
        }

        return (
            <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                loadMoreRows={this.loadMoreRows}
                rowCount={count}
            >
                {({onRowsRendered, registerChild}) => (
                    <WindowScroller>
                        {({height, isScrolling, scrollTop}) => (
                            <AutoSizer>
                                {({width}) => (
                                    <List
                                        onRowsRendered={onRowsRendered}
                                        ref={registerChild}
                                        isScrolling={isScrolling}
                                        scrollTop={scrollTop}
                                        autoHeight
                                        width={width}
                                        height={height}
                                        rowCount={count}
                                        rowHeight={120}
                                        rowRenderer={this.renderHouseList}
                                    />
                                )}
                            </AutoSizer>
                        )}
                    </WindowScroller>
                )}
            </InfiniteLoader>
        );
    }

    render() {
        return (
            <div>
                <Flex className={styles.header}>
                    <i className='iconfont icon-back' onClick={() => {
                        this.props.history.go(-1)
                    }}/>
                    <SearchHeader cityName={this.label} className={styles.searchHeader}/>
                </Flex>

                <Sticky height={40}>
                    <Filter onFilters={this.onFilter}/>
                </Sticky>

                <div className={styles.houseItems}>
                    {this.renderList()}
                </div>

            </div>
        )
    }
}
