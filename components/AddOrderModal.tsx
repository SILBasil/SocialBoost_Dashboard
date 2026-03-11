import React, { useState } from 'react';
import { X, Plus, User, MessageCircle, Globe, Hash, Check, Target, DollarSign, Calendar, Clock, FileText, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddOrderModalProps {
    onClose: () => void;
    onAdd: (newOrder: any) => void;
}

export default function AddOrderModal({ onClose, onAdd }: AddOrderModalProps) {
    const [formData, setFormData] = useState({
        clientName: '',
        chatLink: '',
        targetLink: '',
        platform: 'IG',
        service: 'Followers (ผสม)',
        price: '',
        originalCount: '',
        foreignAmount: '',
        foreignBonus: '',
        thaiAmount: '',
        thaiBonus: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        notes: '',
        speed: 'normal',
        status: 'pending'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            ...formData,
            price: parseFloat(formData.price) || 0,
            originalCount: parseInt(formData.originalCount) || 0,
            foreignAmount: parseInt(formData.foreignAmount) || 0,
            foreignBonus: parseInt(formData.foreignBonus) || 0,
            thaiAmount: parseInt(formData.thaiAmount) || 0,
            thaiBonus: parseInt(formData.thaiBonus) || 0,
            totalAmount: (parseInt(formData.foreignAmount) || 0) + (parseInt(formData.foreignBonus) || 0) + (parseInt(formData.thaiAmount) || 0) + (parseInt(formData.thaiBonus) || 0),
            foreignDone: 0,
            thaiDone: 0,
            speed: formData.speed,
            status: formData.status,
            orderId: `ORD-${new Date().getFullYear()}${(Math.floor(Math.random() * 900) + 100)}`
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md px-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 max-h-[95vh] flex flex-col"
            >
                <div className="flex justify-between items-center p-5 sm:p-8 border-b border-slate-50 bg-slate-50/50">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                            <div className="bg-indigo-600 p-1.5 sm:p-2 rounded-xl shadow-lg shadow-indigo-200">
                                <Plus className="w-4 h-4 sm:w-5 h-5 text-white" />
                            </div>
                            เพิ่มรายการงานใหม่
                        </h2>
                        <p className="text-slate-400 text-[9px] sm:text-xs font-bold uppercase tracking-widest mt-1.5 sm:mt-2 ml-10">กรอกข้อมูลงานให้ครบถ้วนเพื่อเริ่มการติดตาม</p>
                    </div>
                    <button onClick={onClose} className="bg-white text-slate-400 hover:text-rose-500 p-2 sm:p-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-rose-100 hover:bg-rose-50 active:scale-95">
                        <X className="w-5 h-5 sm:w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 sm:p-8 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">ข้อมูลพื้นฐาน</h4>

                            <div>
                                <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5" /> ชื่อลูกค้า
                                </label>
                                <input
                                    required
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
                                    <Target className="w-3.5 h-3.5" /> Link ปลายทาง
                                </label>
                                <input
                                    required
                                    name="targetLink"
                                    value={formData.targetLink}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5">แพลตฟอร์ม</label>
                                    <select name="platform" value={formData.platform} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold">
                                        <option>IG</option>
                                        <option>TikTok</option>
                                        <option>FB</option>
                                        <option>X (Twitter)</option>
                                        <option>YouTube</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5">บริการ</label>
                                    <input name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Activity className="w-3.5 h-3.5" /> สถานะงาน
                                    </label>
                                    <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold">
                                        <option value="waiting">รับยอด (รอสร้างงาน)</option>
                                        <option value="pending">เริ่ม/รอดำเนินการ</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Zap className="w-3.5 h-3.5 text-amber-500" /> ความเร็วทำงาน
                                    </label>
                                    <select name="speed" value={formData.speed} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold">
                                        <option value="normal">ปกติ (Normal)</option>
                                        <option value="urgent">เร่งด่วน (Urgent)</option>
                                        <option value="drip">ทยอยทำ (Drip-feed)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Numbers */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">ตัวเลขและกำหนดส่ง</h4>

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
                                        <Calendar className="w-3.5 h-3.5" /> วันที่เริ่ม
                                    </label>
                                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] sm:text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5 text-rose-500">
                                        <Clock className="w-3.5 h-3.5" /> กำหนดส่ง
                                    </label>
                                    <input required type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full px-4 py-2 bg-rose-50/30 border border-rose-100 rounded-xl text-sm outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400 font-bold" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Detailed Counts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">งานต่างชาติ (Foreign)</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">ยอดสั่ง</label>
                                    <input type="number" name="foreignAmount" value={formData.foreignAmount} onChange={handleChange} className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">แถม</label>
                                    <input type="number" name="foreignBonus" value={formData.foreignBonus} onChange={handleChange} className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">งานไทย (Thai)</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">ยอดสั่ง</label>
                                    <input type="number" name="thaiAmount" value={formData.thaiAmount} onChange={handleChange} className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">แถม</label>
                                    <input type="number" name="thaiBonus" value={formData.thaiBonus} onChange={handleChange} className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" /> หมายเหตุ (Notes)
                        </label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500" placeholder="ระบุรายละเอียดเพิ่มเติม..." />
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-4 text-sm font-black text-slate-400 uppercase tracking-wider bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] px-8 py-4 text-sm font-black text-white uppercase tracking-wider bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" /> บันทึกและเริ่มงาน
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
