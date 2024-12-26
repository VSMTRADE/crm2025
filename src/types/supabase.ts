export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      negotiations: {
        Row: {
          id: string
          user_id: string
          contact_id: string
          title: string
          description: string | null
          total_amount: number
          number_of_installments: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          contact_id: string
          title: string
          description?: string | null
          total_amount: number
          number_of_installments: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          contact_id?: string
          title?: string
          description?: string | null
          total_amount?: number
          number_of_installments?: number
          created_at?: string
          updated_at?: string
        }
      }
      installments: {
        Row: {
          id: string
          negotiation_id: string
          installment_number: number
          amount: number
          due_date: string
          status: string
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          negotiation_id: string
          installment_number: number
          amount: number
          due_date: string
          status?: string
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          negotiation_id?: string
          installment_number?: number
          amount?: number
          due_date?: string
          status?: string
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
