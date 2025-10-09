'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Clock, Truck, Package } from 'lucide-react'

export default function OrderTrackingPage() {
    const [orderId, setOrderId] = useState('')
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(false)

    const trackOrder = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        setTimeout(() => {
            setOrder({
                id: orderId,
                status: 'shipped',
                estimatedDelivery: '2024-01-15',
                trackingNumber: 'TRK123456789',
                items: [
                    { name: 'DJI Mavic 3 Pro', quantity: 1, price: 1599 }
                ],
                timeline: [
                    { status: 'ordered', date: '2024-01-10', completed: true },
                    { status: 'processing', date: '2024-01-11', completed: true },
                    { status: 'shipped', date: '2024-01-12', completed: true },
                    { status: 'delivered', date: '2024-01-15', completed: false }
                ]
            })
            setLoading(false)
        }, 1000)
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'ordered':
                return <CheckCircle className="h-5 w-5 text-green-500" />
            case 'processing':
                return <Clock className="h-5 w-5 text-blue-500" />
            case 'shipped':
                return <Truck className="h-5 w-5 text-orange-500" />
            case 'delivered':
                return <Package className="h-5 w-5 text-green-500" />
            default:
                return <Clock className="h-5 w-5 text-gray-400" />
        }
    }

    const getStatusColor = (status, completed) => {
        if (completed) return 'text-green-600'
        if (status === 'shipped') return 'text-orange-600'
        return 'text-gray-400'
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

            {/* Order Tracking Form */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Enter Order Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={trackOrder} className="flex gap-4">
                        <Input
                            placeholder="Order ID"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            required
                            className="flex-1"
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Tracking...' : 'Track Order'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Order Details */}
            {order && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.timeline.map((step, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <div className={`flex-shrink-0 ${getStatusColor(step.status, step.completed)}`}>
                                            {getStatusIcon(step.status)}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-medium capitalize ${getStatusColor(step.status, step.completed)}`}>
                                                {step.status}
                                            </p>
                                            <p className="text-sm text-gray-500">{step.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Order ID</p>
                                <p className="font-medium">{order.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tracking Number</p>
                                <p className="font-medium">{order.trackingNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Estimated Delivery</p>
                                <p className="font-medium">{order.estimatedDelivery}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p className="font-medium capitalize text-orange-600">{order.status}</p>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-500 mb-2">Items</p>
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span>{item.name} x{item.quantity}</span>
                                        <span>${item.price}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}


