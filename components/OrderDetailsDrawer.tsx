'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, User, Link as LinkIcon, MessageCircle, Hash, Globe, Activity, Zap, FileText, DollarSign, Calendar, Clock, ArrowUpRight, Plus, History, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OrderDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, updates: any) => Promise<void>;
    order: any;
}

export default function OrderDetailsDrawer({ isOpen, onClose, onSave, order }: OrderDetailsDrawerProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'financials'>('overview');
    const [formData, setFormData] = useState<any>(null);
    const [boosts, setBoosts] = useState<any[]>([]);
    const [isLoadingBoosts, setIsLoadingBoosts] = useState(false);

    // New Boost Form
    const [newBoostAmount, setNewBoostAmount] = useState('');
    const [newBoostCost, setNewBoostCost] = useState('');
    const [newBoostNote, setNewBoostNote] = useState('');
    const [isSubmittingBoost, setIsSubmittingBoost] = useState(false);

    useEffect(() => {
        if (order) {
            setFormData({
                clientName: order.clientName || '',
                chatLink: order.chatLink || '',
                targetLink: order.targetLink || '',
                platform: order.platform || '',
                service: order.service || '',
                serviceType: order.serviceType || '',
                price: order.price || 0,
                originalCount: order.originalCount || 0,
                foreignAmount: order.foreignAmount || 0,
                foreignBonus: order.foreignBonus || 0,
                foreignDone: order.foreignDone || 0,
                thaiAmount: order.thaiAmount || 0,
                thaiBonus: order.thaiBonus || 0,
                thaiDone: order.thaiDone || 0,
                totalAmount: order.totalAmount || 0,
                status: order.status || '',
                speed: order.speed || 'normal',
                notes: order.notes || '',
                startDate: order.startDate ? new Date(order.startDate).toISOString().split('T')[0] : '',
                endDate: order.endDate ? new Date(order.endDate).toISOString().split('T')[0] : '',
                providerLink: order.providerLink || '',
                targetPlatformAmount: order.targetPlatformAmount || '',
                feePercentage: order.feePercentage || 13.0,
            });

            if (isOpen) {
                fetchBoosts();
            }
        }
    }, [order, isOpen]);

    const fetchBoosts = async () => {
        setIsLoadingBoosts(true);
        try {
            const res = await fetch(`/api/orders/${order.id}/boosts`);
            if (res.ok) {
                const data = await res.json();
                setBoosts(data);
            }
        } catch (error) {
            console.error("Error fetching boosts", error);
        } finally {
            setIsLoadingBoosts(false);
        }
    };

    if (!formData || !order) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(order.id, formData);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: (type === 'number' || name === 'feePercentage') ? parseFloat(value) || 0 : value
        }));
    };

    const handleAddBoost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBoostAmount || !newBoostCost) return;
        setIsSubmittingBoost(true);
        try {
            const res = await fetch(`/api/orders/${order.id}/boosts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: parseInt(newBoostAmount),
                    cost: parseFloat(newBoostCost),
                    note: newBoostNote
                })
            });
            if (res.ok) {
                const newBoost = await res.json();
                setBoosts([newBoost, ...boosts]);
                setNewBoostAmount('');
                setNewBoostCost('');
                setNewBoostNote('');
                // Since totalCost changed, we optionally might want to refresh the main order in Dashboard.
                // For simplicity, we assume the user will see it when they close/reopen or refresh.
            }
        } catch (err) {
            console.error("Error adding boost:", err);
        } finally {
            setIsSubmittingBoost(false);
        }
    };

    const currentFeeAmount = order.feeAmount || 0;
    const currentNetRevenue = order.netRevenue || 0;
    const currentTotalCost = order.totalCost || 0;
    const currentProfit = order.profit || 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
                    {/* Backdrop click to close */}
                    <div className="absolute inset-0" onClick={onClose} />

                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col z-10 border-l border-slate-200"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <Hash className="w-5 h-5 text-indigo-500" />
                                    จัดการออเดอร์
                                </h3>
                                <div className="flex items-center gap-2 mt-1 shrink-0 flex-wrap">
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{order.orderId}</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                    <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase tracking-wider">{order.platform}</span>
                                    <span className={cn("text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider",
                                        order.speed === 'urgent' ? "bg-rose-50 text-rose-600" :
                                            order.speed === 'drip' ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500"
                                    )}>
                                        {order.speed === 'urgent' ? 'งานด่วน' : order.speed === 'drip' ? 'ทยอยทำ' : 'ปกติ'}
                                    </span>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex px-6 border-b border-slate-100 shrink-0 overflow-x-auto hide-scrollbar">
                            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText className="w-4 h-4" />} label="ข้อมูลสถิติ" />
                            <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History className="w-4 h-4" />} label="ประวัติการปั๊ม" />
                            <TabButton active={activeTab === 'financials'} onClick={() => setActiveTab('financials')} icon={<DollarSign className="w-4 h-4" />} label="สรุปการเงิน" />
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">

                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <form id="edit-form" onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {/* Links Section */}
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2 flex items-center gap-1.5"><LinkIcon className="w-3.5 h-3.5" /> ลิงก์ช่องทางต่างๆ</h4>
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-bold text-slate-600 mb-1.5">Link ปลายทาง (ลูกค้า)</label>
                                            <div className="flex gap-2">
                                                <input name="targetLink" value={formData.targetLink} onChange={handleChange} className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold" />
                                                <a href={formData.targetLink} target="_blank" className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 flex items-center justify-center transition-colors">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-bold text-slate-600 mb-1.5">Link เว็บปั๊ม (ผู้ให้บริการ)</label>
                                            <div className="flex gap-2">
                                                <input name="providerLink" value={formData.providerLink} onChange={handleChange} placeholder="วางลิงก์เว็บปั๊มที่นี่..." className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                                                {formData.providerLink && (
                                                    <a href={formData.providerLink} target="_blank" className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 flex items-center justify-center transition-colors">
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] sm:text-xs font-bold text-slate-600 mb-1.5">ยอดเดิม (Start Count)</label>
                                                <input type="number" name="originalCount" value={formData.originalCount} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold text-slate-600" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] sm:text-xs font-bold text-slate-600 mb-1.5 text-indigo-600">จำนวนเป้าหมายที่ปั๊ม (Target)</label>
                                                <input type="number" name="targetPlatformAmount" value={formData.targetPlatformAmount} onChange={handleChange} className="w-full px-4 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl text-sm outline-none font-black text-indigo-600 focus:bg-indigo-50" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Client & Status */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                                            <div>
                                                <label className="block text-[10px] sm:text-xs font-bold text-slate-600 mb-1.5">ชื่อลูกค้า</label>
                                                <input name="clientName" value={formData.clientName} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold text-slate-700" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] sm:text-xs font-bold text-slate-600 mb-1.5">บริการ</label>
                                                <input name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold text-slate-700" />
                                            </div>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                                            <div>
                                                <label className="block text-[10px] sm:text-xs font-bold text-slate-600 mb-1.5">สถานะงาน</label>
                                                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold">
                                                    <option value="waiting">รอรับยอด</option>
                                                    <option value="pending">รอเริ่มทำ</option>
                                                    <option value="working">กำลังทำ</option>
                                                    <option value="completed">เสร็จ/รอส่ง</option>
                                                    <option value="done">ส่งงานแล้ว ✓</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] sm:text-xs font-bold text-slate-600 mb-1.5">แบบรับงาน</label>
                                                <select name="speed" value={formData.speed} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold">
                                                    <option value="normal">ปกติ</option>
                                                    <option value="urgent">แอดด่วน</option>
                                                    <option value="drip">ทยอยทำ</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sub Items (Thai / Foreign) */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">เป้าหมาย (Foreign)</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-[9px] font-bold text-slate-400 mb-1">ยอดสั่ง</label>
                                                    <input type="number" name="foreignAmount" value={formData.foreignAmount} onChange={handleChange} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-[9px] font-bold text-slate-400 mb-1">ทำไปแล้ว</label>
                                                    <input type="number" name="foreignDone" value={formData.foreignDone} onChange={handleChange} className="w-full px-2 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-black text-indigo-600 outline-none" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">เป้าหมาย (Thai)</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-[9px] font-bold text-slate-400 mb-1">ยอดสั่ง</label>
                                                    <input type="number" name="thaiAmount" value={formData.thaiAmount} onChange={handleChange} className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-[9px] font-bold text-slate-400 mb-1">ทำไปแล้ว</label>
                                                    <input type="number" name="thaiDone" value={formData.thaiDone} onChange={handleChange} className="w-full px-2 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-black text-emerald-600 outline-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-600 mb-1.5">หมายเหตุลับ</label>
                                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-slate-100" placeholder="ใส่โน้ตส่วนตัวที่นี่..." />
                                    </div>
                                </form>
                            )}

                            {/* HISTORY TAB */}
                            {activeTab === 'history' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {/* Add History Form */}
                                    <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.1)]">
                                        <h4 className="text-xs font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <div className="p-1 px-2 rounded-md bg-indigo-100 text-indigo-600 text-[10px] uppercase tracking-widest">New</div>
                                            บันทึกประวัติการปั๊มใหม่
                                        </h4>
                                        <form onSubmit={handleAddBoost} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5">จำนวนที่ปั๊ม (ยอด)</label>
                                                    <input required type="number" value={newBoostAmount} onChange={e => setNewBoostAmount(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-indigo-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 font-black" placeholder="เช่น 500" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5">ต้นทุน (บาท)</label>
                                                    <input required type="number" step="0.01" value={newBoostCost} onChange={e => setNewBoostCost(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-rose-500 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-100 font-black" placeholder="เช่น 25.5" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 mb-1.5">บันทึกย่อ / หมายเหตุ (ถ้ามี)</label>
                                                <input value={newBoostNote} onChange={e => setNewBoostNote(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" placeholder="เช่น ทยอยปั๊มรอบแรก" />
                                            </div>
                                            <button type="submit" disabled={isSubmittingBoost} className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black tracking-widest uppercase hover:bg-slate-800 transition-all flex justify-center items-center gap-2 disabled:opacity-50">
                                                {isSubmittingBoost ? "กำลังบันทึก..." : <><Plus className="w-4 h-4" /> บันทึกประวัติ</>}
                                            </button>
                                        </form>
                                    </div>

                                    {/* History Timeline */}
                                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-1">
                                        <div className="p-4 border-b border-slate-50">
                                            <h4 className="text-xs font-black text-slate-900">ประวัติย้อนหลัง</h4>
                                        </div>
                                        <div className="p-4 space-y-4">
                                            {isLoadingBoosts ? (
                                                <p className="text-center text-xs text-slate-400 font-bold py-4">กำลังโหลด...</p>
                                            ) : boosts.length === 0 ? (
                                                <div className="py-8 text-center text-slate-400">
                                                    <History className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                                    <p className="text-xs font-bold">ยังไม่มีประวัติการปั๊ม</p>
                                                </div>
                                            ) : (
                                                <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                                                    {boosts.map((b, i) => (
                                                        <div key={b.id} className="relative pl-6">
                                                            <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-white" />
                                                            <div className="flex justify-between items-start mb-1">
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                    {new Date(b.createdAt).toLocaleDateString('th-TH')} {new Date(b.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">+{b.amount.toLocaleString()} ยอด</span>
                                                            </div>
                                                            <div className="flex justify-between items-end">
                                                                <p className="text-sm font-bold text-slate-700">{b.note || 'ไม่มีหมายเหตุ'}</p>
                                                                <p className="text-[11px] font-black text-rose-500">ต้นทุน: ฿{b.cost.toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* FINANCIALS TAB */}
                            {activeTab === 'financials' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
                                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">ยอดขายสุทธิ (Price)</p>
                                                <div className="flex gap-2 items-center mt-1">
                                                    <input form="edit-form" type="number" name="price" value={formData.price} onChange={handleChange} className="w-32 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-lg font-black text-slate-900 outline-none focus:ring-2 focus:ring-slate-200" />
                                                    <span className="text-sm font-bold text-slate-400">บาท</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 pl-1">หักค่าธรรมเนียมแพลตฟอร์ม</p>
                                                <div className="flex gap-2 items-center">
                                                    <input form="edit-form" type="number" step="0.1" name="feePercentage" value={formData.feePercentage} onChange={handleChange} className="w-20 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-lg text-sm font-black text-rose-600 outline-none text-center" />
                                                    <span className="text-xs font-black text-rose-400">%</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-rose-500">-฿{currentFeeAmount.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 bg-emerald-50/30 p-4 rounded-xl">
                                            <p className="text-xs font-black text-slate-700 uppercase tracking-widest">รับสุทธิ (Net Revenue)</p>
                                            <p className="text-lg font-black text-slate-900">฿{currentNetRevenue.toLocaleString()}</p>
                                        </div>

                                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-rose-100 rounded-lg"><Zap className="w-3 h-3 text-rose-500" /></div>
                                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">ต้นทุนการปั๊มรวม</p>
                                            </div>
                                            <p className="text-sm font-black text-rose-500">-฿{currentTotalCost.toLocaleString()}</p>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <p className="text-sm font-black text-indigo-600 uppercase tracking-widest px-4">กำไรสุทธิ (Net Profit)</p>
                                            <p className="text-3xl font-black text-indigo-600">฿{currentProfit.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 items-start">
                                        <Activity className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-amber-700 leading-relaxed font-bold">
                                            กำไรและต้นทุนจะถูกคำนวณอัตโนมัติจากใบเสนอราคาและ <strong>ประวัติการปั๊ม (Boost History)</strong>. หากต้องการแก้ไขต้นทุน โปรดเพิ่มประวัติใหม่หรือแก้ไขที่แท็บ History
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer - Save button for Overview / General edits */}
                        <div className="p-6 bg-white border-t border-slate-100 flex gap-3 shrink-0">
                            <button onClick={onClose} type="button" className="px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">ยกเลิก</button>
                            <button form="edit-form" type="submit" className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl text-sm font-black tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" /> บันทึกสถิติ
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-5 py-4 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border-b-2 whitespace-nowrap",
                active ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200"
            )}
        >
            {icon} {label}
        </button>
    )
}
