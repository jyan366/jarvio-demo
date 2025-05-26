
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const icons = [
  {
    name: 'shopify.png',
    url: '/lovable-uploads/ea403407-f5cf-46bf-95f8-906adf37082f.png'
  },
  {
    name: 'figma.png',
    url: '/lovable-uploads/269e32a0-6a3d-4548-835a-bc3c08d870c2.png'
  },
  {
    name: 'amazon.png',
    url: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png'
  },
  {
    name: 'notion.png',
    url: '/lovable-uploads/a3172347-d964-4220-91f8-e497458cdb31.png'
  },
  {
    name: 'google-sheets.png',
    url: '/lovable-uploads/7ac8edf9-3963-4a29-a547-0f62ea731c5e.png'
  },
  {
    name: 'clickup.png',
    url: '/lovable-uploads/14b2571a-876e-4546-90b1-8249c36d649c.png'
  },
  {
    name: 'outlook.png',
    url: '/lovable-uploads/9875ceed-bfd6-465c-9a73-375563737cac.png'
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

    // Create the bucket if it doesn't exist
    const { error: bucketError } = await supabase.storage
      .createBucket('block-icons', { public: true });
    
    if (bucketError && !bucketError.message.includes('already exists')) {
      console.error('Failed to create bucket:', bucketError);
    }

    const uploadedFiles = [];

    for (const icon of icons) {
      try {
        // For local uploads, we need to fetch from the current domain
        const baseUrl = req.headers.get('origin') || 'https://aojrdgobdavxjpnymskc.supabase.co';
        const fullUrl = icon.url.startsWith('/') ? `${baseUrl}${icon.url}` : icon.url;
        
        const response = await fetch(fullUrl);
        if (!response.ok) {
          console.error(`Failed to download ${icon.name}: ${response.status}`);
          continue;
        }

        const blob = await response.blob();
        
        // Upload to Supabase storage
        const { data, error } = await supabase.storage
          .from('block-icons')
          .upload(icon.name, blob, {
            contentType: blob.type,
            upsert: true
          });

        if (error) {
          console.error(`Failed to upload ${icon.name}:`, error);
          continue;
        }

        const { data: publicUrl } = supabase.storage
          .from('block-icons')
          .getPublicUrl(icon.name);

        uploadedFiles.push({
          name: icon.name,
          url: publicUrl.publicUrl
        });
      } catch (iconError) {
        console.error(`Error processing ${icon.name}:`, iconError);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Block icons uploaded successfully', 
        files: uploadedFiles 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to upload block icons', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
