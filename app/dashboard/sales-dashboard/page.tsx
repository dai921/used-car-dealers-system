'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PeriodFilter } from '@/components/sales/period-filter'
import { KPICards } from '@/components/sales/kpi-cards'
import { SalesRepTable } from '@/components/sales/sales-rep-table'
import { TargetAchievement } from '@/components/sales/target-achievement'
import {
  PeriodType,
  DateRange,
  filterByPeriod,
  calculateCompanyKPIs,
  calculateAllSalesRepsKPIs,
} from '@/lib/sales-data-utils'
import { DUMMY_CUSTOMERS, Customer } from '@/lib/dummy-data'
import { COMPANY_TARGET } from '@/lib/sales-dummy-data'
import { ArrowRight, BarChart3 } from 'lucide-react'

export default function SalesDashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [periodType, setPeriodType] = useState<PeriodType>('thisMonth')
  const [customRange, setCustomRange] = useState<DateRange>({
    start: '2025-01-01',
    end: '2025-02-28',
  })

  // localStorageから顧客データを読み込み（顧客管理と連携）
  useEffect(() => {
    const stored = localStorage.getItem('customers')
    if (stored) {
      try {
        setCustomers(JSON.parse(stored))
      } catch (e) {
        setCustomers(DUMMY_CUSTOMERS)
      }
    } else {
      setCustomers(DUMMY_CUSTOMERS)
    }
  }, [])

  const handlePeriodChange = (type: PeriodType, range?: DateRange) => {
    setPeriodType(type)
    if (range) {
      setCustomRange(range)
    }
  }

  // 期間でフィルタリング
  const filteredCustomers = useMemo(() => {
    return filterByPeriod(customers, periodType, customRange)
  }, [customers, periodType, customRange])

  // 全社KPIを計算
  const companyKPI = useMemo(() => {
    return calculateCompanyKPIs(filteredCustomers)
  }, [filteredCustomers])

  // 営業個人別KPIを計算
  const salesRepsKPIs = useMemo(() => {
    return calculateAllSalesRepsKPIs(filteredCustomers)
  }, [filteredCustomers])

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">営業ダッシュボード</h1>
          <p className="text-muted-foreground">
            売上・成約率など主要KPIを確認できます
          </p>
        </div>
        <Link href="/dashboard/sales-dashboard/detail">
          <Button className="gap-2">
            <BarChart3 className="h-4 w-4" />
            詳細分析ページへ
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* 期間フィルタ */}
      <PeriodFilter
        periodType={periodType}
        customRange={customRange}
        onPeriodChange={handlePeriodChange}
      />

      {/* 全社KPIカード */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">全社実績</h2>
        <KPICards kpi={companyKPI} />
      </div>

      {/* 目標達成率 */}
      <TargetAchievement
        target={COMPANY_TARGET}
        actual={companyKPI.sales}
        title="全社目標達成状況"
      />

      {/* 営業個人別実績テーブル */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">営業個人別実績</h2>
        <SalesRepTable kpis={salesRepsKPIs} />
      </div>

      {/* 注釈 */}
      <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
        <p>
          ※ このダッシュボードはプロトタイプです。実際の運用では、リアルタイムでデータが更新されます。
        </p>
        <p className="mt-1">
          ※ 各営業個人の行をクリックすると、詳細分析ページへ遷移できます（実装予定）。
        </p>
      </div>
    </div>
  )
}

