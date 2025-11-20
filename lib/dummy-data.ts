export interface DealMemo {
  id: string
  date: string
  content: string
}

export interface DealStatus {
  checked: boolean
  date: string
}

export interface DealInfo {
  vinNumber: string
  carModel: string
  maker: string
  color: string
  grade: string
  year: string
  mileage: string
  modelType: string
  salesPrice: number
  auctionHouse: string
  shippingFee: string
  dealMemos: DealMemo[]
  statuses: {
    lineContact: DealStatus
    contract: DealStatus
    followUp1: DealStatus
    followUp2: DealStatus
    documents: DealStatus
    payment: DealStatus
  }
  noFollowUp: boolean
}

export interface Customer {
  id: string
  name: string
  furigana: string
  phone: string
  phone2: string
  email: string
  email2: string
  postalCode: string
  address1: string
  address2: string
  salesRep: string
  addedDate: string
  store: string
  contractDate: string
  deliveryStatus: string
  carType: string
  address: string
  memo: string
  carModel: string
  vinNumber: string
  dealInfo: DealInfo
}

export const DUMMY_CUSTOMERS: Customer[] = [
  {
    id: 'C001',
    name: '山田 太郎',
    furigana: 'ヤマダ タロウ',
    phone: '090-1234-5678',
    phone2: '',
    email: 'yamada@example.com',
    email2: '',
    postalCode: '460-0008',
    address1: '愛知県名古屋市中区栄',
    address2: '1-2-3 サンプルビル4F',
    salesRep: '高橋',
    addedDate: '2025-01-10',
    store: '本店',
    contractDate: '2025-01-15',
    deliveryStatus: '納車待ち',
    address: '愛知県名古屋市中区栄1-2-3 サンプルビル4F',
    memo: '初回商談済み',
    carType: '新車',
    carModel: 'プリウス',
    vinNumber: '12345678901234567',
    dealInfo: {
      vinNumber: '12345678901234567',
      carModel: 'プリウス',
      maker: 'トヨタ',
      color: '白',
      grade: 'S',
      year: '2018',
      mileage: '45000',
      modelType: 'ZVW30',
      salesPrice: 1380000,
      auctionHouse: 'オークション会場A',
      shippingFee: '¥30,000',
      dealMemos: [
        { id: '1', date: '2025-01-10', content: '来店ヒアリング' },
        { id: '2', date: '2025-01-12', content: '見積提示、家族と要相談とのこと' },
      ],
      statuses: {
        lineContact: { checked: true, date: '2025-01-10' },
        contract: { checked: true, date: '2025-01-15' },
        followUp1: { checked: false, date: '' },
        followUp2: { checked: false, date: '' },
        documents: { checked: false, date: '' },
        payment: { checked: false, date: '' },
      },
      noFollowUp: false,
    },
  },
  {
    id: 'C002',
    name: '佐藤 花子',
    furigana: 'サトウ ハナコ',
    phone: '080-9876-5432',
    phone2: '052-123-4567',
    email: 'sato.hanako@example.com',
    email2: '',
    postalCode: '464-0850',
    address1: '愛知県名古屋市千種区今池',
    address2: '5-6-7',
    salesRep: '鈴木',
    addedDate: '2025-01-05',
    store: '支店A',
    contractDate: '2025-01-20',
    deliveryStatus: '納車済み',
    address: '愛知県名古屋市千種区今池5-6-7',
    memo: '紹介案件',
    carType: '中古車',
    carModel: 'アクア',
    vinNumber: '98765432109876543',
    dealInfo: {
      vinNumber: '98765432109876543',
      carModel: 'アクア',
      maker: 'トヨタ',
      color: '黒',
      grade: 'G',
      year: '2020',
      mileage: '28000',
      modelType: 'NHP10',
      salesPrice: 980000,
      auctionHouse: 'オークション会場B',
      shippingFee: '¥25,000',
      dealMemos: [
        { id: '3', date: '2025-01-05', content: '電話問い合わせ' },
        { id: '4', date: '2025-01-08', content: '来店、即決' },
      ],
      statuses: {
        lineContact: { checked: true, date: '2025-01-05' },
        contract: { checked: true, date: '2025-01-08' },
        followUp1: { checked: true, date: '2025-01-12' },
        followUp2: { checked: false, date: '' },
        documents: { checked: true, date: '2025-01-15' },
        payment: { checked: true, date: '2025-01-18' },
      },
      noFollowUp: false,
    },
  },
  {
    id: 'C003',
    name: '田中 一郎',
    furigana: 'タナカ イチロウ',
    phone: '070-1111-2222',
    phone2: '',
    email: 'tanaka@example.com',
    email2: 'tanaka.sub@example.com',
    postalCode: '450-0002',
    address1: '愛知県名古屋市中村区名駅',
    address2: '3-4-5 ABCビル10F',
    salesRep: '佐藤',
    addedDate: '2025-01-12',
    store: '本店',
    contractDate: '2025-01-18',
    deliveryStatus: '納車待ち',
    address: '愛知県名古屋市中村区名駅3-4-5 ABCビル10F',
    memo: '法人契約',
    carType: '中古車',
    carModel: 'カローラ',
    vinNumber: '11122233344455566',
    dealInfo: {
      vinNumber: '11122233344455566',
      carModel: 'カローラ',
      maker: 'トヨタ',
      color: '',
      grade: '',
      year: '',
      mileage: '',
      modelType: '',
      salesPrice: 0,
      auctionHouse: '',
      shippingFee: '',
      dealMemos: [
        { id: '5', date: '2025-01-12', content: 'オンライン商談' },
      ],
      statuses: {
        lineContact: { checked: true, date: '2025-01-12' },
        contract: { checked: true, date: '2025-01-18' },
        followUp1: { checked: false, date: '' },
        followUp2: { checked: false, date: '' },
        documents: { checked: false, date: '' },
        payment: { checked: false, date: '' },
      },
      noFollowUp: false,
    },
  },
  {
    id: 'C004',
    name: '鈴木 次郎',
    furigana: 'スズキ ジロウ',
    phone: '090-3333-4444',
    phone2: '',
    email: '',
    email2: '',
    postalCode: '468-0073',
    address1: '愛知県名古屋市天白区塩釜口',
    address2: '2-1-1',
    salesRep: '高橋',
    addedDate: '2025-01-08',
    store: '支店B',
    contractDate: '2025-01-22',
    deliveryStatus: '納車待ち', 
    address: '愛知県名古屋市天白区塩釜口2-1-1',
    memo: '下取り希望',
    carType: '中古車',
    carModel: 'フィット',
    vinNumber: '77788899900011122',
    dealInfo: {
      vinNumber: '77788899900011122',
      carModel: 'フィット',
      maker: 'ホンダ',
      color: '',
      grade: '',
      year: '',
      mileage: '',
      modelType: '',
      salesPrice: 0,
      auctionHouse: 'オークション会場C',
      shippingFee: '¥35,000',
      dealMemos: [],
      statuses: {
        lineContact: { checked: true, date: '2025-01-08' },
        contract: { checked: false, date: '' },
        followUp1: { checked: false, date: '' },
        followUp2: { checked: false, date: '' },
        documents: { checked: false, date: '' },
        payment: { checked: false, date: '' },
      },
      noFollowUp: true,
    },
  },
  {
    id: 'C005',
    name: '伊藤 美咲',
    furigana: 'イトウ ミサキ',
    phone: '080-5555-6666',
    phone2: '052-987-6543',
    email: 'ito.misaki@example.com',
    email2: '',
    postalCode: '461-0001',
    address1: '愛知県名古屋市東区泉',
    address2: '1-23-45',
    salesRep: '田中',
    addedDate: '2025-01-14',
    store: '本店',
    contractDate: '',
    deliveryStatus: '商談中',
    address: '愛知県名古屋市東区泉1-23-45',
    memo: '予算要確認',
    carType: '新車',
    carModel: '', 
    vinNumber: '',
    dealInfo: {
      vinNumber: '',
      carModel: '',
      maker: '',
      color: '',
      grade: '',
      year: '',
      mileage: '',
      modelType: '',
      salesPrice: 0,
      auctionHouse: '',
      shippingFee: '',
      dealMemos: [
        { id: '6', date: '2025-01-14', content: '初回相談、複数車種検討中' },
      ],
      statuses: {
        lineContact: { checked: true, date: '2025-01-14' },
        contract: { checked: false, date: '' },
        followUp1: { checked: false, date: '' },
        followUp2: { checked: false, date: '' },
        documents: { checked: false, date: '' },
        payment: { checked: false, date: '' },
      },
      noFollowUp: false,
    },
  },
]

// ============ 在庫管理用の型定義 ============

export interface LegalFeeItem {
  id: string
  category: string
  amount: number
}

export interface OptionItem {
  id: string
  category: string
  optionName: string
  amount: number
}

export interface PurchaseInfo {
  purchaseDate: string
  purchaseType: string // オークション、下取、その他
  supplier: string
  expectedArrivalDate: string
  arrivalDate: string
  notifyOnDelay: boolean
  purchaseManager: string
  store: string
  depositStatus: string
  depositAmount: number
  purchasePrice: number
  legalFees: LegalFeeItem[]
  options: OptionItem[]
  autoTax: number
  autoTaxEnv: number
  weightTax: number
  compulsoryInsurance: number
  voluntaryInsurance: number
  totalAmount: number
}

export interface VehicleInfo {
  vinNumber: string
  carModel: string
  maker: string
  color: string
  grade: string
  year: string
  mileage: string
  modelType: string
  referencePrice: number
}

export interface SalesInfo {
  displayLocation: string
  salesPrice: number
  onlinePosted: boolean
  notes: string
}

export type InventoryStatus = 'available' | 'negotiating' | 'sold' | 'cancelled'

export interface InventoryItem {
  id: string
  purchaseInfo: PurchaseInfo
  vehicleInfo: VehicleInfo
  salesInfo: SalesInfo
  status: InventoryStatus
  customerId: string | null
  reservedDate: string
  soldDate: string
}

// ============ 在庫管理用のダミーデータ ============

export const DUMMY_INVENTORY: InventoryItem[] = [
  {
    id: 'INV001',
    purchaseInfo: {
      purchaseDate: '2025-01-10',
      purchaseType: 'オークション',
      supplier: 'AA名古屋会場',
      expectedArrivalDate: '2025-01-14',
      arrivalDate: '2025-01-15',
      notifyOnDelay: true,
      purchaseManager: '高橋',
      store: '本店',
      depositStatus: '預託済',
      depositAmount: 50000,
      purchasePrice: 1000000,
      legalFees: [
        { id: 'lf1', category: '自動車税', amount: 39500 },
        { id: 'lf2', category: '重量税', amount: 24600 },
      ],
      options: [
        { id: 'opt1', category: '内装', optionName: 'フロアマット', amount: 15000 },
        { id: 'opt2', category: '外装', optionName: 'ドアバイザー', amount: 12000 },
      ],
      autoTax: 39500,
      autoTaxEnv: 0,
      weightTax: 24600,
      compulsoryInsurance: 25830,
      voluntaryInsurance: 0,
      totalAmount: 1150000,
    },
    vehicleInfo: {
      vinNumber: '12345678901234567',
      carModel: 'プリウス',
      maker: 'トヨタ',
      color: '白',
      grade: 'S',
      year: '2018',
      mileage: '45000',
      modelType: 'ZVW30',
      referencePrice: 1200000,
    },
    salesInfo: {
      displayLocation: '本店1F',
      salesPrice: 1380000,
      onlinePosted: true,
      notes: '人気車種、状態良好',
    },
    status: 'negotiating',
    customerId: 'C001',
    reservedDate: '2025-01-15',
    soldDate: '',
  },
  {
    id: 'INV002',
    purchaseInfo: {
      purchaseDate: '2025-01-08',
      purchaseType: '下取',
      supplier: '顧客：山田太郎様',
      expectedArrivalDate: '2025-01-10',
      arrivalDate: '2025-01-10',
      notifyOnDelay: false,
      purchaseManager: '鈴木',
      store: '本店',
      depositStatus: '不要',
      depositAmount: 0,
      purchasePrice: 650000,
      legalFees: [
        { id: 'lf3', category: '自動車税', amount: 29500 },
      ],
      options: [],
      autoTax: 29500,
      autoTaxEnv: 0,
      weightTax: 16400,
      compulsoryInsurance: 20010,
      voluntaryInsurance: 0,
      totalAmount: 715910,
    },
    vehicleInfo: {
      vinNumber: '98765432109876543',
      carModel: 'アクア',
      maker: 'トヨタ',
      color: '黒',
      grade: 'G',
      year: '2020',
      mileage: '28000',
      modelType: 'NHP10',
      referencePrice: 850000,
    },
    salesInfo: {
      displayLocation: '本店2F',
      salesPrice: 980000,
      onlinePosted: true,
      notes: 'ワンオーナー、禁煙車',
    },
    status: 'sold',
    customerId: 'C002',
    reservedDate: '2025-01-08',
    soldDate: '2025-01-20',
  },
  {
    id: 'INV003',
    purchaseInfo: {
      purchaseDate: '2024-12-20',
      purchaseType: 'オークション',
      supplier: 'USS東京',
      expectedArrivalDate: '2024-12-25',
      arrivalDate: '2024-12-26',
      notifyOnDelay: true,
      purchaseManager: '佐藤',
      store: '支店A',
      depositStatus: '預託済',
      depositAmount: 80000,
      purchasePrice: 1500000,
      legalFees: [
        { id: 'lf4', category: '自動車税', amount: 51000 },
        { id: 'lf5', category: '重量税', amount: 32800 },
      ],
      options: [
        { id: 'opt3', category: 'ナビ', optionName: '社外ナビ取付', amount: 80000 },
        { id: 'opt4', category: 'その他', optionName: 'ETC', amount: 15000 },
      ],
      autoTax: 51000,
      autoTaxEnv: 0,
      weightTax: 32800,
      compulsoryInsurance: 25830,
      voluntaryInsurance: 0,
      totalAmount: 1704630,
    },
    vehicleInfo: {
      vinNumber: '11122233344455566',
      carModel: 'ヴォクシー',
      maker: 'トヨタ',
      color: 'シルバー',
      grade: 'ZS',
      year: '2019',
      mileage: '35000',
      modelType: 'ZRR80',
      referencePrice: 1800000,
    },
    salesInfo: {
      displayLocation: '支店A 1F',
      salesPrice: 2180000,
      onlinePosted: true,
      notes: '7人乗り、ファミリーに人気',
    },
    status: 'available',
    customerId: null,
    reservedDate: '',
    soldDate: '',
  },
  {
    id: 'INV004',
    purchaseInfo: {
      purchaseDate: '2025-01-05',
      purchaseType: 'オークション',
      supplier: 'JU大阪',
      expectedArrivalDate: '2025-01-12',
      arrivalDate: '2025-01-12',
      notifyOnDelay: true,
      purchaseManager: '田中',
      store: '支店B',
      depositStatus: '預託済',
      depositAmount: 60000,
      purchasePrice: 2200000,
      legalFees: [
        { id: 'lf6', category: '自動車税', amount: 66500 },
        { id: 'lf7', category: '重量税', amount: 49200 },
      ],
      options: [
        { id: 'opt5', category: '外装', optionName: 'コーティング', amount: 50000 },
      ],
      autoTax: 66500,
      autoTaxEnv: 0,
      weightTax: 49200,
      compulsoryInsurance: 25830,
      voluntaryInsurance: 0,
      totalAmount: 2441530,
    },
    vehicleInfo: {
      vinNumber: '77788899900011122',
      carModel: 'アルファード',
      maker: 'トヨタ',
      color: '白パール',
      grade: 'S Cパッケージ',
      year: '2021',
      mileage: '22000',
      modelType: 'AGH30W',
      referencePrice: 2800000,
    },
    salesInfo: {
      displayLocation: '支店B 1F',
      salesPrice: 3280000,
      onlinePosted: true,
      notes: '高級ミニバン、上質な内装',
    },
    status: 'negotiating',
    customerId: 'C004',
    reservedDate: '2025-01-12',
    soldDate: '',
  },
  {
    id: 'INV005',
    purchaseInfo: {
      purchaseDate: '2025-01-12',
      purchaseType: '下取',
      supplier: '顧客：鈴木次郎様',
      expectedArrivalDate: '2025-01-15',
      arrivalDate: '2025-01-16',
      notifyOnDelay: false,
      purchaseManager: '高橋',
      store: '本店',
      depositStatus: '不要',
      depositAmount: 0,
      purchasePrice: 450000,
      legalFees: [
        { id: 'lf8', category: '自動車税', amount: 25000 },
      ],
      options: [],
      autoTax: 25000,
      autoTaxEnv: 0,
      weightTax: 12300,
      compulsoryInsurance: 17540,
      voluntaryInsurance: 0,
      totalAmount: 504840,
    },
    vehicleInfo: {
      vinNumber: '33344455566677788',
      carModel: 'N-BOX',
      maker: 'ホンダ',
      color: 'ブルー',
      grade: 'G',
      year: '2019',
      mileage: '48000',
      modelType: 'JF3',
      referencePrice: 600000,
    },
    salesInfo: {
      displayLocation: '本店1F',
      salesPrice: 780000,
      onlinePosted: true,
      notes: '軽自動車、燃費良好',
    },
    status: 'available',
    customerId: null,
    reservedDate: '',
    soldDate: '',
  },
  {
    id: 'INV006',
    purchaseInfo: {
      purchaseDate: '2024-12-28',
      purchaseType: 'オークション',
      supplier: 'TAA横浜',
      expectedArrivalDate: '2025-01-05',
      arrivalDate: '2025-01-06',
      notifyOnDelay: true,
      purchaseManager: '鈴木',
      store: '支店A',
      depositStatus: '預託済',
      depositAmount: 45000,
      purchasePrice: 850000,
      legalFees: [
        { id: 'lf9', category: '自動車税', amount: 34500 },
        { id: 'lf10', category: '重量税', amount: 24600 },
      ],
      options: [
        { id: 'opt6', category: '内装', optionName: 'シートカバー', amount: 18000 },
      ],
      autoTax: 34500,
      autoTaxEnv: 0,
      weightTax: 24600,
      compulsoryInsurance: 25830,
      voluntaryInsurance: 0,
      totalAmount: 952930,
    },
    vehicleInfo: {
      vinNumber: '55566677788899900',
      carModel: 'フィット',
      maker: 'ホンダ',
      color: '赤',
      grade: 'RS',
      year: '2020',
      mileage: '32000',
      modelType: 'GR3',
      referencePrice: 1000000,
    },
    salesInfo: {
      displayLocation: '支店A 2F',
      salesPrice: 1180000,
      onlinePosted: true,
      notes: 'スポーツグレード',
    },
    status: 'available',
    customerId: null,
    reservedDate: '',
    soldDate: '',
  },
  {
    id: 'INV007',
    purchaseInfo: {
      purchaseDate: '2025-01-14',
      purchaseType: 'オークション',
      supplier: 'AA名古屋会場',
      expectedArrivalDate: '2025-01-18',
      arrivalDate: '',
      notifyOnDelay: true,
      purchaseManager: '佐藤',
      store: '本店',
      depositStatus: '預託済',
      depositAmount: 70000,
      purchasePrice: 1800000,
      legalFees: [
        { id: 'lf11', category: '自動車税', amount: 45000 },
      ],
      options: [],
      autoTax: 45000,
      autoTaxEnv: 0,
      weightTax: 32800,
      compulsoryInsurance: 25830,
      voluntaryInsurance: 0,
      totalAmount: 1903630,
    },
    vehicleInfo: {
      vinNumber: '22233344455566677',
      carModel: 'ハリアー',
      maker: 'トヨタ',
      color: '黒',
      grade: 'プレミアム',
      year: '2022',
      mileage: '15000',
      modelType: 'MXUA80',
      referencePrice: 2300000,
    },
    salesInfo: {
      displayLocation: '入庫待ち',
      salesPrice: 2680000,
      onlinePosted: false,
      notes: '入庫次第展示予定',
    },
    status: 'available',
    customerId: null,
    reservedDate: '',
    soldDate: '',
  },
  {
    id: 'INV008',
    purchaseInfo: {
      purchaseDate: '2024-12-15',
      purchaseType: '下取',
      supplier: '顧客：田中一郎様',
      expectedArrivalDate: '2024-12-18',
      arrivalDate: '2024-12-18',
      notifyOnDelay: false,
      purchaseManager: '田中',
      store: '支店B',
      depositStatus: '不要',
      depositAmount: 0,
      purchasePrice: 550000,
      legalFees: [
        { id: 'lf12', category: '自動車税', amount: 30000 },
      ],
      options: [
        { id: 'opt7', category: 'メンテナンス', optionName: 'エンジンオイル交換', amount: 5000 },
      ],
      autoTax: 30000,
      autoTaxEnv: 0,
      weightTax: 16400,
      compulsoryInsurance: 20010,
      voluntaryInsurance: 0,
      totalAmount: 621410,
    },
    vehicleInfo: {
      vinNumber: '88899900011122233',
      carModel: 'カローラ',
      maker: 'トヨタ',
      color: 'シルバー',
      grade: 'G-X',
      year: '2018',
      mileage: '58000',
      modelType: 'NRE210',
      referencePrice: 750000,
    },
    salesInfo: {
      displayLocation: '支店B 2F',
      salesPrice: 880000,
      onlinePosted: true,
      notes: '実用的なセダン',
    },
    status: 'available',
    customerId: null,
    reservedDate: '',
    soldDate: '',
  },
  {
    id: 'INV009',
    purchaseInfo: {
      purchaseDate: '2025-01-03',
      purchaseType: 'オークション',
      supplier: 'USS東京',
      expectedArrivalDate: '2025-01-08',
      arrivalDate: '2025-01-09',
      notifyOnDelay: true,
      purchaseManager: '高橋',
      store: '本店',
      depositStatus: '預託済',
      depositAmount: 55000,
      purchasePrice: 1200000,
      legalFees: [
        { id: 'lf13', category: '自動車税', amount: 39500 },
        { id: 'lf14', category: '重量税', amount: 24600 },
      ],
      options: [
        { id: 'opt8', category: 'ナビ', optionName: 'カーナビ更新', amount: 20000 },
        { id: 'opt9', category: '外装', optionName: 'ヘッドライト磨き', amount: 8000 },
      ],
      autoTax: 39500,
      autoTaxEnv: 0,
      weightTax: 24600,
      compulsoryInsurance: 25830,
      voluntaryInsurance: 0,
      totalAmount: 1317930,
    },
    vehicleInfo: {
      vinNumber: '44455566677788899',
      carModel: 'ノート',
      maker: '日産',
      color: '白',
      grade: 'e-POWER X',
      year: '2021',
      mileage: '25000',
      modelType: 'E13',
      referencePrice: 1400000,
    },
    salesInfo: {
      displayLocation: '本店2F',
      salesPrice: 1680000,
      onlinePosted: true,
      notes: 'e-POWER搭載、低燃費',
    },
    status: 'available',
    customerId: null,
    reservedDate: '',
    soldDate: '',
  },
  {
    id: 'INV010',
    purchaseInfo: {
      purchaseDate: '2025-01-11',
      purchaseType: 'オークション',
      supplier: 'JU大阪',
      expectedArrivalDate: '2025-01-16',
      arrivalDate: '2025-01-17',
      notifyOnDelay: true,
      purchaseManager: '鈴木',
      store: '支店A',
      depositStatus: '預託済',
      depositAmount: 40000,
      purchasePrice: 950000,
      legalFees: [
        { id: 'lf15', category: '自動車税', amount: 36000 },
      ],
      options: [],
      autoTax: 36000,
      autoTaxEnv: 0,
      weightTax: 20500,
      compulsoryInsurance: 20010,
      voluntaryInsurance: 0,
      totalAmount: 1026510,
    },
    vehicleInfo: {
      vinNumber: '66677788899900011',
      carModel: 'ヤリス',
      maker: 'トヨタ',
      color: 'グレー',
      grade: 'Z',
      year: '2021',
      mileage: '18000',
      modelType: 'MXPA10',
      referencePrice: 1150000,
    },
    salesInfo: {
      displayLocation: '支店A 1F',
      salesPrice: 1480000,
      onlinePosted: true,
      notes: 'コンパクトカー、新しめ',
    },
    status: 'available',
    customerId: null,
    reservedDate: '',
    soldDate: '',
  },
]
