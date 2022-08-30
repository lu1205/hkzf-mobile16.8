import React from "react";
import {Redirect, Route} from "react-router-dom";
import {isAuth} from "../../utils/auth";

const AuthRoute = ({component: Component, ...rest}) => {
    // console.log(Component)
    // console.log(rest)

    return <Route
        {...rest}
        render={props => {
            const isLogin = isAuth()
            if (isLogin) {
                // 将 props 传递给组件，组件才能获取路由信息
                return <Component {...props} />
            } else {
                return <Redirect to={{
                    pathname: '/login',
                    state: {
                        from: props.location
                    }
                }}/>
            }
        }}/>
}

export default AuthRoute
