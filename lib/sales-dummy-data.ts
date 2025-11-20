// 営業ダッシュボード用の設定ファイル
// 顧客データは lib/dummy-data.ts の DUMMY_CUSTOMERS を直接使用

import { DUMMY_CUSTOMERS } from './dummy-data'

// 営業ダッシュボードでは DUMMY_CUSTOMERS をそのまま使用
// 顧客管理で追加・編集されたデータが自動的に営業ダッシュボードに反映されます
export const SALES_CUSTOMERS = DUMMY_CUSTOMERS

// 営業個人名のリスト
export const SALES_REPS = ['高橋', '鈴木', '佐藤', '田中', '山本']

// 営業個人ごとの目標売上（月間）
export const SALES_TARGETS = {
  '高橋': 8000000,
  '鈴木': 7500000,
  '佐藤': 8500000,
  '田中': 7000000,
  '山本': 6500000,
}

// 全社目標売上（月間）
export const COMPANY_TARGET = 37500000

