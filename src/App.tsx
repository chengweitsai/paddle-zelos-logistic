import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { RentalRecord } from './types';
import { AuthButton } from './components/AuthButton';
import { GearDashboard } from './components/GearDashboard';
import { GearDatabase } from './components/GearDatabase';
import { AIConsultant } from './components/AIConsultant';
import { 
  BarChart3, Tag, MessageCircle, Anchor, RefreshCw, 
  Settings, HelpCircle, FileSpreadsheet, ExternalLink 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'database' | 'consultant'>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [oauthToken, setOauthToken] = useState<string | null>(null);
  
  // Spreadsheet data state
  const [rentals, setRentals] = useState<RentalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom spreadsheet selection state for authorized users - persistent in localStorage
  const [customSpreadsheetId, setCustomSpreadsheetId] = useState(() => {
    return localStorage.getItem('customSpreadsheetId') || '';
  });
  const [showCustomConfig, setShowCustomConfig] = useState(false);

  // AI Coach show/hide state, default to false (disabled) per user request
  const [showAIConsultant, setShowAIConsultant] = useState(() => {
    return localStorage.getItem('showAIConsultant') === 'true';
  });
  const [showSettings, setShowSettings] = useState(false);

  // Core fetch function (100% client-side for GitHub Pages static compatibility)
  const fetchSheetData = useCallback(async (tokenToUse?: string | null, customId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      let rentalsData: RentalRecord[] = [];

      // If authorized user provides their own spreadsheet ID, fetch directly from Google Sheets API
      if (tokenToUse && customId) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(customId)}/values/${encodeURIComponent('表單回應 1!A1:P200')}`;
        const headers: HeadersInit = {
          'Authorization': `Bearer ${tokenToUse}`
        };
        
        const res = await fetch(url, { headers });
        if (!res.ok) {
          throw new Error(`連線 Google 試算表 API 失敗 (HTTP ${res.status})。請確認您輸入的試算表 ID 是否正確，且您是否具備存取該試算表的權限。`);
        }

        const data = await res.json();
        const rawValues = data.values;
        if (!rawValues || rawValues.length < 2) {
          throw new Error('試算表中無任何租借紀錄，或資料格式與欄位名稱不符規範。');
        }
        
        // Map row arrays to CSV grid parser structure
        const headersList = rawValues[0].map((h: string) => h.toLowerCase());
        const findIdx = (kws: string[]) => headersList.findIndex((h: string) => kws.some(k => h.includes(k)));
        
        const borrowerIdx = findIdx(['借用人']);
        if (borrowerIdx < 0) {
          throw new Error('試算表中找不到「借用人」欄位，請確認試算表格式。');
        }

        const records: RentalRecord[] = [];
        for (let r = 1; r < rawValues.length; r++) {
          const row = rawValues[r];
          if (!row || row.length === 0 || !row[borrowerIdx]) continue;
          
          const getVal = (idx: number, fallback = '') => (idx >= 0 && idx < row.length ? row[idx] : fallback);
          const parseNum = (str: string) => {
            const n = parseInt(str.replace(/[^0-9]/g, ''), 10);
            return isNaN(n) ? 0 : n;
          };
          
          records.push({
            id: `${r}-${getVal(findIdx(['時間'])) || Date.now()}-${getVal(borrowerIdx)}`,
            timestamp: getVal(findIdx(['時間戳記', '時間'])),
            borrower: getVal(borrowerIdx),
            confirmed: getVal(findIdx(['是否已確認', '確認'])).includes('是') || getVal(findIdx(['是否已確認', '確認'])).includes('已') || getVal(findIdx(['是否已確認', '確認'])).includes('v') || getVal(findIdx(['是否已確認', '確認'])).includes('o'),
            paymentConfirmed: getVal(findIdx(['付款', '追帳'])).includes('是') || getVal(findIdx(['付款', '追帳'])).includes('已') || getVal(findIdx(['付款', '追帳'])).includes('v') || getVal(findIdx(['付款', '追帳'])).includes('o'),
            rentalDate: getVal(findIdx(['借用日期'])) || getVal(findIdx(['時間戳記', '時間'])).split(' ')[0] || '',
            returnDate: getVal(findIdx(['歸還'])),
            carbonPaddlesCount: parseNum(getVal(findIdx(['碳纖維槳幾隻', '碳纖維槳數量']))),
            carbonPaddleNumbers: getVal(findIdx(['碳纖維槳編號'])),
            woodPaddlesCount: parseNum(getVal(findIdx(['木槳幾隻', '木槳數量']))),
            woodPaddleNumbers: getVal(findIdx(['木槳編號'])),
            lifeJacketRequested: getVal(findIdx(['救生衣'])).includes('借') || getVal(findIdx(['救衣'])).includes('需'),
            lifeJacketCount: parseNum(getVal(findIdx(['救生衣']))) || (getVal(findIdx(['救生衣'])).includes('借') || getVal(findIdx(['救生衣'])).includes('需') ? 1 : 0),
            buttPadRequested: getVal(findIdx(['屁墊'])).includes('借') || getVal(findIdx(['屁墊'])).includes('需'),
            buttPadCount: parseNum(getVal(findIdx(['屁墊']))) || (getVal(findIdx(['屁墊'])).includes('借') || getVal(findIdx(['屁墊'])).includes('需') ? 1 : 0),
            nextPracticePrep: getVal(findIdx(['下次練習', '幹部幫我準備'])),
            notes: getVal(findIdx(['新人', '備註'])),
            quantity: 1
          });
        }
        rentalsData = records;
      } else {
        // Direct browser CSV fetch of public spreadsheet
        const spreadsheetId = '1VOencdl4jRY2xh-L-ZkE7QVaP_XcYrTnZ8rL4FI1SFI';
        const gid = '288109580';
        const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
        
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`獲取 Google 試算表 CSV 失敗 (HTTP ${res.status})。`);
        }
        
        const csvText = await res.text();
        const { mapCSVToRentals } = await import('./utils/csvParser');
        rentalsData = mapCSVToRentals(csvText);
      }

      setRentals(rentalsData);
    } catch (err: any) {
      console.error('Fetch data error:', err);
      setError(err.message || '無法下載或解析裝備試算表。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch public or cached custom spreadsheet on mount
  useEffect(() => {
    const cachedId = localStorage.getItem('customSpreadsheetId') || '';
    if (oauthToken && cachedId) {
      fetchSheetData(oauthToken, cachedId);
    } else {
      fetchSheetData(null, '');
    }
  }, [fetchSheetData, oauthToken]);

  const handleAuthChange = useCallback((currentUser: User | null, token: string | null) => {
    setUser(currentUser);
    setOauthToken(token);
    const cachedId = localStorage.getItem('customSpreadsheetId') || '';
    if (currentUser && cachedId) {
      fetchSheetData(token, cachedId);
    } else {
      fetchSheetData(null, '');
    }
  }, [fetchSheetData]);

  const handleApplyCustomSheet = () => {
    if (!customSpreadsheetId.trim()) {
      localStorage.removeItem('customSpreadsheetId');
      fetchSheetData(oauthToken, '');
      return;
    }
    const cleanId = customSpreadsheetId.trim();
    localStorage.setItem('customSpreadsheetId', cleanId);
    fetchSheetData(oauthToken, cleanId);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F9] flex flex-col justify-center sm:py-6 px-0 sm:px-4 antialiased">
      {/* Outer shell mimicking a mobile viewport in desktop view */}
      <div className="w-full max-w-[480px] mx-auto bg-slate-50 flex-1 flex flex-col sm:shadow-2xl sm:rounded-3xl border border-transparent sm:border-slate-200 overflow-hidden min-h-[100vh] sm:min-h-[85vh]">
        
        {/* App Header Bar */}
        <header className="bg-white border-b border-slate-200 p-5 space-y-3.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#06C755] rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs">
                <Anchor size={20} className="text-white fill-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-800 leading-tight">龍舟公用裝備狀態</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">LINE Webview • V2.4</p>
              </div>
            </div>
            
            {/* Status indicator pill */}
            <span className="text-[10px] font-extrabold bg-[#06C755]/10 text-[#06C755] px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 bg-[#06C755] rounded-full animate-ping" />
              連線同步中
            </span>
          </div>

          {/* Source spreadsheet link banner */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl text-[11px] font-medium text-slate-600">
            <div className="flex items-center gap-1.5 min-w-0">
              <FileSpreadsheet size={13} className="text-[#06C755] shrink-0" />
              <span className="truncate max-w-[190px]">
                {customSpreadsheetId ? '自訂試算表' : '預設公用資料庫 (試算表)'}
              </span>
            </div>
            <a 
              href="https://docs.google.com/spreadsheets/d/1VOencdl4jRY2xh-L-ZkE7QVaP_XcYrTnZ8rL4FI1SFI/edit?resourcekey=&gid=288109580#gid=288109580" 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#06C755] hover:text-[#05b54c] font-bold flex items-center gap-0.5 shrink-0 transition-colors"
            >
              開啟試算表 <ExternalLink size={10} />
            </a>
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-4 overflow-y-auto space-y-4">
          
          {/* Authenticated user features */}
          {oauthToken && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">試算表連接選項</span>
                <button 
                  onClick={() => setShowCustomConfig(!showCustomConfig)}
                  id="btn-toggle-custom-sheet"
                  className="text-xs font-bold text-[#06C755] hover:underline"
                >
                  {showCustomConfig ? '收合' : '連線自訂試算表 ID'}
                </button>
              </div>

              {showCustomConfig && (
                <div className="space-y-2.5">
                  <p className="text-[10px] text-slate-400 font-medium">
                    您可以輸入另一個 Google 試算表 ID 作為數據源（欄位格式需與預設表格一致）：
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="輸入 Spreadsheet ID..."
                      value={customSpreadsheetId}
                      onChange={e => setCustomSpreadsheetId(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden focus:bg-white focus:border-[#06C755]"
                    />
                    <button 
                      onClick={handleApplyCustomSheet}
                      id="btn-apply-custom-sheet"
                      className="bg-slate-800 text-white font-bold text-xs px-3.5 rounded-xl hover:bg-slate-950 transition-colors"
                    >
                      連線
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* General App Settings */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 select-none">
                <Settings size={14} className="text-slate-500 animate-spin-slow" />
                系統設定
              </span>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                id="btn-toggle-settings"
                className="text-xs font-bold text-[#06C755] hover:underline cursor-pointer"
              >
                {showSettings ? '收合' : '展開'}
              </button>
            </div>

            {showSettings && (
              <div className="pt-2 border-t border-slate-100 space-y-3.5 text-left animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">啟用 AI 諮詢教練</div>
                    <div className="text-[10px] text-slate-400 font-medium">在底部導覽列中顯示 AI 裝備教練對話框</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={showAIConsultant}
                      onChange={e => {
                        const checked = e.target.checked;
                        setShowAIConsultant(checked);
                        if (checked) {
                          localStorage.setItem('showAIConsultant', 'true');
                        } else {
                          localStorage.removeItem('showAIConsultant');
                          if (activeTab === 'consultant') {
                            setActiveTab('dashboard');
                          }
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#06C755]"></div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Active Tab View Rendering */}
          <div className="pb-4">
            {activeTab === 'dashboard' && (
              <GearDashboard 
                rentals={rentals} 
                isLoading={isLoading} 
                onRefresh={() => fetchSheetData(oauthToken, customSpreadsheetId)} 
                error={error}
              />
            )}

            {activeTab === 'database' && <GearDatabase />}

            {activeTab === 'consultant' && showAIConsultant && <AIConsultant />}
          </div>
        </main>

        {/* Floating/Bottom Auth Profile Container */}
        <div className="px-4 py-3 bg-white border-t border-slate-200 shadow-xs">
          <AuthButton onAuthChange={handleAuthChange} />
        </div>

        {/* Sticky LINE-styled Bottom Navigation Bar */}
        <nav className="bg-white border-t border-slate-200 px-3 py-2.5 flex justify-around items-center sticky bottom-0 z-20">
          {[
            { id: 'dashboard', label: '狀態看板', icon: <BarChart3 size={18} />, colorClass: 'text-[#06C755]' },
            { id: 'database', label: '詳細規格', icon: <Tag size={18} />, colorClass: 'text-[#06C755]' },
            { id: 'consultant', label: '教練諮詢', icon: <MessageCircle size={18} />, colorClass: 'text-[#06C755]', hidden: !showAIConsultant }
          ].filter(tab => !tab.hidden).map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                id={`nav-tab-${tab.id}`}
                className={`flex flex-col items-center gap-1.5 py-1.5 px-4.5 rounded-xl transition-all cursor-pointer ${
                  isSelected 
                    ? `font-bold ${tab.colorClass} bg-[#06C755]/10 scale-105` 
                    : 'text-slate-400 font-medium hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] leading-tight tracking-wider font-semibold">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
