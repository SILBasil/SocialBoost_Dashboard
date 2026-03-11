import React from 'react';
import prisma from '@/lib/prisma';
import Dashboard from '@/components/Dashboard';

export const dynamic = 'force-dynamic';

async function getOrders() {
    const dbUrl = process.env.DATABASE_URL || '';
    const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@');
    console.log('[Server] Database URL:', maskedUrl);
    console.log('[Server] TIDB_CA_CERT present:', !!process.env.TIDB_CA_CERT);
    try {
        const orders = await prisma.order.findMany({
            orderBy: {
                startDate: 'desc',
            },
        });
        console.log(`[Server] Success: Fetched ${orders.length} orders.`);
        return orders;
    } catch (error: any) {
        console.error('[Server] Database Error:', error.message);
        // Log more details if available
        if (error.code) console.error('[Server] Error Code:', error.code);
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
