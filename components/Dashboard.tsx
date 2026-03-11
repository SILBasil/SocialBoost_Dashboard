'use client';

import React, { useState, useMemo } from 'react';
import {
    AlertCircle, Clock, CheckCircle, MessageCircle, Plus,
    Search, Filter, Activity, Bell, User, ArrowUpRight, Check, X, FileText, Calendar,
    Timer, History, ChevronUp, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddOrderModal from './AddOrderModal';
import EditOrderModal from './EditOrderModal';
import { cn } from '@/lib/utils';

// --- Types ---
interface Order {
    id: string;
    orderId: string;
    clientName: string | null;
    chatLink?: string | null;
    targetLink: string;
    platform: string;
    service: string;
    serviceType?: string | null;
    price?: number | null;
    originalCount?: number | null;
    foreignAmount?: number | null;
    foreignBonus?: number | null;
    foreignDone?: number | null;
    thaiAmount?: number | null;
    thaiBonus?: number | null;
    thaiDone?: number | null;
    totalAmount?: number | null;
    startDate?: string | null;
    endDate?: string | null; // This is the DEADLINE
    timeSpent?: string | null; // We'll use this for ACTUAL COMPLETION DATE
    status: string;
    speed?: string | null;
    notes?: string | null;
}

export default function Dashboard({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
        key: 'startDate',
        direction: 'asc'
    });
    const [isMounted, setIsMounted] = useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const getUrgency = (startDate: string | null | undefined, status: string) => {
        if (status === 'done') return 'done';
        if (!startDate) return 'low';
        const now = new Date();
        const start = new Date(startDate);
        const diffHours = (now.getTime() - start.getTime()) / (1000 * 60 * 60);
        if (diffHours > 48) return 'high';
        if (diffHours > 24) return 'medium';
        return 'low';
    };

    const processedOrders = useMemo(() => {
        let filtered = orders.filter(order => {
            const isTabMatch = activeTab === 'active'
                ? (order.status === 'pending' || order.status === 'working' || order.status === 'waiting')
                : (order.status === 'done');

            const matchSearch = (order.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.targetLink.toLowerCase().includes(searchTerm.toLowerCase());

            const matchStatus = filterStatus === 'all' || order.status === filterStatus;
            return isTabMatch && matchSearch && matchStatus;
        });

        const urgencyWeight: Record<string, number> = { high: 1, medium: 2, low: 3, done: 4 };

        // Use a fresh copy to be safe with React's reactivity and avoid in-place issues
        const sorted = [...filtered].sort((a, b) => {
            // Manual Sorting by key
            if (sortConfig.key) {
                const valA = a[sortConfig.key as keyof Order];
                const valB = b[sortConfig.key as keyof Order];

                // Handle empty values (null, undefined, '') - push to bottom
                if (!valA && valB) return 1;
                if (valA && !valB) return -1;
                if (!valA && !valB) return 0;

                // At this point valA and valB are guaranteed to be truthy
                const sA = valA as string;
                const sB = valB as string;

                // Date comparison logic
                if (sortConfig.key === 'endDate' || sortConfig.key === 'startDate') {
                    const timeA = new Date(sA).getTime();
                    const timeB = new Date(sB).getTime();
                    if (timeA !== timeB) {
                        const diff = timeA - timeB;
                        return sortConfig.direction === 'asc' ? diff : -diff;
                    }
                } else if (sA !== sB) {
                    // Generic string comparison
                    const result = sA < sB ? -1 : 1;
                    return sortConfig.direction === 'asc' ? result : -result;
                }
            }

            // Fallback to Urgency Weight (Stable sort)
            const uA = getUrgency(a.startDate, a.status);
            const uB = getUrgency(b.startDate, b.status);

            if (uA !== uB) return (urgencyWeight[uA] || 99) - (urgencyWeight[uB] || 99);

            // Secondary fallback: Start Date
            const sA = new Date(a.startDate || 0).getTime();
            const sB = new Date(b.startDate || 0).getTime();
            return sB - sA;
        });

        return sorted;
    }, [orders, searchTerm, filterStatus, activeTab, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const stats = useMemo(() => {
        let urgentCount = 0;
        let workingCount = 0;
        let doneCount = 0;
        orders.forEach(order => {
            const urgency = getUrgency(order.startDate, order.status);
            if (urgency === 'high') urgentCount++;
            if (order.status === 'working') workingCount++;
            if (order.status === 'done') doneCount++;
        });
        return { total: orders.length, urgentCount, workingCount, doneCount };
    }, [orders]);

    const handleAddOrder = async (newOrder: any) => {
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder),
            });
            if (response.ok) {
                const savedOrder = await response.json();
                setOrders([savedOrder, ...orders]);
                setIsAddModalOpen(false);
            }
        } catch (error) {
            console.error('Error adding order:', error);
        }
    };

    const updateProgress = async (id: string, updates: Partial<Order>) => {
        try {
            const response = await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (response.ok) {
                setOrders(orders.map(o => o.id === id ? { ...o, ...updates } : o));
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const markAsDone = async (id: string) => {
        try {
            const order = orders.find(o => o.id === id);
            if (!order) return;
            const now = new Date();
            const updates = {
                status: 'done',
                foreignDone: (order.foreignAmount || 0) + (order.foreignBonus || 0),
                thaiDone: (order.thaiAmount || 0) + (order.thaiBonus || 0),
                timeSpent: now.toISOString() // Store actual completion date in timeSpent
            };
            const response = await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (response.ok) {
                setOrders(orders.map(o => o.id === id ? { ...o, ...updates } : o));
            }
        } catch (error) {
            console.error('Error marking order as done:', error);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Nav */}
            <nav className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">BoostFlow OS</h1>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200/50">
                            <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                                <User className="w-4 h-4 text-slate-500" />
                            </div>
                            <span className="text-xs font-black text-slate-600">ผู้ดูแลระบบ</span>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <Bell className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                            {activeTab === 'active' ? 'รายการงานปัจจุบัน' : 'ประวัติงานทั้งหมด'}
                        </h2>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">ระบบจัดการแดชบอร์ดประสิทธิภาพสูง</p>
                    </div>

                    <div className="flex p-1.5 bg-slate-200/50 rounded-2xl border border-slate-200/50 shadow-inner">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={cn("px-8 py-3 text-sm font-black uppercase tracking-wider rounded-xl transition-all", activeTab === 'active' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-500")}
                        >
                            งานที่รันอยู่ ({orders.filter(o => o.status !== 'done').length})
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={cn("px-8 py-3 text-sm font-black uppercase tracking-wider rounded-xl transition-all", activeTab === 'completed' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-500")}
                        >
                            ประวัติงาน ({orders.filter(o => o.status === 'done').length})
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <StatCard label="งานทั้งหมด" value={stats.total} />
                    <StatCard label="งานด่วน" value={stats.urgentCount} color="rose" />
                    <StatCard label="กำลังทำ" value={stats.workingCount} color="indigo" />
                    <StatCard label="เสร็จสิ้น" value={stats.doneCount} color="emerald" />
                </div>

                {/* Table Area */}
                <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="px-4 sm:px-8 py-6 border-b border-slate-100 flex flex-col lg:flex-row gap-4 sm:gap-6 justify-between items-center bg-white">
                        <div className="relative w-full lg:max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="ค้นหาชื่อลูกค้า, ลิงก์, หรือรหัส..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-6 py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-300 outline-none transition-all font-bold"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-600 text-sm font-black uppercase px-6 py-3.5 rounded-2xl outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                                <option value="all">สถานะ: ทั้งหมด</option>
                                <option value="waiting">รอรับยอด/สร้างงาน</option>
                                <option value="pending">ยังไม่เริ่ม</option>
                                <option value="working">กำลังทำ</option>
                                {activeTab === 'completed' && <option value="done">เสร็จแล้ว</option>}
                            </select>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 shrink-0"
                            >
                                <Plus className="w-5 h-5 inline-block mr-2" /> เพิ่มงานใหม่
                            </button>
                        </div>
                    </div>

                    {/* Mobile/Tablet View (Cards) */}
                    <div className="lg:hidden divide-y divide-slate-100">
                        {processedOrders.length > 0 ? (
                            processedOrders.map((order, idx) => (
                                <MobileOrderCard
                                    key={order.id}
                                    order={order}
                                    index={idx + 1}
                                    urgency={getUrgency(order.startDate, order.status)}
                                    onUpdate={updateProgress}
                                    onMarkDone={markAsDone}
                                    onEdit={() => { setSelectedOrder(order); setIsEditModalOpen(true); }}
                                />
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">ไม่พบรายการงาน</p>
                            </div>
                        )}
                    </div>

                    {/* Desktop View (Table) */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#FAFBFD] text-slate-400 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] w-12 text-center">No.</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] w-12"></th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">ลูกค้า / แชท</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">ลิงก์เป้าหมาย</th>
                                    <th
                                        className="px-8 py-5 font-black uppercase tracking-widest text-[10px] cursor-pointer hover:text-slate-900 group/sort"
                                        onClick={() => requestSort('startDate')}
                                    >
                                        <div className="flex items-center gap-1">
                                            ระยะเวลาแผนงาน
                                            <div className="flex flex-col">
                                                <ChevronUp className={cn("w-2.5 h-2.5 -mb-0.5", sortConfig.key === 'startDate' && sortConfig.direction === 'asc' ? "text-indigo-600" : "text-slate-300")} />
                                                <ChevronDown className={cn("w-2.5 h-2.5", sortConfig.key === 'startDate' && sortConfig.direction === 'desc' ? "text-indigo-600" : "text-slate-300")} />
                                            </div>
                                        </div>
                                    </th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] min-w-[200px]">ความคืบหน้า (ต่างชาติ)</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] min-w-[200px]">ความคืบหน้า (ไทย)</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {processedOrders.map((order, index) => (
                                    <OrderRow
                                        key={order.id}
                                        index={index + 1}
                                        order={order}
                                        urgency={getUrgency(order.startDate, order.status)}
                                        onUpdate={updateProgress}
                                        onMarkDone={markAsDone}
                                        onEdit={() => { setSelectedOrder(order); setIsEditModalOpen(true); }}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {isAddModalOpen && <AddOrderModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddOrder} />}
                {isEditModalOpen && <EditOrderModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={updateProgress} order={selectedOrder} />}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ label, value, color = 'slate' }: { label: string, value: number, color?: string }) {
    const colorMap: any = {
        rose: 'text-rose-500 bg-rose-50 border-rose-100',
        indigo: 'text-indigo-500 bg-indigo-50 border-indigo-100',
        emerald: 'text-emerald-500 bg-emerald-50 border-emerald-100',
        slate: 'text-slate-500 bg-slate-50 border-slate-200'
    };
    return (
        <div className="bg-white p-5 sm:p-8 rounded-[24px] sm:rounded-[28px] border border-slate-200/60 shadow-sm transition-transform hover:scale-[1.02] duration-300">
            <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-2">{label}</p>
            <p className={cn("text-2xl sm:text-4xl font-black tracking-tighter", colorMap[color].split(' ')[0])}>{value.toLocaleString()}</p>
        </div>
    );
}

function MobileOrderCard({ order, index, urgency, onUpdate, onMarkDone, onEdit }: any) {
    const fTotal = (order.foreignAmount || 0) + (order.foreignBonus || 0);
    const fPct = fTotal > 0 ? Math.round(((order.foreignDone || 0) / fTotal) * 100) : 0;
    const tTotal = (order.thaiAmount || 0) + (order.thaiBonus || 0);
    const tPct = tTotal > 0 ? Math.round(((order.thaiDone || 0) / tTotal) * 100) : 0;

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    };

    return (
        <div className="p-5 space-y-5 bg-white sm:p-6">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-300 italic">#{String(index).padStart(2, '0')}</span>
                    <div>
                        <p className="font-black text-slate-900 text-sm leading-tight">{order.clientName || 'ระบุชื่อลูกค้า'}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            {order.status === 'waiting' && <span className="text-[9px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded flex items-center gap-1">รอรับยอด ⏳</span>}
                            {order.speed === 'urgent' && <span className="text-[9px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded flex items-center gap-1">งานด่วน 🔥</span>}
                            {order.speed === 'drip' && <span className="text-[9px] font-black bg-amber-100 text-amber-600 px-2 py-0.5 rounded flex items-center gap-1">ทยอย 💧</span>}
                            <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">{order.platform}</span>
                            <span className="text-[9px] font-mono font-bold text-slate-300">#{order.orderId.slice(-8)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {urgency === 'high' && <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse" />}
                    {urgency === 'done' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                    <button onClick={onEdit} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-lg">
                        <FileText className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">เริ่มเมื่อ</p>
                    <p className="text-[10px] font-bold text-slate-600 flex items-center gap-1.5"><History className="w-3 h-3" /> {formatDate(order.startDate)}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">กำหนดส่ง</p>
                    <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {formatDate(order.endDate)}</p>
                </div>
            </div>

            <div className="space-y-4">
                {fTotal > 0 && (
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                            <span>ต่างชาติ ({fPct}%)</span>
                            <span>{order.foreignDone || 0} / {fTotal}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${fPct}%` }} className="h-full bg-slate-900 rounded-full" />
                        </div>
                    </div>
                )}
                {tTotal > 0 && (
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-black uppercase text-emerald-500">
                            <span>คนไทย ({tPct}%)</span>
                            <span>{order.thaiDone || 0} / {tTotal}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${tPct}%` }} className="h-full bg-emerald-500 rounded-full" />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                <a href={order.targetLink} target="_blank" className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2">
                    ลิงก์งาน <ArrowUpRight className="w-3 h-3" />
                </a>
                {order.status !== 'done' && (
                    <button
                        onClick={() => onMarkDone(order.id)}
                        className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                    >
                        จัดส่งงาน <Check className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    );
}

function OrderRow({ order, index, urgency, onUpdate, onMarkDone, onEdit }: any) {
    const fTotal = (order.foreignAmount || 0) + (order.foreignBonus || 0);
    const fPct = fTotal > 0 ? Math.round(((order.foreignDone || 0) / fTotal) * 100) : 0;
    const tTotal = (order.thaiAmount || 0) + (order.thaiBonus || 0);
    const tPct = tTotal > 0 ? Math.round(((order.thaiDone || 0) / tTotal) * 100) : 0;

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    };

    const timelineSummary = useMemo(() => {
        if (order.status !== 'done' || !order.endDate || !order.timeSpent) return null;

        const deadline = new Date(order.endDate);
        const actual = new Date(order.timeSpent);

        // Reset hours to compare clear days
        deadline.setHours(0, 0, 0, 0);
        actual.setHours(0, 0, 0, 0);

        const diffTime = deadline.getTime() - actual.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            return { text: `เสร็จเร็วว่ากำหนด ${diffDays} วัน`, color: 'text-emerald-500' };
        } else if (diffDays < 0) {
            return { text: `ช้ากว่ากำหนด ${Math.abs(diffDays)} วัน`, color: 'text-rose-500' };
        } else {
            return { text: 'เสร็จตรงตามกำหนด', color: 'text-slate-500' };
        }
    }, [order.status, order.endDate, order.timeSpent]);

    return (
        <tr className="group hover:bg-slate-50/70 transition-colors">
            <td className="px-8 py-5 text-center font-black text-slate-300 text-sm italic">
                {String(index).padStart(2, '0')}
            </td>
            <td className="px-8 py-5 text-center">
                {urgency === 'high' && <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse inline-block" />}
                {urgency === 'medium' && <div className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-sm shadow-amber-200" />}
                {urgency === 'low' && <div className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" />}
                {urgency === 'done' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-200" />}
            </td>
            <td className="px-8 py-5">
                <p className="font-black text-slate-900 text-sm mb-1.5 leading-none">{order.clientName || 'ระบุชื่อลูกค้า'}</p>
                {order.chatLink && <a href={order.chatLink} target="_blank" className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" /> เปิดแชท
                </a>}
            </td>
            <td className="px-8 py-5">
                <a href={order.targetLink} target="_blank" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-xs">
                    <span className="max-w-[180px] truncate">{order.targetLink.replace('https://', '')}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {order.status === 'waiting' && <span className="text-[9px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded tracking-wider flex items-center gap-1">รอรับยอด ⏳</span>}
                    {order.speed === 'urgent' && <span className="text-[9px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded tracking-wider flex items-center gap-1">งานด่วน 🔥</span>}
                    {order.speed === 'drip' && <span className="text-[9px] font-black bg-amber-100 text-amber-600 px-2 py-0.5 rounded tracking-wider flex items-center gap-1">ทยอย 💧</span>}
                    <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">{order.platform}</span>
                    <span className="text-[9px] font-mono font-bold text-slate-300">#{order.orderId.slice(-8)}</span>
                </div>
            </td>
            <td className="px-8 py-5">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                        <History className="w-3 h-3" /> เริ่ม: {formatDate(order.startDate)}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-rose-400">
                        <Calendar className="w-3 h-3" /> ส่ง: {formatDate(order.endDate)}
                    </div>
                </div>
            </td>
            <td className="px-8 py-5">
                {fTotal > 0 ? (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            <span>ต่างชาติ (Foreign)</span>
                            <span className="text-slate-900 text-xs">{fPct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${fPct}%` }} className="h-full bg-slate-900 rounded-full" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                defaultValue={order.foreignDone || 0}
                                onBlur={(e) => onUpdate(order.id, { foreignDone: parseInt(e.target.value) || 0 })}
                                className="w-14 px-1.5 py-1 bg-slate-50 border-none rounded-lg text-xs font-black outline-none focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all text-center"
                            />
                            <span className="text-[11px] font-bold text-slate-300">/ {fTotal.toLocaleString()}</span>
                        </div>
                    </div>
                ) : <span className="text-slate-200 font-bold">—</span>}
            </td>
            <td className="px-8 py-5">
                {tTotal > 0 ? (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-emerald-500 tracking-wider">
                            <span>คนไทย (Thai)</span>
                            <span className="text-slate-900 text-xs">{tPct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${tPct}%` }} className="h-full bg-emerald-500 rounded-full" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                defaultValue={order.thaiDone || 0}
                                onBlur={(e) => onUpdate(order.id, { thaiDone: parseInt(e.target.value) || 0 })}
                                className="w-14 px-1.5 py-1 bg-emerald-50 border-none rounded-lg text-xs font-black text-emerald-600 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all text-center"
                            />
                            <span className="text-[11px] font-bold text-slate-300">/ {tTotal.toLocaleString()}</span>
                        </div>
                    </div>
                ) : <span className="text-slate-200 font-bold">—</span>}
            </td>
            <td className="px-8 py-5 text-right">
                <div className="flex items-center justify-end gap-3">
                    <button onClick={onEdit} className="p-2.5 text-slate-300 hover:text-slate-900 transition-all bg-slate-50 hover:bg-slate-100 rounded-xl" title="แก้ไขข้อมูล">
                        <FileText className="w-5 h-5" />
                    </button>
                    {order.status !== 'done' ? (
                        <button onClick={() => onMarkDone(order.id)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md shadow-slate-200">
                            ปิดงาน
                        </button>
                    ) : (
                        <div className="flex flex-col items-end gap-1.5">
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg shadow-sm">
                                <CheckCircle className="w-3 h-3" />
                                <span className="text-[10px] font-black uppercase tracking-wider">สำเร็จแล้ว</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">
                                    เสร็จจริง: {formatDate(order.timeSpent)}
                                </span>
                                {timelineSummary && (
                                    <span className={cn("text-[9px] font-black uppercase italic tracking-tight", timelineSummary.color)}>
                                        {timelineSummary.text}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
}

