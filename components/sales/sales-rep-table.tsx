'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SalesKPI } from '@/lib/sales-data-utils'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/sales-data-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SalesRepTableProps {
  kpis: SalesKPI[]
}

export function SalesRepTable({ kpis }: SalesRepTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>営業個人別実績</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">名前</TableHead>
                <TableHead className="text-right">売上</TableHead>
                <TableHead className="text-right">成約率</TableHead>
                <TableHead className="text-right">接客数</TableHead>
                <TableHead className="text-right">成約数</TableHead>
                <TableHead className="text-right">即決率</TableHead>
                <TableHead className="text-right">ローン率</TableHead>
                <TableHead className="text-right">下取率</TableHead>
                <TableHead className="text-right">オプション付帯率</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpis.map((kpi) => (
                <TableRow
                  key={kpi.salesRep}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <TableCell className="font-medium">{kpi.salesRep}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(kpi.sales)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercentage(kpi.closeRate)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(kpi.dealCount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(kpi.closeCount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercentage(kpi.instantCloseRate)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercentage(kpi.loanRate)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercentage(kpi.tradeInRate)}
                  </TableCell>
                  <TableCell className="text-right">
                    {kpi.optionAttachRate.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

