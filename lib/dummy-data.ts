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
