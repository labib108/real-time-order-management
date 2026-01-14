import { useMutation } from '@tanstack/react-query'
import { authApi, LoginCredentials, User } from '../api/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export const useLogin = () => {
    const router = useRouter()
    return useMutation({
        mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
        onSuccess: (data) => {
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            router.push('/dashboard')
        },
    })
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')

        if (storedUser && token) {
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])

    const logout = () => {
        authApi.logout()
        setUser(null)
    }

    return { user, isLoading, logout }
}
