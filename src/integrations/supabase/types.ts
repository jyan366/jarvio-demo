export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agent_settings: {
        Row: {
          agent_id: string
          created_at: string | null
          custom_tools: string[] | null
          id: string
          tools_config: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          custom_tools?: string[] | null
          id?: string
          tools_config?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          custom_tools?: string[] | null
          id?: string
          tools_config?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_documents: {
        Row: {
          created_at: string | null
          description: string | null
          file_path: string
          file_size: number
          file_type: string
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_path: string
          file_size: number
          file_type: string
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      block_executions: {
        Row: {
          block_id: string
          block_name: string
          block_type: string
          completed_at: string | null
          error_message: string | null
          execution_order: number | null
          id: string
          input_data: Json | null
          output_data: Json | null
          started_at: string | null
          status: string
          task_id: string | null
        }
        Insert: {
          block_id: string
          block_name: string
          block_type: string
          completed_at?: string | null
          error_message?: string | null
          execution_order?: number | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          started_at?: string | null
          status?: string
          task_id?: string | null
        }
        Update: {
          block_id?: string
          block_name?: string
          block_type?: string
          completed_at?: string | null
          error_message?: string | null
          execution_order?: number | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          started_at?: string | null
          status?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "block_executions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      block_executions_backup: {
        Row: {
          block_id: string | null
          block_name: string | null
          block_type: string | null
          completed_at: string | null
          error_message: string | null
          flow_execution_id: string | null
          id: string | null
          input_data: Json | null
          output_data: Json | null
          requires_user_action: boolean | null
          started_at: string | null
          status: string | null
          user_action_response: Json | null
        }
        Insert: {
          block_id?: string | null
          block_name?: string | null
          block_type?: string | null
          completed_at?: string | null
          error_message?: string | null
          flow_execution_id?: string | null
          id?: string | null
          input_data?: Json | null
          output_data?: Json | null
          requires_user_action?: boolean | null
          started_at?: string | null
          status?: string | null
          user_action_response?: Json | null
        }
        Update: {
          block_id?: string | null
          block_name?: string | null
          block_type?: string | null
          completed_at?: string | null
          error_message?: string | null
          flow_execution_id?: string | null
          id?: string | null
          input_data?: Json | null
          output_data?: Json | null
          requires_user_action?: boolean | null
          started_at?: string | null
          status?: string | null
          user_action_response?: Json | null
        }
        Relationships: []
      }
      flow_block_configs: {
        Row: {
          block_name: string
          block_type: string
          config_data: Json | null
          created_at: string | null
          credentials: Json | null
          id: string
          is_functional: boolean | null
          updated_at: string | null
        }
        Insert: {
          block_name: string
          block_type: string
          config_data?: Json | null
          created_at?: string | null
          credentials?: Json | null
          id?: string
          is_functional?: boolean | null
          updated_at?: string | null
        }
        Update: {
          block_name?: string
          block_type?: string
          config_data?: Json | null
          created_at?: string | null
          credentials?: Json | null
          id?: string
          is_functional?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      flow_executions: {
        Row: {
          completed_at: string | null
          created_by: string | null
          flow_id: string
          id: string
          metadata: Json | null
          started_at: string | null
          status: string
          task_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_by?: string | null
          flow_id: string
          id?: string
          metadata?: Json | null
          started_at?: string | null
          status?: string
          task_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_by?: string | null
          flow_id?: string
          id?: string
          metadata?: Json | null
          started_at?: string | null
          status?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_executions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category: string | null
          created_at: string | null
          data: Json | null
          description: string | null
          execution_order: number | null
          id: string
          parent_id: string | null
          priority: string | null
          saved_to_flows: boolean | null
          status: string | null
          step_execution_log: Json | null
          steps_completed: Json | null
          task_type: string | null
          title: string
          trigger: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          data?: Json | null
          description?: string | null
          execution_order?: number | null
          id?: string
          parent_id?: string | null
          priority?: string | null
          saved_to_flows?: boolean | null
          status?: string | null
          step_execution_log?: Json | null
          steps_completed?: Json | null
          task_type?: string | null
          title: string
          trigger?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          data?: Json | null
          description?: string | null
          execution_order?: number | null
          id?: string
          parent_id?: string | null
          priority?: string | null
          saved_to_flows?: boolean | null
          status?: string | null
          step_execution_log?: Json | null
          steps_completed?: Json | null
          task_type?: string | null
          title?: string
          trigger?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
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
