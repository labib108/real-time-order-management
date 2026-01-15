'use client'

import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { OrderStatus } from "../types"
import { Filter, Search, X } from "lucide-react"

type OrderFiltersProps = {
    search?: string
    status?: string
    startDate?: string
    endDate?: string
    onSearchChange: (value: string) => void
    onStatusChange: (status: string) => void
    onDateChange: (start?: string, end?: string) => void
    onReset: () => void
}

const statusOptions: { label: string, value: string | 'all' }[] = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
]

export function OrderFilters({
    search,
    status,
    startDate,
    endDate,
    onSearchChange,
    onStatusChange,
    onDateChange,
    onReset
}: OrderFiltersProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by ID or customer..."
                        className="pl-8"
                        value={search || ''}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            {statusOptions.find(o => o.value === status)?.label || 'Status'}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[200px]">
                        {statusOptions.map((opt) => (
                            <DropdownMenuItem
                                key={opt.value}
                                onClick={() => onStatusChange(opt.value)}
                                className={status === opt.value ? "bg-accent" : ""}
                            >
                                {opt.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {(search || (status && status !== 'all') || startDate || endDate) && (
                    <Button variant="ghost" onClick={onReset} className="h-8 px-2 lg:px-3">
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <Input
                    type="date"
                    className="w-[150px]"
                    value={startDate || ''}
                    onChange={(e) => onDateChange(e.target.value, endDate)}
                />
                <span className="text-muted-foreground">to</span>
                <Input
                    type="date"
                    className="w-[150px]"
                    value={endDate || ''}
                    onChange={(e) => onDateChange(startDate, e.target.value)}
                />
            </div>
        </div>
    )
}
