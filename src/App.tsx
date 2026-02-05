
import React, { useState, useEffect, useCallback } from 'react';
import { Home, QrCode, Clock, User, Zap, MessageCircle, RefreshCw, BellRing } from 'lucide-react';
import { ref, onValue, push } from "firebase/database";
import { db } from './firebase-config';
import Dashboard from './components/Dashboard';
import DepositPage from './components/DepositPage';
import HistoryPage from './components/HistoryPage';
import ProfilePage from './components/ProfilePage';
import StationDetail from './components/StationDetail';
import { TabType, ChargingStation, Transaction } from './types';

const USER_ID = "user_001";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [balance, setBalance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // 1. Lắng nghe dữ liệu Trạm sạc (Chỉ đọc)
  useEffect(() => {
    const stationsRef = ref(db, 'stations');
    const unsubscribe = onValue(stationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const stationsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setStations(stationsList);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Lắng nghe dữ liệu Người dùng (Chỉ đọc)
  useEffect(() => {
    const userRef = ref(db, `users/${USER_ID}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBalance(data.balance || 0);
        if (data.transactions) {
          const txList = Object.keys(data.transactions).map(key => ({
            id: key,
            ...data.transactions[key]
          })).sort((a, b) => b.timestamp - a.timestamp);
          setTransactions(txList);
        }
        // Lắng nghe thông báo lỗi/thành công từ Cloud Function
        if (data.notify) {
          handleSystemNotify(data.notify);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSystemNotify = (code: string) => {
    const messages: Record<string, string> = {
      'error_03': 'Số dư không đủ để thực hiện giao dịch!',
      'success_charge': 'Lệnh sạc đã được kích hoạt thành công.',
      'success_deposit': 'Số dư đã được cập nhật thành công.',
      'stop_success': 'Đã dừng sạc và hoàn tiền thừa.'
    };
    if (messages[code]) {
      setStatusMsg(messages[code]);
      setShowStatusUpdate(true);
      setTimeout(() => setShowStatusUpdate(false), 4000);
    }
  };

  const refreshBalance = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  // Lệnh GỬI COMMAND duy nhất cho App User
  const sendCommand = async (cmd: string, stationId?: string) => {
    setIsRefreshing(true);
    try {
      await push(ref(db, "commands"), {
        uid: USER_ID,
        stationId: stationId || null,
        cmd: cmd,
        createdAt: Date.now()
      });
      setStatusMsg("Đang gửi lệnh tới hệ thống...");
      setShowStatusUpdate(true);
      setTimeout(() => setShowStatusUpdate(false), 3000);
    } catch (error) {
      console.error("Lỗi gửi lệnh:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderContent = () => {
    if (selectedStation) {
      const liveStation = stations.find(s => s.id === selectedStation.id) || selectedStation;
      return (
        <StationDetail 
          station={liveStation} 
          balance={balance} 
          onBack={() => setSelectedStation(null)} 
          onStartCharge={(pkg) => sendCommand(pkg.id, selectedStation.id)}
          onStopCharge={() => sendCommand('stop', selectedStation.id)}
        />
      );
    }

    switch (activeTab) {
      case 'home': return <Dashboard stations={stations} onSelectStation={setSelectedStation} />;
      case 'deposit': return <DepositPage onDepositCommand={(cmd) => sendCommand(cmd)} />;
      case 'history': return <HistoryPage transactions={transactions} />;
      case 'profile': return <ProfilePage balance={balance} stations={stations} isRefreshing={isRefreshing} onRefresh={refreshBalance} />;
      default: return <Dashboard stations={stations} onSelectStation={setSelectedStation} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FA] pb-20 overflow-hidden text-gray-900">
      {showStatusUpdate && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] bg-blue-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-10 duration-500 font-black text-xs border-2 border-white/50">
          <BellRing size={16} className="animate-bounce" />
          <span className="uppercase">{statusMsg}</span>
        </div>
      )}

      <header className="bg-[#0068FF] text-white p-3 sticky top-0 z-50 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <h1 className="text-base font-black tracking-tight uppercase">EV Master</h1>
        </div>
        
        <button 
          onClick={refreshBalance}
          disabled={isRefreshing}
          className="relative group bg-white/10 px-3 py-1.5 rounded-full text-[11px] font-black border border-white/20 flex items-center gap-1.5 active:bg-white/20 transition-all"
        >
          {isRefreshing && <div className="absolute inset-0 rounded-full shimmer opacity-30 pointer-events-none"></div>}
          <span className={`${isRefreshing ? 'animate-pulse' : ''} tabular-nums`}>
            Ví: {balance.toLocaleString()}đ
          </span>
          <RefreshCw size={12} className={`${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto animate-in fade-in duration-300 overflow-y-auto">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] safe-area-bottom z-50">
        <div className="flex justify-around items-center h-14 max-w-md mx-auto">
          <NavItem icon={<Home />} label="Trang chủ" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={<QrCode />} label="Nạp tiền" active={activeTab === 'deposit'} onClick={() => setActiveTab('deposit')} />
          <NavItem icon={<Clock />} label="Lịch sử" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <NavItem icon={<User />} label="Cá nhân" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </div>
      </nav>

      {!isAIChatOpen && (
        <button 
          onClick={() => setIsAIChatOpen(true)}
          className="fixed right-4 bottom-20 bg-[#0068FF] p-3 rounded-full shadow-2xl text-white active:scale-90 z-40 border-2 border-white"
        >
          <MessageCircle size={20} fill="white" />
        </button>
      )}

      {isAIChatOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md h-[80vh] bg-white rounded-t-[2rem] overflow-hidden shadow-2xl relative">
          
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-0.5 w-full transition-all ${active ? 'text-[#0068FF]' : 'text-[#8E949E]'}`}>
    <div className={`${active ? 'scale-105' : ''}`}>{React.cloneElement(icon as React.ReactElement<any>, { size: 18, strokeWidth: active ? 3 : 2 })}</div>
    <span className={`text-[9px] font-black tracking-tight ${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
  </button>
);

export default App;
