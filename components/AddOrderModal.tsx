import React, { useState } from 'react';
import { X, Plus, User, MessageCircle, Globe, Activity, Hash, Layers, Target, Clock, Check, History } from 'lucide-react';
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
        totalAmount: '',
        startDate: new Date().toISOString().slice(0, 16), // Use datetime-local format
        deadline: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            ...formData,
            totalAmount: parseInt(formData.totalAmount) || 0,
            completedAmount: 0,
            status: 'pending',
            orderId: `ORD-${new Date().getFullYear()}${(Math.floor(Math.random() * 900) + 100)}`
        });
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
                className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 max-h-[95vh] flex flex-col"
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

                <form onSubmit={handleSubmit} className="p-5 sm:p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="sm:col-span-2">
                            <label className="block text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">ชื่อผู้ว่าจ้าง / Account</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    required
                                    type="text"
                                    className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white text-sm font-bold transition-all placeholder:text-slate-300 shadow-inner"
                                    placeholder="เช่น คุณเอ (Line) หรือ ร้านค้า X"
                                    value={formData.clientName}
                                    onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">ลิงก์ติดต่อ (แชท)</label>
                            <div className="relative group">
                                <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="url"
                                    className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white text-sm font-bold transition-all placeholder:text-slate-300 shadow-inner"
                                    placeholder="https://line.me/ti/p/..."
                                    value={formData.chatLink}
                                    onChange={e => setFormData({ ...formData, chatLink: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">ลิงก์งาน (Target URL)</label>
                            <div className="relative group">
                                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    required
                                    type="text"
                                    className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white text-sm font-bold transition-all placeholder:text-slate-300 shadow-inner"
                                    placeholder="ลิงก์โปรไฟล์ / โพสต์"
                                    value={formData.targetLink}
                                    onChange={e => setFormData({ ...formData, targetLink: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">แพลตฟอร์ม</label>
                            <div className="relative group">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                <select
                                    className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white text-sm font-bold transition-all appearance-none cursor-pointer shadow-inner"
                                    value={formData.platform}
                                    onChange={e => setFormData({ ...formData, platform: e.target.value })}
                                >
                                    <option>IG</option>
                                    <option>TikTok</option>
                                    <option>FB</option>
                                    <option>X (Twitter)</option>
                                    <option>YouTube</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">บริการ (Service Type)</label>
                            <div className="relative group">
                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    required
                                    type="text"
                                    className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white text-sm font-bold transition-all placeholder:text-slate-300 shadow-inner"
                                    placeholder="เช่น Followers (ผสม)"
                                    value={formData.service}
                                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">ยอดรวมที่สั่ง (Total Amount)</label>
                            <div className="relative group">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white text-sm font-bold transition-all placeholder:text-slate-300 shadow-inner"
                                    placeholder="จำนวนยอดที่สั่ง"
                                    value={formData.totalAmount}
                                    onChange={e => setFormData({ ...formData, totalAmount: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:col-span-2">
                            <div>
                                <label className="block text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">วันที่เริ่ม (Start Date)</label>
                                <div className="relative group">
                                    <History className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        required
                                        type="datetime-local"
                                        className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white text-[11px] sm:text-sm font-bold transition-all shadow-inner"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 text-rose-400">กำหนดส่ง (Deadline)</label>
                                <div className="relative group">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        required
                                        type="datetime-local"
                                        className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white text-[11px] sm:text-sm font-bold transition-all shadow-inner"
                                        value={formData.deadline}
                                        onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 mb-4 sm:mb-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-black text-white uppercase tracking-wider bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" /> บันทึกและเริ่มงาน
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
