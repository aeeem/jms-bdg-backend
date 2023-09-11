export interface DailyReportResponse {
  yesterdayTransaction: CashFlowResponseItem
  todayTransactions: CashFlowResponseItem[]
}
export interface CashFlowResponseItem {
  id: number
  note: string
  type: string
  sub_total_cash: number
  sub_total_transfer: number
  customerName?: string
  payDebt?: number
}

export interface ReportResponse{
  id: string | number
  date?: string
  no_nota: string
  notes: string | null
  cash_in: number
  cash_out: number
}
