import { useState } from 'react'


const useToken = () => {

    const getToken = () => {
        const tokenString = localStorage.getItem('accessToken')
        return JSON.parse(tokenString)
    }

    const saveToken = (userToken) => {
        localStorage.setItem('accessToken', JSON.stringify(userToken))
        setToken(userToken)
    }

    const [token, setToken] = useState(getToken())

    return {
        token,
        setToken: saveToken
    }
}

export default useToken