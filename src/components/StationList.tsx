import React, { useState } from 'react';
import { ChargingStation, StationStatus, ChargingPackage } from '../types';
import { Power, MapPin, Zap, X, CheckCircle2 } from 'lucide-react';

interface Props {
  stations: ChargingStation[];
  // Bỏ setStations và addTransaction vì logic này do Firebase xử lý
  onStartCharge: (pkg: ChargingPackage, stationId: string) => void;
  onStopCharge: (stationId: string) => void;
}

const PACKAGES: ChargingPackage[] = [
  { id: 'buy_01', name: 'Gói Tiết Kiệm', price: 20000, value: '5', type: 'kwh' },
  { id: 'buy_02', name: 'Gói Tiêu Chuẩn', price: 50000, value: '12', type: 'kwh' },
  { id: 'buy_03', name: 'Gói Đầy Bình', price: 100000, value: '25', type: 'kwh' },
];

const StationList: React.FC<Props> = ({ stations, onStartCharge, onStopCharge }) => {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [showPackages, setShowPackages] = useState(false);

  const handleStartCharge = (pkg: ChargingPackage) => {
    if (!selectedStationId) return;

    // Chỉ gửi lệnh đi, không tự cập nhật UI tại đây
    onStartCharge(pkg, selectedStationId);
    
    setShowPackages(false);
    setSelectedStationId(null);
  };

  return (
    <div className="space-y-4">
      <div className="px-1 flex justify-between items-center">
        <h2 className="text-lg font-black text-gray-800">Trạm sạc lân cận</h2>
        <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-lg">Trực tuyến</span>
      </div>

      {stations.map(station => (
        <div key={station.id} className={`bg-white p-5 rounded-[2rem] shadow-sm border ${station.status === StationStatus.OFFLINE ? 'opacity-60 grayscale' : 'border-gray-100 hover:border-blue-100 transition-colors'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${getStatusBg(station.status)}`}>
                <Power className="text-white" size={28} />
              </div>
              <div>
                <h3 className="font-black text-gray-800 text-base">{station.name}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <MapPin size={12} className="text-blue-400" />
                  <span>{station.location}</span>
                </div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusTag(station.status)}`}>
              {station.status}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-2xl mb-4">
            <Metric label="Điện áp" value={`${station.voltage}V`} />
            <Metric label="Dòng điện" value={`${station.current}A`} />
            <Metric label="Công suất" value={`${station.power}kW`} />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-[11px] text-gray-500">
              Đã tiêu thụ: <span className="font-bold text-gray-800">{station.energyUsed} kWh</span>
            </div>
            
            {station.status === StationStatus.ONLINE && (
              <button 
                onClick={() => { setSelectedStationId(station.id); setShowPackages(true); }}
                className="bg-[#0068ff] text-white px-6 py-2.5 rounded-2xl font-black text-sm shadow-lg shadow-blue-100 active:scale-95 transition-all"
              >
                Bắt đầu sạc
              </button>
            )}
            {station.status === StationStatus.CHARGING && (
              <button 
                onClick={() => onStopCharge(station.id)}
                className="bg-red-50 text-red-600 border border-red-100 px-6 py-2.5 rounded-2xl font-black text-sm active:scale-95 transition-all"
              >
                Dừng sạc
              </button>
            )}
          </div>
        </div>
      ))}

      {/* UI Gói sạc giữ nguyên */}
      {showPackages && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-end p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md mx-auto rounded-[2.5rem] p-6 animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-800">Chọn gói sạc</h3>
              <button onClick={() => setShowPackages(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3 mb-8">
              {PACKAGES.map(pkg => (
                <button 
                  key={pkg.id} 
                  onClick={() => handleStartCharge(pkg)}
                  className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-3xl border border-transparent hover:border-blue-200 hover:bg-blue-50 group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Zap size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-gray-800">{pkg.name}</p>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{pkg.value} kWh sạc nhanh</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-blue-600">{pkg.price.toLocaleString()}đ</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl flex items-center gap-3 border border-blue-100">
              <CheckCircle2 className="text-blue-600" size={20} />
              <p className="text-[11px] text-blue-700 font-medium leading-tight">Sau khi gửi lệnh, hệ thống sẽ kiểm tra số dư và kích hoạt trạm tự động.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Các Helper Function giữ nguyên UI
const Metric = ({ label, value }: any) => (
  <div className="text-center">
    <p className="text-[9px] text-gray-400 font-black uppercase mb-0.5 tracking-tighter">{label}</p>
    <p className="text-xs font-black text-gray-700 leading-none">{value}</p>
  </div>
);

const getStatusBg = (status: StationStatus) => {
  switch (status) {
    case StationStatus.CHARGING: return 'bg-gradient-to-br from-yellow-400 to-orange-500';
    case StationStatus.ONLINE: return 'bg-gradient-to-br from-green-400 to-emerald-600';
    case StationStatus.ERROR: return 'bg-red-500';
    default: return 'bg-gray-400';
  }
};

const getStatusTag = (status: StationStatus) => {
  switch (status) {
    case StationStatus.CHARGING: return 'bg-yellow-50 text-yellow-600';
    case StationStatus.ONLINE: return 'bg-green-50 text-green-600';
    case StationStatus.ERROR: return 'bg-red-50 text-red-600';
    default: return 'bg-gray-100 text-gray-500';
  }
};

export default StationList;