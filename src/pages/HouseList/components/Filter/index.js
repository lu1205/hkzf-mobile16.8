import React from "react";

import styles from './index.module.css'

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";
import {API} from "../../../../utils/api";

const titleSelectedStatus = {
    area: false,
    mode: false,
    price: false,
    more: false,
}

const selectedValue = {
    area: ['area', 'null'],
    mode: ['null'],
    price: ['null'],
    more: [],
}

export default class Filter extends React.Component {
    state = {
        titleSelectedStatus,
        openType: '',
        filtersData: {},
        selectedValue,
    }

    async getFiltersData() {
        const {value} = JSON.parse(localStorage.getItem('hkzf_city'));
        const res = await API.get(`/houses/condition?id=${value}`)
        console.log(res)
        this.setState({
            filtersData: res.data.body
        })
    }

    async componentDidMount() {
        await this.getFiltersData()
    }

    onTitleClick = (type) => {
        const {titleSelectedStatus, selectedValue} = this.state
        let newTitleSelectedStatus = {...titleSelectedStatus}
        Object.keys(titleSelectedStatus).forEach(key => {
            if (key === type) {
                newTitleSelectedStatus[type] = true;
            } else {
                if (key === 'area' && (selectedValue[key].length !== 2 || selectedValue[key][0] !== 'area')) {
                    newTitleSelectedStatus[key] = true
                } else if (key === 'mode' && selectedValue[key][0] !== 'null') {
                    newTitleSelectedStatus[key] = true
                } else if (key === 'price' && selectedValue[key][0] !== 'null') {
                    newTitleSelectedStatus[key] = true
                } else if (key === 'more' && selectedValue[key].length > 0) {
                    newTitleSelectedStatus[key] = true
                } else {
                    newTitleSelectedStatus[key] = false
                }
            }
        })
        this.setState((preState) => {
            return {
                // titleSelectedStatus: {
                //     ...preState.titleSelectedStatus,
                //     [type]: true
                // },
                titleSelectedStatus: newTitleSelectedStatus,
                openType: type,
            }
        })
    }

    onCancel = (type) => {
        console.log(type)
        // 设置选中项为默认时，标题不高亮
        const {titleSelectedStatus,selectedValue} = this.state
        let newTitleSelectedStatus = {...titleSelectedStatus}
        let value = selectedValue[type]
        if (type === 'area' && (value[0] !== 'area' || value.length !== 2)) {
            newTitleSelectedStatus[type] = true
        } else if (type === 'mode' && value[0] !== 'null') {
            newTitleSelectedStatus[type] = true
        } else if (type === 'price' && value[0] !== 'null') {
            console.log(123)
            newTitleSelectedStatus[type] = true
        } else if (type === 'more' && value.length !== 0) {
            newTitleSelectedStatus[type] = true
        } else {
            newTitleSelectedStatus[type] = false
        }
        this.setState({
            openType: '',
            titleSelectedStatus: newTitleSelectedStatus,
        })
    }

    onSave = (type, value) => {
        console.log(type, value)
        // 设置选中项为默认时，标题不高亮
        const {titleSelectedStatus} = this.state
        let newTitleSelectedStatus = {...titleSelectedStatus}
        if (type === 'area' && (value[0] !== 'area' || value.length !== 2)) {
            newTitleSelectedStatus[type] = true
        } else if (type === 'mode' && value[0] !== 'null') {
            newTitleSelectedStatus[type] = true
        } else if (type === 'price' && value[0] !== 'null') {
            newTitleSelectedStatus[type] = true
        } else if (type === 'more' && value.length !== 0) {
            newTitleSelectedStatus[type] = true
        } else {
            newTitleSelectedStatus[type] = false
        }
        /*if (type === 'area' && value[0] === 'area' && value.length === 2) {
            newTitleSelectedStatus[type] = false
        } else if (type === 'mode' && value[0] === 'null') {
            newTitleSelectedStatus[type] = false
        } else if (type === 'price' && value[0] === 'null') {
            newTitleSelectedStatus[type] = false
        } else if (type === 'more' && value.length === 0) {
            newTitleSelectedStatus[type] = false
        }*/

        this.setState({
            openType: '',
            selectedValue: {
                ...this.state.selectedValue,
                [type]: value
            },
            titleSelectedStatus: newTitleSelectedStatus,
        });
    }

    renderFilterPicker() {
        const {openType, filtersData: {area, subway, rentType, price}, selectedValue} = this.state
        if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
            return null
        }
        let data = []
        let cols = 3
        let defaultValue = selectedValue[openType]
        switch (openType) {
            case 'area':
                data = [area, subway]
                cols = 3
                break
            case 'mode':
                data = rentType
                cols = 1
                break
            case 'price':
                data = price
                cols = 1
                break
            case 'more':
                data = []
                break
            default:
                data = []
                break
        }
        return <FilterPicker
            onCancel={this.onCancel}
            onSave={this.onSave}
            data={data}
            cols={cols}
            type={openType}
            defaultValue={defaultValue}
        />
    }

    renderFilterMore() {
        const {openType, selectedValue, filtersData: {characteristic, floor, oriented, roomType}} = this.state
        if (openType !== 'more') {
            return null
        }
        let defaultValue = selectedValue[openType]
        const data = {
            characteristic,
            floor,
            oriented,
            roomType
        }
        return <FilterMore
            type={openType}
            data={data}
            defaultValue={defaultValue}
            cancelText='清除'
            onSave={this.onSave}
            onCancel={this.onCancel}
        />
    }

    render() {
        const {titleSelectedStatus, openType} = this.state
        return (
            <div className={styles.root}>
                {/* 前三个菜单的遮罩层 */}
                {
                    (openType === 'area' || openType === 'mode' || openType === 'price')
                        ? <div className={styles.mask} onClick={() => this.onCancel(openType)}></div>
                        : null
                }

                <div className={styles.content}>
                    {/* 标题栏 */}
                    <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick}/>

                    {/* 前三个菜单对应的内容： */}
                    {this.renderFilterPicker()}

                    {/* 最后一个菜单对应的内容： */}
                    {
                        this.renderFilterMore()
                    }
                </div>
            </div>
        )
    }
}
