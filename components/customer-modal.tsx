'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // DialogDescriptionをインポート
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Customer } from '@/lib/dummy-data'
import { CustomerBasicTab } from './customer-basic-tab'
import { CustomerDealTab } from './customer-deal-tab'

interface CustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
  onSave: (customer: Customer) => void
  onDelete?: (customer: Customer) => void
}

export function CustomerModal({
  open,
  onOpenChange,
  customer,
  onSave,
  onDelete,
}: CustomerModalProps) {
  const [formData, setFormData] = useState<Customer>(
    customer || {
      id: '',
      name: '',
      furigana: '',
      phone: '',
      phone2: '',
      email: '',
      email2: '',
      postalCode: '',
      address1: '',
      address2: '',
      salesRep: '',
      addedDate: new Date().toISOString().split('T')[0],
      store: '',
      contractDate: '',
      deliveryStatus: '納車待ち',
      carType: '中古車',
      address: '',
      memo: '',
      carModel: '',
      vinNumber: '',
      dealInfo: {
        vinNumber: '',
        carModel: '',
        maker: '',
        color: '',
        grade: '',
        year: '',
        mileage: '',
        modelType: '',
        salesPrice: 0,
        auctionHouse: '',
        shippingFee: '',
        dealMemos: [],
        statuses: {
          lineContact: { checked: false, date: '' },
          contract: { checked: false, date: '' },
          followUp1: { checked: false, date: '' },
          followUp2: { checked: false, date: '' },
          documents: { checked: false, date: '' },
          payment: { checked: false, date: '' },
          delivered: { checked: false, date: '' },
        },
        noFollowUp: false,
      },
    }
  )

  useEffect(() => {
    if (customer) {
      setFormData(customer)
    }
  }, [customer])

  const handleSave = () => {
    onSave(formData)
  }

  const handleDelete = () => {
    if (customer && onDelete) {
      if (window.confirm(`${customer.name} さんの情報を削除してもよろしいですか？\n\nこの操作は取り消せません。`)) {
        onDelete(customer)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {customer ? '顧客情報編集' : '顧客新規追加'}
          </DialogTitle>
          <DialogDescription>
            {customer ? '顧客の基本情報や商談情報を編集できます' : '新しい顧客の情報を入力してください'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">基本情報</TabsTrigger>
            <TabsTrigger value="deal">商談情報</TabsTrigger>
            <TabsTrigger value="purchase" disabled>
              買取情報
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <CustomerBasicTab
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              onDelete={customer && onDelete ? handleDelete : undefined}
            />
          </TabsContent>

          <TabsContent value="deal" className="space-y-4">
            <CustomerDealTab
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
            />
          </TabsContent>

          <TabsContent value="purchase">
            <div className="py-12 text-center text-muted-foreground">
              この機能は今後実装予定です
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
