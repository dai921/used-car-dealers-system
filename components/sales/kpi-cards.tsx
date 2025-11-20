'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CompanyKPI } from '@/lib/sales-data-utils'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/sales-data-utils'
import {
  TrendingUp,
  CheckCircle,
  DollarSign,
  Package,
} from 'lucide-react'

interface KPICardsProps {
  kpi: CompanyKPI
}

export function KPICards({ kpi }: KPICardsProps) {
  const cards = [
    {
      title: '売上',
      value: formatCurrency(kpi.sales),
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: '成約数',
      value: formatNumber(kpi.closeCount),
      icon: CheckCircle,
      color: 'text-emerald-600',
    },
    {
      title: '成約率',
      value: formatPercentage(kpi.closeRate),
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      title: 'オプション付帯率',
      value: kpi.optionAttachRate.toFixed(2),
      icon: Package,
      color: 'text-amber-600',
      suffix: '個/成約',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.value}
                {card.suffix && (
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    {card.suffix}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

