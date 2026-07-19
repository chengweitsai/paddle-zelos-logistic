import { GearItem } from './types';

export const GEAR_DATABASE: GearItem[] = [
  {
    id: 'carbon-paddle-elite',
    name: 'IDBF 認證極輕量碳纖維槳 (競賽型)',
    category: 'paddle',
    specs: {
      material: '100% 東麗高模數碳纖維 (Toray T800)',
      weight: '320g - 350g',
      length: '44 - 51 英吋 (可調節或固定長度)',
      features: ['IDBF 202a 規格認證', '一體成型高強度槳桿', '水滴型防滑人體工學 T型握把', '刀刃加強邊緣防磕碰'],
      suitability: '適合中高階隊員、熱衷競賽與追求極致划速、高頻率槳頻者'
    },
    acquisition: {
      method: '幹部統一協助向專業槳廠訂製 (Falcon / Hurricane / ZRE)',
      priceRange: 'NT$ 4,500 - NT$ 9,000',
      links: [
        { label: 'ZRE 官方網站 (專業競賽槳)', url: 'https://www.zre.com/' },
        { label: 'IDBF 認證槳廠商清單', url: 'https://www.dragonboat.sport/' }
      ],
      clubRental: '碳纖維槳長期租借方案 (NT$ 400 / 月，需填寫租借單確認編號)'
    },
    description: '專為龍舟競賽設計的專業級碳纖維槳。採用航太級高強度碳纖維，重量極輕、剛性極佳。入水時的回饋感敏銳，起水乾淨俐落，能有效降低手臂疲勞並大幅提升划槳頻率與傳動效率。'
  },
  {
    id: 'carbon-paddle-standard',
    name: '入門級碳纖維槳 (練習/進階型)',
    category: 'paddle',
    specs: {
      material: '高強度碳纖維 (3K 碳纖維布)',
      weight: '380g - 420g',
      length: '46 - 49 英吋',
      features: ['高性價比', '適合日常高強度訓練', '高抗衝擊結構', '經典水滴型刀刃'],
      suitability: '適合剛接觸龍舟 3-6 個月的隊員，或作為第一支個人專屬碳纖維槳'
    },
    acquisition: {
      method: '向俱樂部幹部登記團購，或至國內水上運動用品店購買',
      priceRange: 'NT$ 2,500 - NT$ 3,800',
      links: [
        { label: '台灣水上運動用品商城', url: 'https://shopee.tw/' }
      ],
      clubRental: '碳纖維槳短期租借 (配合幹部準備，費用以團體規章為準)'
    },
    description: '專為希望從木槳升級到碳纖維槳的划手設計。擁有碳纖維特有的輕量化手感，同時加強了槳刃的抗衝擊能力，即使在練習時不慎碰撞船身或他人槳隻，也具有極佳的耐用度。'
  },
  {
    id: 'wood-paddle-standard',
    name: '標準龍舟木槳 (基礎訓練型)',
    category: 'paddle',
    specs: {
      material: '優質楓木/硬木拼接、防水環氧樹脂包覆',
      weight: '600g - 750g',
      length: '46 - 48 英吋',
      features: ['天然木紋質感', '傳統厚實配重', '平直刀面受力均勻', '槳葉包覆金屬防護防裂'],
      suitability: '適合新手隊員入隊初學、體能耐力訓練、力量建立者'
    },
    acquisition: {
      method: '體育用品社、划船配件專賣店，或直接租用公用裝備',
      priceRange: 'NT$ 1,200 - NT$ 2,000',
      links: [
        { label: '龍舟器材專業零售商', url: 'https://shopee.tw/' }
      ],
      clubRental: '公用木槳借用方案 (週租 NT$ 50，新手規則期間可免費借用)'
    },
    description: '經典耐用的龍舟訓練木槳。雖然重量較碳纖維槳重，但其厚實的配重能幫助新手建立紮實的吃水感與核心施力習慣。是日常力量訓練與初學基礎動作的必備良伴。'
  },
  {
    id: 'lifejacket-sport',
    name: '專業救生衣 (龍舟與水上運動專用)',
    category: 'lifejacket',
    specs: {
      material: '100D 高密度防撕裂尼龍 + 輕量 EPE 環保浮力棉',
      weight: '450g (極度輕巧不吸水)',
      length: 'S / M / L / XL 可選 (貼身短版裁剪)',
      features: ['大袖口活動無阻礙', '三道高強度防滑插扣安全帶', '高能反光條 + 求生哨', '底部設有防脫落跨帶 (可拆卸)'],
      suitability: '所有划手、鼓手與舵手必備。特別適合需要頻繁旋轉肩膀與前傾身體的龍舟運動'
    },
    acquisition: {
      method: '俱樂部常態備有少量團購庫存，亦可於各大戶外用品店 (迪卡儂) 購買',
      priceRange: 'NT$ 600 - NT$ 1,500',
      links: [
        { label: '迪卡儂水上運動救生衣', url: 'https://www.decathlon.com.tw/' }
      ],
      clubRental: '公用救生衣免費/付費借用 (每次練習可於表單登記借用 1 件)'
    },
    description: '專為龍舟划水動作設計的短版救生衣。腋下和肩部採用大剪裁，確保划槳時的迴旋空間。高浮力防護設計在保障人身安全的同時，兼顧了出汗時的透氣度與活動靈活性。'
  },
  {
    id: 'buttpad-silicone',
    name: '人體工學防滑矽膠屁墊 (龍舟坐墊)',
    category: 'buttpad',
    specs: {
      material: '食品級環保防滑矽膠 + 中空緩震蜂巢結構',
      weight: '220g',
      length: '32cm x 15cm x 1.5cm (符合龍舟板凳寬度)',
      features: ['吸盤式底部防滑', '蜂巢中空高回彈減壓', '防水不吸水、一沖即淨', '便攜雙提手設計'],
      suitability: '所有長距離、高強度耐力訓練划手必備，能顯著改善臀部壓痛'
    },
    acquisition: {
      method: '網購平台 (蝦皮) 直接搜尋「龍舟屁墊」或「划船器坐墊」',
      priceRange: 'NT$ 250 - NT$ 500',
      links: [
        { label: '蝦皮購物 - 龍舟屁墊推薦', url: 'https://shopee.tw/search?keyword=%E9%BE%8D%E8%88%9F%E5%B1%81%E5%A2%8A' }
      ],
      clubRental: '公用屁墊每次練習可於表單登記借用 1 個'
    },
    description: '由於龍舟木椅極度堅硬，長時間划行會導致臀部與尾椎骨強烈不適甚至磨破皮。本款高彈性蜂巢屁墊能有效分散壓力，吸盤設計牢牢固定於木椅，是您保護屁屁、專注出力的秘密武器。'
  },
  {
    id: 'paddle-bag-pro',
    name: '厚款防震龍舟槳袋',
    category: 'accessory',
    specs: {
      material: '600D 防水牛津布 + 5mm EPE 防震珍珠棉填充',
      weight: '300g',
      length: '約 130cm (容納最長 52 英吋槳)',
      features: ['加厚防震保護槳葉', '可調節背帶與手提兩用', '外側設有拉鍊零錢防曬乳收納袋', '專屬姓名吊牌插槽'],
      suitability: '已購買個人碳纖維槳或木槳者，保護愛槳避免碰撞、日曬'
    },
    acquisition: {
      method: '向俱樂部加購，或網購自選外觀款式',
      priceRange: 'NT$ 350 - NT$ 600',
      links: [
        { label: '淘寶/蝦皮龍舟槳袋專區', url: 'https://shopee.tw/' }
      ],
      clubRental: '無提供租借，建議人手一個保護個人財產'
    },
    description: '專為龍舟槳尺寸量身打造的保護袋。內襯 5mm 防撞珍珠棉，可確保昂貴的碳纖維槳在搬運、乘車過程中不受磕碰碎裂，並避免長時間高溫日曬導致複合材料老化變形。'
  },
  {
    id: 'grip-tape-silicone',
    name: '自粘型無膠矽膠握把帶',
    category: 'accessory',
    specs: {
      material: '高拉力自粘矽膠 (Silicone)',
      weight: '25g',
      length: '3公尺長 x 2.5公分寬',
      features: ['無膠殘留、靠分子引力自粘', '極佳乾濕防滑效果', '耐水、耐汗、防紫外線', '增厚減震減緩手掌起水泡'],
      suitability: '所有碳纖維槳或木槳握把處纏繞，防手滑、防起水泡'
    },
    acquisition: {
      method: '體育用品社、羽球網球拍握把皮，或網購矽膠自融帶',
      priceRange: 'NT$ 80 - NT$ 200 / 捲',
      links: [
        { label: '自粘防滑帶網路商城', url: 'https://shopee.tw/' }
      ],
      clubRental: '無提供租借，屬消耗品'
    },
    description: '用於纏繞龍舟槳桿的手握處。具有驚人的乾濕摩擦力，即使沾滿水花或手汗依然穩固不打滑。無膠設計在拆換時不會在槳桿上留下討厭的殘膠，是划槳舒適度必備升級品。'
  }
];
