import React from "react";
import {Flex} from "antd-mobile";
import styles from './index.module.css'

const arr = [
    {title: '区域', type: 'area'},
    {title: '方式', type: 'mode'},
    {title: '租金', type: 'price'},
    {title: '筛选', type: 'more'},
]

export default class FilterTitle extends React.Component {
    render() {
        return (
            <Flex align='center' className={styles.root}>
                <Flex.Item>
                    <span className={[styles.dropdown, styles.selected].join(' ')}>
                    <span>区域</span>
                    <i className='iconfont icon-arrow'/>
                </span>
                </Flex.Item>
            </Flex>
        )
    }
}
