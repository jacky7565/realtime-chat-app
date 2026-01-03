import axios from "axios"
import { useState } from "react"
import { createContext, useContext, useEffect } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null)
    let API = import.meta.env.VITE_API_BASE_URL;
    useEffect(() => {
        const fetchUser = async () => {
            try {
                let userData = await axios.get(`${API}/current-user`, { withCredentials: true })
                // console.log(userData.data.data)
                setUserData(userData.data.data)
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchUser()

    }, [])
    return (
        <AuthContext.Provider value={{ userData }}>
            {children}
        </AuthContext.Provider>
    )
}

export const userAuth = () => {
    return useContext(AuthContext)
}
