import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children  }) => {
    const [user, setUser] = useState(() => {
        // get data user localstroage jika sudah login
        const saved = localStorage.getItem('user')
        return saved ? JSON.parse(saved) : null
    })

    const login = (UsetData, token) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(UsetData))
        setUser(UsetData)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    )
}

// custom hook komponen
export const useAuth = () => useContext(AuthContext)