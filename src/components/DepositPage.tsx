
import React, { useState } from 'react';
import { QrCode, Copy, Landmark, ShieldCheck, Wallet, Zap, Info, ChevronRight } from 'lucide-react';

interface Props {
  onDepositCommand: (cmd: string) => void;
}

const DepositPage: React.FC<Props> = ({ onDepositCommand }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState(100000);
  const [memo] = useState(`EVNAP ${Math.floor(100000 + Math.random() * 900000)}`);

  const bankId = "MB";
  const accountNo = "0123456789";
  const accountName = "CONG TY EV MASTER";
  
  // VietQR URL - Optimized for clean appearance
  const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${memo}&accountName=${accountName}`;

  const presets = [
    { label: 'Gói 50k', value: 50000, cmd: 'buy_05' },
    { label: 'Gói 100k', value: 100000, cmd: 'buy_06' },
    { label: 'Gói 200k', value: 200000, cmd: 'buy_07' },
    { label: 'Gói 500k', value: 500000, cmd: 'buy_08' },
  ];

  const handleSelectPackage = (amt: number, cmd: string) => {
    setAmount(amt);
    // Gửi lệnh nạp tiền ngay lập tức khi người dùng chọn gói
    onDepositCommand(cmd);
    setStep(2);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-4 space-y-6 pb-24 animate-in fade-in duration-500">
      {step === 1 ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-3">
              <div className="bg-blue-50 p-2.5 rounded-2xl text-[#0068FF]"><Wallet size={20} /></div>
              Chọn mệnh giá nạp
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {presets.map(p => (
                <button 
                  key={p.value} 
                  onClick={() => handleSelectPackage(p.value, p.cmd)}
                  className="w-full p-5 rounded-[1.8rem] bg-gray-50 border border-gray-100 flex justify-between items-center active:scale-[0.98] active:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0068FF] shadow-sm">
                      <QrCode size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black text-gray-800">{p.label}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tự động cộng tiền</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-[#0068FF]">{p.value.toLocaleString()}đ</span>
                    <ChevronRight size={18} className="text-gray-200 group-hover:text-[#0068FF]" />
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 p-5 rounded-[2.2rem] border border-blue-100 flex items-start gap-3">
            <Info size={18} className="text-[#0068FF] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#0068FF] font-bold leading-relaxed italic">
              Sau khi chọn gói, vui lòng quét mã QR và chuyển khoản chính xác nội dung để hệ thống cộng tiền tự động.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-8 animate-in slide-in-from-bottom-6 duration-500 py-6">
          {/* Header simple back button */}
          <button 
            onClick={() => setStep(1)} 
            className="self-start ml-4 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-4 py-2 rounded-full active:scale-95 transition-all"
          >
            Thay đổi mệnh giá
          </button>

          {/* Clean QR Card Container matching user's visual request */}
          <div className="bg-white p-8 rounded-[3.5rem] shadow-2xl border border-gray-50 flex flex-col items-center w-full max-w-[340px]">
            <div className="relative w-full aspect-square bg-white rounded-[2rem] p-3 flex items-center justify-center">
               <img src={qrUrl} alt="VietQR" className="w-full h-full object-contain" />
               <div className="absolute inset-0 border-2 border-gray-50 rounded-[2rem] pointer-events-none"></div>
            </div>
            
            <div className="mt-8 text-center space-y-2">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{accountName}</p>
              <p className="text-[20px] text-gray-800 font-black tracking-tight">{amount.toLocaleString()} VNĐ</p>
            </div>

            <div 
              className="mt-6 flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-50 rounded-full border border-blue-100 active:bg-blue-100 transition-all cursor-pointer group" 
              onClick={() => copyToClipboard(memo)}
            >
              <span className="text-[12px] font-black text-[#0068FF] uppercase tracking-wider">NỘI DUNG: {memo}</span>
              <Copy size={14} className="text-[#0068FF] group-active:scale-125 transition-transform" />
            </div>
          </div>

          <div className="text-center px-10">
            <p className="text-[11px] text-gray-400 font-medium leading-relaxed italic">
              Hệ thống đã nhận lệnh nạp. Vui lòng quét mã và chuyển khoản. 
              Số dư sẽ tự động cập nhật sau 1-3 phút.
            </p>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex justify-center items-center gap-10 py-4 opacity-20 grayscale">
            <div className="flex flex-col items-center gap-1.5"><ShieldCheck size={18} /><span className="text-[8px] font-black uppercase">Bảo mật</span></div>
            <div className="flex flex-col items-center gap-1.5"><Landmark size={18} /><span className="text-[8px] font-black uppercase">VietQR</span></div>
            <div className="flex flex-col items-center gap-1.5"><Zap size={18} /><span className="text-[8px] font-black uppercase">Realtime</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositPage;
