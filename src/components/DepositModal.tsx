
import React, { useState } from 'react';
import { X, Copy, CheckCircle2, QrCode, Landmark, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const PRESET_AMOUNTS = [50000, 100000, 200000, 500000];

const DepositModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [amount, setAmount] = useState<number>(100000);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerateQR = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 2000);
  };

const handleDone = () => {

  setStep(1);
  onClose(); // Chỉ đơn giản là đóng Modal
};
  return (
    <div className="fixed inset-0 bg-black/70 z-[200] flex items-end sm:items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-xl font-black text-gray-800">Nạp tiền vào ví</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Chọn số tiền nạp</label>
                <div className="grid grid-cols-2 gap-3">
                  {PRESET_AMOUNTS.map(amt => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt)}
                      className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${
                        amount === amt 
                        ? 'border-[#0068ff] bg-blue-50 text-[#0068ff]' 
                        : 'border-gray-100 text-gray-600 active:border-blue-200'
                      }`}
                    >
                      {amt.toLocaleString()}đ
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Nhập số tiền khác</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="bg-transparent text-xl font-black text-gray-800 outline-none w-full"
                    placeholder="0"
                  />
                  <span className="font-bold text-gray-400">VNĐ</span>
                </div>
              </div>

              <button 
                onClick={handleGenerateQR}
                disabled={isLoading}
                className="w-full bg-[#0068ff] text-white py-4 rounded-2xl font-black text-base shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <QrCode size={20} />}
                Tạo mã QR nạp tiền
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 text-center">
              <div className="bg-blue-50 text-[#0068ff] px-4 py-2 rounded-full text-xs font-bold inline-block">
                Quét mã để chuyển khoản
              </div>
              
              <div className="relative mx-auto w-56 h-56 bg-white border-4 border-blue-50 rounded-3xl p-4 shadow-inner flex items-center justify-center">
                {/* Simulated QR Code with dynamic details */}
                <div className="w-full h-full bg-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                  <QrCode size={120} className="text-gray-300 mb-2" />
                  <span className="text-[10px] font-black text-gray-400 uppercase">VietQR - EVMASTER</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-white p-2 rounded-lg shadow-md">
                      <Landmark size={24} className="text-[#0068ff]" />
                   </div>
                </div>
              </div>

              <div className="space-y-2 text-left bg-gray-50 p-4 rounded-2xl">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Ngân hàng:</span>
                  <span className="font-black text-gray-800">MB Bank (Quân Đội)</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Số tiền:</span>
                  <span className="font-black text-blue-600">{amount.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Nội dung:</span>
                  <div className="flex items-center gap-1 font-black text-gray-800">
                    EVNAP {Math.floor(Math.random() * 9000) + 1000}
                    <Copy size={12} className="text-blue-500" />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-full bg-[#0068ff] text-white py-4 rounded-2xl font-black text-base shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Tôi đã chuyển khoản"}
              </button>
              
              <p className="text-[10px] text-gray-400 font-medium">Hệ thống sẽ tự động cập nhật số dư sau 1-3 phút</p>
            </div>
          )}

          {step === 3 && (
            <div className="py-10 text-center space-y-6 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h4 className="text-xl font-black text-gray-800 mb-2">Nạp tiền thành công!</h4>
                <p className="text-sm text-gray-500">Số dư ví của bạn đã được cộng thêm <br/><b className="text-gray-800">{amount.toLocaleString()}đ</b></p>
              </div>
              <button 
                onClick={handleDone}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-base active:scale-95 transition-all"
              >
                Tuyệt vời
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
