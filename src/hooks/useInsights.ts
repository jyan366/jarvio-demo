
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Insight {
  id: string;
  title: string;
  summary: string;
  category: 'Sales' | 'Inventory' | 'Listings' | 'Customers' | 'Competitors' | 'Advertising';
  severity: 'high' | 'medium' | 'low' | 'info';
  source_flow_id?: string;
  source_task_id?: string;
  source_block_id?: string;
  generated_at: string;
  created_at: string;
  user_id: string;
  metadata?: Record<string, any>;
  status: 'active' | 'dismissed' | 'resolved';
  resolved_at?: string;
  actions_taken?: any[];
}

export function useInsights(taskId?: string) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use supabase.rpc or raw query since the table isn't in auto-generated types yet
      let query = `SELECT * FROM insights ORDER BY generated_at DESC`;
      
      if (taskId) {
        query = `SELECT * FROM insights WHERE source_task_id = '${taskId}' ORDER BY generated_at DESC`;
      }
      
      const { data, error: fetchError } = await supabase.rpc('execute_sql', { 
        sql: query 
      }) as { data: Insight[] | null, error: any };
      
      if (fetchError) {
        // Fallback: try direct query if rpc doesn't work
        console.log('RPC failed, trying direct query...');
        const { data: directData, error: directError } = await (supabase as any)
          .from('insights')
          .select('*')
          .order('generated_at', { ascending: false });
        
        if (directError) {
          throw directError;
        }
        
        setInsights((directData as Insight[]) || []);
      } else {
        setInsights(data || []);
      }
    } catch (err) {
      console.error('Error loading insights:', err);
      setError(err instanceof Error ? err.message : 'Failed to load insights');
      // Set empty array on error to prevent UI issues
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  const dismissInsight = async (insightId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('insights')
        .update({ status: 'dismissed' })
        .eq('id', insightId);
      
      if (error) throw error;
      
      setInsights(prev => prev.map(insight => 
        insight.id === insightId 
          ? { ...insight, status: 'dismissed' as const }
          : insight
      ));
      
      toast({
        title: "Insight dismissed",
        description: "The insight has been marked as dismissed."
      });
    } catch (err) {
      console.error('Error dismissing insight:', err);
      toast({
        title: "Error",
        description: "Failed to dismiss insight",
        variant: "destructive"
      });
    }
  };

  const resolveInsight = async (insightId: string, actionsTaken?: any[]) => {
    try {
      const { error } = await (supabase as any)
        .from('insights')
        .update({ 
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          actions_taken: actionsTaken || []
        })
        .eq('id', insightId);
      
      if (error) throw error;
      
      setInsights(prev => prev.map(insight => 
        insight.id === insightId 
          ? { 
              ...insight, 
              status: 'resolved' as const,
              resolved_at: new Date().toISOString(),
              actions_taken: actionsTaken || []
            }
          : insight
      ));
      
      toast({
        title: "Insight resolved",
        description: "The insight has been marked as resolved."
      });
    } catch (err) {
      console.error('Error resolving insight:', err);
      toast({
        title: "Error",
        description: "Failed to resolve insight",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadInsights();
  }, [taskId]);

  return {
    insights,
    loading,
    error,
    refreshInsights: loadInsights,
    dismissInsight,
    resolveInsight
  };
}
