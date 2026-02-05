
import React from 'react';
import { MapPin, Navigation, Search, Filter, Zap, ChevronRight, Lock, Clock } from 'lucide-react';
import { ChargingStation, StationStatus } from '../types';

interface Props {
  stations: ChargingStation[];
  onSelectStation: (s: ChargingStation) => void;
}

const Dashboard: React.FC<Props> = ({ stations, onSelectStation }) => {
  return (
    <div className="space-y-3 pb-6">
      {/* Search Bar - Compact */}
      <div className="p-3 bg-white border-b border-gray-100 flex gap-2">
        <div className="flex-1 bg-gray-100 rounded-xl px-3 py-1.5 flex items-center gap-2">
          <Search size={14} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm trạm sạc gần bạn..." 
            className="bg-transparent text-[13px] w-full outline-none font-medium" 
          />
        </div>
        <button className="bg-gray-100 p-1.5 rounded-xl text-gray-500 active:scale-95 transition-all">
          <Filter size={18} />
        </button>
      </div>

      {/* Simulated Map View - Reduced Height */}
      <div className="mx-3 h-44 bg-blue-50 rounded-[1.5rem] relative overflow-hidden border border-gray-100 shadow-inner">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#0068ff_1px,transparent_1px)] [background-size:15px_15px]"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-8 h-8 bg-[#0068FF] rounded-full flex items-center justify-center animate-pulse shadow-lg border-2 border-white">
               <Navigation size={14} className="text-white fill-white" />
            </div>
          </div>
        </div>

        <div className="absolute top-10 right-20 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-12 left-24 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
      </div>

      {/* Quick Action Info - Compact */}
      <div className="px-3">
        <div className="bg-[#0068FF]/5 p-3 rounded-2xl border border-[#0068FF]/10 flex items-center justify-between">
           <div className="flex items-center gap-2.5">
              <div className="bg-[#0068FF] text-white p-1.5 rounded-lg">
                 <Zap size={14} fill="white" />
              </div>
              <div>
                <p className="text-[9px] font-black text-[#0068FF] uppercase tracking-widest">Trạng thái hệ thống</p>
                <p className="text-[11px] font-bold text-gray-700">85 trạm sạc đang hoạt động</p>
              </div>
           </div>
           <ChevronRight size={14} className="text-[#0068FF]" />
        </div>
      </div>

      {/* Station List - Compact Icons and Text */}
      <div className="px-3 space-y-2.5">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-black text-gray-800">Trạm sạc lân cận</h3>
          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Xem tất cả</span>
        </div>

        {stations.map(s => {
          const isCharging = s.status === StationStatus.CHARGING;
          const isOnline = s.status === StationStatus.ONLINE;
          const isSelectable = isOnline || isCharging;

          return (
            <div 
              key={s.id} 
              onClick={() => isSelectable && onSelectStation(s)}
              className={`bg-white p-3 rounded-2xl shadow-sm border flex flex-col gap-3 transition-all ${
                isSelectable 
                ? 'border-gray-50 active:scale-[0.98] cursor-pointer hover:border-blue-100' 
                : 'border-gray-100 cursor-not-allowed opacity-80'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner shrink-0 ${
                    isCharging ? 'bg-yellow-50 text-yellow-500' : isOnline ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {isCharging ? (
                      <div className="relative">
                        <Zap size={22} className="animate-pulse" fill="currentColor" />
                      </div>
                    ) : (
                      <Zap size={22} fill="currentColor" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center overflow-hidden">
                    <h4 className={`text-[13px] font-black truncate ${isSelectable ? 'text-gray-800' : 'text-gray-400'}`}>{s.name}</h4>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5 font-medium truncate">
                      <MapPin size={10} className={isSelectable ? 'text-blue-500' : 'text-gray-300'} />
                      <span>{s.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg whitespace-nowrap flex items-center gap-1 ${
                    isCharging ? 'bg-yellow-100 text-yellow-600' : isOnline ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {!isSelectable && <Lock size={8} />}
                    {isCharging ? 'Đang sạc' : isOnline ? 'Trống' : 'Bận'}
                  </div>
                  {isCharging && s.timeRemaining && (
                    <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
                      <Clock size={10} />
                      {s.timeRemaining}
                    </div>
                  )}
                </div>
              </div>

              {isCharging && s.progress !== undefined && (
                <div className="w-full space-y-1 px-1">
                   <div className="flex justify-between items-end">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Tiến độ sạc</span>
                      <span className="text-[10px] font-black text-blue-600">{Math.round(s.progress)}%</span>
                   </div>
                   <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#0068FF] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${s.progress}%` }}
                      ></div>
                   </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-1 px-1">
                <div className="flex items-center gap-1.5">
                   <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-bold whitespace-nowrap">Cách {s.distance}</span>
                   {isSelectable && <span className="text-[8px] bg-blue-50 text-[#0068FF] px-1.5 py-0.5 rounded-md font-bold whitespace-nowrap">22kW</span>}
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
