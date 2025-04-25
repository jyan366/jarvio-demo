
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { context } = await req.json();
    
    // Validate input to prevent errors
    if (!context || typeof context !== 'object') {
      throw new Error('Invalid context provided');
    }

    // Generate relevant insights based on task context
    const relatedInsights = generateRelatedInsights(context);
    
    // Provide optimized task structure with insights
    const taskSuggestion = {
      title: context.title || 'New Task',
      description: context.description || 'Task description',
      category: determineCategory(context),
      priority: determinePriority(context),
      insights: relatedInsights,
      subtasks: generateSubtasks(context, relatedInsights)
    };

    return new Response(JSON.stringify(taskSuggestion), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhanced-task-suggestions:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateRelatedInsights(context: any) {
  // Sample insights based on task context
  const insights = [
    {
      title: "Related Review Issue",
      description: "Recent 2-star review mentions similar concerns with product packaging",
      severity: "MEDIUM",
      category: "REVIEW"
    },
    {
      title: "Competitive Analysis",
      description: "3 competitors have updated their listings with similar improvements",
      severity: "LOW",
      category: "COMPETITION"
    },
    {
      title: "Sales Impact",
      description: "Products in this category show 15% lower conversion rate",
      severity: "HIGH",
      category: "SALES"
    }
  ];

  // Filter insights based on context
  return insights.filter(insight => {
    return context.description?.toLowerCase().includes(insight.category.toLowerCase()) ||
           context.category === insight.category;
  });
}

function determineCategory(context: any) {
  if (context.category) return context.category;
  
  const categoryKeywords = {
    LISTINGS: ['listing', 'product', 'description', 'image'],
    INVENTORY: ['stock', 'inventory', 'warehouse'],
    MARKETING: ['promotion', 'marketing', 'campaign'],
    SALES: ['revenue', 'sales', 'profit'],
    SUPPORT: ['customer', 'ticket', 'issue']
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => 
      context.title?.toLowerCase().includes(keyword) || 
      context.description?.toLowerCase().includes(keyword)
    )) {
      return category;
    }
  }
  return 'LISTINGS';
}

function determinePriority(context: any) {
  if (context.priority) return context.priority;
  
  const urgentKeywords = ['urgent', 'asap', 'immediately', 'critical'];
  const highKeywords = ['important', 'significant', 'priority'];
  
  const text = `${context.title} ${context.description}`.toLowerCase();
  
  if (urgentKeywords.some(keyword => text.includes(keyword))) {
    return 'HIGH';
  }
  if (highKeywords.some(keyword => text.includes(keyword))) {
    return 'MEDIUM';
  }
  return 'LOW';
}

function generateSubtasks(context: any, insights: any[]) {
  const defaultSubtasks = [
    {
      title: 'Review requirements',
      description: 'Analyze what needs to be done'
    },
    {
      title: 'Create action plan',
      description: 'Plan your approach'
    },
    {
      title: 'Implement solution',
      description: 'Complete the required work'
    }
  ];

  // Generate insight-specific subtasks
  const insightSubtasks = insights.map(insight => ({
    title: `Address ${insight.title}`,
    description: `Review and address: ${insight.description}`
  }));

  return [...insightSubtasks, ...defaultSubtasks];
}
