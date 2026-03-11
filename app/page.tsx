import React from 'react';
import prisma from '@/lib/prisma';
import Dashboard from '@/components/Dashboard';

export const dynamic = 'force-dynamic';

async function getOrders() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: {
                startDate: 'desc',
            },
        });
        console.log(`[Server] Fetched ${orders.length} orders from database.`);
        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}



export default async function Page() {
    const initialOrders = await getOrders();

    return (
        <main className="min-h-screen bg-[#f8fafc]">
            <Dashboard initialOrders={JSON.parse(JSON.stringify(initialOrders))} />
        </main>
    );
}
