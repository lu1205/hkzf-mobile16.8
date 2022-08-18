import React, {Component, createRef} from "react";
import PropTypes from "prop-types";

import styles from "./index.module.css"

class Sticky extends Component {

    placeholder = createRef()
    content = createRef()

    handleScroll = () => {
        const placeholderEl = this.placeholder.current
        const contentEl = this.content.current
        const {top} = placeholderEl.getBoundingClientRect()
        if (top < 0) {
            contentEl.classList.add(styles.fixed);
            placeholderEl.style.height = `${this.props.height}px`
        } else {
            contentEl.classList.remove(styles.fixed);
            placeholderEl.style.height = '0'
        }
    }

    // 监听scroll
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    // 销毁scroll监听
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    render() {
        return (
            <div>
                {/* 占位元素 */}
                <div ref={this.placeholder}></div>

                {/* 内容元素 */}
                <div ref={this.content}>{this.props.children}</div>
            </div>
        )
    }
}

Sticky.propTypes = {
    height: PropTypes.number.isRequired,
}

export default Sticky
