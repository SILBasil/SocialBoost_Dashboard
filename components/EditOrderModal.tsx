'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, User, Link as LinkIcon, MessageCircle, Hash, Globe, MousePointer2, FileText, DollarSign, Calendar, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, updates: any) => Promise<void>;
    order: any;
}

export default function EditOrderModal({ isOpen, onClose, onSave, order }: EditOrderModalProps) {
    const [formData, setFormData] = useState<any>(null);

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
            });
        }
    }, [order]);

    if (!formData) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(order.id, formData);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[95vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-5 sm:px-8 py-5 sm:py-6 bg-indigo-600 flex items-center justify-between text-white">
                            <div>
                                <h3 className="text-lg sm:text-xl font-black">แก้ไขข้อมูลออเดอร์</h3>
                                <p className="text-indigo-100 text-[10px] sm:text-xs mt-1">Order ID: {order.orderId}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5 sm:w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">ข้อมูลพื้นฐาน</h4>

                                    <div>
                                        <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" /> ชื่อลูกค้า
                                        </label>
                                        <input
                                            name="clientName"
                                            value={formData.clientName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                            <MessageCircle className="w-3.5 h-3.5" /> Link แชท
                                        </label>
                                        <input
                                            name="chatLink"
                                            value={formData.chatLink}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                            <LinkIcon className="w-3.5 h-3.5" /> Link ปลายทาง
                                        </label>
                                        <input
                                            name="targetLink"
                                            value={formData.targetLink}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5">แพลตฟอร์ม</label>
                                            <input name="platform" value={formData.platform} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5">บริการ</label>
                                            <input name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold" />
                                        </div>
                                    </div>
                                </div>

                                {/* Numbers */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">ตัวเลขและสถานะ</h4>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                                <DollarSign className="w-3.5 h-3.5" /> ราคา
                                            </label>
                                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5">ยอดเดิม</label>
                                            <input type="number" name="originalCount" value={formData.originalCount} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                                <Activity className="w-3.5 h-3.5" /> สถานะงาน
                                            </label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                                            >
                                                <option value="waiting">รับยอด/รอจ้างงาน (Waiting)</option>
                                                <option value="pending">รอดำเนินการ (Pending)</option>
                                                <option value="working">กำลังดำเนินการ (Working)</option>
                                                <option value="done">เสร็จสิ้น (Done)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                                <Zap className="w-3.5 h-3.5 text-amber-500" /> แบบรับงาน
                                            </label>
                                            <select
                                                name="speed"
                                                value={formData.speed}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold"
                                            >
                                                <option value="normal">ปกติ (Normal)</option>
                                                <option value="urgent">แอดด่วน (Urgent)</option>
                                                <option value="drip">ทยอยทำ (Drip-feed)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" /> วันที่เริ่ม
                                            </label>
                                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5 text-rose-500">
                                                <Calendar className="w-3.5 h-3.5" /> กำหนดส่ง
                                            </label>
                                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full px-4 py-2 bg-rose-50/30 border border-rose-100 rounded-xl text-sm outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400 font-bold" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Detailed Counts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">งานต่างชาติ (Foreign)</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 mb-1">ยอดสั่ง</label>
                                            <input type="number" name="foreignAmount" value={formData.foreignAmount} onChange={handleChange} className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 mb-1">แถม</label>
                                            <input type="number" name="foreignBonus" value={formData.foreignBonus} onChange={handleChange} className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 mb-1">ทำไปแล้ว</label>
                                            <input type="number" name="foreignDone" value={formData.foreignDone} onChange={handleChange} className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-indigo-600 outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">งานไทย (Thai)</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 mb-1">ยอดสั่ง</label>
                                            <input type="number" name="thaiAmount" value={formData.thaiAmount} onChange={handleChange} className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 mb-1">แถม</label>
                                            <input type="number" name="thaiBonus" value={formData.thaiBonus} onChange={handleChange} className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 mb-1">ทำไปแล้ว</label>
                                            <input type="number" name="thaiDone" value={formData.thaiDone} onChange={handleChange} className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-emerald-600 outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">หมายเหตุ (Notes)</label>
                                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="px-5 sm:px-8 py-5 sm:py-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                            <button onClick={onClose} type="button" className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all">ยกเลิก</button>
                            <button onClick={handleSubmit} type="submit" className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" /> บันทึกการเปลี่ยนแปลง
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
