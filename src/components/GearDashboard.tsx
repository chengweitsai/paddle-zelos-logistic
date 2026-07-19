import React, { useState, useMemo } from 'react';
import { RentalRecord, InventoryStats } from '../types';
import { 
  Search, ShieldAlert, ShieldCheck, CheckCircle2, AlertCircle, 
  Settings, Save, Anchor, Sparkles, HelpCircle, User, RefreshCw
} from 'lucide-react';

interface GearDashboardProps {
  rentals: RentalRecord[];
  isLoading: boolean;
  onRefresh: () => void;
  error: string | null;
}

export const GearDashboard: React.FC<GearDashboardProps> = ({ 
  rentals, 
  isLoading, 
  onRefresh, 
  error 
}) => {
  // Club's default total inventory
  const [totals, setTotals] = useState({
    carbonPaddle: 20,
    woodPaddle: 15,
    lifeJacket: 25,
    buttPad: 30
  });

  const [showConfig, setShowConfig] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unconfirmed' | 'unpaid' | 'confirmed'>('all');

  // Input editing state for config
  const [editTotals, setEditTotals] = useState({ ...totals });

  const handleSaveConfig = () => {
    setTotals({ ...editTotals });
    setShowConfig(false);
  };

  // Compute stats based on active rental records
  // We assume active records are those listed in the spreadsheet.
  const stats = useMemo<InventoryStats>(() => {
    let carbon = 0;
    let wood = 0;
    let lifeJacket = 0;
    let buttPad = 0;

    rentals.forEach(r => {
      carbon += r.carbonPaddlesCount || 0;
      wood += r.woodPaddlesCount || 0;
      lifeJacket += r.lifeJacketCount || 0;
      buttPad += r.buttPadCount || 0;
    });

    return {
      carbonPaddle: { total: totals.carbonPaddle, borrowed: Math.min(totals.carbonPaddle, carbon) },
      woodPaddle: { total: totals.woodPaddle, borrowed: Math.min(totals.woodPaddle, wood) },
      lifeJacket: { total: totals.lifeJacket, borrowed: Math.min(totals.lifeJacket, lifeJacket) },
      buttPad: { total: totals.buttPad, borrowed: Math.min(totals.buttPad, buttPad) }
    };
  }, [rentals, totals]);

  // Filtered list of rentals
  const filteredRentals = useMemo(() => {
    return rentals.filter(r => {
      const matchSearch = r.borrower.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.carbonPaddleNumbers && r.carbonPaddleNumbers.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (r.woodPaddleNumbers && r.woodPaddleNumbers.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;

      switch (filterType) {
        case 'unconfirmed':
          return !r.confirmed;
        case 'confirmed':
          return r.confirmed;
        case 'unpaid':
          return !r.paymentConfirmed;
        case 'all':
        default:
          return true;
      }
    });
  }, [rentals, searchQuery, filterType]);

  const progressColor = (ratio: number) => {
    if (ratio >= 0.9) return 'bg-rose-500';
    if (ratio >= 0.7) return 'bg-amber-500';
    return 'bg-[#06C755]';
  };

  return (
    <div className="space-y-5">
      {/* Dynamic Inventory Ring / Bars */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Anchor className="text-[#06C755] animate-pulse" size={20} />
            <h2 className="text-sm font-bold text-slate-800">公用裝備可用狀態</h2>
          </div>
          <button 
            onClick={() => {
              setEditTotals({ ...totals });
              setShowConfig(!showConfig);
            }}
            id="btn-toggle-inventory-config"
            className="flex items-center gap-1 text-xs text-slate-500 font-semibold hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Settings size={14} />
            設定總量
          </button>
        </div>

        {/* Configuration Panel */}
        {showConfig && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3.5 animate-fadeIn">
            <h3 className="text-xs font-bold text-slate-600 tracking-wider uppercase">更改隊部裝備總庫存</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">碳纖維槳總數</label>
                <input 
                  type="number" 
                  value={editTotals.carbonPaddle} 
                  onChange={e => setEditTotals({ ...editTotals, carbonPaddle: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-hidden focus:border-[#06C755]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">木槳總數</label>
                <input 
                  type="number" 
                  value={editTotals.woodPaddle} 
                  onChange={e => setEditTotals({ ...editTotals, woodPaddle: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-hidden focus:border-[#06C755]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">救生衣總數</label>
                <input 
                  type="number" 
                  value={editTotals.lifeJacket} 
                  onChange={e => setEditTotals({ ...editTotals, lifeJacket: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-hidden focus:border-[#06C755]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">屁墊總數</label>
                <input 
                  type="number" 
                  value={editTotals.buttPad} 
                  onChange={e => setEditTotals({ ...editTotals, buttPad: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-hidden focus:border-[#06C755]"
                />
              </div>
            </div>
            <button 
              onClick={handleSaveConfig}
              id="btn-save-inventory"
              className="w-full bg-[#06C755] hover:bg-[#05b54c] text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Save size={15} />
              儲存裝備數量
            </button>
          </div>
        )}

        {/* 4 Core Equipment Items Status Card */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '碳纖維槳', stats: stats.carbonPaddle, unit: '支', colorClass: 'from-slate-700 to-slate-900', key: 'carbon' },
            { label: '木槳', stats: stats.woodPaddle, unit: '支', colorClass: 'from-amber-600 to-amber-800', key: 'wood' },
            { label: '公用救生衣', stats: stats.lifeJacket, unit: '件', colorClass: 'from-orange-500 to-orange-600', key: 'jacket' },
            { label: '公用屁墊', stats: stats.buttPad, unit: '個', colorClass: 'from-teal-500 to-teal-600', key: 'pad' }
          ].map(item => {
            const available = item.stats.total - item.stats.borrowed;
            const ratio = item.stats.total > 0 ? item.stats.borrowed / item.stats.total : 0;
            return (
              <div key={item.key} className="bg-slate-50/50 rounded-xl p-3.5 border border-slate-200/60 flex flex-col justify-between space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-500">{item.label}</span>
                  <span className="text-[10px] bg-slate-200/50 text-slate-600 font-bold px-1.5 py-0.5 rounded-md">
                    總庫存 {item.stats.total}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-black ${available === 0 ? 'text-rose-500' : 'text-slate-800'}`}>
                    {available}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{item.unit} 可借</span>
                </div>
                {/* Micro Progress Bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${progressColor(ratio)}`}
                    style={{ width: `${ratio * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  已借出 {item.stats.borrowed} {item.unit}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rentals Filter & List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-slate-800">借用名單與確認狀態</h3>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200/60">
              {rentals.length} 筆紀錄
            </span>
          </div>
          <button 
            onClick={onRefresh}
            id="btn-refresh-data"
            disabled={isLoading}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="手動刷新資料"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Query Input */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="搜尋借用人姓名、槳編號、備註..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#06C755] focus:ring-2 focus:ring-[#06C755]/10 shadow-2xs transition-all"
          />
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={15} />
        </div>

        {/* Filter Quick-Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {[
            { id: 'all', label: '全部 📋' },
            { id: 'unconfirmed', label: '幹部未確認 ⏳' },
            { id: 'unpaid', label: '未付款 💸' },
            { id: 'confirmed', label: '已確認合格 ✅' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap border transition-all cursor-pointer ${
                filterType === tab.id 
                  ? 'bg-[#06C755] border-[#06C755] text-white shadow-xs' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List of Rentals */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-2.5 text-rose-700 text-xs font-semibold">
            <AlertCircle size={16} className="shrink-0" />
            <div>
              <p>資料加載失敗：{error}</p>
              <button onClick={onRefresh} className="mt-1 text-blue-600 underline font-bold">點此重試</button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#06C755] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-semibold">正在從 Google Sheet 載入即時裝備租借狀態...</p>
          </div>
        ) : filteredRentals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
            <HelpCircle size={32} className="text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-500">無符合條件的借用紀錄</p>
            <p className="text-xs text-slate-400">請嘗試更改關鍵字或篩選分類。</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredRentals.map(record => {
              // Summarize gear for this borrower
              const gears: string[] = [];
              if (record.carbonPaddlesCount > 0) {
                gears.push(`碳纖槳 x${record.carbonPaddlesCount}${record.carbonPaddleNumbers ? ` (${record.carbonPaddleNumbers})` : ''}`);
              }
              if (record.woodPaddlesCount > 0) {
                gears.push(`木槳 x${record.woodPaddlesCount}${record.woodPaddleNumbers ? ` (${record.woodPaddleNumbers})` : ''}`);
              }
              if (record.lifeJacketCount > 0) {
                gears.push(`救生衣 x${record.lifeJacketCount}`);
              }
              if (record.buttPadCount > 0) {
                gears.push(`屁墊 x${record.buttPadCount}`);
              }

              return (
                <div 
                  key={record.id} 
                  className="bg-white rounded-xl p-4 border border-slate-200/80 hover:border-[#06C755]/30 hover:shadow-xs transition-all shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <User size={14} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">
                          {record.borrower}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {record.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex gap-1.5">
                        {record.confirmed ? (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold bg-[#06C755]/10 text-[#06C755] border border-[#06C755]/20 px-1.5 py-0.5 rounded-md">
                            <ShieldCheck size={11} /> 幹部已確認
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60 px-1.5 py-0.5 rounded-md">
                            <ShieldAlert size={11} /> 未核對
                          </span>
                        )}
                        
                        {record.paymentConfirmed ? (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200/60 px-1.5 py-0.5 rounded-md">
                            <CheckCircle2 size={11} /> 已付款
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded-md">
                            未核款
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Borrowed Gear Details */}
                  <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-200/50">
                    <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">借用清單</div>
                    {gears.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {gears.map((g, i) => (
                          <span key={i} className="text-xs font-semibold text-slate-700 bg-white border border-slate-200/60 px-2 py-1 rounded-lg">
                            {g}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-semibold">僅登記，無借用裝備</span>
                    )}
                  </div>

                  {/* Extra specs or comments */}
                  {(record.nextPracticePrep || record.notes) && (
                    <div className="text-xs space-y-1 border-t border-dashed border-slate-200 pt-2.5 text-slate-500 leading-relaxed">
                      {record.nextPracticePrep && (
                        <p>
                          <strong className="text-slate-600 font-bold">下次練習幹部協助：</strong>
                          {record.nextPracticePrep}
                        </p>
                      )}
                      {record.notes && (
                        <p>
                          <strong className="text-slate-600 font-bold">幹部備註：</strong>
                          {record.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
