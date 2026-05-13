export type Role = "user" | "assistant"

export interface Message {
  role: Role
  content: string
}

export interface Source {
  id: string
  document_id: string
  content: string
  page: number
  similarity: number
}

export interface CostInfo {
  tokens: number
  cost_usd: number
}

