// src/types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      user_section_completion: {
        Row: {
          user_id: string
          module_id: number
          section_number: number
          created_at: string | null
        }
        Insert: {
          user_id: string
          module_id: number
          section_number: number
          created_at?: string | null
        }
        Update: {
          user_id?: string
          module_id?: number
          section_number?: number
          created_at?: string | null
        }
        Relationships: []
      }
      user_module_progress: {
        Row: {
          user_id: string
          module_id: number
          unlocked_section: number
          completed: boolean
          updated_at: string
        }
        Insert: {
          user_id: string
          module_id: number
          unlocked_section?: number
          completed?: boolean
          updated_at?: string
        }
        Update: {
          user_id?: string
          module_id?: number
          unlocked_section?: number
          completed?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          created_at?: string
        }
        Relationships: []
      }
      sim_runs: {
        Row: {
          id: string
          user_id: string
          simulator_slug: string
          run_name: string
          inputs: Json
          outputs: Json
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          simulator_slug: string
          run_name?: string
          inputs: Json
          outputs: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          simulator_slug?: string
          run_name?: string
          inputs?: Json
          outputs?: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
