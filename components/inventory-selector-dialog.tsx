'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, Check } from 'lucide-react'
import { InventoryItem } from '@/lib/dummy-data'
import { 
  getInventoryFromStorage, 
  getStatusLabel, 
  getStatusColorClass 
} from '@/lib/inventory-utils'

interface InventorySelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (item: InventoryItem) => void
  showAvailableOnly?: boolean
}

export function InventorySelectorDialog({
  open,
  onOpenChange,
  onSelect,
  showAvailableOnly = true,
}: InventorySelectorDialogProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(showAvailableOnly)

  useEffect(() => {
    if (open) {
      const items = getInventoryFromStorage()
      setInventory(items)
      setFilteredInventory(items)
      setSearchQuery('')
    }
  }, [open])

  useEffect(() => {
    let filtered = [...inventory]

    // ステータスでフィルタ
    if (showOnlyAvailable) {
      filtered = filtered.filter(item => item.status === 'available')
    }

    // 検索クエリでフィルタ
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.vehicleInfo.carModel.toLowerCase().includes(query) ||
        item.vehicleInfo.maker.toLowerCase().includes(query) ||
        item.vehicleInfo.vinNumber.toLowerCase().includes(query) ||
        item.vehicleInfo.year.includes(searchQuery) ||
        item.vehicleInfo.color.toLowerCase().includes(query) ||
        item.salesInfo.displayLocation.toLowerCase().includes(query)
      )
    }

    setFilteredInventory(filtered)
  }, [inventory, searchQuery, showOnlyAvailable])

  const handleSelect = (item: InventoryItem) => {
    onSelect(item)
    onOpenChange(false)
  }

  const formatCurrency = (value: number): string => {
    return `¥${value.toLocaleString()}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>在庫から選択</DialogTitle>
          <DialogDescription>
            車輛を在庫リストから選択してください
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* 検索フィルタ */}
          <div className="space-y-3">
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-1">
                <Label className="text-xs">検索</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="車種、メーカー、車台番号、年式、色、展示場所で検索..."
                    className="pl-10 h-9 text-sm"
                  />
                </div>
              </div>
              
              <Button
                variant={showOnlyAvailable ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
                className="h-9 gap-2"
              >
                {showOnlyAvailable && <Check className="h-4 w-4" />}
                在庫中のみ表示
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              {filteredInventory.length}件の在庫が見つかりました
            </div>
          </div>

          {/* 在庫リストテーブル */}
          <div className="flex-1 overflow-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ステータス</TableHead>
                  <TableHead className="w-[100px]">車種</TableHead>
                  <TableHead className="w-[80px]">メーカー</TableHead>
                  <TableHead className="w-[60px]">年式</TableHead>
                  <TableHead className="w-[80px]">色</TableHead>
                  <TableHead className="w-[140px]">車台番号</TableHead>
                  <TableHead className="w-[100px]">販売価格</TableHead>
                  <TableHead className="w-[100px]">展示場所</TableHead>
                  <TableHead className="w-[80px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      {searchQuery || showOnlyAvailable 
                        ? '条件に一致する在庫が見つかりませんでした' 
                        : '在庫がありません'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${getStatusColorClass(item.status)}`}
                        >
                          {getStatusLabel(item.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {item.vehicleInfo.carModel}
                      </TableCell>
                      <TableCell className="text-xs">
                        {item.vehicleInfo.maker}
                      </TableCell>
                      <TableCell className="text-xs">
                        {item.vehicleInfo.year}
                      </TableCell>
                      <TableCell className="text-xs">
                        {item.vehicleInfo.color}
                      </TableCell>
                      <TableCell className="font-mono text-[10px]">
                        {item.vehicleInfo.vinNumber}
                      </TableCell>
                      <TableCell className="text-xs text-right font-mono">
                        {formatCurrency(item.salesInfo.salesPrice)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {item.salesInfo.displayLocation}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSelect(item)}
                          disabled={item.status !== 'available'}
                          className="h-7 text-xs"
                        >
                          選択
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

