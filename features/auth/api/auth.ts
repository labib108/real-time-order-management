import axios from 'axios'
import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginCredentials = z.infer<typeof loginSchema>

export type User = {
    id: string
    email: string
    role: string
}

export type AuthResponse = {
    user: User
    token: string
}

const api = axios.create({
    baseURL: '/api',
})

// Add token to requests if saved
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials)
        return data
    },
    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // creating a slight delay to allow UI to update if needed or just straight redirect
        window.location.href = '/login'
    },
}
