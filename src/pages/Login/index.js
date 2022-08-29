import React, {Component} from "react";

import {Flex, WingBlank, WhiteSpace, Toast} from "antd-mobile";
import {Link} from "react-router-dom";
// 导入withFormik
import {ErrorMessage, Field, Form, withFormik} from "formik";
// 导入Yup
import * as Yup from 'yup'

import NavHeader from "../../components/NavHeader";

import styles from './index.module.css'
import {API} from "../../utils/api";

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/


class Login extends Component {
    /*    state = {
            username: '',
            password: '',
        }

        getUserName = (e) => {
            this.setState({
                username: e.target.value
            })
        }

        getPassword = (e) => {
            this.setState({
                password: e.target.value
            })
        }

        handleSubmit = async (e) => {
            // 阻止表单默认行为
            e.preventDefault()

            const {username, password} = this.state
            if (!username) {
                return
            }

            const res = await API.post('/user/login', {username: username, password: password});
            console.log(res)
            if (res.data.status === 200) {
                localStorage.setItem('hfzf_token', res.data.body.token)
                this.props.history.go(-1)
            } else {
                Toast.info(res.data.description, 2, null, false)
            }
        }*/

    render() {
        // const {username, password} = this.state

        // const {values, handleSubmit, handleChange, handleBlur, errors, touched} = this.props

        return (
            <div className={styles.root}>
                <NavHeader className={styles.navHeader}>账号登录</NavHeader>
                <WhiteSpace size="xl"/>
                <WingBlank>
                    <Form>
                        <div className={styles.formItem}>
                            <Field
                                className={styles.input}
                                name='username'
                                placeholder='请输入账号'
                                />
                        </div>
                        <ErrorMessage className={styles.error} name='username' component='div'></ErrorMessage>
                        <div className={styles.formItem}>
                            <Field
                                className={styles.input}
                                name='password'
                                type='password'
                                placeholder='请输入密码'
                            />
                        </div>
                        <ErrorMessage className={styles.error} name='password' component='div'></ErrorMessage>

                        <div className={styles.formSubmit}>
                            <button className={styles.submit} type='submit'>登录</button>
                        </div>
                    </Form>
{/*                    <form onSubmit={handleSubmit}>
                        <div className={styles.formItem}>
                            <input
                                value={values.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={styles.input}
                                name='username'
                                placeholder='请输入账号'
                            />
                        </div>
                        {
                            errors.username && touched.username && (
                                <div className={styles.error}>{errors.username}</div>)
                        }
                         长度为5-8位，只能出现数字、字母、下划线
                        <div className={styles.error}>账号为必填项</div>
                        <div className={styles.formItem}>
                            <input
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={styles.input}
                                name='password'
                                type='password'
                                placeholder='请输入密码'
                            />
                        </div>
                        {
                            errors.password && touched.password && (
                                <div className={styles.error}>{errors.password}</div>)
                        }
                         长度为5-12位，只能出现数字、字母、下划线
                        <div className={styles.error}>密码为必填项</div>

                        <div className={styles.formSubmit}>
                            <button className={styles.submit} type='submit'>登录</button>
                        </div>
                    </form>*/}
                    <Flex className={styles.backHome}>
                        <Flex.Item>
                            <Link to='/register'>还没有账号，去注册~</Link>
                        </Flex.Item>
                    </Flex>
                </WingBlank>
            </div>
        )
    }
}

// 使用 withFormik 包装 Login 组件，为 Login 组件提供属性和方法
Login = withFormik({
    // 提供状态
    mapPropsToValues: () => ({username: '', password: ''}),
    // 表单校验规则
    validationSchema: Yup.object().shape({
        username: Yup.string().required('账号为必填项').matches(REG_UNAME, '长度为5-8位，只能出现数字、字母、下划线'),
        password: Yup.string().required('密码为必填项').matches(REG_PWD, '长度为5-12位，只能出现数字、字母、下划线'),
    }),
    // 表单的提交事件
    handleSubmit: async (values, {props}) => {
        const {username, password} = values

        const res = await API.post('/user/login', {username: username, password: password});
        console.log(res)
        if (res.data.status === 200) {
            localStorage.setItem('hkzf_token', res.data.body.token)
            props.history.go(-1)
        } else {
            Toast.info(res.data.description, 2, null, false)
        }
    },


})(Login)

// 此处返回的是 高阶组件 包装后的组件
export default Login
