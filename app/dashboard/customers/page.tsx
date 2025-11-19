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
import { Plus, Search, RotateCcw, Settings2, Edit, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { CustomerModal } from '@/components/customer-modal'
import { DUMMY_CUSTOMERS, Customer } from '@/lib/dummy-data'

const STORES = ['本店', '支店A', '支店B']
const SALES_REPS = ['高橋', '鈴木', '佐藤', '田中']
const DELIVERY_STATUSES = ['納車済み', '納車待ち', '商談中']
const CAR_MODELS = ['プリウス', 'アクア', 'ヴォクシー', 'アルファード', 'N-BOX', 'フィット']
const CAR_TYPES = ['新車', '中古車']


export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Filter states
  const [salesRep, setSalesRep] = useState('')
  const [store, setStore] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [carType, setCarType] = useState('')
  const [deliveryStatus, setDeliveryStatus] = useState('')
  const [carModel, setCarModel] = useState('')
  const [customerNameSearch, setCustomerNameSearch] = useState('')
  const [memoSearch, setMemoSearch] = useState('')
  const [contractDateFrom, setContractDateFrom] = useState('')
  const [contractDateTo, setContractDateTo] = useState('')

  // Sort states
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const [visibleColumns, setVisibleColumns] = useState({
    contractDate: true,
    deliveryStatus: true,
    customerName: true,
    furigana: true,
    phone: true,
    email: true,
    address: true,
    store: true,
    salesRep: true,
    addedDate: true,
    memo: true,
    carModel: false,
    vinNumber: false,
  })

  useEffect(() => {
    const stored = localStorage.getItem('customers')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setCustomers(parsed)
        setFilteredCustomers(parsed)
      } catch (e) {
        setCustomers(DUMMY_CUSTOMERS)
        setFilteredCustomers(DUMMY_CUSTOMERS)
      }
    } else {
      setCustomers(DUMMY_CUSTOMERS)
      setFilteredCustomers(DUMMY_CUSTOMERS)
      localStorage.setItem('customers', JSON.stringify(DUMMY_CUSTOMERS))
    }
  }, [])

  useEffect(() => {
    let filtered = [...customers]

    if (salesRep && salesRep !== 'all') {
      filtered = filtered.filter(c => c.salesRep === salesRep)
    }

    if (store && store !== 'all') {
      filtered = filtered.filter(c => c.store === store)
    }

    if (deliveryStatus && deliveryStatus !== 'all') {
      filtered = filtered.filter(c => c.deliveryStatus === deliveryStatus)
    }

    if (carType && carType !== 'all') {
      filtered = filtered.filter(c => c.carType === carType)
    }

    if (carModel && carModel !== 'all') {
      filtered = filtered.filter(c => c.carModel === carModel)
    }

    // 商談日フィルタ（contractDateを基準に）
    if (dateFilter && dateFilter !== 'all') {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()
      
      if (dateFilter === 'thisMonth') {
        const firstDay = new Date(year, month, 1).toISOString().split('T')[0]
        const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0]
        filtered = filtered.filter(c => c.contractDate >= firstDay && c.contractDate <= lastDay)
      } else if (dateFilter === 'lastMonth') {
        const firstDay = new Date(year, month - 1, 1).toISOString().split('T')[0]
        const lastDay = new Date(year, month, 0).toISOString().split('T')[0]
        filtered = filtered.filter(c => c.contractDate >= firstDay && c.contractDate <= lastDay)
      }
    }

    if (customerNameSearch) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(customerNameSearch.toLowerCase())
      )
    }

    if (memoSearch) {
      filtered = filtered.filter(c => 
        c.memo.toLowerCase().includes(memoSearch.toLowerCase())
      )
    }

    if (contractDateFrom) {
      filtered = filtered.filter(c => c.contractDate >= contractDateFrom)
    }

    if (contractDateTo) {
      filtered = filtered.filter(c => c.contractDate <= contractDateTo)
    }

    setFilteredCustomers(filtered)
  }, [customers, salesRep, store, deliveryStatus, carType, carModel, dateFilter, customerNameSearch, memoSearch, contractDateFrom, contractDateTo])

  // Sort filtered customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (!sortColumn) return 0

    let aValue: any = a[sortColumn as keyof Customer]
    let bValue: any = b[sortColumn as keyof Customer]

    // Handle empty values
    if (!aValue) aValue = ''
    if (!bValue) bValue = ''

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
    let filtered = [...customers]

    if (salesRep && salesRep !== 'all') {
      filtered = filtered.filter(c => c.salesRep === salesRep)
    }

    if (store && store !== 'all') {
      filtered = filtered.filter(c => c.store === store)
    }

    if (deliveryStatus && deliveryStatus !== 'all') {
      filtered = filtered.filter(c => c.deliveryStatus === deliveryStatus)
    }

    if (carType && carType !== 'all') {
      filtered = filtered.filter(c => c.carType === carType)
    }

    if (carModel && carModel !== 'all') {
      filtered = filtered.filter(c => c.carModel === carModel)
    }

    // 商談日フィルタ（contractDateを基準に）
    if (dateFilter && dateFilter !== 'all') {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()
      
      if (dateFilter === 'thisMonth') {
        const firstDay = new Date(year, month, 1).toISOString().split('T')[0]
        const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0]
        filtered = filtered.filter(c => c.contractDate >= firstDay && c.contractDate <= lastDay)
      } else if (dateFilter === 'lastMonth') {
        const firstDay = new Date(year, month - 1, 1).toISOString().split('T')[0]
        const lastDay = new Date(year, month, 0).toISOString().split('T')[0]
        filtered = filtered.filter(c => c.contractDate >= firstDay && c.contractDate <= lastDay)
      }
    }

    if (customerNameSearch) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(customerNameSearch.toLowerCase())
      )
    }

    if (memoSearch) {
      filtered = filtered.filter(c => 
        c.memo.toLowerCase().includes(memoSearch.toLowerCase())
      )
    }

    if (contractDateFrom) {
      filtered = filtered.filter(c => c.contractDate >= contractDateFrom)
    }

    if (contractDateTo) {
      filtered = filtered.filter(c => c.contractDate <= contractDateTo)
    }

    setFilteredCustomers(filtered)
  }

  const handleReset = () => {
    setSalesRep('')
    setStore('')
    setDateFilter('all')
    setDeliveryStatus('')
    setCarType('')
    setCarModel('')
    setCustomerNameSearch('')
    setMemoSearch('')
    setContractDateFrom('')
    setContractDateTo('')
    setSortColumn(null)
    setSortDirection('asc')
    setFilteredCustomers(customers)
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
    setSelectedCustomer(null)
    setIsModalOpen(true)
  }

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsModalOpen(true)
  }

  const handleSave = (customer: Customer) => {
    console.log('[v0] Saving customer:', customer)
    
    let updated: Customer[]
    
    if (selectedCustomer) {
      updated = customers.map(c => 
        c.id === selectedCustomer.id ? { ...customer, id: selectedCustomer.id } : c
      )
      console.log('[v0] Updated existing customer')
    } else {
      const newCustomer = { 
        ...customer, 
        id: `C${String(customers.length + 1).padStart(3, '0')}`,
        addedDate: new Date().toISOString().split('T')[0]
      }
      updated = [...customers, newCustomer]
      console.log('[v0] Added new customer:', newCustomer)
    }
    
    localStorage.setItem('customers', JSON.stringify(updated))
    setCustomers(updated)


    console.log('[v0] Updated customer list and saved to localStorage')
    
    setIsModalOpen(false)
    setSelectedCustomer(null)
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">顧客管理</h1>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          顧客新規追加
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-wrap items-end gap-2">
            {/* 担当者 */}
            <div className="space-y-0.5 min-w-[120px]">
              <Label className="text-xs">担当者</Label>
              <Select value={salesRep} onValueChange={setSalesRep}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="全て" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {SALES_REPS.map(rep => (
                    <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 店舗 */}
            <div className="space-y-0.5 min-w-[120px]">
              <Label className="text-xs">店舗</Label>
              <Select value={store} onValueChange={setStore}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="全て" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {STORES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 納車状況 */}
            <div className="space-y-0.5 min-w-[120px]">
              <Label className="text-xs">納車状況</Label>
              <Select value={deliveryStatus} onValueChange={setDeliveryStatus}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="全て" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {DELIVERY_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 車種区分（新車/中古車） */}
            <div className="space-y-0.5 min-w-[120px]">
              <Label className="text-xs">車種区分</Label>
              <Select value={carType} onValueChange={setCarType}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="全て" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {CAR_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 商談日 */}
            <div className="space-y-0.5 min-w-[120px]">
              <Label className="text-xs">商談日</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="全期間" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全期間</SelectItem>
                  <SelectItem value="thisMonth">今月</SelectItem>
                  <SelectItem value="lastMonth">先月</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 車種 */}
            <div className="space-y-0.5 min-w-[120px]">
              <Label className="text-xs">車種</Label>
              <Select value={carModel} onValueChange={setCarModel}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="全て" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {CAR_MODELS.map(model => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 顧客名検索 */}
            <div className="space-y-0.5 min-w-[140px]">
              <Label className="text-xs">顧客名</Label>
              <Input 
                placeholder="顧客名を入力" 
                value={customerNameSearch}
                onChange={(e) => setCustomerNameSearch(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* 契約日（開始） */}
            <div className="space-y-0.5 min-w-[140px]">
              <Label className="text-xs">契約日（開始）</Label>
              <Input 
                type="date" 
                value={contractDateFrom}
                onChange={(e) => setContractDateFrom(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* 契約日（終了） */}
            <div className="space-y-0.5 min-w-[140px]">
              <Label className="text-xs">契約日（終了）</Label>
              <Input 
                type="date" 
                value={contractDateTo}
                onChange={(e) => setContractDateTo(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* メモ検索 */}
            <div className="space-y-0.5 min-w-[140px]">
              <Label className="text-xs">メモ</Label>
              <Input 
                placeholder="メモ内容を入力" 
                value={memoSearch}
                onChange={(e) => setMemoSearch(e.target.value)}
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
              {filteredCustomers.length}件の顧客
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
                  checked={visibleColumns.contractDate}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, contractDate: checked })
                  }
                >
                  契約日
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.deliveryStatus}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, deliveryStatus: checked })
                  }
                >
                  納車状況
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
                  checked={visibleColumns.furigana}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, furigana: checked })
                  }
                >
                  フリガナ
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.phone}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, phone: checked })
                  }
                >
                  電話番号
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.email}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, email: checked })
                  }
                >
                  Email
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.address}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, address: checked })
                  }
                >
                  住所
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.store}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, store: checked })
                  }
                >
                  店舗
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.salesRep}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, salesRep: checked })
                  }
                >
                  担当者
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.addedDate}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, addedDate: checked })
                  }
                >
                  追加日
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.memo}
                  onCheckedChange={(checked) =>
                    setVisibleColumns({ ...visibleColumns, memo: checked })
                  }
                >
                  メモ
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.contractDate && <SortableHeader column="contractDate" className="w-[100px]">契約日</SortableHeader>}
                  {visibleColumns.deliveryStatus && <SortableHeader column="deliveryStatus" className="w-[90px]">納車状況</SortableHeader>}
                  {visibleColumns.customerName && <SortableHeader column="name" className="w-[120px]">顧客名</SortableHeader>}
                  {visibleColumns.furigana && <TableHead className="w-[140px]">フリガナ</TableHead>}
                  {visibleColumns.phone && <TableHead className="w-[130px]">電話番号</TableHead>}
                  {visibleColumns.email && <TableHead className="w-[180px]">Email</TableHead>}
                  {visibleColumns.address && <TableHead className="w-[200px]">住所</TableHead>}
                  {visibleColumns.store && <SortableHeader column="store" className="w-[80px]">店舗</SortableHeader>}
                  {visibleColumns.salesRep && <SortableHeader column="salesRep" className="w-[80px]">担当者</SortableHeader>}
                  {visibleColumns.addedDate && <SortableHeader column="addedDate" className="w-[100px]">追加日</SortableHeader>}
                  {visibleColumns.memo && <TableHead className="w-[180px]">メモ</TableHead>}
                  {visibleColumns.carModel && <TableHead className="w-[100px]">車種</TableHead>}
                  {visibleColumns.vinNumber && <TableHead className="w-[140px]">車台番号</TableHead>}
                  <TableHead className="w-[90px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    {visibleColumns.contractDate && (
                      <TableCell className="whitespace-nowrap text-xs">{customer.contractDate}</TableCell>
                    )}
                    {visibleColumns.deliveryStatus && (
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                            customer.deliveryStatus === '納車済み'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {customer.deliveryStatus}
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.customerName && <TableCell className="font-medium text-xs">{customer.name}</TableCell>}
                    {visibleColumns.furigana && <TableCell className="text-xs text-muted-foreground">{customer.furigana}</TableCell>}
                    {visibleColumns.phone && <TableCell className="text-xs font-mono">{customer.phone}</TableCell>}
                    {visibleColumns.email && (
                      <TableCell className="text-xs">
                        <div className="truncate max-w-[180px]" title={customer.email}>
                          {customer.email || '-'}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.address && (
                      <TableCell className="text-xs">
                        <div className="truncate max-w-[200px]" title={customer.address}>
                          {customer.address}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.store && <TableCell className="text-xs">{customer.store}</TableCell>}
                    {visibleColumns.salesRep && <TableCell className="text-xs">{customer.salesRep}</TableCell>}
                    {visibleColumns.addedDate && <TableCell className="whitespace-nowrap text-xs">{customer.addedDate}</TableCell>}
                    {visibleColumns.memo && (
                      <TableCell className="text-xs">
                        <div className="truncate max-w-[180px]" title={customer.memo}>
                          {customer.memo}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.carModel && <TableCell className="text-xs">{customer.carModel}</TableCell>}
                    {visibleColumns.vinNumber && <TableCell className="font-mono text-[10px]">{customer.vinNumber}</TableCell>}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(customer)}
                        className="gap-1 h-7 px-2"
                      >
                        <Edit className="h-3 w-3" />
                        <span className="text-xs">編集</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CustomerModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        customer={selectedCustomer}
        onSave={handleSave}
      />
    </div>
  )
}
