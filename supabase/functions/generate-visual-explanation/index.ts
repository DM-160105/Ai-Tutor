import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, topic, description, user_id } = await req.json();

    if (!subject || !topic || !user_id) {
      throw new Error('Subject, topic, and user_id are required');
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    const imagePrompt = `Create an educational diagram or illustration about "${topic}" in the subject of "${subject}". ${description ? `Additional details: ${description}.` : ''} The style should be clean, labeled, and modern — ideal for teaching and learning.`;

    let imageUrl = '';

    if (openAIApiKey) {
      try {
        const openAIResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: imagePrompt,
            n: 1,
            size: '1024x1024'
          }),
        });

        const openAIData = await openAIResponse.json();

        if (openAIData?.data?.[0]?.url) {
          imageUrl = openAIData.data[0].url;
          console.log("✅ Image generated successfully");
        } else {
          console.error('❌ OpenAI image response invalid:', openAIData);
        }
      } catch (err) {
        console.error('❌ OpenAI image generation failed:', err);
      }
    }

    if (!imageUrl) {
      throw new Error('Image generation failed. Please try again later.');
    }

    // Generate text explanation
    let explanation = '';
    try {
      const explanationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are an expert educator in ${subject}. Provide clear, structured explanations to aid visual learners.`
            },
            {
              role: 'user',
              content: `Explain "${topic}" in ${subject}. ${description ? `Additional context: ${description}.` : ''} 
Structure your answer with:
1. Overview
2. Key concepts
3. How it works
4. Real-world examples
5. Common misconceptions.`
            }
          ],
          max_tokens: 1200,
          temperature: 0.7
        }),
      });

      const explanationData = await explanationResponse.json();
      explanation = explanationData?.choices?.[0]?.message?.content ?? '';
    } catch (err) {
      console.error('⚠️ Explanation generation failed:', err);
      explanation = `This image shows an educational illustration about ${topic} in ${subject}.`;
    }

    const { data: savedImage, error: saveError } = await supabase
      .from('generated_images')
      .insert({
        user_id,
        subject,
        topic,
        description: description || '',
        image_url: imageUrl,
        explanation
      })
      .select()
      .single();

    if (saveError) {
      console.error('⚠️ Failed to save image record:', saveError);
    }

    return new Response(JSON.stringify({
      id: savedImage?.id,
      image: imageUrl,
      explanation,
      topic,
      subject
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('🔥 Function error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Unexpected error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
