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
import { Customer, DealMemo, InventoryItem, OptionItem } from '@/lib/dummy-data'
import { useToast } from '@/hooks/use-toast'
import { Plus, FileText, Package, X } from 'lucide-react'
import { InventorySelectorDialog } from './inventory-selector-dialog'
import { getInventoryByVin } from '@/lib/inventory-utils'

const OPTION_CATEGORIES = [
  'タイヤ',
  'ナビ',
  'ライト',
  'オーディオ',
  'セキュリティ',
  'エアロ',
  'その他'
]

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
    const currentStatus = formData.dealInfo.statuses[statusKey as keyof typeof formData.dealInfo.statuses] || { checked: false, date: '' }
    const updatedStatuses = {
      ...formData.dealInfo.statuses,
      [statusKey]: {
        ...currentStatus,
        [field]: value,
      },
    }

    // Auto-fill date when checkbox is checked
    if (field === 'checked' && value) {
      updatedStatuses[statusKey as keyof typeof updatedStatuses].date = new Date().toISOString().split('T')[0]
    }

    // 納車済みステータスがチェックされたらdeliveryStatusを「納車済み」に更新
    if (statusKey === 'delivered' && field === 'checked' && value) {
      setFormData({
        ...formData,
        deliveryStatus: '納車済み',
        dealInfo: {
          ...formData.dealInfo,
          statuses: updatedStatuses,
        },
      })
    } else {
      handleDealInfoChange('statuses', updatedStatuses)
    }
  }

  // オプション追加
  const handleAddOption = () => {
    const newOption: OptionItem = {
      id: Date.now().toString(),
      category: '',
      optionName: '',
      amount: 0,
    }
    handleDealInfoChange('options', [...(formData.dealInfo.options || []), newOption])
  }

  // オプション変更
  const handleOptionChange = (id: string, field: keyof OptionItem, value: any) => {
    // プレースホルダーの場合は新しいオプションを追加
    if (id.startsWith('placeholder-')) {
      const newOption: OptionItem = {
        id: Date.now().toString(),
        category: field === 'category' ? value : '',
        optionName: field === 'optionName' ? value : '',
        amount: field === 'amount' ? value : 0,
      }
      handleDealInfoChange('options', [...(formData.dealInfo.options || []), newOption])
    } else {
      const updatedOptions = (formData.dealInfo.options || []).map((option) =>
        option.id === id ? { ...option, [field]: value } : option
      )
      handleDealInfoChange('options', updatedOptions)
    }
  }

  // オプション削除
  const handleRemoveOption = (id: string) => {
    const updatedOptions = (formData.dealInfo.options || []).filter((option) => option.id !== id)
    handleDealInfoChange('options', updatedOptions)
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
    handleDealInfoChange('carType', item.purchaseInfo.category)
    
    // 顧客データの車台番号と車種、車種区分も更新
    setFormData({
      ...formData,
      vinNumber: item.vehicleInfo.vinNumber,
      carModel: item.vehicleInfo.carModel,
      carType: item.purchaseInfo.category,
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
        carType: item.purchaseInfo.category,
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
        handleDealInfoChange('carType', inventory.purchaseInfo.category)
        
        // 顧客データの車種と車種区分も更新
        setFormData({
          ...formData,
          vinNumber: vinNumber,
          carModel: inventory.vehicleInfo.carModel,
          carType: inventory.purchaseInfo.category,
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
            carType: inventory.purchaseInfo.category,
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左列: 車両詳細 */}
            <div>
              <h4 className="text-sm font-semibold mb-4">車両詳細</h4>
              <div className="grid gap-4 md:grid-cols-2">
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
              <Label htmlFor="carType">車種区分（在庫から自動取得）</Label>
              <Input
                id="carType"
                value={formData.dealInfo.carType || '未設定'}
                onChange={(e) => handleDealInfoChange('carType', e.target.value)}
                placeholder="新車 / 中古車"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">色</Label>
              <Input
                id="color"
                value={formData.dealInfo.color || ''}
                onChange={(e) => handleDealInfoChange('color', e.target.value)}
                placeholder="白"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">グレード</Label>
              <Input
                id="grade"
                value={formData.dealInfo.grade || ''}
                onChange={(e) => handleDealInfoChange('grade', e.target.value)}
                placeholder="S"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">年式</Label>
              <Input
                id="year"
                value={formData.dealInfo.year || ''}
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
                  value={formData.dealInfo.mileage || ''}
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
                value={formData.dealInfo.modelType || ''}
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
              <Label htmlFor="discount">値引き</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  ¥
                </span>
                <Input
                  id="discount"
                  type="number"
                  value={formData.dealInfo.discount || ''}
                  onChange={(e) => handleDealInfoChange('discount', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          {/* 総額表示 */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">総額</Label>
              <div className="text-2xl font-bold text-primary">
                ¥{(() => {
                  const salesPrice = formData.dealInfo.salesPrice || 0
                  const discount = formData.dealInfo.discount || 0
                  const optionsTotal = (formData.dealInfo.options || []).reduce((sum, opt) => sum + (opt.amount || 0), 0)
                  const total = salesPrice + optionsTotal - discount
                  return total.toLocaleString()
                })()}
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>販売価格:</span>
                <span>¥{(formData.dealInfo.salesPrice || 0).toLocaleString()}</span>
              </div>
              {(formData.dealInfo.options || []).length > 0 && (
                <div className="flex justify-between">
                  <span>オプション合計:</span>
                  <span>¥{(formData.dealInfo.options || []).reduce((sum, opt) => sum + (opt.amount || 0), 0).toLocaleString()}</span>
                </div>
              )}
              {(formData.dealInfo.discount || 0) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>値引き:</span>
                  <span>-¥{(formData.dealInfo.discount || 0).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右列: オプション */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold">オプション</h4>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handleAddOption}
            >
              <Plus className="h-3 w-3" />
              追加
            </Button>
          </div>
          <div className="space-y-3">
            {((formData.dealInfo.options || []).length === 0 ? Array(3).fill(null) : (formData.dealInfo.options || [])).map((option, index) => {
              const isPlaceholder = !option
              const optionData = isPlaceholder ? { id: `placeholder-${index}`, category: '', optionName: '', amount: 0 } : option
              
              return (
                <div key={optionData.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3">
                    <Select
                      value={optionData.category}
                      onValueChange={(value) => handleOptionChange(optionData.id, 'category', value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="カテゴリ" />
                      </SelectTrigger>
                      <SelectContent>
                        {OPTION_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-xs">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-5">
                    <Input
                      value={optionData.optionName}
                      onChange={(e) => handleOptionChange(optionData.id, 'optionName', e.target.value)}
                      placeholder="オプション名"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      value={optionData.amount || ''}
                      onChange={(e) => handleOptionChange(optionData.id, 'amount', parseInt(e.target.value) || 0)}
                      placeholder="金額"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="col-span-1">
                    {!isPlaceholder && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleRemoveOption(optionData.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
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
          <div className="grid grid-cols-2 gap-6">
            {/* 左列: ステータス管理 */}
            <div>
              <h3 className="mb-4 text-sm font-semibold">ステータス管理</h3>
              <div className="space-y-3">
                {/* 成約済み */}
                <div className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="flex items-center gap-2 flex-1">
                    <Checkbox
                      id="contract"
                      checked={formData.dealInfo.statuses.contract.checked}
                      onCheckedChange={(checked) =>
                        handleStatusChange('contract', 'checked', checked)
                      }
                    />
                    <Label htmlFor="contract" className="text-sm font-medium">
                      成約済み
                    </Label>
                  </div>
                  <Input
                    type="date"
                    value={formData.dealInfo.statuses.contract.date}
                    onChange={(e) => handleStatusChange('contract', 'date', e.target.value)}
                    className="w-40"
                  />
                </div>

                {/* 書類済み */}
                <div className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="flex items-center gap-2 flex-1">
                    <Checkbox
                      id="documents"
                      checked={formData.dealInfo.statuses.documents.checked}
                      onCheckedChange={(checked) =>
                        handleStatusChange('documents', 'checked', checked)
                      }
                    />
                    <Label htmlFor="documents" className="text-sm font-medium">
                      書類済み
                    </Label>
                  </div>
                  <Input
                    type="date"
                    value={formData.dealInfo.statuses.documents.date}
                    onChange={(e) => handleStatusChange('documents', 'date', e.target.value)}
                    className="w-40"
                  />
                </div>

                {/* 入金済み */}
                <div className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="flex items-center gap-2 flex-1">
                    <Checkbox
                      id="payment"
                      checked={formData.dealInfo.statuses.payment.checked}
                      onCheckedChange={(checked) =>
                        handleStatusChange('payment', 'checked', checked)
                      }
                    />
                    <Label htmlFor="payment" className="text-sm font-medium">
                      入金済み
                    </Label>
                  </div>
                  <Input
                    type="date"
                    value={formData.dealInfo.statuses.payment.date}
                    onChange={(e) => handleStatusChange('payment', 'date', e.target.value)}
                    className="w-40"
                  />
                </div>

                {/* 納車済み */}
                <div className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="flex items-center gap-2 flex-1">
                    <Checkbox
                      id="delivered"
                      checked={formData.dealInfo.statuses.delivered?.checked || false}
                      onCheckedChange={(checked) =>
                        handleStatusChange('delivered', 'checked', checked)
                      }
                    />
                    <Label htmlFor="delivered" className="text-sm font-medium">
                      納車済み
                    </Label>
                  </div>
                  <Input
                    type="date"
                    value={formData.dealInfo.statuses.delivered?.date || ''}
                    onChange={(e) => handleStatusChange('delivered', 'date', e.target.value)}
                    className="w-40"
                  />
                </div>
              </div>
            </div>

            {/* 右列: 営業管理 */}
            <div>
              <h3 className="mb-4 text-sm font-semibold">営業管理</h3>
              <div className="space-y-3">
                {/* LINE連絡済み */}
                <div className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="flex items-center gap-2 flex-1">
                    <Checkbox
                      id="lineContact"
                      checked={formData.dealInfo.statuses.lineContact.checked}
                      onCheckedChange={(checked) =>
                        handleStatusChange('lineContact', 'checked', checked)
                      }
                    />
                    <Label htmlFor="lineContact" className="text-sm font-medium">
                      LINE連絡済み
                    </Label>
                  </div>
                  <Input
                    type="date"
                    value={formData.dealInfo.statuses.lineContact.date}
                    onChange={(e) => handleStatusChange('lineContact', 'date', e.target.value)}
                    className="w-40"
                  />
                </div>

                {/* 後追1 */}
                <div className={`flex items-center gap-4 rounded-lg border p-3 ${
                  formData.dealInfo.noFollowUp ? 'opacity-50' : ''
                }`}>
                  <div className="flex items-center gap-2 flex-1">
                    <Checkbox
                      id="followUp1"
                      checked={formData.dealInfo.statuses.followUp1.checked}
                      onCheckedChange={(checked) =>
                        handleStatusChange('followUp1', 'checked', checked)
                      }
                      disabled={formData.dealInfo.noFollowUp}
                    />
                    <Label htmlFor="followUp1" className="text-sm font-medium">
                      後追1
                    </Label>
                  </div>
                  <Input
                    type="date"
                    value={formData.dealInfo.statuses.followUp1.date}
                    onChange={(e) => handleStatusChange('followUp1', 'date', e.target.value)}
                    disabled={formData.dealInfo.noFollowUp}
                    className="w-40"
                  />
                </div>

                {/* 後追2 */}
                <div className={`flex items-center gap-4 rounded-lg border p-3 ${
                  formData.dealInfo.noFollowUp ? 'opacity-50' : ''
                }`}>
                  <div className="flex items-center gap-2 flex-1">
                    <Checkbox
                      id="followUp2"
                      checked={formData.dealInfo.statuses.followUp2.checked}
                      onCheckedChange={(checked) =>
                        handleStatusChange('followUp2', 'checked', checked)
                      }
                      disabled={formData.dealInfo.noFollowUp}
                    />
                    <Label htmlFor="followUp2" className="text-sm font-medium">
                      後追2
                    </Label>
                  </div>
                  <Input
                    type="date"
                    value={formData.dealInfo.statuses.followUp2.date}
                    onChange={(e) => handleStatusChange('followUp2', 'date', e.target.value)}
                    disabled={formData.dealInfo.noFollowUp}
                    className="w-40"
                  />
                </div>

                {/* 後追不要 */}
                <div className="flex items-center gap-2 rounded-lg border p-3">
                  <Checkbox
                    id="noFollowUp"
                    checked={formData.dealInfo.noFollowUp}
                    onCheckedChange={(checked) =>
                      handleDealInfoChange('noFollowUp', checked)
                    }
                  />
                  <Label htmlFor="noFollowUp" className="text-sm font-medium">
                    後追不要
                  </Label>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                後追いは営業マン管理／通知に使用されます
              </p>
            </div>
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
