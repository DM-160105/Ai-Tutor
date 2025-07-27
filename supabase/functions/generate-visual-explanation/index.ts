import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const stabilityApiKey = Deno.env.get('STABILITY_API_KEY');
const hfApiKey = Deno.env.get('HUGGINGFACE_API_KEY');
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
    const imagePrompt = `Create an educational diagram or illustration about ${topic} in the context of ${subject}. ${description ? `Additional details: ${description}. ` : ''}Make it visually clear, educational, and suitable for learning. Style: clean, modern educational illustration with clear labels and visual elements that explain the concept effectively.`;

    let imageUrl = '';

    // 1. Try Stability AI
if (!imageUrl && stabilityApiKey) {
  try {
    console.log('🔍 Trying Stability AI...');
    console.log('📤 Prompt:', imagePrompt);

    const formData = new FormData();
    formData.append('prompt', imagePrompt);
    formData.append('output_format', 'png');

    const stabilityResponse = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stabilityApiKey}`,
        'Accept': 'application/json'
      },
      body: formData
    });

    console.log('📥 Stability Response Status:', stabilityResponse.status);
    const rawText = await stabilityResponse.text();
    console.log('🧾 Stability Response Body:', rawText);

    if (stabilityResponse.ok) {
      const stabilityData = JSON.parse(rawText);
      if (stabilityData.image) {
        imageUrl = stabilityData.image;
        console.log('✅ Stability AI returned image.');
      }
    }
  } catch (error) {
    console.error('❌ Stability AI error:', error);
  }
}

// 2. Fallback to Hugging Face if Stability AI failed
if (!imageUrl && hfApiKey) {
  try {
    console.log('🔁 Fallback: Trying Hugging Face FLUX.1-dev...');
    console.log('📤 Prompt:', imagePrompt);

    const fluxResponse = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: imagePrompt
      })
    });

    console.log('📥 FLUX.1-dev Response Status:', fluxResponse.status);

    if (fluxResponse.ok) {
      const buffer = await fluxResponse.arrayBuffer();
      const base64Image = `data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(buffer)))}`;
      imageUrl = base64Image;
      console.log('✅ Hugging Face FLUX returned image.');
    } else {
      const errText = await fluxResponse.text();
      console.error('FLUX.1-dev Error Response:', errText);
    }
  } catch (error) {
    console.error('❌ Hugging Face FLUX generation error:', error);
  }
}

// 3. If still no image, throw error
if (!imageUrl) {
  throw new Error('Image generation failed using both Stability AI and Hugging Face.');
}
    let explanation = `This image shows an educational illustration about ${topic} in the context of ${subject}.`;
    if (openAIApiKey) {
      try {
        const explanationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an expert educator specializing in ${subject}. Provide comprehensive, clear explanations that help students understand complex concepts through visual learning.`
              },
              {
                role: 'user',
                content: `Provide a detailed explanation about "${topic}" in the context of ${subject}. ${description ? `Additional context: ${description}. ` : ''}

                Please structure your response with:
                1. A clear definition or overview
                2. Key components or elements
                3. How it works or why it's important
                4. Real-world applications or examples
                5. Common misconceptions or things to remember

                Make it educational, engaging, and suitable for visual learning. The explanation should complement a visual diagram or illustration.`
              }
            ],
            max_tokens: 1500,
            temperature: 0.7,
          }),
        });

        if (explanationResponse.ok) {
          const explanationData = await explanationResponse.json();
          explanation = explanationData.choices[0].message.content;
        }
      } catch (error) {
        console.error('Explanation generation error:', error);
      }
    }

    const { data: savedImage, error: saveError } = await supabase
      .from('generated_images')
      .insert({
        user_id: user_id,
        subject: subject,
        topic: topic,
        description: description || '',
        image_url: imageUrl,
        explanation: explanation
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving to Supabase:', saveError);
    }

    return new Response(JSON.stringify({ 
      id: savedImage?.id,
      image: imageUrl,
      explanation: explanation,
      topic: topic,
      subject: subject
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Handler error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
