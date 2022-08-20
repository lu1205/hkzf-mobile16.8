import React from "react";
import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";
import {API} from "../../../../utils/api";
import {Spring} from "react-spring/renderprops-universal";
import styles from './index.module.css'

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
        filtersData: {
            // FilterMore
            roomType: [],
            oriented: [],
            floor: [],
            characteristic: [],
            // FilterPicker
            area: {},
            subway: {},
            rentType: [],
            price: []
        },
        selectedValue,
    }

    componentDidMount() {
        this.htmlBody = document.body
        this.getFiltersData()
    }

    async getFiltersData() {
        const {value} = JSON.parse(localStorage.getItem('hkzf_city'));
        const res = await API.get(`/houses/condition?id=${value}`)
        console.log(res)
        this.setState({
            filtersData: res.data.body
        })
    }

    onTitleClick = (type) => {
        this.htmlBody.className = 'body-fixed'

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
        this.htmlBody.className = ''

        console.log(type)
        // 设置选中项为默认时，标题不高亮
        const {titleSelectedStatus, selectedValue} = this.state
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
        this.htmlBody.className = ''

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

        const newSelectedValues = {
            ...this.state.selectedValue,
            [type]: value
        }
        const {area, mode, price, more} = newSelectedValues

        const filters = {}

        const areaKey = area[0]

        let areaValue = 'null'

        if (area.length === 3) {
            areaValue = area[2] !== 'null' ? area[2] : area[1]
        }
        filters[areaKey] = areaValue

        filters.mode = mode[0]
        filters.price = price[0]
        filters.more = more.join(',')

        console.log(newSelectedValues)

        this.props.onFilters(filters)

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

    renderMask = () => {
        const {openType} = this.state
        const isHide = openType === 'more' || openType === ''
        return <Spring from={{opacity: 0}} to={{opacity: isHide ? 0 : 1}}>
            {
                props => {
                    return props.opacity === 0
                        ? null
                        : <div
                            style={props} className={styles.mask}
                            onClick={() => this.onCancel(openType)}
                        />
                }
            }
        </Spring>
    }

    render() {
        const {titleSelectedStatus} = this.state
        return (
            <div className={styles.root}>
                {/* 前三个菜单的遮罩层 */}
                {
                    this.renderMask()
                }

                <div className={styles.content}>
                    {/* 标题栏 */}
                    <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick}/>

                    {/* 前三个菜单对应的内容： */}
                    {this.renderFilterPicker()}

                    {/* 最后一个菜单对应的内容： */}
                    {this.renderFilterMore()}
                </div>
            </div>
        )
    }
}
