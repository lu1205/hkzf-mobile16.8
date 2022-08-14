import React from "react";
import FilterFooter from "../../../../components/FilterFooter";
import styles from './index.module.css'

export default class FilterMore extends React.Component {

    state = {
        selectedValues: this.props.defaultValue,
    }

    onTagClick(value) {
        const {selectedValues} = this.state
        let newSelectedValues = [...selectedValues]
        if (selectedValues.indexOf(value) <= -1) {
            newSelectedValues.push(value);
        } else {
            const index = newSelectedValues.findIndex(item => item === value)
            newSelectedValues.splice(index, 1)
        }
        this.setState({
            selectedValues: newSelectedValues,
        })
    }

    // 渲染标签
    renderFilters(data) {
        const {selectedValues} = this.state
        return data.map(item => {
            const isSelected = selectedValues.indexOf(item.value) > -1 ? true : false
            return (
                <span
                    key={item.value}
                    className={[
                        styles.tag,
                        isSelected ? styles.tagActive : ''
                    ].join(' ')}
                    onClick={() => {
                        this.onTagClick(item.value)
                    }}
                >
                    {item.label}
                </span>
            )
        })
    }

    onCancel = () => {
        this.setState({
            selectedValues: []
        })
    }

    onOk = () => {
        const {onSave, type} = this.props
        onSave(type, this.state.selectedValues)
    }

    render() {
        const {data: {characteristic, floor, oriented, roomType}, cancelText, onCancel, type} = this.props
        return (
            <div className={styles.root}>
                {/* 遮罩层 */}
                <div className={styles.mask} onClick={() => onCancel(type)}></div>

                {/* 条件内容 */}
                <div className={styles.tags}>
                    <dl className={styles.dl}>
                        <dt className={styles.dt}>户型</dt>
                        <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

                        <dt className={styles.dt}>朝向</dt>
                        <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

                        <dt className={styles.dt}>楼层</dt>
                        <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

                        <dt className={styles.dt}>房屋亮点</dt>
                        <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
                    </dl>
                </div>

                {/* 底部按钮| */}
                <FilterFooter
                    className={styles.footer}
                    cancelText={cancelText}
                    onCancel={this.onCancel}
                    onOk={this.onOk}
                />

            </div>
        )
    }
}
