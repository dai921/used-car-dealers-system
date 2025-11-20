'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Customer } from '@/lib/dummy-data'
import { useToast } from '@/hooks/use-toast'

const SALES_REPS = ['高橋', '鈴木', '佐藤', '田中']
const STORES = ['本店', '支店A', '支店B']  

interface CustomerBasicTabProps {
  formData: Customer
  setFormData: (data: Customer) => void
  onSave: () => void
  onDelete?: () => void
}

export function CustomerBasicTab({
  formData,
  setFormData,
  onSave,
  onDelete,
}: CustomerBasicTabProps) {
  const { toast } = useToast()

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSave = () => {
    // Validate required fields
    if (!formData.name || !formData.furigana) {
      toast({
        title: 'エラー',
        description: '顧客名とフリガナは必須項目です',
        variant: 'destructive',
      })
      return
    }

    const fullAddress = `${formData.address1} ${formData.address2}`.trim()
    const updatedFormData = { ...formData, address: fullAddress }
    setFormData(updatedFormData)

    toast({
      title: '保存完了',
      description: '顧客情報を保存しました',
    })

    setTimeout(() => {
      onSave()
    }, 10)
  }

  return (
    <div className="space-y-6 py-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            顧客名 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="山田 太郎"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="furigana">
            フリガナ <span className="text-destructive">*</span>
          </Label>
          <Input
            id="furigana"
            value={formData.furigana}
            onChange={(e) => handleChange('furigana', e.target.value)}
            placeholder="ヤマダ タロウ"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">電話番号</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="090-1234-5678"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone2">電話番号2</Label>
          <Input
            id="phone2"
            type="tel"
            value={formData.phone2}
            onChange={(e) => handleChange('phone2', e.target.value)}
            placeholder="090-8765-4321"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="example@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email2">Email2</Label>
          <Input
            id="email2"
            type="email"
            value={formData.email2}
            onChange={(e) => handleChange('email2', e.target.value)}
            placeholder="example2@email.com"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="mb-4 text-sm font-semibold">住所情報</h3>
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="postalCode">郵便番号</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                placeholder="123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address1">住所1（自動入力）</Label>
            <Input
              id="address1"
              value={formData.address1}
              onChange={(e) => handleChange('address1', e.target.value)}
              placeholder="愛知県名古屋市中区"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address2">住所2（詳細情報）</Label>
            <Input
              id="address2"
              value={formData.address2}
              onChange={(e) => handleChange('address2', e.target.value)}
              placeholder="栄1-2-3 サンプルビル4F"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="mb-4 text-sm font-semibold">担当情報</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="salesRep">担当者</Label>
            <Select
              value={formData.salesRep}
              onValueChange={(value) => handleChange('salesRep', value)}
            >
              <SelectTrigger id="salesRep">
                <SelectValue placeholder="担当者を選択" />
              </SelectTrigger>
              <SelectContent>
                {SALES_REPS.map((rep) => (
                  <SelectItem key={rep} value={rep}>
                    {rep}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="addedDate">追加日</Label>
            <Input
              id="addedDate"
              type="date"
              value={formData.addedDate}
              onChange={(e) => handleChange('addedDate', e.target.value)}
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store">店舗</Label>
            <Select
              value={formData.store}
              onValueChange={(value) => handleChange('store', value)}
            >
              <SelectTrigger id="store">
                <SelectValue placeholder="店舗を選択" />
              </SelectTrigger>
              <SelectContent>
                {STORES.map((store) => (
                  <SelectItem key={store} value={store}>
                    {store}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <div className="space-y-2">
            <Label htmlFor="contractDate">契約日</Label>
            <Input
              id="contractDate"
              type="date"
              value={formData.contractDate}
              onChange={(e) => handleChange('contractDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between border-t pt-4">
        {onDelete && (
          <Button variant="destructive" onClick={onDelete}>
            削除
          </Button>
        )}
        <div className={`flex gap-2 ${!onDelete ? 'w-full justify-end' : 'ml-auto'}`}>
          <Button variant="outline" onClick={() => window.history.back()}>
            閉じる
          </Button>
          <Button onClick={handleSave}>自動保存</Button>
        </div>
      </div>
    </div>
  )
}
