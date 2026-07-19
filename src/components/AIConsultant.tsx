import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, Sparkles, MessageCircle, AlertCircle, HelpCircle, Key, Check, Trash2 } from 'lucide-react';

// Highly-polished local expert advisor responder (100% offline & client-side compatible)
const getLocalResponse = (userText: string): string => {
  const text = userText.toLowerCase().trim();
  
  // Height check: look for numbers around 140 to 200
  const heightMatch = text.match(/\b(1[4-9]\d|200)\b/);
  if (heightMatch) {
    const height = parseInt(heightMatch[1], 10);
    let recLength = "46 英吋";
    let rationale = "";
    
    if (height < 155) {
      recLength = "44 - 45 英吋";
      rationale = "適合身材較為嬌小的划手或負責帶領節奏的前排槳手，能提供高頻率的起槳速度，划水阻力適中，好控槳。";
    } else if (height <= 165) {
      recLength = "46 英吋";
      rationale = "適合標準身材的划手。46 英吋是台灣女性與一般中等體型最通用的標準規格，平衡感與控制力最佳。";
    } else if (height <= 175) {
      recLength = "47 - 48 英吋";
      rationale = "適合一般大眾男划手與力量型女划手。能提供優異的抓水長度、較大的槓桿與強大划距推進力。";
    } else if (height <= 185) {
      recLength = "49 - 50 英吋";
      rationale = "適合身材高大、排槳主力或中後段動力槳手。需要較長的力臂以及強大的核心肌肉力量來驅動。";
    } else {
      recLength = "51 英吋";
      rationale = "適合極高大體型的專業划手。需要配合極佳的身體爆發力與大槳距、長划距技術。";
    }
    
    return `### 📏 您的專屬龍舟槳長度推薦
經教練精密分析，針對您 **${height} cm** 的身高，推薦：
👉 **建議槳長： ${recLength}**

**💡 教練解析與建議：**
- **規格定位：** ${rationale}
- **推薦款式：** 建議選擇 【極速水星 3K 碳纖維槳】 (46-48吋) 或 【巨浪木製專業龍舟槳】 進行練習體驗。
- **調整準則：** 如果您的划姿坐姿較高或手臂較長，可以往上挑選 0.5 到 1 英吋；若是以高槳頻為主，可往下選 0.5 英吋。

**🛶 俱樂部租借對策：**
您可以在本看板登記借用 **公用木槳**（免費）或向教練申請租用 **碳纖維專業槳**（月租費僅 $150，新人首月免費喔！）`;
  }

  // General Paddle selection
  if (text.includes('挑選') || text.includes('長度') || text.includes('尺寸') || text.includes('對照') || text.includes('多長') || text.includes('長短')) {
    return `### 📏 龍舟槳長度黃金對照表
教練為大家整理了最科學的身高與建議槳長對照：

- **身高 155cm 以下：** 建議 **44 - 45 英吋** (高頻起槳，輕巧控槳)
- **身高 156 - 165cm：** 建議 **46 英吋** (標準全能，最普遍規格)
- **身高 166 - 175cm：** 建議 **47 - 48 英吋** (力量抓水，爆發推進)
- **身高 176 - 185cm：** 建議 **49 - 50 英吋** (高大身材，中後段排槳)
- **身高 186cm 以上：** 建議 **51 英吋** (巨人划手專用)

**💡 如何精準微調選槳？**
1. **槳手位置：** 龍舟頭槳（1-2排）通常偏好短槳（高槳頻），中段動力槳手偏好長槳（拉長划距）。
2. **座墊厚度：** 若有使用較厚的屁墊，視同身體增高，建議增加 0.5 到 1 英吋。
3. **測試方式：** 槳垂直倒立放地上，手握著 T 字柄，若手肘能剛好呈 90 度，即為完美長度！`;
  }

  // Carbon rentals
  if (text.includes('碳') || text.includes('碳纖維') || text.includes('租') || text.includes('費用') || text.includes('付')) {
    if (text.includes('屁墊') || text.includes('救生衣') || text.includes('木槳')) {
      // mix query - fall through to general explanation
    } else {
      return `### 🛶 碳纖維槳租借方案與流程
隊部提供高品質 **3K 碳纖維輕量槳** (每隻重量僅約 360g)，能大幅減輕手臂負擔並提升進水感！

**💰 租借費用：**
- **月租方案：** 每月 NT$ 150 (無限次練習使用，可保管專屬編號槳)。
- **新人首月：** **免費體驗！** (讓新人能在決定添購前充分體驗碳纖維槳的性能)。

**📝 借用流程：**
1. 在本看板「狀態看板」查看碳纖維槳可用數量。
2. 練習當天向器材幹部登記編號，並於試算表中確認。
3. 費用於每月 5 號前統一轉帳給財務幹部。`;
    }
  }

  // Public gear / Free gear
  if (text.includes('木') || text.includes('救生衣') || text.includes('屁墊') || text.includes('免費') || text.includes('不用錢')) {
    return `### 🛶 隊部公用裝備（免費借用規則）
隊部宗旨是讓大家無痛享受水上運動！以下裝備皆為 **免費提供** 給全體隊員：

- **🪵 巨浪木製專業龍舟槳：** 免費借用。重量約 650g，材質為進口紅松木，手感紮實，非常適合基礎划距練習與核心訓練。
- **🦺 專業浮力救生衣：** 免費借用。具備多段式調整扣帶與防跳脫跨下安全帶，浮力大於 7.5kg，上水練習安全有保障。
- **🍑 減震防滑高級屁墊：** 免費借用。採用高密度 EVA 閉孔泡棉，防水防滑，能有效緩解久坐船板的不適，保護尾椎。

**⚠️ 借用注意事項：**
1. 上水練習前請務必至登記表填寫，以便幹部掌握下水人數。
2. 上岸後請協助用乾淨淡水沖洗救生衣與屁墊，並吊掛在器材庫通風陰乾，切勿潮濕堆疊。`;
  }

  // Buying priority list
  if (text.includes('買') || text.includes('新手') || text.includes('順序') || text.includes('購') || text.includes('添購')) {
    return `### 🚀 龍舟新手裝備添購黃金順序
很多剛加入的新夥伴會急著想買最好的碳纖維槳，但教練建議「循序漸進」，把預算花在刀口上：

- **第一順位：🍑 減震屁墊 (預算約 $300 - $600)**
  - *原因：* 新人練習最容易磨傷屁股或因船板堅硬導致坐姿歪斜。自己的屁墊乾淨衛生，且能立即改善練習舒適度！
- **第二順位：🦺 個人防滑水陸鞋與救生衣 (預算約 $800 - $1500)**
  - *原因：* 攸關水上安全與衛生。個人水陸鞋抓地力強防割傷；個人救生衣可以完全貼合身形，划船時不會阻礙轉體動作。
- **第三順位：🛶 專業碳纖維槳 (預算約 $3500 - $6500)**
  - *原因：* 當您掌握了基礎划距與水感（大約 2-3 個月後），添購屬於自己長度、硬度的碳纖維槳，會讓您的技術產生質的飛躍。

**💡 溫馨提醒：**
在還沒買齊之前，隊部都有足夠的公用木槳、救生衣與屁墊供您免費登記借用！`;
  }

  // Default response (General Help)
  return `### 🚣‍♂️ 龍舟裝備 AI 教練在線解答
您的問題我收到了！以下是一些推薦的發問方向，您可以直接詢問我：

1. **📏 身高與選槳推薦：** 輸入您的「身高與體重」（例如：\`我 172 公分 68 公斤適合選什麼槳？\`）。
2. **🛶 碳纖維槳細節：** 詢問 \`碳纖維槳的月租方案與規格是什麼？\`。
3. **🦺 公用裝備問題：** 詢問 \`借用救生衣、屁墊、公用木槳要收費嗎？\`。
4. **🚀 新手採購建議：** 詢問 \`新手建議先購買什麼裝備？\`。

*💡 提示：本網頁已調整為 100% 靜態運行（適合直接部署至 GitHub Pages）。您可以點擊右上角的「金鑰」圖示，輸入您個人的 Gemini API Key，即可啟用完整的雲端智慧對話體驗喔！*`;
};

export const AIConsultant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: '哈囉！我是你們隊上的**龍舟裝備 AI 教練**。🚣‍♂️\n\n不論是挑選適合你身高體重的**槳長度**、材質挑選、**公用裝備租借規則**，還是任何裝備獲取管道，我都可以為你解答！\n\n您可以點擊下方的「熱門問題」直接發問，或是輸入您的個人身高體重讓我為您精準推薦喔！',
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Client-side Gemini API Key state - persistent in localStorage
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState('');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSaveApiKey = () => {
    const cleanKey = tempKey.trim();
    if (cleanKey) {
      localStorage.setItem('gemini_api_key', cleanKey);
      setApiKey(cleanKey);
      setShowKeyInput(false);
      setTempKey('');
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setTempKey('');
    setShowKeyInput(false);
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const history = [...messages, userMsg].slice(-10);

      if (apiKey) {
        // Option 1: Use direct client-side call to Google Gemini API
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: history.map(m => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }]
            })),
            systemInstruction: {
              parts: [{
                text: `你是一位專業的龍舟教練兼水上運動裝備顧問。
請利用以下提供的「俱樂部公用/推薦裝備資料庫」，為使用者解答關於裝備的疑問、詳細數值或獲取途徑。

【裝備資料庫內容】
- 極速水星 3K 碳纖維槳: 360g, 100% 碳纖維, 新人免費/月租150元
- 巨浪木製專業龍舟槳: 650g, 進口松木, 免費借用
- 專業浮力救生衣: 免費借用
- 減震防滑高級屁墊: 免費借用

【回覆準則】
1. 請以溫慢、親切、專業的口吻，使用「繁體中文 (台灣)」回答。
2. 當使用者詢問適合的划槳時，應根據他們的身高、體重、划船頻率和級別，推薦合適的長度（一般 44 - 51 英吋）、材質與種類。
3. 對於每一種被推薦或詢問的裝備，請清楚說明「詳細規格數值」、「獲取/購買途徑（含大概價格）」以及「俱樂部租借規則（如週租、月租或免費）」。
4. 格式請多使用 Markdown 的粗體、列表與標題，使其在手機/LINE webview 介面上容易閱讀、一目了然。
5. 回答字數不宜過於冗長，保持在 200-400 字內，並分段清晰。`
              }]
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800
            }
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || `Gemini API 連線失敗 (HTTP ${response.status})。請確認您的 API 金鑰是否正確且有效。`);
        }

        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '教練現在在忙，請稍後再試。';

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: replyText,
          timestamp: new Date()
        }]);

      } else {
        // Option 2: Pure Offline Expert System matching
        await new Promise(resolve => setTimeout(resolve, 350)); // Tiny realistic delay
        const replyText = getLocalResponse(textToSend);
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: replyText,
          timestamp: new Date()
        }]);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || '連線金鑰服務出錯，請確認網路與金鑰狀態。');
    } finally {
      setIsSending(false);
    }
  };

  // Quick prompt helper
  const quickPrompts = [
    { text: '如何挑選合適的槳長度？ 📏', prompt: '請告訴我如何根據身高體重挑選適合自己的龍舟槳長度？有對照表嗎？' },
    { text: '碳纖維槳租借規則 🛶', prompt: '我想租借隊上的碳纖維槳，請問月租方案、費用與借用流程是什麼？' },
    { text: '公用裝備費用說明 💰', prompt: '借用公用木槳、救生衣或屁墊需要付費嗎？新人有優惠規則嗎？' },
    { text: '新手推薦購買順序 🚀', prompt: '我是剛加入的新手，想慢慢添購自己的裝備，建議優先購買哪樣裝備？' }
  ];

  // Micro Markdown text parser to render basic bolding (**text**), lists (- item) and newlines
  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, lIdx) => {
      // Check if it's a list item
      const isListItem = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      let text = line;
      if (isListItem) {
        text = line.trim().substring(2);
      }

      // Parse bolding (**text**)
      const boldRegex = /\*\*([^*]+)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-extrabold text-slate-950 bg-slate-100 px-1 rounded-sm">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

      const renderedText = parts.length > 0 ? parts : text;

      if (isListItem) {
        return (
          <li key={lIdx} className="ml-4 list-disc pl-1 text-slate-700 font-semibold text-xs my-0.5 leading-relaxed">
            {renderedText}
          </li>
        );
      }

      // Check if it's an inline header (starts with ### or ##)
      if (line.trim().startsWith('### ') || line.trim().startsWith('【')) {
        return (
          <h5 key={lIdx} className="text-xs font-bold text-[#06C755] mt-2.5 mb-1 flex items-center gap-1 select-none">
            ✨ {line.replace(/###\s*/g, '')}
          </h5>
        );
      }

      return (
        <p key={lIdx} className="text-xs text-slate-600 font-semibold leading-relaxed my-1">
          {renderedText}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[520px] bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Chat header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#06C755]/10 flex items-center justify-center text-[#06C755]">
            <MessageCircle size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
              教練 AI 諮詢顧問 <Sparkles size={11} className="text-purple-500 fill-purple-400 animate-pulse" />
            </div>
            <div className="text-[9px] text-[#06C755] font-extrabold flex items-center gap-1">
              <span className="w-1 h-1 bg-[#06C755] rounded-full animate-ping" />
              {apiKey ? '已載入 Gemini AI' : '已載入離線大師系統'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          {/* Key toggle button */}
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            id="btn-toggle-apikey-panel"
            className={`p-1.5 rounded-lg border transition-all ${
              apiKey 
                ? 'bg-[#06C755]/10 border-[#06C755]/30 text-[#06C755]' 
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title="設定 Gemini API 金鑰"
          >
            <Key size={13} />
          </button>
          
          <button 
            onClick={() => {
              setMessages([
                {
                  id: 'welcome',
                  role: 'model',
                  content: '哈囉！我是你們隊上的**龍舟裝備 AI 教練**。🚣‍♂️\n\n不論是挑選適合你身高體重的**槳長度**、材質挑選、**公用裝備租借規則**，還是任何裝備獲取管道，我都可以為你解答！\n\n您可以點擊下方的「熱門問題」直接發問，或是輸入您的個人身高體重讓我為您精準推薦喔！',
                  timestamp: new Date()
                }
              ]);
              setError(null);
            }}
            id="btn-clear-chat"
            className="text-[10px] text-slate-400 font-bold hover:text-[#06C755] px-2 py-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            重設
          </button>
        </div>
      </div>

      {/* Optional Gemini API Key input panel */}
      {showKeyInput && (
        <div className="bg-amber-50/50 border-b border-amber-200/60 p-3.5 space-y-2 text-left animate-fadeIn shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-800 tracking-wider uppercase flex items-center gap-1">
              🔑 自訂 GEMINI API 金鑰 (選填)
            </span>
            {apiKey && (
              <button 
                onClick={handleClearApiKey}
                className="text-[9px] font-bold text-rose-600 hover:underline flex items-center gap-0.5"
              >
                <Trash2 size={10} /> 清除金鑰
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            若欲體驗完整的智慧問答，請在下方輸入您的 Google Gemini API 金鑰。金鑰將僅儲存在您本機瀏覽器（LocalStorage）中，100% 安全：
          </p>
          <div className="flex gap-2">
            <input 
              type="password"
              placeholder={apiKey ? '••••••••••••••••••••••••' : '輸入 AI Key (AIZA...)'}
              value={tempKey}
              onChange={e => setTempKey(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden focus:border-[#06C755]"
            />
            <button
              onClick={handleSaveApiKey}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] px-3 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Check size={12} /> 儲存
            </button>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40">
        {messages.map(msg => {
          const isModel = msg.role === 'model';
          return (
            <div 
              key={msg.id} 
              className={`flex items-start gap-2 max-w-[85%] ${isModel ? '' : 'ml-auto flex-row-reverse text-right'}`}
            >
              {isModel && (
                <div className="w-7 h-7 rounded-lg bg-[#06C755]/10 border border-[#06C755]/20 flex items-center justify-center text-xs shrink-0 select-none">
                  🤖
                </div>
              )}
              <div className="space-y-1">
                <div 
                  className={`p-3.5 rounded-2xl text-left border shadow-2xs ${
                    isModel 
                      ? 'bg-white border-slate-200 text-slate-800 rounded-tl-none' 
                      : 'bg-slate-800 border-slate-800 text-slate-50 rounded-tr-none'
                  }`}
                >
                  {isModel ? renderMessageContent(msg.content) : (
                    <p className="text-xs font-semibold leading-relaxed">{msg.content}</p>
                  )}
                </div>
                <div className="text-[9px] text-slate-400 font-medium px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-2 max-w-[80%]">
            <div className="w-7 h-7 rounded-lg bg-[#06C755]/10 border border-[#06C755]/20 flex items-center justify-center text-xs shrink-0">
              🤖
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-2xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl flex items-start gap-2 text-[11px] font-semibold">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Chips Selector */}
      <div className="bg-white border-t border-slate-200 p-2.5 space-y-1.5 shrink-0">
        <div className="text-[10px] text-slate-400 font-bold px-1 flex items-center gap-1 uppercase tracking-wider">
          <HelpCircle size={12} className="text-[#06C755]" />
          熱門問題快速諮詢
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              id={`quick-prompt-${idx}`}
              disabled={isSending}
              className="text-[11px] font-bold text-[#06C755] bg-[#06C755]/10 hover:bg-[#06C755]/15 border border-[#06C755]/20 px-2.5 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
            >
              {qp.text}
            </button>
          ))}
        </div>
      </div>

      {/* Input row */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="bg-white border-t border-slate-200 p-3 flex gap-2 shrink-0"
      >
        <input 
          type="text" 
          placeholder="向教練提問（例：我身高170適合多長的槳？）"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isSending}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#06C755] focus:ring-2 focus:ring-[#06C755]/10 transition-all disabled:opacity-60"
        />
        <button
          type="submit"
          id="btn-send-message"
          disabled={!input.trim() || isSending}
          className="bg-[#06C755] hover:bg-[#05b54c] disabled:bg-slate-100 text-white disabled:text-slate-400 px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
