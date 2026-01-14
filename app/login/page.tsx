import { LoginForm } from '@/features/auth/components/login-form'
import Image from 'next/image'

export default function LoginPage() {
    return (
        <div className="w-full h-screen flex">
            {/* Left Side: Image */}
            <div className="hidden lg:flex w-1/2 relative bg-black">
                <Image
                    src="/image/login/login-side-image.jpg"
                    alt="Login Visual"
                    fill
                    className="object-cover opacity-80"
                    priority
                />
                <div className="absolute top-10 left-10 z-10 text-white">
                    <h1 className="text-4xl font-bold">Order Manager</h1>
                    <p className="text-lg opacity-80 mt-2">Manage your business in real-time.</p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
                <div className="w-full max-w-md">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}
