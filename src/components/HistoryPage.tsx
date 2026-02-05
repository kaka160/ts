
import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Calendar, Search, Filter, Clock, Loader2, AlertCircle } from 'lucide-react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

const HistoryPage: React.FC<Props> = ({ transactions }) => {
  const pendingTransactions = transactions.filter(tx => tx.status === 'pending');
  const completedTransactions = transactions.filter(tx => tx.status === 'success');

  return (
    <div className="p-3 space-y-4 pb-10">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-black text-gray-800">Lịch sử giao dịch</h2>
        <div className="flex gap-1.5">
           <button className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 text-gray-500 active:scale-90 transition-all">
             <Search size={16} />
           </button>
           <button className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 text-[#0068FF] active:scale-90 transition-all">
             <Filter size={16} />
           </button>
        </div>
      </div>

      {/* Date Picker Ribbon */}
      <div className="bg-[#0068FF] p-3 rounded-2xl text-white flex justify-between items-center shadow-lg shadow-blue-100">
        <div className="flex items-center gap-2.5">
          <Calendar size={18} />
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Thời gian xem</p>
            <p className="text-xs font-bold">Tháng 3, 2024</p>
          </div>
        </div>
        <button className="bg-white/20 px-2 py-0.5 rounded-full text-[9px] font-bold">Thay đổi</button>
      </div>

      {/* Pending Transactions Section */}
      {pendingTransactions.length > 0 && (
        <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 px-1">
             <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
             <h3 className="text-[11px] font-black text-yellow-600 uppercase tracking-widest">Giao dịch đang chờ xử lý</h3>
          </div>
          <div className="space-y-2">
            {pendingTransactions.map(tx => (
              <div 
                key={tx.id} 
                className="bg-yellow-50/50 p-3 rounded-2xl border border-yellow-100 flex justify-between items-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-yellow-600 shadow-sm">
                    <Loader2 size={18} className="animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-gray-800 leading-tight">{tx.description}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9px] text-gray-400 font-bold italic">Đang xác thực hệ thống...</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-500">
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}đ
                  </p>
                  <span className="text-[8px] font-bold text-yellow-600 uppercase">Pending</span>
                </div>
              </div>
            ))}
            <div className="px-2 py-1 bg-gray-50 rounded-lg flex items-center gap-2">
              <AlertCircle size={10} className="text-gray-400" />
              <p className="text-[9px] text-gray-400 font-medium">Lưu ý: Các giao dịch này sẽ được cập nhật trong 1-3 phút.</p>
            </div>
          </div>
        </div>
      )}

      {/* Main History List */}
      <div className="space-y-2.5">
        <div className="px-1 pt-2">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Tất cả hoạt động</h3>
        </div>
        
        {completedTransactions.length > 0 ? (
          completedTransactions.map(tx => (
            <div 
              key={tx.id} 
              className="bg-white p-3 rounded-2xl shadow-sm border border-gray-50 flex justify-between items-center group active:bg-gray-50 transition-colors"
            >
              <div className="flex gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                  tx.type === 'charge' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                }`}>
                  {tx.type === 'charge' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                </div>
                <div>
                  <h4 className="text-[13px] font-black text-gray-800 leading-tight">{tx.description}</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] text-gray-400 font-bold">{new Date(tx.timestamp).toLocaleString('vi-VN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})
}</span>
                    <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md bg-green-100 text-green-600">
                      Thành công
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${tx.type === 'charge' ? 'text-red-500' : 'text-green-600'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}đ
                </p>
                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">Mã: {tx.id.slice(-6)}</span>
              </div>
            </div>
          ))
        ) : pendingTransactions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 opacity-50">
               <Calendar size={24} className="text-gray-400" />
            </div>
            <p className="text-xs text-gray-400 font-bold">Bạn chưa có giao dịch nào</p>
          </div>
        ) : null}
      </div>

      {/* Footer Stats - Compact */}
      <div className="bg-gray-100/50 p-4 rounded-2xl border border-dashed border-gray-200 text-center">
         <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Tổng chi tiêu tháng này</p>
         <p className="text-xl font-black text-gray-800">1.450.000đ</p>
      </div>
    </div>
  );
};

export default HistoryPage;
