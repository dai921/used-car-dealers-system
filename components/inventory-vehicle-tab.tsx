'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'
import { InventoryItem } from '@/lib/dummy-data'

interface InventoryVehicleTabProps {
  formData: InventoryItem
  setFormData: (data: InventoryItem) => void
  onSave: () => void
  onDelete?: () => void
}

const CAR_MAKERS = ['トヨタ', 'ホンダ', '日産', 'マツダ', 'スバル', 'スズキ', 'ダイハツ', 'その他']

export function InventoryVehicleTab({
  formData,
  setFormData,
  onSave,
  onDelete,
}: InventoryVehicleTabProps) {
  
  const updateVehicleInfo = (field: string, value: any) => {
    setFormData({
      ...formData,
      vehicleInfo: {
        ...formData.vehicleInfo,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-4 py-4">
      {/* 車輛基本情報 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">車輛基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {/* 車台番号 */}
            <div className="space-y-1 col-span-2">
              <Label className="text-xs">車台番号 *</Label>
              <Input
                value={formData.vehicleInfo.vinNumber}
                onChange={(e) => updateVehicleInfo('vinNumber', e.target.value)}
                placeholder="17桁の車台番号を入力"
                maxLength={17}
                className="h-9 text-sm font-mono"
              />
              <p className="text-[10px] text-muted-foreground">
                ※ 将来的には車台番号入力で他の項目が自動補完される予定です
              </p>
            </div>

            {/* 車種 */}
            <div className="space-y-1">
              <Label className="text-xs">車種 *</Label>
              <Input
                value={formData.vehicleInfo.carModel}
                onChange={(e) => updateVehicleInfo('carModel', e.target.value)}
                placeholder="例：プリウス"
                className="h-9 text-sm"
              />
            </div>

            {/* メーカー */}
            <div className="space-y-1">
              <Label className="text-xs">メーカー *</Label>
              <Input
                value={formData.vehicleInfo.maker}
                onChange={(e) => updateVehicleInfo('maker', e.target.value)}
                placeholder="例：トヨタ"
                list="makers"
                className="h-9 text-sm"
              />
              <datalist id="makers">
                {CAR_MAKERS.map(maker => (
                  <option key={maker} value={maker} />
                ))}
              </datalist>
            </div>

            {/* 色 */}
            <div className="space-y-1">
              <Label className="text-xs">色</Label>
              <Input
                value={formData.vehicleInfo.color}
                onChange={(e) => updateVehicleInfo('color', e.target.value)}
                placeholder="例：白"
                className="h-9 text-sm"
              />
            </div>

            {/* グレード */}
            <div className="space-y-1">
              <Label className="text-xs">グレード</Label>
              <Input
                value={formData.vehicleInfo.grade}
                onChange={(e) => updateVehicleInfo('grade', e.target.value)}
                placeholder="例：S"
                className="h-9 text-sm"
              />
            </div>

            {/* 年式 */}
            <div className="space-y-1">
              <Label className="text-xs">年式</Label>
              <Input
                value={formData.vehicleInfo.year}
                onChange={(e) => updateVehicleInfo('year', e.target.value)}
                placeholder="例：2018"
                maxLength={4}
                className="h-9 text-sm"
              />
            </div>

            {/* 走行距離 */}
            <div className="space-y-1">
              <Label className="text-xs">走行距離（km）</Label>
              <Input
                value={formData.vehicleInfo.mileage}
                onChange={(e) => updateVehicleInfo('mileage', e.target.value)}
                placeholder="例：45000"
                className="h-9 text-sm"
              />
            </div>

            {/* 型式 */}
            <div className="space-y-1">
              <Label className="text-xs">型式</Label>
              <Input
                value={formData.vehicleInfo.modelType}
                onChange={(e) => updateVehicleInfo('modelType', e.target.value)}
                placeholder="例：ZVW30"
                className="h-9 text-sm font-mono"
              />
            </div>

            {/* 参考金額 */}
            <div className="space-y-1">
              <Label className="text-xs">参考金額</Label>
              <Input
                type="number"
                value={formData.vehicleInfo.referencePrice}
                onChange={(e) => updateVehicleInfo('referencePrice', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="h-9 text-sm"
              />
              <p className="text-[10px] text-muted-foreground">
                在庫としての基準金額
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 説明 */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="space-y-2 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">車輛情報タブについて</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>このタブでは、在庫として登録する車両の基本スペック情報を管理します</li>
              <li>車台番号は必須項目です（17桁）</li>
              <li>将来的には、車台番号を入力すると在庫DBから他の項目が自動補完される予定です</li>
              <li>在庫DBに存在しない車台番号の場合は、手動で各項目を入力してください</li>
              <li>この情報は顧客管理側の「商談情報」タブと連携して使用されます</li>
            </ul>
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

