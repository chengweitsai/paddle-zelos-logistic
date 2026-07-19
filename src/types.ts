export interface GearItem {
  id: string;
  name: string;
  category: 'paddle' | 'lifejacket' | 'buttpad' | 'accessory';
  specs: {
    material: string;
    weight: string;
    length?: string;
    features: string[];
    suitability: string;
  };
  acquisition: {
    method: string;
    priceRange: string;
    links: { label: string; url: string }[];
    clubRental: string;
  };
  description: string;
  image?: string;
}

export interface RentalRecord {
  id: string;
  timestamp: string;
  borrower: string;
  confirmed: boolean;
  paymentConfirmed: boolean;
  rentalDate: string;
  returnDate: string;
  carbonPaddlesCount: number;
  carbonPaddleNumbers: string;
  woodPaddlesCount: number;
  woodPaddleNumbers: string;
  lifeJacketRequested: boolean;
  lifeJacketCount: number;
  buttPadRequested: boolean;
  buttPadCount: number;
  nextPracticePrep: string;
  notes: string;
  quantity: number;
}

export interface InventoryStats {
  carbonPaddle: { total: number; borrowed: number };
  woodPaddle: { total: number; borrowed: number };
  lifeJacket: { total: number; borrowed: number };
  buttPad: { total: number; borrowed: number };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}
