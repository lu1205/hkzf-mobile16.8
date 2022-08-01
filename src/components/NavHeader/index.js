import React from "react";
import {NavBar} from "antd-mobile";
// import './index.scss'

import style from './index.module.css'

import {withRouter} from "react-router-dom";

import PropTypes from 'prop-types'

// children,history,onLeftClick 为props中结构出来的参数
function NavHeader({children,history,onLeftClick}) {

    const defaultHandle = ()=>{history.go(-1)}
    return (
        <NavBar
            className={style.navBar}
            mode="light"
            icon={<i className='iconfont icon-back'/>}
            onLeftClick={onLeftClick || defaultHandle}
        >
            {children}
        </NavBar>
    )
}

// 添加props校验
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func
}

export default withRouter(NavHeader)