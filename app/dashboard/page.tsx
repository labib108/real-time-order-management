export default function DashboardPage() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Orders</h3>
                    <p className="text-2xl font-bold">0</p>
                </div>
                {/* More cards later */}
            </div>
        </div>
    )
}
