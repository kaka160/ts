
import React from 'react';
import { Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { Transaction } from '../types';

interface Props {
  balance: number;
  transactions: Transaction[];
  onTopUp: () => void;
}

const Profile: React.FC<Props> = ({ balance, transactions, onTopUp }) => {
  return (
    <div className="space-y-6">
      {/* Header User */}
      <div className="flex items-center gap-4 bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-gray-50 shadow-sm">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-lg font-black text-gray-800">Nguyễn Văn A</h2>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">ID: 102948576</p>
          <div className="mt-1.5 flex gap-2">
             <span className="bg-yellow-100 text-yellow-600 text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-tighter">Gold Member</span>
             <span className="bg-blue-50 text-[#0068ff] text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-tighter">Admin</span>
          </div>
        </div>
      </div>

      {/* Wallet Action */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Số dư hiện tại</p>
        <h3 className="text-3xl font-black text-gray-800 mb-6">{balance.toLocaleString()}đ</h3>
        <button 
          onClick={onTopUp}
          className="w-full bg-[#0068ff] text-white py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 active:scale-95 transition-all"
        >
          Nạp thêm tiền
        </button>
      </div>

      {/* Transaction History */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-black text-gray-800 flex items-center gap-2">
            <Clock size={18} className="text-blue-600" />
            Lịch sử giao dịch
          </h3>
          <span className="text-[10px] font-black text-gray-300 uppercase">30 ngày qua</span>
        </div>
        
        <div className="space-y-4">
          {transactions.map(tx => (
            <div key={tx.id} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="flex gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tx.type === 'charge' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                  {tx.type === 'charge' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-800">{tx.description}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{new Date(tx.timestamp).toLocaleString('vi-VN')}</p>
                </div>
              </div>
              <p className={`text-sm font-black ${tx.type === 'charge' ? 'text-red-500' : 'text-green-600'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}đ
              </p>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-center text-xs text-gray-400 py-4 italic">Chưa có giao dịch nào</p>
          )}
        </div>
      </div>

      {/* Settings Menu */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden px-2">
        <MenuButton icon={<Shield size={20} className="text-blue-500" />} label="Bảo mật tài khoản" />
        <MenuButton icon={<Bell size={20} className="text-orange-500" />} label="Cài đặt thông báo" />
        <MenuButton icon={<HelpCircle size={20} className="text-green-500" />} label="Trung tâm hỗ trợ" />
      </div>

      <button className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-black text-sm active:bg-red-50 rounded-2xl transition-colors">
        <LogOut size={18} /> Đăng xuất tài khoản
      </button>

      <div className="text-center text-[9px] text-gray-300 pb-8 font-bold uppercase tracking-widest">
        Powered by Zalo Mini App Engine • v1.0.5
      </div>
    </div>
  );
};

const MenuButton = ({ icon, label }: any) => (
  <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-2xl group">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">{icon}</div>
      <span className="text-xs font-black text-gray-700">{label}</span>
    </div>
    <ChevronRight size={16} className="text-gray-300" />
  </button>
);

export default Profile;
