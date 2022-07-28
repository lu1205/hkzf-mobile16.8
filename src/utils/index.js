import axios from "axios";

export const getCurrentCity = () => {

    const localCity = JSON.parse(localStorage.getItem('hkzf_city'))

    if (!localCity) {
        return new Promise((resolve, reject) => {
            const myCity = new window.BMapGL.LocalCity();
            myCity.get(async (position) => {
                try {
                    let curCity = await axios.get(`http://127.0.0.1:8080/area/info?name=${position.name}`)
                    localStorage.setItem('hkzf_city', JSON.stringify(curCity.data.body))
                    resolve(curCity.data.body)
                } catch (e) {
                    reject(e)
                }
            });
        })
    } else {
        return Promise.resolve(localCity)
    }
}