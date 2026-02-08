import React, { useState, useEffect, useCallback } from 'react';
import { Home, QrCode, Clock, User, Zap, MessageCircle, RefreshCw, BellRing, Wallet } from 'lucide-react';
import { ref, onValue, push, serverTimestamp } from "firebase/database";
import api from "zmp-sdk"; 
import { db } from './firebase-config';

// Import Components
import Dashboard from './components/Dashboard';
import DepositPage from './components/DepositPage';
import HistoryPage from './components/HistoryPage';
import ProfilePage from './components/ProfilePage';
import StationDetail from './components/StationDetail';
import { TabType, ChargingStation, Transaction, SYSTEM_MESSAGES } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState<string>(""); 
  const [userName, setUserName] = useState<string>("Khách");
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // 1. Lấy thông tin thực từ Zalo (Không dùng user_001 nữa)
  useEffect(() => {
    api.getUserInfo({
      success: (data) => {
        const { id, name, avatar } = data.userInfo;
        setUserId(id);
        setUserName(name);
        setUserAvatar(avatar);
      },
      fail: (error) => {
        console.error("Zalo SDK Error:", error);
        setUserId("guest_dev"); // ID dự phòng khi dev trên trình duyệt
      }
    });
  }, []);

  // 2. Đồng bộ hóa dữ liệu Trạm sạc (Realtime)
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

  // 3. Đồng bộ hóa Ví tiền & Thông báo dựa trên User ID thật
  useEffect(() => {
    if (!userId) return;
    const userRef = ref(db, `users/${userId}`);
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
        if (data.notify) handleSystemNotify(data.notify);
      }
    });
    return () => unsubscribe();
  }, [userId]);

  const handleSystemNotify = (code: string) => {
    const notification = SYSTEM_MESSAGES[code];
    if (notification) {
      setStatusMsg(notification.msg);
      setShowStatusUpdate(true);
      setTimeout(() => setShowStatusUpdate(false), 4000);
    }
  };

  const refreshBalance = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  // 4. Hàm gửi lệnh: Tích hợp xin quyền Push Notification 01 lần duy nhất
  const sendCommand = async (cmd: string, stationId?: string) => {
    if (isRefreshing || !userId) return;

    // Xin quyền cho tất cả các mẫu thông báo khi người dùng bắt đầu sạc
    if (cmd.startsWith('buy_')) {
      api.requestSendNotification({
        templateIds: [
          "ID_MAU_BAT_DAU", // Thay bằng ID thật từ Zalo Dev
          "ID_MAU_HOAN_TAT", 
          "ID_MAU_LOI_HE_THONG"
        ],
        success: (res) => console.log("Permission granted:", res),
        fail: (err) => console.warn("Permission denied:", err)
      });
    }

    setIsRefreshing(true);
    try {
      await push(ref(db, "commands"), {
        uid: userId,
        stationId: stationId || null,
        cmd: cmd,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setStatusMsg("Đang xử lý...");
      setShowStatusUpdate(true);
    } catch (e) {
      setStatusMsg("Lỗi kết nối!");
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setShowStatusUpdate(false);
      }, 2000);
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
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] pb-32 overflow-hidden text-slate-900">
      
      {/* 🔔 Toast Notification hiện đại */}
      {showStatusUpdate && (
        <div className="fixed top-20 left-4 right-4 z-[100] animate-in fade-in slide-in-from-top-5">
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <div className="bg-blue-500 p-1.5 rounded-full animate-pulse">
              <BellRing size={14} />
            </div>
            <span className="text-[13px] font-bold tracking-tight uppercase">{statusMsg}</span>
          </div>
        </div>
      )}

      {/* 🏗️ Header: Glassmorphism Design */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-100 p-4 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-800 leading-none">EVION</h1>
            <span className="text-[9px] font-bold text-blue-600 tracking-[0.2em] uppercase">Connect & Charge</span>
          </div>
        </div>
        
        <button 
          onClick={refreshBalance}
          disabled={isRefreshing}
          className="bg-slate-50 border border-slate-100 pl-4 pr-1.5 py-1.5 rounded-full flex items-center gap-3 active:scale-95 transition-all shadow-inner"
        >
          <span className="text-xs font-black text-slate-700">{balance.toLocaleString()}đ</span>
          <div className="bg-blue-600 p-1.5 rounded-full text-white shadow-md">
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
          </div>
        </button>
      </header>

      {/* 📱 Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-4 overflow-y-auto">
        {renderContent()}
      </main>

      {/* 🛸 Floating Navigation Bar */}
      <nav className="fixed bottom-8 left-6 right-6 z-50">
        <div className="bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 flex justify-around items-center h-20 px-2">
          <NavItem icon={<Home />} label="Trạm" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={<QrCode />} label="Nạp" active={activeTab === 'deposit'} onClick={() => setActiveTab('deposit')} />
          <NavItem icon={<Clock />} label="Lịch sử" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <NavItem icon={<User />} label="Tôi" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </div>
      </nav>

      {/* 🤖 AI Assistant Button */}
      {!isAIChatOpen && (
        <button 
          onClick={() => setIsAIChatOpen(true)}
          className="fixed right-6 bottom-32 bg-white p-4 rounded-3xl shadow-xl text-blue-600 active:scale-90 z-40 border-2 border-blue-50 transition-all"
        >
          <MessageCircle size={24} fill="currentColor" className="opacity-20 absolute scale-150" />
          <MessageCircle size={24} className="relative z-10" />
        </button>
      )}

      {/* 💬 AI Chat Drawer (Mô phỏng) */}
      {isAIChatOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md h-[70vh] bg-white rounded-t-[3rem] shadow-2xl relative p-8">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" onClick={() => setIsAIChatOpen(false)} />
            <div className="flex items-center gap-4 mb-6">
              <img src={userAvatar || 'https://via.placeholder.com/150'} className="w-12 h-12 rounded-2xl border-2 border-blue-50" />
              <div>
                <h3 className="font-black text-slate-800">Chào {userName},</h3>
                <p className="text-sm text-slate-400 font-medium">Tôi là EVION AI. Bạn cần hỗ trợ gì?</p>
              </div>
            </div>
            <div className="space-y-4">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600">Bạn muốn tìm trạm sạc gần nhất hay nạp thêm tiền?</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 🎨 Sub-component: NavItem với hiệu ứng Active mượt mà
const NavItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-500 ${active ? 'text-white' : 'text-slate-500'}`}
  >
    <div className={`p-3 rounded-2xl transition-all duration-300 ${active ? 'bg-blue-600 shadow-lg shadow-blue-500/50 scale-110 -translate-y-2' : 'hover:bg-white/5'}`}>
      {React.cloneElement(icon as React.ReactElement<any>, { size: 22, strokeWidth: active ? 2.5 : 2 })}
    </div>
    {!active && <span className="text-[10px] font-black mt-1 uppercase tracking-widest">{label}</span>}
  </button>
);

export default App;