
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const productImages = [
  {
    name: 'natural-sauerkraut-and-kimchi.png',
    url: 'https://raw.githubusercontent.com/lovable-user/demo/main/public/lovable-uploads/5e353a6f-a142-4d86-8db6-a9b77ea53f4a.png'
  },
  {
    name: 'natural-sauerkraut-duo.png',
    url: 'https://raw.githubusercontent.com/lovable-user/demo/main/public/lovable-uploads/aa5c220e-9962-481e-ae52-b011ec3adaba.png'
  },
  {
    name: 'juniper-berry-sauerkraut.png',
    url: 'https://raw.githubusercontent.com/lovable-user/demo/main/public/lovable-uploads/346b3202-bea8-4bdc-ada9-65a71b2b3151.png'
  },
  {
    name: 'chilli-dill-sauerkraut.png',
    url: 'https://raw.githubusercontent.com/lovable-user/demo/main/public/lovable-uploads/4a24e33a-86ed-47ed-826c-66f42aeb70e7.png'
  },
  {
    name: 'ruby-red-sauerkraut.png',
    url: 'https://raw.githubusercontent.com/lovable-user/demo/main/public/lovable-uploads/381bb43c-de57-469c-ba6b-8e646a6dbaa7.png'
  },
  {
    name: 'kimchi-large.png',
    url: 'https://raw.githubusercontent.com/lovable-user/demo/main/public/lovable-uploads/f38614f1-f152-4013-b934-3a69db1b7368.png'
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

    for (const image of productImages) {
      // Download the image
      const response = await fetch(image.url);
      if (!response.ok) {
        console.error(`Failed to download ${image.name}`);
        continue;
      }

      const blob = await response.blob();
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(image.name, blob, {
          contentType: blob.type,
          upsert: true
        });

      if (error) {
        console.error(`Failed to upload ${image.name}:`, error);
        continue;
      }

      const { data: publicUrl } = supabase.storage
        .from('product-images')
        .getPublicUrl(image.name);

      uploadedFiles.push({
        name: image.name,
        url: publicUrl.publicUrl
      });
    }

    return new Response(
      JSON.stringify({ 
        message: 'Product images uploaded successfully', 
        files: uploadedFiles 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to upload images', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
