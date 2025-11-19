'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InventoryItem } from '@/lib/dummy-data'
import { InventoryPurchaseTab } from './inventory-purchase-tab'
import { InventoryVehicleTab } from './inventory-vehicle-tab'
import { InventorySalesTab } from './inventory-sales-tab'
import { useToast } from '@/hooks/use-toast'

interface InventoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryItem | null
  onSave: (item: InventoryItem) => void
}

export function InventoryModal({
  open,
  onOpenChange,
  item,
  onSave,
}: InventoryModalProps) {
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<InventoryItem>(
    item || {
      id: '',
      purchaseInfo: {
        purchaseDate: '',
        purchaseType: 'オークション',
        supplier: '',
        expectedArrivalDate: '',
        arrivalDate: '',
        notifyOnDelay: false,
        purchaseManager: '',
        store: '',
        depositStatus: '不要',
        depositAmount: 0,
        purchasePrice: 0,
        legalFees: [],
        options: [],
        autoTax: 0,
        autoTaxEnv: 0,
        weightTax: 0,
        compulsoryInsurance: 0,
        voluntaryInsurance: 0,
        totalAmount: 0,
      },
      vehicleInfo: {
        vinNumber: '',
        carModel: '',
        maker: '',
        color: '',
        grade: '',
        year: '',
        mileage: '',
        modelType: '',
        referencePrice: 0,
      },
      salesInfo: {
        displayLocation: '',
        salesPrice: 0,
        onlinePosted: false,
        notes: '',
      },
      status: 'available',
      customerId: null,
      reservedDate: '',
      soldDate: '',
    }
  )

  useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      // 新規作成時は空のフォーム
      setFormData({
        id: '',
        purchaseInfo: {
          purchaseDate: new Date().toISOString().split('T')[0],
          purchaseType: 'オークション',
          supplier: '',
          expectedArrivalDate: '',
          arrivalDate: '',
          notifyOnDelay: false,
          purchaseManager: '',
          store: '本店',
          depositStatus: '不要',
          depositAmount: 0,
          purchasePrice: 0,
          legalFees: [],
          options: [],
          autoTax: 0,
          autoTaxEnv: 0,
          weightTax: 0,
          compulsoryInsurance: 0,
          voluntaryInsurance: 0,
          totalAmount: 0,
        },
        vehicleInfo: {
          vinNumber: '',
          carModel: '',
          maker: '',
          color: '',
          grade: '',
          year: '',
          mileage: '',
          modelType: '',
          referencePrice: 0,
        },
        salesInfo: {
          displayLocation: '',
          salesPrice: 0,
          onlinePosted: false,
          notes: '',
        },
        status: 'available',
        customerId: null,
        reservedDate: '',
        soldDate: '',
      })
    }
  }, [item, open])

  const handleSave = () => {
    // バリデーション
    if (!formData.purchaseInfo.purchaseDate) {
      toast({
        title: '入力エラー',
        description: '仕入日を入力してください',
        variant: 'destructive',
      })
      return
    }

    if (!formData.vehicleInfo.vinNumber) {
      toast({
        title: '入力エラー',
        description: '車台番号を入力してください',
        variant: 'destructive',
      })
      return
    }

    if (!formData.salesInfo.salesPrice) {
      toast({
        title: '入力エラー',
        description: '販売価格を入力してください',
        variant: 'destructive',
      })
      return
    }

    onSave(formData)
    
    toast({
      title: '保存しました',
      description: item ? '在庫情報を更新しました' : '新規在庫を登録しました',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? '在庫情報編集' : '新規入庫'}
          </DialogTitle>
          <DialogDescription>
            {item ? '在庫の仕入情報、車輛情報、販売情報を編集できます' : '新しい在庫の情報を入力してください'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="purchase" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="purchase">仕入情報</TabsTrigger>
            <TabsTrigger value="vehicle">車輛情報</TabsTrigger>
            <TabsTrigger value="sales">販売情報</TabsTrigger>
          </TabsList>

          <TabsContent value="purchase" className="space-y-4">
            <InventoryPurchaseTab
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
            />
          </TabsContent>

          <TabsContent value="vehicle" className="space-y-4">
            <InventoryVehicleTab
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
            />
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <InventorySalesTab
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

