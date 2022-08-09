import React from "react";

import styles from './index.module.css'

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

export default class Filter extends React.Component {
    render() {
        return (
            <div className={styles.root}>
                {/* 前三个菜单的遮罩层 */}
                {/*<div className={styles.mask}></div>*/}

                <div className={styles.content}>
                    {/* 标题栏 */}
                    <FilterTitle />

                    {/* 前三个菜单对应的内容： */}
                    <FilterPicker />

                    {/* 最后一个菜单对应的内容： */}
                    {/*<FilterMore />*/}
                </div>
            </div>
        )
    }
}
