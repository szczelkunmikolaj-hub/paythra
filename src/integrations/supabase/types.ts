export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      gmail_connections: {
        Row: {
          access_token: string
          connected_at: string
          email: string | null
          id: string
          last_scan_at: string | null
          refresh_token: string
          token_expires_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          connected_at?: string
          email?: string | null
          id?: string
          last_scan_at?: string | null
          refresh_token: string
          token_expires_at: string
          user_id: string
        }
        Update: {
          access_token?: string
          connected_at?: string
          email?: string | null
          id?: string
          last_scan_at?: string | null
          refresh_token?: string
          token_expires_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          subscription_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          subscription_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          subscription_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          is_student: boolean
          monthly_income: number | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_student?: boolean
          monthly_income?: number | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_student?: boolean
          monthly_income?: number | null
          user_id?: string
        }
        Relationships: []
      }
      service_pricing: {
        Row: {
          category: string
          cheapest_plan_name: string | null
          cheapest_plan_price: number | null
          country: string
          family_price: number | null
          id: string
          last_updated: string
          service_domain: string
          service_name: string
          standard_price: number
          student_price: number | null
        }
        Insert: {
          category?: string
          cheapest_plan_name?: string | null
          cheapest_plan_price?: number | null
          country?: string
          family_price?: number | null
          id?: string
          last_updated?: string
          service_domain: string
          service_name: string
          standard_price?: number
          student_price?: number | null
        }
        Update: {
          category?: string
          cheapest_plan_name?: string | null
          cheapest_plan_price?: number | null
          country?: string
          family_price?: number | null
          id?: string
          last_updated?: string
          service_domain?: string
          service_name?: string
          standard_price?: number
          student_price?: number | null
        }
        Relationships: []
      }
      subscription_history: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          monthly_price: number
          service_color: string | null
          service_domain: string | null
          service_name: string
          started_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          monthly_price?: number
          service_color?: string | null
          service_domain?: string | null
          service_name: string
          started_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          monthly_price?: number
          service_color?: string | null
          service_domain?: string | null
          service_name?: string
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_price_history: {
        Row: {
          date_changed: string
          id: string
          new_price: number
          old_price: number
          subscription_id: string
          user_id: string
        }
        Insert: {
          date_changed?: string
          id?: string
          new_price: number
          old_price: number
          subscription_id: string
          user_id: string
        }
        Update: {
          date_changed?: string
          id?: string
          new_price?: number
          old_price?: number
          subscription_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_price_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_cycle: string
          category: string
          created_at: string
          id: string
          is_trial: boolean
          is_unused: boolean
          logo_url: string | null
          name: string
          next_billing_date: string
          price: number
          start_date: string
          status: string
          trial_end_date: string | null
          user_id: string
        }
        Insert: {
          billing_cycle: string
          category?: string
          created_at?: string
          id?: string
          is_trial?: boolean
          is_unused?: boolean
          logo_url?: string | null
          name: string
          next_billing_date: string
          price: number
          start_date?: string
          status?: string
          trial_end_date?: string | null
          user_id: string
        }
        Update: {
          billing_cycle?: string
          category?: string
          created_at?: string
          id?: string
          is_trial?: boolean
          is_unused?: boolean
          logo_url?: string | null
          name?: string
          next_billing_date?: string
          price?: number
          start_date?: string
          status?: string
          trial_end_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          date: string
          id: string
          merchant: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          id?: string
          merchant: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          id?: string
          merchant?: string
          user_id?: string
        }
        Relationships: []
      }
      user_categories: {
        Row: {
          category_name: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          category_name: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          category_name?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          discount_code: string | null
          id: string
          plan: string
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          discount_code?: string | null
          id?: string
          plan?: string
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          discount_code?: string | null
          id?: string
          plan?: string
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
