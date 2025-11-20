'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Customer, DealMemo, InventoryItem } from '@/lib/dummy-data'
import { useToast } from '@/hooks/use-toast'
import { Plus, FileText, Package } from 'lucide-react'
import { InventorySelectorDialog } from './inventory-selector-dialog'
import { getInventoryByVin } from '@/lib/inventory-utils'

const AUCTION_HOUSES = ['オークション会場A', 'オークション会場B', 'オークション会場C']
const SHIPPING_FEES = {
  'オークション会場A': '¥30,000',
  'オークション会場B': '¥25,000',
  'オークション会場C': '¥35,000',
}

interface CustomerDealTabProps {
  formData: Customer
  setFormData: (data: Customer) => void
  onSave: () => void
}

export function CustomerDealTab({
  formData,
  setFormData,
  onSave,
}: CustomerDealTabProps) {
  const { toast } = useToast()
  const [memoText, setMemoText] = useState('')
  const [isInventorySelectorOpen, setIsInventorySelectorOpen] = useState(false)

  const handleDealInfoChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      dealInfo: {
        ...formData.dealInfo,
        [field]: value,
      },
    })
  }

  const handleAuctionHouseChange = (value: string) => {
    handleDealInfoChange('auctionHouse', value)
    handleDealInfoChange('shippingFee', SHIPPING_FEES[value as keyof typeof SHIPPING_FEES] || '')
  }

  const handleAddMemo = () => {
    if (!memoText.trim()) return

    const newMemo: DealMemo = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      content: memoText,
    }

    handleDealInfoChange('dealMemos', [...formData.dealInfo.dealMemos, newMemo])
    setMemoText('')
  }

  const handleStatusChange = (statusKey: string, field: 'checked' | 'date', value: any) => {
    const updatedStatuses = {
      ...formData.dealInfo.statuses,
      [statusKey]: {
        ...formData.dealInfo.statuses[statusKey as keyof typeof formData.dealInfo.statuses],
        [field]: value,
      },
    }

    // Auto-fill date when checkbox is checked
    if (field === 'checked' && value) {
      updatedStatuses[statusKey as keyof typeof updatedStatuses].date = new Date().toISOString().split('T')[0]
    }

    handleDealInfoChange('statuses', updatedStatuses)
  }

  const handleSave = () => {
    toast({
      title: '保存完了',
      description: '商談情報を保存しました',
    })
    
    setTimeout(() => {
      onSave()
    }, 10)
  }

  // 在庫から選択
  const handleInventorySelect = (item: InventoryItem) => {
    handleDealInfoChange('vinNumber', item.vehicleInfo.vinNumber)
    handleDealInfoChange('carModel', item.vehicleInfo.carModel)
    handleDealInfoChange('maker', item.vehicleInfo.maker)
    handleDealInfoChange('color', item.vehicleInfo.color)
    handleDealInfoChange('grade', item.vehicleInfo.grade)
    handleDealInfoChange('year', item.vehicleInfo.year)
    handleDealInfoChange('mileage', item.vehicleInfo.mileage)
    handleDealInfoChange('modelType', item.vehicleInfo.modelType)
    handleDealInfoChange('salesPrice', item.salesInfo.salesPrice)
    
    // 顧客データの車台番号と車種も更新
    setFormData({
      ...formData,
      vinNumber: item.vehicleInfo.vinNumber,
      carModel: item.vehicleInfo.carModel,
      dealInfo: {
        ...formData.dealInfo,
        vinNumber: item.vehicleInfo.vinNumber,
        carModel: item.vehicleInfo.carModel,
        maker: item.vehicleInfo.maker,
        color: item.vehicleInfo.color,
        grade: item.vehicleInfo.grade,
        year: item.vehicleInfo.year,
        mileage: item.vehicleInfo.mileage,
        modelType: item.vehicleInfo.modelType,
        salesPrice: item.salesInfo.salesPrice,
      },
    })
    
    toast({
      title: '在庫情報を反映しました',
      description: `${item.vehicleInfo.carModel} (${item.vehicleInfo.vinNumber})`,
    })
  }

  // 車台番号入力時の自動補完
  const handleVinNumberChange = (vinNumber: string) => {
    handleDealInfoChange('vinNumber', vinNumber)
    
    // 顧客データの車台番号も更新
    setFormData({
      ...formData,
      vinNumber: vinNumber,
      dealInfo: {
        ...formData.dealInfo,
        vinNumber: vinNumber,
      },
    })
    
    // 17桁入力されたら自動補完を試みる
    if (vinNumber.length === 17) {
      const inventory = getInventoryByVin(vinNumber)
      if (inventory) {
        handleDealInfoChange('carModel', inventory.vehicleInfo.carModel)
        handleDealInfoChange('maker', inventory.vehicleInfo.maker)
        handleDealInfoChange('color', inventory.vehicleInfo.color)
        handleDealInfoChange('grade', inventory.vehicleInfo.grade)
        handleDealInfoChange('year', inventory.vehicleInfo.year)
        handleDealInfoChange('mileage', inventory.vehicleInfo.mileage)
        handleDealInfoChange('modelType', inventory.vehicleInfo.modelType)
        handleDealInfoChange('salesPrice', inventory.salesInfo.salesPrice)
        
        // 顧客データの車種も更新
        setFormData({
          ...formData,
          vinNumber: vinNumber,
          carModel: inventory.vehicleInfo.carModel,
          dealInfo: {
            ...formData.dealInfo,
            vinNumber: vinNumber,
            carModel: inventory.vehicleInfo.carModel,
            maker: inventory.vehicleInfo.maker,
            color: inventory.vehicleInfo.color,
            grade: inventory.vehicleInfo.grade,
            year: inventory.vehicleInfo.year,
            mileage: inventory.vehicleInfo.mileage,
            modelType: inventory.vehicleInfo.modelType,
            salesPrice: inventory.salesInfo.salesPrice,
          },
        })
        
        toast({
          title: '在庫データから自動補完しました',
          description: `${inventory.vehicleInfo.carModel} - ${inventory.vehicleInfo.maker}`,
        })
      }
    }
  }

  return (
    <div className="space-y-6 py-4">
      {/* Vehicle Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">車両情報</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => setIsInventorySelectorOpen(true)}
              >
                <Package className="h-4 w-4" />
                在庫から選択
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                この車で見積を作成
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="vinNumber">車台番号</Label>
              <Input
                id="vinNumber"
                value={formData.dealInfo.vinNumber}
                onChange={(e) => handleVinNumberChange(e.target.value)}
                placeholder="12345678901234567"
                maxLength={17}
              />
              <p className="text-[10px] text-muted-foreground">
                17桁入力で在庫から自動補完されます
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="carModel">車種</Label>
              <Input
                id="carModel"
                value={formData.dealInfo.carModel}
                onChange={(e) => handleDealInfoChange('carModel', e.target.value)}
                placeholder="プリウス"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maker">メーカー</Label>
              <Input
                id="maker"
                value={formData.dealInfo.maker}
                onChange={(e) => handleDealInfoChange('maker', e.target.value)}
                placeholder="トヨタ"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">色</Label>
              <Input
                id="color"
                value={formData.dealInfo.color}
                onChange={(e) => handleDealInfoChange('color', e.target.value)}
                placeholder="白"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">グレード</Label>
              <Input
                id="grade"
                value={formData.dealInfo.grade}
                onChange={(e) => handleDealInfoChange('grade', e.target.value)}
                placeholder="S"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">年式</Label>
              <Input
                id="year"
                value={formData.dealInfo.year}
                onChange={(e) => handleDealInfoChange('year', e.target.value)}
                placeholder="2018"
                maxLength={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">走行距離</Label>
              <div className="relative">
                <Input
                  id="mileage"
                  value={formData.dealInfo.mileage}
                  onChange={(e) => handleDealInfoChange('mileage', e.target.value)}
                  placeholder="45000"
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  km
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelType">型式</Label>
              <Input
                id="modelType"
                value={formData.dealInfo.modelType}
                onChange={(e) => handleDealInfoChange('modelType', e.target.value)}
                placeholder="ZVW30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salesPrice">販売価格</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  ¥
                </span>
                <Input
                  id="salesPrice"
                  type="number"
                  value={formData.dealInfo.salesPrice || ''}
                  onChange={(e) => handleDealInfoChange('salesPrice', parseInt(e.target.value) || 0)}
                  placeholder="1380000"
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auctionHouse">オークション会場</Label>
              <Select
                value={formData.dealInfo.auctionHouse}
                onValueChange={handleAuctionHouseChange}
              >
                <SelectTrigger id="auctionHouse">
                  <SelectValue placeholder="会場を選択" />
                </SelectTrigger>
                <SelectContent>
                  {AUCTION_HOUSES.map((house) => (
                    <SelectItem key={house} value={house}>
                      {house}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingFee">送料（自動）</Label>
              <Input
                id="shippingFee"
                value={formData.dealInfo.shippingFee}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deal Memos */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-sm font-semibold">商談メモ</h3>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                placeholder="商談内容を入力..."
                className="min-h-[80px]"
              />
              <Button onClick={handleAddMemo} className="gap-2">
                <Plus className="h-4 w-4" />
                追加
              </Button>
            </div>

            {formData.dealInfo.dealMemos.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {formData.dealInfo.dealMemos.map((memo) => (
                  <Card key={memo.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="text-xs text-muted-foreground">{memo.date}</p>
                          <p className="text-sm">{memo.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Management */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">ステータス管理</h3>
            <div className="flex items-center gap-2">
              <Checkbox
                id="noFollowUp"
                checked={formData.dealInfo.noFollowUp}
                onCheckedChange={(checked) =>
                  handleDealInfoChange('noFollowUp', checked)
                }
              />
              <Label htmlFor="noFollowUp" className="text-sm font-normal">
                後追不要
              </Label>
            </div>
          </div>

          <p className="mb-4 text-xs text-muted-foreground">
            後追いは営業マン管理／通知に使用されます
          </p>

          <div className="space-y-3">
            {Object.entries(formData.dealInfo.statuses).map(([key, status]) => {
              const labels: Record<string, string> = {
                lineContact: 'LINE 連絡済',
                contract: '成約',
                followUp1: '後追1',
                followUp2: '後追2',
                documents: '書類',
                payment: '入金',
              }

              const isFollowUp = key === 'followUp1' || key === 'followUp2'
              const disabled = isFollowUp && formData.dealInfo.noFollowUp

              return (
                <div
                  key={key}
                  className={`flex items-center gap-4 rounded-lg border p-3 ${
                    disabled ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Checkbox
                      id={key}
                      checked={status.checked}
                      onCheckedChange={(checked) =>
                        handleStatusChange(key, 'checked', checked)
                      }
                      disabled={disabled}
                    />
                    <Label htmlFor={key} className="text-sm font-medium">
                      {labels[key]}
                    </Label>
                  </div>
                  <Input
                    type="date"
                    value={status.date}
                    onChange={(e) => handleStatusChange(key, 'date', e.target.value)}
                    disabled={disabled}
                    className="w-40"
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          閉じる
        </Button>
        <Button onClick={handleSave}>自動保存</Button>
      </div>

      {/* 在庫選択ダイアログ */}
      <InventorySelectorDialog
        open={isInventorySelectorOpen}
        onOpenChange={setIsInventorySelectorOpen}
        onSelect={handleInventorySelect}
        showAvailableOnly={true}
      />
    </div>
  )
}
