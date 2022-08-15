import React from "react";
import style from "../../pages/Map/index.module.css";
import PropTypes from "prop-types";

function HouseItem({src,title, desc, tags, price,onClick}) {

    return (
        <div className={style.house} onClick={onClick}>
            <div className={style.imgWrap}>
                <img
                    className={style.img}
                    src={src}
                    alt=""/>
            </div>
            <div className={style.content}>
                <h3 className={style.title}>{title}</h3>
                <div className={style.desc}>{desc}</div>
                <div>
                    {/* ['近地铁', '随时看房'] */}
                    {
                        tags.map((tag, index) => {
                                const tagClass = 'tag' + (index + 1)
                                return (
                                    <span className={[style.tag, style[tagClass]].join(' ')}
                                          key={tag}>
                                        {tag}
                                    </span>
                                )
                            }
                        )
                    }
                </div>
                <div className={style.price}>
                    <span className={style.priceNum}>{price}</span> 元/月
                </div>
            </div>
        </div>
    )
}

HouseItem.propTypes = {
    src: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    tags: PropTypes.array.isRequired,
    price: PropTypes.number,
    onClick: PropTypes.func
}

export default HouseItem