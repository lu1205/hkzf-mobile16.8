import React from "react";
import SearchHeader from "../../components/SearchHeader";
import {Flex} from "antd-mobile";

import styles from './index.module.css'

import Filter from "./components/Filter";

const {label} = JSON.parse(localStorage.getItem('hkzf_city'));

export default class HouseList extends React.Component {
    render() {
        return (
            <div>
                <Flex className={styles.header}>
                    <i className='iconfont icon-back' onClick={() => {
                        this.props.history.go(-1)
                    }}/>
                    <SearchHeader cityName={label} className={styles.searchHeader}/>
                </Flex>
                <Filter />
            </div>
        )
    }
}
