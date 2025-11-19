import { InventoryItem, InventoryStatus, Customer, DUMMY_INVENTORY } from './dummy-data'

/**
 * 在庫データをローカルストレージから取得
 */
export function getInventoryFromStorage(): InventoryItem[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem('inventory')
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      
      // statusフィールドが存在しない（undefined）場合は古いデータなので再初期化
      if (parsed.length > 0 && parsed[0].status === undefined) {
        localStorage.setItem('inventory', JSON.stringify(DUMMY_INVENTORY))
        return DUMMY_INVENTORY
      }
      
      return parsed
    } catch (e) {
      console.error('Failed to parse inventory from localStorage:', e)
      // エラーの場合はダミーデータで初期化
      localStorage.setItem('inventory', JSON.stringify(DUMMY_INVENTORY))
      return DUMMY_INVENTORY
    }
  }
  
  // データが存在しない場合はダミーデータで初期化
  localStorage.setItem('inventory', JSON.stringify(DUMMY_INVENTORY))
  return DUMMY_INVENTORY
}

/**
 * 在庫データをローカルストレージに保存
 */
export function saveInventoryToStorage(inventory: InventoryItem[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('inventory', JSON.stringify(inventory))
  } catch (e) {
    console.error('Failed to save inventory to localStorage:', e)
  }
}

/**
 * 車台番号から在庫を検索
 */
export function getInventoryByVin(vinNumber: string): InventoryItem | null {
  if (!vinNumber) return null
  
  const inventory = getInventoryFromStorage()
  return inventory.find(item => item.vehicleInfo.vinNumber === vinNumber) || null
}

/**
 * 複数条件で在庫を検索
 */
export function searchInventory(query: string): InventoryItem[] {
  if (!query) return getInventoryFromStorage()
  
  const inventory = getInventoryFromStorage()
  const lowerQuery = query.toLowerCase()
  
  return inventory.filter(item => 
    item.vehicleInfo.carModel.toLowerCase().includes(lowerQuery) ||
    item.vehicleInfo.maker.toLowerCase().includes(lowerQuery) ||
    item.vehicleInfo.vinNumber.toLowerCase().includes(lowerQuery) ||
    item.vehicleInfo.year.includes(query) ||
    item.salesInfo.displayLocation.toLowerCase().includes(lowerQuery)
  )
}

/**
 * 在庫中の在庫のみを取得
 */
export function getAvailableInventory(): InventoryItem[] {
  const inventory = getInventoryFromStorage()
  return inventory.filter(item => item.status === 'available')
}

/**
 * 車台番号で在庫ステータスを更新
 */
export function updateInventoryStatusByVin(
  vinNumber: string,
  status: InventoryStatus,
  customerId?: string,
  reservedDate?: string,
  soldDate?: string
): boolean {
  if (!vinNumber) return false
  
  const inventory = getInventoryFromStorage()
  const index = inventory.findIndex(item => item.vehicleInfo.vinNumber === vinNumber)
  
  if (index === -1) return false
  
  inventory[index] = {
    ...inventory[index],
    status,
    customerId: customerId || null,
    reservedDate: reservedDate || inventory[index].reservedDate,
    soldDate: soldDate || inventory[index].soldDate,
  }
  
  saveInventoryToStorage(inventory)
  return true
}

/**
 * 在庫を解放（ステータスをavailableに戻す）
 */
export function releaseInventory(vinNumber: string): boolean {
  if (!vinNumber) return false
  
  const inventory = getInventoryFromStorage()
  const index = inventory.findIndex(item => item.vehicleInfo.vinNumber === vinNumber)
  
  if (index === -1) return false
  
  inventory[index] = {
    ...inventory[index],
    status: 'available',
    customerId: null,
    reservedDate: '',
    soldDate: '',
  }
  
  saveInventoryToStorage(inventory)
  return true
}

/**
 * 顧客情報に基づいて在庫ステータスを更新
 * 納車状況に応じて適切なステータスに設定
 */
export function updateInventoryFromCustomer(
  customer: Customer,
  previousVinNumber?: string
): void {
  const vinNumber = customer.vinNumber
  
  // 車台番号が変更された場合、旧在庫を解放
  if (previousVinNumber && previousVinNumber !== vinNumber) {
    releaseInventory(previousVinNumber)
  }
  
  // 車台番号がない場合は何もしない
  if (!vinNumber) return
  
  // 在庫が存在するかチェック
  const inventory = getInventoryByVin(vinNumber)
  if (!inventory) return
  
  // 納車状況に応じてステータスを設定
  let status: InventoryStatus
  let soldDate = ''
  
  if (customer.deliveryStatus === '商談中') {
    status = 'negotiating'
  } else if (customer.deliveryStatus === '納車待ち' || customer.deliveryStatus === '納車済み') {
    status = 'sold'
    soldDate = customer.contractDate || new Date().toISOString().split('T')[0]
  } else {
    // その他の状態の場合は在庫中にする
    status = 'available'
  }
  
  updateInventoryStatusByVin(
    vinNumber,
    status,
    customer.id,
    customer.contractDate || new Date().toISOString().split('T')[0],
    soldDate
  )
}

/**
 * 顧客データをローカルストレージから取得
 */
export function getCustomersFromStorage(): Customer[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem('customers')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse customers from localStorage:', e)
      return []
    }
  }
  return []
}

/**
 * 在庫IDに紐付く顧客名を取得
 */
export function getCustomerNameByInventory(item: InventoryItem): string {
  if (!item.customerId) return ''
  
  const customers = getCustomersFromStorage()
  const customer = customers.find(c => c.id === item.customerId)
  return customer ? customer.name : ''
}

/**
 * ステータスの日本語表示名を取得
 */
export function getStatusLabel(status: InventoryStatus): string {
  const labels: Record<InventoryStatus, string> = {
    available: '在庫中',
    negotiating: '商談中',
    sold: '販売済み',
    cancelled: 'キャンセル',
  }
  return labels[status] || status
}

/**
 * ステータスに応じた色クラスを取得
 */
export function getStatusColorClass(status: InventoryStatus): string {
  const colors: Record<InventoryStatus, string> = {
    available: 'bg-green-100 text-green-700',
    negotiating: 'bg-yellow-100 text-yellow-700',
    sold: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

