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
import { Customer, DealMemo } from '@/lib/dummy-data'
import { useToast } from '@/hooks/use-toast'
import { Plus, FileText } from 'lucide-react'

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

  return (
    <div className="space-y-6 py-4">
      {/* Vehicle Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">車両情報</h3>
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              この車で見積を作成
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="vinNumber">車台番号</Label>
              <Input
                id="vinNumber"
                value={formData.dealInfo.vinNumber}
                onChange={(e) => handleDealInfoChange('vinNumber', e.target.value)}
                placeholder="12345678901234567"
                maxLength={17}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carModel">車種（自動）</Label>
              <Input
                id="carModel"
                value={formData.dealInfo.carModel}
                onChange={(e) => handleDealInfoChange('carModel', e.target.value)}
                placeholder="プリウス"
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maker">メーカー（自動）</Label>
              <Input
                id="maker"
                value={formData.dealInfo.maker}
                onChange={(e) => handleDealInfoChange('maker', e.target.value)}
                placeholder="トヨタ"
                className="bg-muted"
              />
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
    </div>
  )
}
