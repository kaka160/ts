
import React, { useEffect, useState, useRef } from 'react';
import { 
  Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight, 
  Info, RefreshCw, Zap, ChevronLeft, Globe, Moon, CreditCard,
  ToggleLeft, ToggleRight, ShieldCheck, Check, Award, Fingerprint, Database
} from 'lucide-react';

interface Props {
  balance: number;
  stations: any[];
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

type ViewState = 'main' | 'security' | 'notifications' | 'settings' | 'support' | 'legal' | 'language';

const ProfilePage: React.FC<Props> = ({ balance, isRefreshing, onRefresh }) => {
  const [activeView, setActiveView] = useState<ViewState>('main');
  const [balanceAnim, setBalanceAnim] = useState(false);
  const prevBalance = useRef(balance);

  const [appSettings, setAppSettings] = useState({
    faceId: true,
    twoStep: true, 
    chargeNotif: true,
    transactionNotif: true,
    darkMode: false,
    language: 'Tiếng Việt',
    cacheSize: '24.5 MB'
  });

  const toggleSetting = (key: keyof typeof appSettings) => {
    setAppSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

useEffect(() => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  if (prevBalance.current !== balance) {
    setBalanceAnim(true);
    timer = setTimeout(() => setBalanceAnim(false), 1000);
    prevBalance.current = balance;
  }

  return () => {
    if (timer) clearTimeout(timer);
  };
}, [balance]);


  const renderMainView = () => (
    <div className="h-[calc(100vh-140px)] flex flex-col p-3 gap-3 animate-in fade-in duration-500 overflow-hidden">
      {/* Mini User Card */}
      <div className="glass-card p-3 rounded-[1.5rem] flex items-center gap-3 shadow-sm shrink-0">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f8fafc" 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-400 text-white p-0.5 rounded-md border-2 border-white">
            <Award size={8} fill="white" />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-[14px] font-black text-slate-800 leading-none">Nguyễn Văn A</h2>
          <div className="flex gap-1.5 mt-1">
             <span className="bg-amber-50 text-amber-600 text-[7px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">Gold Member</span>
             <span className="bg-zalo-blue text-white text-[7px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">VIP</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-extrabold text-slate-300 uppercase tracking-widest">ID: 102948</p>
        </div>
      </div>

      {/* Slim Wallet Card */}
      <div className="bg-gradient-to-br from-zalo-blue to-indigo-700 p-4 rounded-[1.8rem] shadow-lg shadow-blue-100 relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Zap size={12} className="fill-yellow-300 text-yellow-300" />
              <p className="text-[9px] font-black text-white/70 uppercase tracking-widest">Ví điện tử</p>
            </div>
            <p className={`text-2xl font-black text-white tracking-tighter tabular-nums ${balanceAnim ? 'scale-105' : ''} transition-transform`}>
              {balance.toLocaleString()}đ
            </p>
          </div>
          <button 
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md text-white active:scale-90 transition-all"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Menu List - Optimized for zero-scroll */}
      <div className="glass-card rounded-[1.8rem] shadow-sm border border-white/50 overflow-hidden shrink-0">
        <div className="divide-y divide-slate-100/50">
          <MenuButton 
            icon={<Shield className="text-zalo-blue" size={16} />} 
            label="Bảo mật" 
            onClick={() => setActiveView('security')}
          />
          <MenuButton 
            icon={<Bell className="text-amber-500" size={16} />} 
            label="Thông báo" 
            onClick={() => setActiveView('notifications')}
          />
          <MenuButton 
            icon={<Settings className="text-slate-500" size={16} />} 
            label="Cài đặt" 
            onClick={() => setActiveView('settings')}
          />
          <MenuButton 
            icon={<HelpCircle className="text-emerald-500" size={16} />} 
            label="Hỗ trợ" 
            onClick={() => setActiveView('support')} 
          />
          <MenuButton 
            icon={<Info className="text-slate-400" size={16} />} 
            label="Pháp lý" 
            onClick={() => setActiveView('legal')} 
          />
        </div>
      </div>

      {/* Logout Button pushed to the absolute bottom */}
      <div className="mt-auto px-1 pb-2 shrink-0">
        <button className="w-full flex items-center justify-center gap-2 py-4 text-rose-500 font-black text-[12px] active:bg-rose-50 rounded-[1.5rem] transition-all border border-rose-100 bg-white shadow-sm">
          <LogOut size={16} /> 
          <span className="uppercase tracking-widest">Đăng xuất hệ thống</span>
        </button>
      </div>

      <div className="text-center text-[7px] text-slate-300 font-black uppercase tracking-[0.2em] opacity-40 shrink-0 pb-1">
        EV MASTER • ENGINE V2.0.4
      </div>
    </div>
  );

  const renderSubView = (title: string, content: React.ReactNode, backTo: ViewState = 'main') => (
    <div className="h-[calc(100vh-140px)] flex flex-col p-3 gap-3 animate-in slide-in-from-right duration-400 overflow-hidden">
      <header className="flex items-center gap-3 shrink-0 py-1">
        <button 
          onClick={() => setActiveView(backTo)} 
          className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all"
        >
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-base font-black text-slate-800 tracking-tight">{title}</h2>
      </header>
      
      <div className="flex-1 overflow-hidden flex flex-col gap-3">
        {content}
      </div>
    </div>
  );

  const renderView = () => {
    switch(activeView) {
      case 'security': 
        return renderSubView('Bảo mật', (
          <div className="space-y-2">
            <ToggleItem 
              icon={<Fingerprint size={18} className="text-zalo-blue" />}
              label="Sinh trắc học"
              active={appSettings.faceId}
              onToggle={() => toggleSetting('faceId')}
            />
            <ToggleItem 
              icon={<ShieldCheck size={18} className="text-amber-500" />}
              label="Xác thực 2 lớp"
              active={appSettings.twoStep}
              onToggle={() => toggleSetting('twoStep')}
            />
            <div className="glass-card p-4 rounded-[1.5rem] flex items-center justify-between opacity-50">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Database size={16} />
                  </div>
                  <span className="text-[13px] font-extrabold text-slate-600">Lịch sử đăng nhập</span>
               </div>
               <ChevronRight size={14} className="text-slate-300" />
            </div>
          </div>
        ));

      case 'notifications':
        return renderSubView('Thông báo', (
          <div className="space-y-2">
            <ToggleItem 
              icon={<Zap size={18} className="text-amber-500" />} 
              label="Trạng thái sạc" 
              active={appSettings.chargeNotif} 
              onToggle={() => toggleSetting('chargeNotif')} 
            />
            <ToggleItem 
              icon={<CreditCard size={18} className="text-emerald-500" />} 
              label="Giao dịch" 
              active={appSettings.transactionNotif} 
              onToggle={() => toggleSetting('transactionNotif')} 
            />
          </div>
        ));

      case 'settings':
        return renderSubView('Cài đặt', (
          <div className="space-y-2">
            <div className="glass-card rounded-[1.5rem] overflow-hidden">
              <button 
                className="w-full p-4 flex items-center justify-between active:bg-slate-50 transition-colors"
                onClick={() => setActiveView('language')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-zalo-blue">
                    <Globe size={16} />
                  </div>
                  <span className="text-[13px] font-extrabold text-slate-700">Ngôn ngữ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-zalo-blue uppercase">{appSettings.language}</span>
                  <ChevronRight size={12} className="text-slate-300" />
                </div>
              </button>
              <div className="h-[1px] bg-slate-50 mx-4"></div>
              <ToggleItem 
                icon={<Moon size={18} className="text-indigo-500" />}
                label="Chế độ tối"
                active={appSettings.darkMode}
                onToggle={() => toggleSetting('darkMode')}
              />
            </div>
            
            <div className="glass-card p-4 rounded-[1.5rem] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <Database size={16} />
                </div>
                <div>
                  <p className="text-[13px] font-extrabold text-slate-700 leading-none">Bộ nhớ đệm</p>
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">{appSettings.cacheSize}</p>
                </div>
              </div>
              <button className="text-[9px] font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg active:bg-rose-100">DỌN DẸP</button>
            </div>
          </div>
        ));

      case 'language':
        return renderSubView('Ngôn ngữ', (
          <div className="glass-card rounded-[1.5rem] overflow-hidden">
            {['Tiếng Việt', 'English', '日本語'].map((lang, idx) => (
              <React.Fragment key={lang}>
                <button 
                  onClick={() => { setAppSettings(prev => ({...prev, language: lang})); setActiveView('settings'); }}
                  className="w-full p-4 flex justify-between items-center active:bg-blue-50 transition-all"
                >
                  <span className={`text-[13px] font-extrabold ${appSettings.language === lang ? 'text-zalo-blue' : 'text-slate-600'}`}>{lang}</span>
                  {appSettings.language === lang && <Check size={16} className="text-zalo-blue" />}
                </button>
                {idx < 2 && <div className="h-[1px] bg-slate-50 mx-4"></div>}
              </React.Fragment>
            ))}
          </div>
        ), 'settings');

      case 'support':
        return renderSubView('Hỗ trợ', (
          <div className="glass-card p-6 rounded-[2rem] text-center space-y-4 flex flex-col items-center justify-center flex-1">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-zalo-blue shrink-0">
              <HelpCircle size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-800">Cần giúp đỡ?</h3>
              <p className="text-[10px] text-slate-400 font-medium px-4">Kỹ thuật viên luôn túc trực 24/7 để hỗ trợ bạn nhanh nhất.</p>
            </div>
            <button className="w-full btn-primary text-white py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-wider">Gọi tổng đài</button>
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">Gửi email phản hồi</button>
          </div>
        ));

      case 'legal':
        return renderSubView('Pháp lý', (
          <div className="glass-card p-5 rounded-[1.5rem] space-y-3 flex-1 overflow-y-auto scrollbar-hide">
            <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
              <span className="text-zalo-blue font-black uppercase tracking-widest block mb-2">Điều khoản sử dụng</span>
              Sử dụng ứng dụng đồng nghĩa với việc bạn chấp nhận các chính sách bảo mật và điều kiện vận hành của EV Master. Chúng tôi bảo mật dữ liệu tuyệt đối theo tiêu chuẩn quốc tế.
            </p>
            <div className="h-[1px] bg-slate-50 w-full"></div>
            <p className="text-[8px] text-slate-300 italic font-medium text-center">Cập nhật lần cuối: 24/03/2024</p>
          </div>
        ));

      default: return renderMainView();
    }
  };

  return renderView();
};

const MenuButton = ({ icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-3.5 px-5 active:bg-blue-50/50 group transition-colors"
  >
    <div className="flex items-center gap-4">
      <div className="transition-transform group-active:scale-110 opacity-70 group-hover:opacity-100">{icon}</div>
      <span className="text-[13px] font-extrabold text-slate-700 tracking-tight">{label}</span>
    </div>
    <ChevronRight size={14} className="text-slate-200 group-active:translate-x-1 transition-transform" />
  </button>
);

const ToggleItem = ({ icon, label, active, onToggle }: any) => (
  <div 
    className="glass-card p-3 px-5 rounded-[1.5rem] flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all shadow-sm" 
    onClick={onToggle}
  >
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center opacity-70">
         {icon}
      </div>
      <span className="text-[13px] font-extrabold text-slate-700 tracking-tight">{label}</span>
    </div>
    <div className="transition-all">
      {active ? (
        <div className="text-zalo-blue"><ToggleRight size={28} /></div>
      ) : (
        <div className="text-slate-200"><ToggleLeft size={28} /></div>
      )}
    </div>
  </div>
);

export default ProfilePage;
