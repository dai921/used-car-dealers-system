'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { InventoryItem, LegalFeeItem, OptionItem } from '@/lib/dummy-data'

interface InventoryPurchaseTabProps {
  formData: InventoryItem
  setFormData: (data: InventoryItem) => void
  onSave: () => void
  onDelete?: () => void
}

const STORES = ['本店', '支店A', '支店B']
const PURCHASE_MANAGERS = ['高橋', '鈴木', '佐藤', '田中']
const PURCHASE_TYPES = ['オークション', '下取', 'その他']
const DEPOSIT_STATUSES = ['預託済', '預託予定', '不要']

export function InventoryPurchaseTab({
  formData,
  setFormData,
  onSave,
  onDelete,
}: InventoryPurchaseTabProps) {
  
  const updatePurchaseInfo = (field: string, value: any) => {
    setFormData({
      ...formData,
      purchaseInfo: {
        ...formData.purchaseInfo,
        [field]: value,
      },
    })
  }

  const handleAddLegalFee = () => {
    const newFee: LegalFeeItem = {
      id: `lf${Date.now()}`,
      category: '',
      amount: 0,
    }
    setFormData({
      ...formData,
      purchaseInfo: {
        ...formData.purchaseInfo,
        legalFees: [...formData.purchaseInfo.legalFees, newFee],
      },
    })
  }

  const handleRemoveLegalFee = (id: string) => {
    setFormData({
      ...formData,
      purchaseInfo: {
        ...formData.purchaseInfo,
        legalFees: formData.purchaseInfo.legalFees.filter(fee => fee.id !== id),
      },
    })
  }

  const handleUpdateLegalFee = (id: string, field: keyof LegalFeeItem, value: any) => {
    setFormData({
      ...formData,
      purchaseInfo: {
        ...formData.purchaseInfo,
        legalFees: formData.purchaseInfo.legalFees.map(fee =>
          fee.id === id ? { ...fee, [field]: value } : fee
        ),
      },
    })
  }

  const handleAddOption = () => {
    const newOption: OptionItem = {
      id: `opt${Date.now()}`,
      category: '',
      optionName: '',
      amount: 0,
    }
    setFormData({
      ...formData,
      purchaseInfo: {
        ...formData.purchaseInfo,
        options: [...formData.purchaseInfo.options, newOption],
      },
    })
  }

  const handleRemoveOption = (id: string) => {
    setFormData({
      ...formData,
      purchaseInfo: {
        ...formData.purchaseInfo,
        options: formData.purchaseInfo.options.filter(opt => opt.id !== id),
      },
    })
  }

  const handleUpdateOption = (id: string, field: keyof OptionItem, value: any) => {
    setFormData({
      ...formData,
      purchaseInfo: {
        ...formData.purchaseInfo,
        options: formData.purchaseInfo.options.map(opt =>
          opt.id === id ? { ...opt, [field]: value } : opt
        ),
      },
    })
  }

  return (
    <div className="space-y-4 py-4">
      {/* 基本情報 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {/* 仕入日 */}
            <div className="space-y-1">
              <Label className="text-xs">仕入日 *</Label>
              <Input
                type="date"
                value={formData.purchaseInfo.purchaseDate}
                onChange={(e) => updatePurchaseInfo('purchaseDate', e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            {/* 仕入区分 */}
            <div className="space-y-1">
              <Label className="text-xs">仕入区分 *</Label>
              <Select
                value={formData.purchaseInfo.purchaseType}
                onValueChange={(value) => updatePurchaseInfo('purchaseType', value)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {PURCHASE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 仕入先 */}
            <div className="space-y-1">
              <Label className="text-xs">仕入先</Label>
              <Input
                value={formData.purchaseInfo.supplier}
                onChange={(e) => updatePurchaseInfo('supplier', e.target.value)}
                placeholder="仕入先を入力"
                className="h-9 text-sm"
              />
            </div>

            {/* 入庫予定日 */}
            <div className="space-y-1">
              <Label className="text-xs">入庫予定日</Label>
              <Input
                type="date"
                value={formData.purchaseInfo.expectedArrivalDate}
                onChange={(e) => updatePurchaseInfo('expectedArrivalDate', e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            {/* 入庫日 */}
            <div className="space-y-1">
              <Label className="text-xs">入庫日</Label>
              <Input
                type="date"
                value={formData.purchaseInfo.arrivalDate}
                onChange={(e) => updatePurchaseInfo('arrivalDate', e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            {/* 仕入担当者 */}
            <div className="space-y-1">
              <Label className="text-xs">仕入担当者</Label>
              <Select
                value={formData.purchaseInfo.purchaseManager}
                onValueChange={(value) => updatePurchaseInfo('purchaseManager', value)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {PURCHASE_MANAGERS.map(manager => (
                    <SelectItem key={manager} value={manager}>{manager}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 店舗 */}
            <div className="space-y-1">
              <Label className="text-xs">店舗</Label>
              <Select
                value={formData.purchaseInfo.store}
                onValueChange={(value) => updatePurchaseInfo('store', value)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {STORES.map(store => (
                    <SelectItem key={store} value={store}>{store}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 入庫遅延通知 */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="notifyOnDelay"
              checked={formData.purchaseInfo.notifyOnDelay}
              onCheckedChange={(checked) => updatePurchaseInfo('notifyOnDelay', checked)}
            />
            <Label
              htmlFor="notifyOnDelay"
              className="text-xs font-normal cursor-pointer"
            >
              入庫予定日に入庫が無かったら担当者に通知
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* 金額・費用 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">金額・費用</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {/* リ預金状況 */}
            <div className="space-y-1">
              <Label className="text-xs">リ預金状況</Label>
              <Select
                value={formData.purchaseInfo.depositStatus}
                onValueChange={(value) => updatePurchaseInfo('depositStatus', value)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {DEPOSIT_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* リ預相当額 */}
            <div className="space-y-1">
              <Label className="text-xs">リ預相当額</Label>
              <Input
                type="number"
                value={formData.purchaseInfo.depositAmount}
                onChange={(e) => updatePurchaseInfo('depositAmount', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="h-9 text-sm"
              />
            </div>

            {/* 仕入価格 */}
            <div className="space-y-1">
              <Label className="text-xs">仕入価格 *</Label>
              <Input
                type="number"
                value={formData.purchaseInfo.purchasePrice}
                onChange={(e) => updatePurchaseInfo('purchasePrice', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="h-9 text-sm"
              />
            </div>
          </div>

          {/* 預り法定費用内訳 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">預り法定費用内訳</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLegalFee}
                className="h-7 text-xs gap-1"
              >
                <Plus className="h-3 w-3" />
                行追加
              </Button>
            </div>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] h-9 text-xs">カテゴリ</TableHead>
                    <TableHead className="w-[150px] h-9 text-xs">金額</TableHead>
                    <TableHead className="w-[60px] h-9"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.purchaseInfo.legalFees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell className="py-2">
                        <Input
                          value={fee.category}
                          onChange={(e) => handleUpdateLegalFee(fee.id, 'category', e.target.value)}
                          placeholder="カテゴリ名"
                          className="h-8 text-xs"
                        />
                      </TableCell>
                      <TableCell className="py-2">
                        <Input
                          type="number"
                          value={fee.amount}
                          onChange={(e) => handleUpdateLegalFee(fee.id, 'amount', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="h-8 text-xs"
                        />
                      </TableCell>
                      <TableCell className="py-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLegalFee(fee.id)}
                          className="h-7 w-7 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {formData.purchaseInfo.legalFees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-xs text-muted-foreground py-4">
                        データがありません
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* オプション内訳（税込） */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">オプション内訳（税込）</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="h-7 text-xs gap-1"
              >
                <Plus className="h-3 w-3" />
                行追加
              </Button>
            </div>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px] h-9 text-xs">カテゴリ</TableHead>
                    <TableHead className="w-[200px] h-9 text-xs">オプション名</TableHead>
                    <TableHead className="w-[150px] h-9 text-xs">金額</TableHead>
                    <TableHead className="w-[60px] h-9"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.purchaseInfo.options.map((option) => (
                    <TableRow key={option.id}>
                      <TableCell className="py-2">
                        <Input
                          value={option.category}
                          onChange={(e) => handleUpdateOption(option.id, 'category', e.target.value)}
                          placeholder="カテゴリ"
                          className="h-8 text-xs"
                        />
                      </TableCell>
                      <TableCell className="py-2">
                        <Input
                          value={option.optionName}
                          onChange={(e) => handleUpdateOption(option.id, 'optionName', e.target.value)}
                          placeholder="オプション名"
                          className="h-8 text-xs"
                        />
                      </TableCell>
                      <TableCell className="py-2">
                        <Input
                          type="number"
                          value={option.amount}
                          onChange={(e) => handleUpdateOption(option.id, 'amount', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="h-8 text-xs"
                        />
                      </TableCell>
                      <TableCell className="py-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveOption(option.id)}
                          className="h-7 w-7 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {formData.purchaseInfo.options.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-4">
                        データがありません
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 税・保険料内訳 */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">税・保険料内訳</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">自動車税（種別割）</Label>
                <Input
                  type="number"
                  value={formData.purchaseInfo.autoTax}
                  onChange={(e) => updatePurchaseInfo('autoTax', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">自動車税（環境性能割）</Label>
                <Input
                  type="number"
                  value={formData.purchaseInfo.autoTaxEnv}
                  onChange={(e) => updatePurchaseInfo('autoTaxEnv', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">自動車重量税</Label>
                <Input
                  type="number"
                  value={formData.purchaseInfo.weightTax}
                  onChange={(e) => updatePurchaseInfo('weightTax', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">自賠責保険料</Label>
                <Input
                  type="number"
                  value={formData.purchaseInfo.compulsoryInsurance}
                  onChange={(e) => updatePurchaseInfo('compulsoryInsurance', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">任意保険料</Label>
                <Input
                  type="number"
                  value={formData.purchaseInfo.voluntaryInsurance}
                  onChange={(e) => updatePurchaseInfo('voluntaryInsurance', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>

          {/* 総額 */}
          <div className="space-y-1 pt-2 border-t">
            <Label className="text-xs font-semibold">総額</Label>
            <Input
              type="number"
              value={formData.purchaseInfo.totalAmount}
              onChange={(e) => updatePurchaseInfo('totalAmount', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="h-10 text-base font-semibold"
            />
          </div>
        </CardContent>
      </Card>

      {/* 保存・削除ボタン */}
      <div className="flex justify-between gap-2 pt-2">
        {onDelete && formData.id && (
          <Button onClick={onDelete} variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            削除
          </Button>
        )}
        <div className="flex-1" />
        <Button onClick={onSave} className="gap-2">
          自動保存
        </Button>
      </div>
    </div>
  )
}

