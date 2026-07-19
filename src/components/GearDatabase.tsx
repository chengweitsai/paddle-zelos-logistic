import React, { useState, useMemo } from 'react';
import { GEAR_DATABASE } from '../data';
import { GearItem } from '../types';
import { Search, ExternalLink, HelpCircle, Layers, Award, Tag, Sparkles, X, Info } from 'lucide-react';

export const GearDatabase: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'paddle' | 'lifejacket' | 'buttpad' | 'accessory'>('all');
  const [selectedGear, setSelectedGear] = useState<GearItem | null>(null);

  // Filter products based on category and query
  const filteredGear = useMemo(() => {
    return GEAR_DATABASE.filter(g => {
      const matchCategory = selectedCategory === 'all' || g.category === selectedCategory;
      if (!matchCategory) return false;

      const q = searchQuery.toLowerCase();
      return g.name.toLowerCase().includes(q) ||
             g.description.toLowerCase().includes(q) ||
             g.specs.material.toLowerCase().includes(q) ||
             g.specs.suitability.toLowerCase().includes(q) ||
             g.specs.features.some(f => f.toLowerCase().includes(q));
    });
  }, [searchQuery, selectedCategory]);

  const getCategoryEmoji = (cat: string) => {
    switch (cat) {
      case 'paddle': return '🛶';
      case 'lifejacket': return '🎽';
      case 'buttpad': return '🍑';
      case 'accessory': return '🎒';
      default: return '📦';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'paddle': return '龍舟槳';
      case 'lifejacket': return '救生衣';
      case 'buttpad': return '屁墊坐墊';
      case 'accessory': return '附屬配件';
      default: return '一般裝備';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Category Quick Tabs */}
      <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <input 
            type="text" 
            placeholder="搜尋槳、救生衣、屁墊、規格、材質..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#06C755] focus:ring-2 focus:ring-[#06C755]/10 transition-all"
          />
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={15} />
        </div>

        {/* Categories Grid */}
        <div className="flex gap-1 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {[
            { id: 'all', label: '全部裝備 🏷️' },
            { id: 'paddle', label: '龍舟槳 🛶' },
            { id: 'lifejacket', label: '救生衣 🎽' },
            { id: 'buttpad', label: '屁墊 🍑' },
            { id: 'accessory', label: '配件 🎒' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl border whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === tab.id 
                  ? 'bg-[#06C755] border-[#06C755] text-white shadow-xs' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Gear Items */}
      {filteredGear.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
          <HelpCircle size={32} className="text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">找不到相符的裝備</p>
          <p className="text-xs text-slate-400">請嘗試更改搜尋關鍵字。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredGear.map(item => (
            <div 
              key={item.id} 
              onClick={() => setSelectedGear(item)}
              id={`gear-card-${item.id}`}
              className="bg-white rounded-xl p-4 border border-slate-200/80 hover:border-[#06C755]/30 hover:shadow-xs transition-all cursor-pointer text-left flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-[#06C755] bg-[#06C755]/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {getCategoryEmoji(item.category)} {getCategoryLabel(item.category)}
                  </span>
                  <span className="text-xs text-slate-400 font-bold group-hover:text-[#06C755] transition-colors">
                    詳細規格 →
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-[#06C755] transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Highlights Specs Row */}
              <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-100 pt-3">
                <div>
                  <span className="text-slate-400 font-medium block">材質</span>
                  <span className="text-slate-700 font-semibold truncate block">{item.specs.material}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">重量</span>
                  <span className="text-slate-700 font-semibold truncate block">{item.specs.weight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Bottom-Sheet / Dialog Modal */}
      {selectedGear && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto flex flex-col shadow-2xl animate-slideUp">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getCategoryEmoji(selectedGear.category)}</span>
                <div>
                  <span className="text-[10px] font-extrabold text-[#06C755] bg-[#06C755]/10 px-2 py-0.5 rounded-md uppercase tracking-wider block w-fit mb-0.5">
                    {getCategoryLabel(selectedGear.category)}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 leading-snug">
                    {selectedGear.name}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedGear(null)}
                id="btn-close-gear-detail"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-5 text-left flex-1 overflow-y-auto">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Info size={13} className="text-[#06C755]" />
                  裝備簡介
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedGear.description}
                </p>
              </div>

              {/* Specs parameters list */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-500 tracking-wider uppercase flex items-center gap-1">
                  <Award size={13} className="text-amber-500" />
                  詳細規格參數
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-3 py-1 border-b border-slate-200/50">
                    <span className="text-slate-400 font-medium">材質</span>
                    <span className="col-span-2 text-slate-700 font-semibold">{selectedGear.specs.material}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-slate-200/50">
                    <span className="text-slate-400 font-medium">重量</span>
                    <span className="col-span-2 text-slate-700 font-semibold">{selectedGear.specs.weight}</span>
                  </div>
                  {selectedGear.specs.length && (
                    <div className="grid grid-cols-3 py-1 border-b border-slate-200/50">
                      <span className="text-slate-400 font-medium">適用長度</span>
                      <span className="col-span-2 text-slate-700 font-semibold">{selectedGear.specs.length}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 py-1">
                    <span className="text-slate-400 font-medium">特色要點</span>
                    <div className="col-span-2 text-slate-700 font-semibold space-y-1">
                      {selectedGear.specs.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span className="text-[#06C755]">✓</span> {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Suitability */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Sparkles size={13} className="text-purple-500" />
                  適合對象與建議
                </span>
                <p className="text-xs text-slate-700 bg-purple-50/40 border border-purple-100/50 p-3 rounded-xl leading-relaxed">
                  {selectedGear.specs.suitability}
                </p>
              </div>

              {/* Club rental option */}
              <div className="bg-[#06C755]/5 border border-[#06C755]/15 p-4 rounded-xl space-y-2 text-xs">
                <h4 className="font-bold text-[#06C755] flex items-center gap-1">
                  🛶 隊部租借方案
                </h4>
                <p className="text-slate-700 leading-relaxed font-semibold">
                  {selectedGear.acquisition.clubRental}
                </p>
              </div>

              {/* Acquisition and shopping link */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Tag size={13} className="text-orange-500" />
                  獲取途徑與參考價格
                </span>
                <div className="space-y-2">
                  <div className="bg-orange-50/30 border border-orange-100/50 p-3.5 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-bold text-orange-800">
                      <span>購買方式</span>
                      <span>預估價格</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-semibold">
                      <span className="max-w-[200px]">{selectedGear.acquisition.method}</span>
                      <span className="text-slate-800 font-bold">{selectedGear.acquisition.priceRange}</span>
                    </div>
                  </div>

                  {/* Purchase outbound links */}
                  <div className="space-y-1.5">
                    {selectedGear.acquisition.links.map((link, idx) => (
                      <a 
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs p-3 rounded-xl flex items-center justify-between border border-slate-200 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 truncate max-w-[280px]">
                          🔗 {link.label}
                        </span>
                        <ExternalLink size={13} className="text-slate-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-center sticky bottom-0">
              <button 
                onClick={() => setSelectedGear(null)}
                id="btn-close-gear-bottom"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer"
              >
                回到裝備庫
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
