'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CompanyKPI } from '@/lib/sales-data-utils'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/sales-data-utils'
import {
  TrendingUp,
  Users,
  CheckCircle,
  DollarSign,
  Zap,
  CreditCard,
  RefreshCw,
  Package,
  MessageCircle,
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
      title: '成約率',
      value: formatPercentage(kpi.closeRate),
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      title: '商談数',
      value: formatNumber(kpi.dealCount),
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: '成約数',
      value: formatNumber(kpi.closeCount),
      icon: CheckCircle,
      color: 'text-emerald-600',
    },
    {
      title: 'オプション付帯率',
      value: kpi.optionAttachRate.toFixed(2),
      icon: Package,
      color: 'text-amber-600',
      suffix: '個/成約',
    },
    {
      title: '即決率',
      value: formatPercentage(kpi.instantCloseRate),
      icon: Zap,
      color: 'text-orange-600',
    },
    {
      title: 'ローン率',
      value: formatPercentage(kpi.loanRate),
      icon: CreditCard,
      color: 'text-indigo-600',
    },
    {
      title: '下取率',
      value: formatPercentage(kpi.tradeInRate),
      icon: RefreshCw,
      color: 'text-cyan-600',
    },
    {
      title: 'LINE交換率',
      value: formatPercentage(kpi.lineExchangeRate),
      icon: MessageCircle,
      color: 'text-lime-600',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

