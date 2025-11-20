'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { KPITrendChart } from '@/components/sales/kpi-trend-chart'
import { KPISelector } from '@/components/sales/kpi-selector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  calculateMonthlyKPIs,
  calculateWeeklyKPIs,
  calculateDailyKPIs,
} from '@/lib/sales-data-utils'
import { SALES_CUSTOMERS, SALES_REPS } from '@/lib/sales-dummy-data'
import { ArrowLeft, TrendingUp } from 'lucide-react'

type PeriodUnit = 'day' | 'week' | 'month'

export default function SalesDashboardDetailPage() {
  const [selectedSalesRep, setSelectedSalesRep] = useState<string>('')
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>([
    'dealCount',
    'closeCount',
    'closeRate',
  ])
  const [periodUnit, setPeriodUnit] = useState<PeriodUnit>('month')

  // 個人別分析用のデータ
  const individualData = useMemo(() => {
    if (!selectedSalesRep) return []
    
    if (periodUnit === 'month') {
      return calculateMonthlyKPIs(SALES_CUSTOMERS, selectedSalesRep)
    } else if (periodUnit === 'week') {
      return calculateWeeklyKPIs(SALES_CUSTOMERS, selectedSalesRep)
    } else {
      return calculateDailyKPIs(SALES_CUSTOMERS, selectedSalesRep)
    }
  }, [selectedSalesRep, periodUnit])

  // 期間別分析用のデータ（全社）
  const periodData = useMemo(() => {
    if (periodUnit === 'month') {
      return calculateMonthlyKPIs(SALES_CUSTOMERS)
    } else if (periodUnit === 'week') {
      return calculateWeeklyKPIs(SALES_CUSTOMERS)
    } else {
      return calculateDailyKPIs(SALES_CUSTOMERS)
    }
  }, [periodUnit])

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2">
            <Link href="/dashboard/sales-dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                戻る
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">詳細分析ページ</h1>
          <p className="text-muted-foreground">
            営業個人別・期間別のKPI推移を分析できます
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* メインコンテンツ */}
      <Tabs defaultValue="individual" className="space-y-6">
        <TabsList className="grid w-full max-w-[600px] grid-cols-3">
          <TabsTrigger value="individual">個人別分析</TabsTrigger>
          <TabsTrigger value="period">期間別分析</TabsTrigger>
          <TabsTrigger value="analysis-cut">分析カット</TabsTrigger>
        </TabsList>

        {/* 個人別分析 */}
        <TabsContent value="individual" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>担当者を選択</Label>
              <Select
                value={selectedSalesRep}
                onValueChange={setSelectedSalesRep}
              >
                <SelectTrigger>
                  <SelectValue placeholder="担当者を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {SALES_REPS.map((rep) => (
                    <SelectItem key={rep} value={rep}>
                      {rep}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>期間区切り</Label>
              <Select
                value={periodUnit}
                onValueChange={(value) => setPeriodUnit(value as PeriodUnit)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">日</SelectItem>
                  <SelectItem value="week">週</SelectItem>
                  <SelectItem value="month">月</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <KPISelector
            selectedKPIs={selectedKPIs}
            onSelectionChange={setSelectedKPIs}
          />

          {selectedSalesRep ? (
            <KPITrendChart
              data={individualData}
              selectedKPIs={selectedKPIs}
              title={`${selectedSalesRep} のKPI推移`}
            />
          ) : (
            <Card>
              <CardContent className="flex h-[400px] items-center justify-center">
                <p className="text-muted-foreground">
                  担当者を選択してください
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 期間別分析 */}
        <TabsContent value="period" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>期間区切り</Label>
              <Select
                value={periodUnit}
                onValueChange={(value) => setPeriodUnit(value as PeriodUnit)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">日</SelectItem>
                  <SelectItem value="week">週</SelectItem>
                  <SelectItem value="month">月</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <KPISelector
            selectedKPIs={selectedKPIs}
            onSelectionChange={setSelectedKPIs}
          />

          <KPITrendChart
            data={periodData}
            selectedKPIs={selectedKPIs}
            title="全社KPI推移"
          />
        </TabsContent>

        {/* 分析カット選択 */}
        <TabsContent value="analysis-cut" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>分析カット選択</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                分析カットを選択してください
              </p>

              <div className="space-y-2">
                <Label>分析軸</Label>
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="分析軸を選択（準備中）" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salesrep">営業個人別</SelectItem>
                    <SelectItem value="store">店舗別</SelectItem>
                    <SelectItem value="channel">チャネル別</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  この機能は将来の拡張用に予約されています。
                  <br />
                  営業個人別、店舗別、チャネル別などの多角的な分析が可能になります。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

