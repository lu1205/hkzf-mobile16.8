import React from "react";
import {PickerView} from "antd-mobile";
import FilterFooter from "../../../../components/FilterFooter";

export default class FilterPicker extends React.Component {
    state = {
        value: this.props.defaultValue
    }

    onChange = (value) => {
        this.setState({
            value: value
        })
    }

    render() {
        const {onCancel, onSave, data, cols, type} = this.props
        return (
            <>
                <PickerView onChange={this.onChange} data={data} value={this.state.value} cols={cols}/>
                <FilterFooter onCancel={() => onCancel(type)} onOk={() => onSave(type, this.state.value)}/>
            </>
        )
    }
}
