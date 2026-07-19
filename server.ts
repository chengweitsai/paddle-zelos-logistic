import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { GEAR_DATABASE } from './src/data';
import { mapCSVToRentals } from './src/utils/csvParser';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes defined FIRST
// 1. Fetch public Google Sheets CSV and parse into structured rentals
app.get('/api/sheets/public', async (req, res) => {
  try {
    const spreadsheetId = '1VOencdl4jRY2xh-L-ZkE7QVaP_XcYrTnZ8rL4FI1SFI';
    const gid = '288109580';
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch spreadsheet from Google. Status: ${response.status}`);
    }
    
    const csvText = await response.text();
    const rentals = mapCSVToRentals(csvText);
    
    res.json({
      success: true,
      spreadsheetId,
      gid,
      count: rentals.length,
      rentals
    });
  } catch (error: any) {
    console.error('Error fetching public sheet:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch and parse public gear sheet'
    });
  }
});

// 2. Fetch custom spreadsheet using user OAuth Token (Sheets API Proxy)
app.get('/api/sheets/custom', async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing OAuth Access Token' });
  }

  const { spreadsheetId, range } = req.query;
  if (!spreadsheetId || !range) {
    return res.status(400).json({ success: false, error: 'Missing spreadsheetId or range parameters' });
  }

  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
      headers: { Authorization: token },
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Google API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in sheets/custom proxy:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Gemini-powered interactive Dragon Boat Gear Advisor
app.post('/api/ai/recommend', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, error: 'Invalid or missing messages body' });
  }

  try {
    // Format our local gear database into a concise context text block for Gemini
    const gearContext = GEAR_DATABASE.map(g => {
      return `【${g.name}】
- 類別: ${g.category}
- 材質規格: ${g.specs.material}
- 重量: ${g.specs.weight}
- 長度規格: ${g.specs.length || '不限'}
- 特色: ${g.specs.features.join(', ')}
- 適合群體: ${g.specs.suitability}
- 取得方式: ${g.acquisition.method} (價格區間: ${g.acquisition.priceRange})
- 俱樂部租借: ${g.acquisition.clubRental}
- 詳細描述: ${g.description}`;
    }).join('\n\n');

    const systemInstruction = `你是一位專業的龍舟教練兼水上運動裝備顧問。
請利用以下提供的「俱樂部公用/推薦裝備資料庫」，為使用者解答關於裝備的疑問、詳細數值或獲取途徑。

【裝備資料庫內容】
${gearContext}

【回覆準則】
1. 請以溫暖、親切、專業的口吻，使用「繁體中文 (台灣)」回答。
2. 當使用者詢問適合的划槳時，應根據他們的身高、體重、划船頻率和級別，推薦合適的長度（一般 44 - 51 英吋）、材質與種類（木槳/碳纖維槳），並引導他們獲取。
3. 對於每一種被推薦或詢問的裝備，請清楚說明「詳細規格數值」、「獲取/購買途徑（含大概價格）」以及「俱樂部租借規則（如週租、月租或免費）」。
4. 格式請多使用 Markdown 的粗體、列表等排版，使其在手機/LINE webview 介面上容易閱讀、一目了然。
5. 回答字數不宜過於冗長，保持在 200-400 字內，並分段清晰。`;

    // Format chat history for the generateContent call
    // The @google/genai SDK chats or generateContent accepts contents in format: { role, parts: [{ text }] }
    const formattedContents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      success: true,
      reply: response.text || '教練目前在水上，請稍後再試。'
    });
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Gemini API call failed'
    });
  }
});

// Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
