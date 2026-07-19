import { RentalRecord } from '../types';

export function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          cell += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(cell.trim());
        cell = '';
      } else if (char === '\r' || char === '\n') {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        row.push(cell.trim());
        lines.push(row);
        row = [];
        cell = '';
      } else {
        cell += char;
      }
    }
  }
  
  if (row.length > 0 || cell !== '') {
    row.push(cell.trim());
    lines.push(row);
  }
  
  return lines.filter(r => r.length > 0 && r.some(c => c !== ''));
}

export function mapCSVToRentals(csvText: string): RentalRecord[] {
  const grid = parseCSV(csvText);
  if (grid.length < 2) return [];
  
  const headers = grid[0].map(h => h.toLowerCase());
  
  // Dynamic column detection
  const findIndex = (keywords: string[]) => {
    return headers.findIndex(h => keywords.some(k => h.includes(k)));
  };
  
  const idxConfirmed = findIndex(['是否已確認', '確認']);
  const idxPayment = findIndex(['追帳', '付款']);
  const idxReturnDate = findIndex(['歸還日期', '歸還']);
  const idxNextPrep = findIndex(['下次練習', '幹部幫我準備']);
  const idxTimestamp = findIndex(['時間戳記', '時間']);
  const idxBorrower = findIndex(['借用人']);
  const idxQuantity = findIndex(['數量']);
  const idxPaddleRequest = findIndex(['龍舟槳需求', '租借金額']);
  const idxLifejacket = findIndex(['救生衣']);
  const idxButtpad = findIndex(['屁墊']);
  const idxCarbonCount = findIndex(['碳纖維槳幾隻', '碳纖維槳數量']);
  const idxCarbonNo = findIndex(['碳纖維槳編號']);
  const idxWoodCount = findIndex(['木槳幾隻', '木槳數量']);
  const idxWoodNo = findIndex(['木槳編號']);
  const idxRentDate = findIndex(['借用日期']);
  const idxNotes = findIndex(['新人規則', '備註']);
  
  const records: RentalRecord[] = [];
  
  for (let r = 1; r < grid.length; r++) {
    const row = grid[r];
    if (!row || row.length === 0) continue;
    
    const getVal = (idx: number, fallback = '') => (idx >= 0 && idx < row.length ? row[idx] : fallback);
    
    // Check if the row has a borrower or at least some content
    const borrower = getVal(idxBorrower);
    if (!borrower) continue;
    
    // Helper parsers
    const parseNum = (str: string) => {
      const n = parseInt(str.replace(/[^0-9]/g, ''), 10);
      return isNaN(n) ? 0 : n;
    };
    
    const parseBool = (str: string) => {
      const s = str.toLowerCase();
      return s === 'yes' || s === 'true' || s === '是' || s === '已確認' || s === 'v' || s === 'o';
    };
    
    const carbonCountStr = getVal(idxCarbonCount);
    const woodCountStr = getVal(idxWoodCount);
    const lifejacketStr = getVal(idxLifejacket);
    const buttpadStr = getVal(idxButtpad);
    const paddleReqStr = getVal(idxPaddleRequest);
    
    // Auto-detect quantities if blank but requested
    let carbonPaddlesCount = parseNum(carbonCountStr);
    if (carbonPaddlesCount === 0 && (paddleReqStr.includes('碳纖維槳') || paddleReqStr.includes('碳槳'))) {
      carbonPaddlesCount = 1;
    }
    
    let woodPaddlesCount = parseNum(woodCountStr);
    if (woodPaddlesCount === 0 && paddleReqStr.includes('木槳')) {
      woodPaddlesCount = 1;
    }
    
    const lifeJacketRequested = lifejacketStr.includes('借') || lifejacketStr.includes('需');
    const lifeJacketCount = parseNum(lifejacketStr) || (lifeJacketRequested ? 1 : 0);
    
    const buttPadRequested = buttpadStr.includes('借') || buttpadStr.includes('需');
    const buttPadCount = parseNum(buttpadStr) || (buttPadRequested ? 1 : 0);
    
    records.push({
      id: `${r}-${getVal(idxTimestamp)}-${borrower}`,
      timestamp: getVal(idxTimestamp),
      borrower,
      confirmed: parseBool(getVal(idxConfirmed)),
      paymentConfirmed: parseBool(getVal(idxPayment)),
      rentalDate: getVal(idxRentDate) || getVal(idxTimestamp).split(' ')[0] || '',
      returnDate: getVal(idxReturnDate),
      carbonPaddlesCount,
      carbonPaddleNumbers: getVal(idxCarbonNo),
      woodPaddlesCount,
      woodPaddleNumbers: getVal(idxWoodNo),
      lifeJacketRequested,
      lifeJacketCount,
      buttPadRequested,
      buttPadCount,
      nextPracticePrep: getVal(idxNextPrep),
      notes: getVal(idxNotes),
      quantity: parseNum(getVal(idxQuantity)) || 1
    });
  }
  
  return records;
}
