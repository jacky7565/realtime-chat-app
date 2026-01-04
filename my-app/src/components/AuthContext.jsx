import axios from "axios"
import { useState } from "react"
import { createContext, useContext, useEffect } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true);
    let API = import.meta.env.VITE_API_BASE_URL;
    useEffect(() => {
        const fetchUser = async () => {
            try {
                let userData = await axios.get(`${API}/current-user`, { withCredentials: true })
                // console.log(userData.data.data)
                setUserData(userData.data.data)
            }
            catch (error) {
                 setUserData(null);
                console.log(error)
            }
            finally{
                setLoading(false);
            }
        }
        fetchUser()

    }, [])
    return (
        <AuthContext.Provider value={{ userData,setUserData,loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const userAuth = () => {
    return useContext(AuthContext)
}
