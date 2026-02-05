
import React, { useState } from 'react';
// Fix: Removed BatteryCharging from lucide-react import as it is defined locally at the bottom of the file
import { ArrowLeft, MapPin, Zap, Clock, ShieldCheck, ChevronRight, Info, Power, AlertCircle } from 'lucide-react';
import { ChargingStation, ChargingPackage, StationStatus } from '../types';

interface Props {
  station: ChargingStation;
  balance: number;
  onBack: () => void;
  onStartCharge: (pkg: ChargingPackage) => void;
  onStopCharge: () => void;
}

// Cập nhật Package ID theo chuẩn Command
const PACKAGES: ChargingPackage[] = [
  { id: 'buy_01', name: 'Gói 30 phút', price: 15000, value: '30 phút', type: 'time' },
  { id: 'buy_02', name: 'Gói 1 giờ', price: 25000, value: '60 phút', type: 'time' },
  { id: 'buy_03', name: 'Gói 2 giờ', price: 45000, value: '120 phút', type: 'time' },
  { id: 'buy_04', name: 'Gói Năng Lượng (1 kWh)', price: 5000, value: '1 kWh', type: 'kwh' },
];

const StationDetail: React.FC<Props> = ({ station, balance, onBack, onStartCharge, onStopCharge }) => {
  const [selectedPkg, setSelectedPkg] = useState<ChargingPackage | null>(null);
  const isCharging = station.status === StationStatus.CHARGING;

  const handleStart = () => {
    if (!selectedPkg) return;
    // Gửi yêu cầu, Cloud Function sẽ tự động kiểm tra số dư và thông báo lại
    onStartCharge(selectedPkg);
  };

  return (
    <div className="bg-[#F7F8FA] min-h-screen animate-in slide-in-from-right duration-500 pb-10">
      <div className="relative h-64">
        <img src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="EV Station" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <button onClick={onBack} className="absolute top-6 left-6 bg-white/20 p-2.5 rounded-full backdrop-blur-lg border border-white/30 shadow-lg active:scale-90 transition-all z-10">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div className="absolute bottom-10 left-8 right-8 text-white">
           <h2 className="text-2xl font-black tracking-tight">{station.name}</h2>
           <div className="flex items-center gap-2 text-xs opacity-80 mt-1.5 font-bold uppercase tracking-wider">
              <MapPin size={12} className="text-blue-400" />
              <span>{station.location}</span>
           </div>
        </div>
      </div>

      <div className="px-5 -mt-6">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 p-7 space-y-8 relative z-20 overflow-hidden min-h-[60vh]">
          {isCharging ? (
            <div className="animate-in fade-in duration-700 space-y-10">
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="relative w-56 h-56 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-[14px] border-gray-50 shadow-inner"></div>
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="112" cy="112" r="99" stroke="currentColor" strokeWidth="14" fill="transparent" strokeDasharray={2 * Math.PI * 99} strokeDashoffset={2 * Math.PI * 99 * (1 - (station.progress || 0) / 100)} strokeLinecap="round" className="text-[#0068FF] transition-all duration-1000 ease-linear" />
                  </svg>
                  <div className="flex flex-col items-center justify-center text-center z-10">
                    <div className="bg-blue-50 p-2 rounded-xl mb-3 text-[#0068FF]"><BatteryCharging size={28} className="animate-pulse" /></div>
                    <span className="text-5xl font-black text-gray-800 tracking-tighter tabular-nums leading-none">{Math.round(station.progress || 0)}%</span>
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Đang sạc</span>
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-2.5 bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100">
                  <Clock size={16} className="text-blue-500" />
                  <p className="text-[13px] font-bold text-gray-400">Thời gian còn lại: <span className="text-gray-800 font-black">{station.timeRemaining}</span></p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 px-2">
                 <LiveMetric label="Công suất" value={`${station.power} kW`} icon={<Zap size={15} />} />
                 <LiveMetric label="Điáp" value={`${station.voltage} V`} icon={<Info size={15} />} />
                 <LiveMetric label="Dòng điện" value={`${station.current} A`} icon={<Zap size={15} />} />
                 <LiveMetric label="Đã nạp" value={`${station.energyUsed} kWh`} icon={<Zap size={15} />} />
              </div>
              <div className="pt-4 px-2">
                <button onClick={onStopCharge} className="w-full bg-red-50 text-red-600 border border-red-100 py-5 rounded-[2.2rem] font-black text-base active:scale-95 transition-all flex items-center justify-center gap-2.5 shadow-sm">
                  <Power size={22} /> DỪNG SẠC KHẨN CẤP
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <InfoBox label="Điện áp" value="230V" />
                <InfoBox label="Cổng sạc" value="Type 2" />
                <InfoBox label="Cường độ" value="32A" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Chọn gói sạc linh hoạt</h3>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">SIÊU RẺ</span>
                </div>
                <div className="space-y-3.5 max-h-[35vh] overflow-y-auto pr-1 scrollbar-hide">
                  {PACKAGES.map(pkg => (
                    <button key={pkg.id} onClick={() => setSelectedPkg(pkg)} className={`w-full p-5 rounded-[2.2rem] border-2 flex justify-between items-center transition-all ${selectedPkg?.id === pkg.id ? 'border-[#0068FF] bg-blue-50/50 shadow-sm' : 'border-gray-50 bg-gray-50/50 hover:border-gray-100'}`}>
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${pkg.type === 'time' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                          {pkg.type === 'time' ? <Clock size={28} /> : <Zap size={28} />}
                        </div>
                        <div className="text-left">
                          <p className="text-[15px] font-black text-gray-800">{pkg.name}</p>
                          <p className="text-[11px] text-gray-400 font-black uppercase tracking-wide">{pkg.value}</p>
                        </div>
                      </div>
                      <div className="text-right"><p className="text-lg font-black text-[#0068FF]">{pkg.price.toLocaleString()}đ</p></div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 space-y-5">
                <button onClick={handleStart} disabled={!selectedPkg} className="w-full bg-[#0068FF] text-white py-5.5 rounded-[2.5rem] font-black text-base shadow-xl shadow-blue-100 flex items-center justify-center gap-3.5 active:scale-95 transition-all disabled:opacity-50">
                  GỬI LỆNH KÍCH HOẠT SẠC <ChevronRight size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value }: any) => (
  <div className="bg-gray-50/50 p-3.5 rounded-2xl text-center border border-gray-100/50">
    <p className="text-[9px] text-gray-400 font-black uppercase mb-1.5 tracking-tighter opacity-70">{label}</p>
    <p className="text-xs font-black text-gray-700">{value}</p>
  </div>
);

const LiveMetric = ({ label, value, icon }: any) => (
  <div className="bg-white border border-gray-100 p-5 rounded-[2rem] shadow-sm flex flex-col gap-2 transition-all active:bg-gray-50">
    <div className="flex items-center gap-2.5 text-blue-500">
       <div className="bg-blue-50 p-1.5 rounded-lg">{icon}</div>
       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-[17px] font-black text-gray-800 pl-1">{value}</p>
  </div>
);

const BatteryCharging = ({ className, size }: { className?: string, size: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"/>
    <line x1="23" y1="13" x2="23" y2="11"/>
    <polyline points="11 6 7 12 13 12 9 18"/>
  </svg>
);

export default StationDetail;
