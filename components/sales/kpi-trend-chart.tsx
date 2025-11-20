'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PeriodKPI } from '@/lib/sales-data-utils'

interface KPITrendChartProps {
  data: PeriodKPI[]
  selectedKPIs: string[]
  title?: string
}

const KPI_CONFIG = {
  dealCount: { label: '商談数', color: '#8884d8' },
  closeCount: { label: '成約数', color: '#82ca9d' },
  closeRate: { label: '成約率(%)', color: '#ffc658' },
  instantCloseRate: { label: '即決率(%)', color: '#ff7c7c' },
  loanRate: { label: 'ローン率(%)', color: '#8dd1e1' },
  tradeInRate: { label: '下取率(%)', color: '#a4de6c' },
  lineExchangeRate: { label: 'LINE交換率(%)', color: '#d0ed57' },
}

export function KPITrendChart({
  data,
  selectedKPIs,
  title = 'KPI推移',
}: KPITrendChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            データがありません
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {selectedKPIs.map((kpi) => {
              const config = KPI_CONFIG[kpi as keyof typeof KPI_CONFIG]
              if (!config) return null
              return (
                <Line
                  key={kpi}
                  type="monotone"
                  dataKey={kpi}
                  stroke={config.color}
                  name={config.label}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

