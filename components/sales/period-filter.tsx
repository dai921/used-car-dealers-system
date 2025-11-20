'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PeriodType, DateRange } from '@/lib/sales-data-utils'
import { Calendar } from 'lucide-react'

interface PeriodFilterProps {
  periodType: PeriodType
  customRange?: DateRange
  onPeriodChange: (type: PeriodType, range?: DateRange) => void
}

export function PeriodFilter({
  periodType,
  customRange,
  onPeriodChange,
}: PeriodFilterProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">期間選択</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={periodType === 'thisMonth' ? 'default' : 'outline'}
          onClick={() => onPeriodChange('thisMonth')}
          className="flex-1 min-w-[100px]"
        >
          今月
        </Button>
        <Button
          variant={periodType === 'lastMonth' ? 'default' : 'outline'}
          onClick={() => onPeriodChange('lastMonth')}
          className="flex-1 min-w-[100px]"
        >
          先月
        </Button>
        <Button
          variant={periodType === 'custom' ? 'default' : 'outline'}
          onClick={() => {
            if (periodType !== 'custom') {
              onPeriodChange('custom', {
                start: '2025-01-01',
                end: '2025-02-28',
              })
            }
          }}
          className="flex-1 min-w-[100px]"
        >
          期間指定
        </Button>
      </div>

      {periodType === 'custom' && (
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="start-date">開始日</Label>
            <Input
              id="start-date"
              type="date"
              value={customRange?.start || ''}
              onChange={(e) =>
                onPeriodChange('custom', {
                  start: e.target.value,
                  end: customRange?.end || '',
                })
              }
              className="mt-1"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="end-date">終了日</Label>
            <Input
              id="end-date"
              type="date"
              value={customRange?.end || ''}
              onChange={(e) =>
                onPeriodChange('custom', {
                  start: customRange?.start || '',
                  end: e.target.value,
                })
              }
              className="mt-1"
            />
          </div>
        </div>
      )}
    </div>
  )
}

