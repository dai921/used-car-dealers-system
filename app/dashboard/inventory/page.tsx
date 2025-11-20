'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, Search, RotateCcw, Settings2, Edit, ArrowUpDown, ArrowUp, ArrowDown, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { InventoryModal } from '@/components/inventory-modal'
import { DUMMY_INVENTORY, InventoryItem } from '@/lib/dummy-data'
import { 
  getCustomerNameByInventory, 
  getStatusLabel, 
  getStatusColorClass 
} from '@/lib/inventory-utils'

const STORES = ['本店', '支店A', '支店B']
const PURCHASE_MANAGERS = ['高橋', '鈴木', '佐藤', '田中']
const PURCHASE_TYPES = ['オークション', '下取', 'その他']
const INVENTORY_STATUSES = ['在庫中', '商談中', '販売済み', 'キャンセル']

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([])
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Filter states
  const [purchaseDateFrom, setPurchaseDateFrom] = useState('')
  const [purchaseDateTo, setPurchaseDateTo] = useState('')
  const [arrivalDateFrom, setArrivalDateFrom] = useState('')
  const [arrivalDateTo, setArrivalDateTo] = useState('')
  const [purchaseType, setPurchaseType] = useState('')
  const [inventoryStatus, setInventoryStatus] = useState('')
  const [inventoryDaysFrom, setInventoryDaysFrom] = useState('')
  const [inventoryDaysTo, setInventoryDaysTo] = useState('')

  // Sort states
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const [visibleColumns, setVisibleColumns] = useState({
    status: true,
    customerName: false,
    purchaseDate: true,
    arrivalDate: true,
    purchasePrice: true,
    totalAmount: true,
    supplier: true,
    salesPrice: true,
    inventoryDays: true,
    carModel: true,
    vinNumber: true,
    displayLocation: true,
    onlinePosted: true,
  })

  useEffect(() => {
    const stored = localStorage.getItem('inventory')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setInventory(parsed)
        setFilteredInventory(parsed)
      } catch (e) {
        setInventory(DUMMY_INVENTORY)
        setFilteredInventory(DUMMY_INVENTORY)
      }
    } else {
      setInventory(DUMMY_INVENTORY)
      setFilteredInventory(DUMMY_INVENTORY)
      localStorage.setItem('inventory', JSON.stringify(DUMMY_INVENTORY))
    }
  }, [])

  // 在庫期間の計算
  const calculateInventoryDays = (arrivalDate: string): number => {
    if (!arrivalDate) return 0
    const today = new Date()
    const arrival = new Date(arrivalDate)
    const diffTime = today.getTime() - arrival.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  useEffect(() => {
    let filtered = [...inventory]

    if (purchaseDateFrom) {
      filtered = filtered.filter(item => item.purchaseInfo.purchaseDate >= purchaseDateFrom)
    }

    if (purchaseDateTo) {
      filtered = filtered.filter(item => item.purchaseInfo.purchaseDate <= purchaseDateTo)
    }

    if (arrivalDateFrom) {
      filtered = filtered.filter(item => item.purchaseInfo.arrivalDate >= arrivalDateFrom)
    }

    if (arrivalDateTo) {
      filtered = filtered.filter(item => item.purchaseInfo.arrivalDate <= arrivalDateTo)
    }

    if (purchaseType && purchaseType !== 'all') {
      filtered = filtered.filter(item => item.purchaseInfo.purchaseType === purchaseType)
    }

    if (inventoryStatus && inventoryStatus !== 'all') {
      const statusMap: Record<string, string> = {
        '在庫中': 'available',
        '商談中': 'negotiating',
        '販売済み': 'sold',
        'キャンセル': 'cancelled',
      }
      const statusValue = statusMap[inventoryStatus]
      if (statusValue) {
        filtered = filtered.filter(item => item.status === statusValue)
      }
    }

    if (inventoryDaysFrom || inventoryDaysTo) {
      filtered = filtered.filter(item => {
        const days = calculateInventoryDays(item.purchaseInfo.arrivalDate)
        if (inventoryDaysFrom && days < parseInt(inventoryDaysFrom)) return false
        if (inventoryDaysTo && days > parseInt(inventoryDaysTo)) return false
        return true
      })
    }

    setFilteredInventory(filtered)
  }, [inventory, purchaseDateFrom, purchaseDateTo, arrivalDateFrom, arrivalDateTo, purchaseType, inventoryStatus, inventoryDaysFrom, inventoryDaysTo])

  // Sort filtered inventory
  const sortedInventory = [...filteredInventory].sort((a, b) => {
    if (!sortColumn) return 0

    let aValue: any
    let bValue: any

    if (sortColumn === 'purchaseDate') {
      aValue = a.purchaseInfo.purchaseDate
      bValue = b.purchaseInfo.purchaseDate
    } else if (sortColumn === 'arrivalDate') {
      aValue = a.purchaseInfo.arrivalDate
      bValue = b.purchaseInfo.arrivalDate
    } else if (sortColumn === 'purchasePrice') {
      aValue = a.purchaseInfo.purchasePrice
      bValue = b.purchaseInfo.purchasePrice
    } else if (sortColumn === 'totalAmount') {
      aValue = a.purchaseInfo.totalAmount
      bValue = b.purchaseInfo.totalAmount
    } else if (sortColumn === 'salesPrice') {
      aValue = a.salesInfo.salesPrice
      bValue = b.salesInfo.salesPrice
    } else if (sortColumn === 'inventoryDays') {
      aValue = calculateInventoryDays(a.purchaseInfo.arrivalDate)
      bValue = calculateInventoryDays(b.purchaseInfo.arrivalDate)
    }

    // Handle empty values
    if (!aValue && aValue !== 0) aValue = ''
    if (!bValue && bValue !== 0) bValue = ''

    // Compare values
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction or clear sort
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else {
        setSortColumn(null)
        setSortDirection('asc')
      }
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleSearch = () => {
    // Filter logic is already handled by useEffect
  }

  const handleReset = () => {
    setPurchaseDateFrom('')
    setPurchaseDateTo('')
    setArrivalDateFrom('')
    setArrivalDateTo('')
    setPurchaseType('')
    setInventoryStatus('')
    setInventoryDaysFrom('')
    setInventoryDaysTo('')
    setSortColumn(null)
    setSortDirection('asc')
    setFilteredInventory(inventory)
  }

  const SortableHeader = ({ column, children, className }: { column: string; children: React.ReactNode; className?: string }) => {
    return (
      <TableHead className={className}>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-accent -ml-2"
          onClick={() => handleSort(column)}
        >
          {children}
          {sortColumn === column ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="ml-1 h-3 w-3" />
            ) : (
              <ArrowDown className="ml-1 h-3 w-3" />
            )
          ) : (
            <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
          )}
        </Button>
      </TableHead>
    )
  }

  const handleAddNew = () => {
    setSelectedItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleSave = (item: InventoryItem) => {
    console.log('[Inventory] Saving item:', item)
    
    let updated: InventoryItem[]
    
    if (selectedItem) {
      updated = inventory.map(i => 
        i.id === selectedItem.id ? { ...item, id: selectedItem.id } : i
      )
      console.log('[Inventory] Updated existing item')
    } else {
      const newItem = { 
        ...item, 
        id: `INV${String(inventory.length + 1).padStart(3, '0')}`,
      }
      updated = [...inventory, newItem]
      console.log('[Inventory] Added new item:', newItem)
    }
    
    localStorage.setItem('inventory', JSON.stringify(updated))
    setInventory(updated)

    console.log('[Inventory] Updated inventory list and saved to localStorage')
    
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  const handleDelete = (item: InventoryItem) => {
    console.log('[Inventory] Deleting item:', item)
    
    // 顧客との紐付けを解除
    if (item.customerId) {
      const storedCustomers = localStorage.getItem('customers')
      if (storedCustomers) {
        try {
          const customers = JSON.parse(storedCustomers)
          const updatedCustomers = customers.map((customer: any) => {
            if (customer.id === item.customerId) {
              return {
                ...customer,
                vinNumber: '',
                dealInfo: {
                  ...customer.dealInfo,
                  vinNumber: '',
                }
              }
            }
            return customer
          })
          localStorage.setItem('customers', JSON.stringify(updatedCustomers))
          console.log('[Inventory] Released customer binding for:', item.customerId)
        } catch (e) {
          console.error('[Inventory] Failed to update customer data:', e)
        }
      }
    }
    
    // 在庫を削除
    const updated = inventory.filter(i => i.id !== item.id)
    localStorage.setItem('inventory', JSON.stringify(updated))
    setInventory(updated)
    
    console.log('[Inventory] Deleted item and saved to localStorage')
    
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  // 金額フォーマット
  const formatCurrency = (value: number): string => {
    return `¥${value.toLocaleString()}`
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">在庫状況確認</h1>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          新規入庫
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3">
          <div className="mb-2">
            <h3 className="text-sm font-semibold">フィルター</h3>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            {/* 仕入日（開始） */}
            <div className="space-y-0.5 min-w-[140px]">
              <Label className="text-xs">仕入日（開始）</Label>
              <Input 
                type="date" 
                value={purchaseDateFrom}
                onChange={(e) => setPurchaseDateFrom(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* 仕入日（終了） */}
            <div className="space-y-0.5 min-w-[140px]">
              <Label className="text-xs">仕入日（終了）</Label>
              <Input 
                type="date" 
                value={purchaseDateTo}
                onChange={(e) => setPurchaseDateTo(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* 入庫日（開始） */}
            <div className="space-y-0.5 min-w-[140px]">
              <Label className="text-xs">入庫日（開始）</Label>
              <Input 
                type="date" 
                value={arrivalDateFrom}
                onChange={(e) => setArrivalDateFrom(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* 入庫日（終了） */}
            <div className="space-y-0.5 min-w-[140px]">
              <Label className="text-xs">入庫日（終了）</Label>
              <Input 
                type="date" 
                value={arrivalDateTo}
                onChange={(e) => setArrivalDateTo(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* 仕入区分 */}
            <div className="space-y-0.5 min-w-[140px]">
              <Label className="text-xs">仕入区分</Label>
              <Select value={purchaseType} onValueChange={setPurchaseType}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="全て" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {PURCHASE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ステータス */}
            <div className="space-y-0.5 min-w-[120px]">
              <Label className="text-xs">ステータス</Label>
              <Select value={inventoryStatus} onValueChange={setInventoryStatus}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="全て" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {INVENTORY_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 在庫期間（開始） */}
            <div className="space-y-0.5 min-w-[120px]">
              <Label className="text-xs">在庫期間（日数）開始</Label>
              <Input 
                type="number" 
                placeholder="0"
                value={inventoryDaysFrom}
                onChange={(e) => setInventoryDaysFrom(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* 在庫期間（終了） */}
            <div className="space-y-0.5 min-w-[120px]">
              <Label className="text-xs">在庫期間（日数）終了</Label>
              <Input 
                type="number" 
                placeholder="365"
                value={inventoryDaysTo}
                onChange={(e) => setInventoryDaysTo(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* 検索・リセットボタン */}
            <div className="flex gap-2 ml-auto">
              <Button onClick={handleSearch} className="gap-1 h-8 text-xs px-3">
                <Search className="h-3 w-3" />
                検索
              </Button>
              <Button onClick={handleReset} variant="outline" className="gap-1 h-8 text-xs px-3">
                <RotateCcw className="h-3 w-3" />
                リセット
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Column Selection & Table */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {filteredInventory.length}件の在庫
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-9">
                  <Settings2 className="h-4 w-4" />
                  列選択
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.status}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, status: checked })
                  }
                >
                  ステータス
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.customerName}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, customerName: checked })
                  }
                >
                  顧客名
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.purchaseDate}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, purchaseDate: checked })
                  }
                >
                  仕入日
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.arrivalDate}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, arrivalDate: checked })
                  }
                >
                  入庫日
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.purchasePrice}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, purchasePrice: checked })
                  }
                >
                  仕入原価
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.totalAmount}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, totalAmount: checked })
                  }
                >
                  仕入総額
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.supplier}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, supplier: checked })
                  }
                >
                  仕入元
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.salesPrice}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, salesPrice: checked })
                  }
                >
                  販売価格
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.inventoryDays}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, inventoryDays: checked })
                  }
                >
                  在庫期間
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.carModel}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, carModel: checked })
                  }
                >
                  車種
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.vinNumber}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, vinNumber: checked })
                  }
                >
                  車台番号
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.displayLocation}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, displayLocation: checked })
                  }
                >
                  展示場所
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.onlinePosted}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, onlinePosted: checked })
                  }
                >
                  ネット掲載
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.status && <TableHead className="w-[90px]">ステータス</TableHead>}
                  {visibleColumns.customerName && <TableHead className="w-[120px]">顧客名</TableHead>}
                  {visibleColumns.purchaseDate && <SortableHeader column="purchaseDate" className="w-[100px]">仕入日</SortableHeader>}
                  {visibleColumns.arrivalDate && <SortableHeader column="arrivalDate" className="w-[100px]">入庫日</SortableHeader>}
                  {visibleColumns.purchasePrice && <SortableHeader column="purchasePrice" className="w-[110px]">仕入原価</SortableHeader>}
                  {visibleColumns.totalAmount && <SortableHeader column="totalAmount" className="w-[110px]">仕入総額</SortableHeader>}
                  {visibleColumns.supplier && <TableHead className="w-[150px]">仕入元</TableHead>}
                  {visibleColumns.salesPrice && <SortableHeader column="salesPrice" className="w-[110px]">販売価格</SortableHeader>}
                  {visibleColumns.inventoryDays && <SortableHeader column="inventoryDays" className="w-[90px]">在庫期間</SortableHeader>}
                  {visibleColumns.carModel && <TableHead className="w-[100px]">車種</TableHead>}
                  {visibleColumns.vinNumber && <TableHead className="w-[140px]">車台番号</TableHead>}
                  {visibleColumns.displayLocation && <TableHead className="w-[120px]">展示場所</TableHead>}
                  {visibleColumns.onlinePosted && <TableHead className="w-[80px]">ネット掲載</TableHead>}
                  <TableHead className="w-[90px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedInventory.map((item) => {
                  const inventoryDays = calculateInventoryDays(item.purchaseInfo.arrivalDate)
                  const customerName = getCustomerNameByInventory(item)
                  return (
                    <TableRow key={item.id}>
                      {visibleColumns.status && (
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] ${getStatusColorClass(item.status)}`}
                          >
                            {getStatusLabel(item.status)}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.customerName && (
                        <TableCell className="text-xs">
                          {customerName || '-'}
                        </TableCell>
                      )}
                      {visibleColumns.purchaseDate && (
                        <TableCell className="whitespace-nowrap text-xs">{item.purchaseInfo.purchaseDate}</TableCell>
                      )}
                      {visibleColumns.arrivalDate && (
                        <TableCell className="whitespace-nowrap text-xs">
                          {item.purchaseInfo.arrivalDate || '-'}
                        </TableCell>
                      )}
                      {visibleColumns.purchasePrice && (
                        <TableCell className="text-xs text-right font-mono">
                          {formatCurrency(item.purchaseInfo.purchasePrice)}
                        </TableCell>
                      )}
                      {visibleColumns.totalAmount && (
                        <TableCell className="text-xs text-right font-mono">
                          {formatCurrency(item.purchaseInfo.totalAmount)}
                        </TableCell>
                      )}
                      {visibleColumns.supplier && (
                        <TableCell className="text-xs">
                          <div className="truncate max-w-[150px]" title={item.purchaseInfo.supplier}>
                            {item.purchaseInfo.supplier}
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.salesPrice && (
                        <TableCell className="text-xs text-right font-mono">
                          {formatCurrency(item.salesInfo.salesPrice)}
                        </TableCell>
                      )}
                      {visibleColumns.inventoryDays && (
                        <TableCell className="text-xs text-center">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            inventoryDays > 60 
                              ? 'bg-red-100 text-red-700' 
                              : inventoryDays > 30 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {inventoryDays}日
                          </span>
                        </TableCell>
                      )}
                      {visibleColumns.carModel && (
                        <TableCell className="text-xs">{item.vehicleInfo.carModel}</TableCell>
                      )}
                      {visibleColumns.vinNumber && (
                        <TableCell className="font-mono text-[10px]">{item.vehicleInfo.vinNumber}</TableCell>
                      )}
                      {visibleColumns.displayLocation && (
                        <TableCell className="text-xs">{item.salesInfo.displayLocation}</TableCell>
                      )}
                      {visibleColumns.onlinePosted && (
                        <TableCell className="text-center">
                          {item.salesInfo.onlinePosted ? (
                            <Globe className="h-4 w-4 mx-auto text-blue-600" />
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="gap-1 h-7 px-2"
                        >
                          <Edit className="h-3 w-3" />
                          <span className="text-xs">編集</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <InventoryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        item={selectedItem}
        onSave={handleSave}
        onDelete={selectedItem ? handleDelete : undefined}
      />
    </div>
  )
}

