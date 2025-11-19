'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InventoryItem } from '@/lib/dummy-data'

interface InventorySalesTabProps {
  formData: InventoryItem
  setFormData: (data: InventoryItem) => void
  onSave: () => void
}

const DISPLAY_LOCATIONS = [
  '本店1F',
  '本店2F',
  '支店A 1F',
  '支店A 2F',
  '支店B 1F',
  '支店B 2F',
  '入庫待ち',
  'その他',
]

export function InventorySalesTab({
  formData,
  setFormData,
  onSave,
}: InventorySalesTabProps) {
  
  const updateSalesInfo = (field: string, value: any) => {
    setFormData({
      ...formData,
      salesInfo: {
        ...formData.salesInfo,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-4 py-4">
      {/* 販売条件 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">販売条件</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {/* 展示場所 */}
            <div className="space-y-1">
              <Label className="text-xs">展示場所</Label>
              <Input
                value={formData.salesInfo.displayLocation}
                onChange={(e) => updateSalesInfo('displayLocation', e.target.value)}
                placeholder="例：本店1F"
                list="locations"
                className="h-9 text-sm"
              />
              <datalist id="locations">
                {DISPLAY_LOCATIONS.map(location => (
                  <option key={location} value={location} />
                ))}
              </datalist>
            </div>

            {/* 販売価格 */}
            <div className="space-y-1">
              <Label className="text-xs">販売価格 *</Label>
              <Input
                type="number"
                value={formData.salesInfo.salesPrice}
                onChange={(e) => updateSalesInfo('salesPrice', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="h-9 text-sm"
              />
            </div>
          </div>

          {/* ネット掲載有無 */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="onlinePosted"
              checked={formData.salesInfo.onlinePosted}
              onCheckedChange={(checked) => updateSalesInfo('onlinePosted', checked)}
            />
            <Label
              htmlFor="onlinePosted"
              className="text-xs font-normal cursor-pointer"
            >
              ネットに掲載する
            </Label>
          </div>

          {/* 備考 */}
          <div className="space-y-1">
            <Label className="text-xs">備考</Label>
            <Textarea
              value={formData.salesInfo.notes}
              onChange={(e) => updateSalesInfo('notes', e.target.value)}
              placeholder="販売に関するメモや特記事項を入力してください"
              className="text-sm min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* 説明 */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="space-y-2 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">販売情報タブについて</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>このタブでは、展示場所や販売価格、ネット掲載状況など、販売側の条件を管理します</li>
              <li>販売価格は必須項目です</li>
              <li>「ネットに掲載する」をチェックすると、在庫一覧にアイコンが表示されます</li>
              <li>展示場所は在庫一覧テーブルにも反映されます</li>
              <li>備考欄には、キャンペーン情報や車両の特徴など、自由にメモを記入できます</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 保存ボタン */}
      <div className="flex justify-end gap-2 pt-2">
        <Button onClick={onSave} className="gap-2">
          自動保存
        </Button>
      </div>
    </div>
  )
}

