import { Customer } from './dummy-data'

// 営業KPIデータの型定義
export interface SalesKPI {
  salesRep: string
  dealCount: number // 商談数
  closeCount: number // 成約数
  closeRate: number // 成約率
  sales: number // 売上
  instantCloseRate: number // 即決率
  loanRate: number // ローン率
  tradeInRate: number // 下取率
  optionAttachRate: number // オプション付帯率
  lineExchangeRate: number // LINE交換率
}

// 全社KPIデータの型定義
export interface CompanyKPI extends SalesKPI {
  salesRep: '全社'
}

// 期間フィルタの型定義
export type PeriodType = 'thisMonth' | 'lastMonth' | 'custom'

export interface DateRange {
  start: string
  end: string
}

// 営業個人一覧を取得
export function getSalesReps(customers: Customer[]): string[] {
  const reps = new Set(customers.map((c) => c.salesRep))
  return Array.from(reps).filter((rep) => rep).sort()
}

// 期間の日数を取得
function getPeriodDates(
  periodType: PeriodType,
  customRange?: DateRange
): { startDate: Date; endDate: Date } {
  const now = new Date('2025-02-15') // プロトタイプ用の基準日
  let startDate: Date
  let endDate: Date

  if (periodType === 'custom' && customRange) {
    startDate = new Date(customRange.start)
    endDate = new Date(customRange.end)
  } else if (periodType === 'thisMonth') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  } else if (periodType === 'lastMonth') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    endDate = new Date(now.getFullYear(), now.getMonth(), 0)
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  }

  return { startDate, endDate }
}

// 期間に応じた目標台数を計算（月間目標を基準に日割り計算）
export function calculateTargetUnits(
  monthlyTarget: number,
  periodType: PeriodType,
  customRange?: DateRange
): number {
  const { startDate, endDate } = getPeriodDates(periodType, customRange)
  
  // 期間の日数を計算
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  
  // 月の平均日数（30.44日）で日割り計算
  const averageDaysPerMonth = 30.44
  const targetUnits = Math.round((monthlyTarget / averageDaysPerMonth) * daysDiff)
  
  return targetUnits
}

// 期間でフィルタリング
export function filterByPeriod(
  customers: Customer[],
  periodType: PeriodType,
  customRange?: DateRange
): Customer[] {
  const { startDate, endDate } = getPeriodDates(periodType, customRange)

  return customers.filter((customer) => {
    const addedDate = new Date(customer.addedDate)
    return addedDate >= startDate && addedDate <= endDate
  })
}

// 営業個人別のKPIを計算
export function calculateKPIsBySalesRep(
  customers: Customer[],
  salesRep: string
): SalesKPI {
  const repCustomers = customers.filter((c) => c.salesRep === salesRep)
  return calculateKPIs(repCustomers, salesRep)
}

// 全社KPIを計算
export function calculateCompanyKPIs(customers: Customer[]): CompanyKPI {
  const kpi = calculateKPIs(customers, '全社')
  return kpi as CompanyKPI
}

// KPIを計算（内部関数）
function calculateKPIs(customers: Customer[], salesRep: string): SalesKPI {
  const dealCount = customers.length
  
  // 成約した顧客のみ
  const closedCustomers = customers.filter(
    (c) => c.dealInfo.statuses.contract.checked
  )
  const closeCount = closedCustomers.length

  // 成約率
  const closeRate = dealCount > 0 ? (closeCount / dealCount) * 100 : 0

  // 売上（成約顧客の販売価格合計）
  const sales = closedCustomers.reduce(
    (sum, c) => sum + (c.dealInfo.salesPrice || 0),
    0
  )

  // 即決率（成約のうち即決）
  const instantCloseCount = closedCustomers.filter(
    (c) => c.dealInfo.isInstantClose
  ).length
  const instantCloseRate =
    closeCount > 0 ? (instantCloseCount / closeCount) * 100 : 0

  // ローン率（成約のうちローン）
  const loanCount = closedCustomers.filter(
    (c) => c.dealInfo.paymentMethod === 'loan'
  ).length
  const loanRate = closeCount > 0 ? (loanCount / closeCount) * 100 : 0

  // 下取率（成約のうち下取あり）
  const tradeInCount = closedCustomers.filter(
    (c) => c.dealInfo.hasTradeIn
  ).length
  const tradeInRate = closeCount > 0 ? (tradeInCount / closeCount) * 100 : 0

  // オプション付帯率（オプション総数 / 成約数）
  const totalOptions = closedCustomers.reduce(
    (sum, c) => sum + (c.dealInfo.options?.length || 0),
    0
  )
  const optionAttachRate = closeCount > 0 ? totalOptions / closeCount : 0

  // LINE交換率（LINE連絡済み / 商談数）
  const lineExchangeCount = customers.filter(
    (c) => c.dealInfo.statuses.lineContact.checked
  ).length
  const lineExchangeRate =
    dealCount > 0 ? (lineExchangeCount / dealCount) * 100 : 0

  return {
    salesRep,
    dealCount,
    closeCount,
    closeRate,
    sales,
    instantCloseRate,
    loanRate,
    tradeInRate,
    optionAttachRate,
    lineExchangeRate,
  }
}

// 全営業個人のKPIを計算
export function calculateAllSalesRepsKPIs(
  customers: Customer[]
): SalesKPI[] {
  const reps = getSalesReps(customers)
  return reps.map((rep) => calculateKPIsBySalesRep(customers, rep))
}

// 期間別の集計データを取得（グラフ用）
export interface PeriodKPI {
  period: string // '2025-01', '2025-02', etc.
  dealCount: number
  closeCount: number
  closeRate: number
  sales: number
  instantCloseRate: number
  loanRate: number
  tradeInRate: number
  optionAttachRate: number
  lineExchangeRate: number
}

// 月別に集計
export function calculateMonthlyKPIs(
  customers: Customer[],
  salesRep?: string
): PeriodKPI[] {
  let targetCustomers = customers
  if (salesRep) {
    targetCustomers = customers.filter((c) => c.salesRep === salesRep)
  }

  // 月ごとにグループ化
  const monthlyGroups = new Map<string, Customer[]>()
  targetCustomers.forEach((customer) => {
    const date = new Date(customer.addedDate)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!monthlyGroups.has(monthKey)) {
      monthlyGroups.set(monthKey, [])
    }
    monthlyGroups.get(monthKey)!.push(customer)
  })

  // 各月のKPIを計算
  const result: PeriodKPI[] = []
  monthlyGroups.forEach((customers, period) => {
    const kpi = calculateKPIs(customers, '')
    result.push({
      period,
      ...kpi,
    })
  })

  return result.sort((a, b) => a.period.localeCompare(b.period))
}

// 週別に集計
export function calculateWeeklyKPIs(
  customers: Customer[],
  salesRep?: string
): PeriodKPI[] {
  let targetCustomers = customers
  if (salesRep) {
    targetCustomers = customers.filter((c) => c.salesRep === salesRep)
  }

  // 週ごとにグループ化（ISO週番号を使用）
  const weeklyGroups = new Map<string, Customer[]>()
  targetCustomers.forEach((customer) => {
    const date = new Date(customer.addedDate)
    const weekKey = getISOWeek(date)
    
    if (!weeklyGroups.has(weekKey)) {
      weeklyGroups.set(weekKey, [])
    }
    weeklyGroups.get(weekKey)!.push(customer)
  })

  // 各週のKPIを計算
  const result: PeriodKPI[] = []
  weeklyGroups.forEach((customers, period) => {
    const kpi = calculateKPIs(customers, '')
    result.push({
      period,
      ...kpi,
    })
  })

  return result.sort((a, b) => a.period.localeCompare(b.period))
}

// 日別に集計
export function calculateDailyKPIs(
  customers: Customer[],
  salesRep?: string
): PeriodKPI[] {
  let targetCustomers = customers
  if (salesRep) {
    targetCustomers = customers.filter((c) => c.salesRep === salesRep)
  }

  // 日ごとにグループ化
  const dailyGroups = new Map<string, Customer[]>()
  targetCustomers.forEach((customer) => {
    const dayKey = customer.addedDate // YYYY-MM-DD形式
    
    if (!dailyGroups.has(dayKey)) {
      dailyGroups.set(dayKey, [])
    }
    dailyGroups.get(dayKey)!.push(customer)
  })

  // 各日のKPIを計算
  const result: PeriodKPI[] = []
  dailyGroups.forEach((customers, period) => {
    const kpi = calculateKPIs(customers, '')
    result.push({
      period,
      ...kpi,
    })
  })

  return result.sort((a, b) => a.period.localeCompare(b.period))
}

// ISO週番号を取得するヘルパー関数
function getISOWeek(date: Date): string {
  const target = new Date(date.valueOf())
  const dayNr = (date.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNr + 3)
  const firstThursday = target.valueOf()
  target.setMonth(0, 1)
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7))
  }
  const weekNumber = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)
  return `${target.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`
}

// 数値フォーマット用のヘルパー関数
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ja-JP').format(value)
}

