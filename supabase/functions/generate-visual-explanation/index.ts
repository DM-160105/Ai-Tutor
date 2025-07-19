
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, topic, description, user_id } = await req.json();

    if (!subject || !topic || !user_id) {
      throw new Error('Subject, topic, and user_id are required');
    }

    console.log('Generating visual explanation for:', { subject, topic, user_id });

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Create a detailed prompt for image generation
    const imagePrompt = `Create an educational diagram or illustration about ${topic} in the context of ${subject}. ${description ? `Additional details: ${description}. ` : ''}Make it visually clear, educational, and suitable for learning. Style: clean, modern educational illustration with clear labels and visual elements that explain the concept effectively.`;

    let imageUrl = '';

    // Try OpenAI first since we know it works
    if (openAIApiKey) {
      try {
        console.log('Attempting image generation with OpenAI...');
        const openAIResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-image-1',
            prompt: imagePrompt,
            n: 1,
            size: '1024x1024',
            quality: 'high',
            response_format: 'b64_json'
          }),
        });

        if (openAIResponse.ok) {
          const openAIData = await openAIResponse.json();
          if (openAIData.data && openAIData.data[0] && openAIData.data[0].b64_json) {
            imageUrl = `data:image/png;base64,${openAIData.data[0].b64_json}`;
            console.log('Successfully generated image with OpenAI');
          }
        } else {
          const errorText = await openAIResponse.text();
          console.error('OpenAI API error:', openAIResponse.status, errorText);
        }
      } catch (openAIError) {
        console.error('OpenAI generation error:', openAIError);
      }
    }

    // Fallback to Gemini if OpenAI fails
    if (!imageUrl && geminiApiKey) {
      try {
        console.log('Falling back to Gemini...');
        // Use the correct Gemini endpoint for text-to-image
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: imagePrompt,
            sampleCount: 1,
            aspectRatio: "1:1"
          }),
        });

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          console.log('Gemini response received');
          if (geminiData.images && geminiData.images[0] && geminiData.images[0].bytesBase64Encoded) {
            imageUrl = `data:image/png;base64,${geminiData.images[0].bytesBase64Encoded}`;
            console.log('Successfully generated image with Gemini');
          }
        } else {
          const errorText = await geminiResponse.text();
          console.error('Gemini API error:', geminiResponse.status, errorText);
        }
      } catch (geminiError) {
        console.error('Gemini generation error:', geminiError);
      }
    }

    if (!imageUrl) {
      throw new Error('All image generation services failed or are unavailable. Please check your API keys.');
    }

    // Generate detailed explanation using ChatGPT
    let explanation = '';
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
        } else {
          console.error('Failed to generate explanation:', explanationResponse.status);
          explanation = `This image shows an educational illustration about ${topic} in the context of ${subject}.`;
        }
      } catch (explanationError) {
        console.error('Error generating explanation:', explanationError);
        explanation = `This image shows an educational illustration about ${topic} in the context of ${subject}.`;
      }
    } else {
      explanation = `This image shows an educational illustration about ${topic} in the context of ${subject}.`;
    }

    // Save to Supabase
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
      // Continue without saving if there's an error
    }

    console.log('Successfully generated visual explanation');

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
    console.error('Error in generate-visual-explanation function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
