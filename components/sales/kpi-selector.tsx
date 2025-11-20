'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface KPISelectorProps {
  selectedKPIs: string[]
  onSelectionChange: (kpis: string[]) => void
}

const KPI_OPTIONS = [
  { id: 'dealCount', label: '商談数' },
  { id: 'closeCount', label: '成約数' },
  { id: 'closeRate', label: '成約率' },
  { id: 'instantCloseRate', label: '即決率' },
  { id: 'loanRate', label: 'ローン率' },
  { id: 'tradeInRate', label: '下取率' },
  { id: 'lineExchangeRate', label: 'LINE交換率' },
]

export function KPISelector({
  selectedKPIs,
  onSelectionChange,
}: KPISelectorProps) {
  const handleToggle = (kpiId: string) => {
    if (selectedKPIs.includes(kpiId)) {
      onSelectionChange(selectedKPIs.filter((id) => id !== kpiId))
    } else {
      onSelectionChange([...selectedKPIs, kpiId])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">表示するKPIを選択</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {KPI_OPTIONS.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={selectedKPIs.includes(option.id)}
                onCheckedChange={() => handleToggle(option.id)}
              />
              <Label
                htmlFor={option.id}
                className="cursor-pointer text-sm font-normal"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

