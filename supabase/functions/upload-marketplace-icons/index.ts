
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const icons = [
  {
    name: 'amazon.png',
    url: 'https://companieslogo.com/img/orig/AMZN-e9f942e4.png'
  },
  {
    name: 'shopify.svg',
    url: 'https://cdn.worldvectorlogo.com/logos/shopify.svg'
  },
  {
    name: 'walmart.png',
    url: 'https://companieslogo.com/img/orig/WMT-0d8e7e26.png?v=2023-03-05'
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const uploadedFiles = [];

    for (const icon of icons) {
      // Download the image
      const response = await fetch(icon.url);
      if (!response.ok) {
        console.error(`Failed to download ${icon.name}`);
        continue;
      }

      const blob = await response.blob();
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('marketplace-icons')
        .upload(icon.name, blob, {
          contentType: blob.type,
          upsert: true
        });

      if (error) {
        console.error(`Failed to upload ${icon.name}:`, error);
        continue;
      }

      const { data: publicUrl } = supabase.storage
        .from('marketplace-icons')
        .getPublicUrl(icon.name);

      uploadedFiles.push({
        name: icon.name,
        url: publicUrl.publicUrl
      });
    }

    return new Response(
      JSON.stringify({ 
        message: 'Icons uploaded successfully', 
        files: uploadedFiles 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to upload icons', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
