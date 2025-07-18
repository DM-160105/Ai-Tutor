import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!subject || !topic) {
      throw new Error('Subject and topic are required');
    }

    console.log('Generating visual explanation for:', { subject, topic, user_id });

    // Create a detailed prompt for image generation
    const imagePrompt = `Create an educational diagram or illustration about ${topic} in the context of ${subject}. ${description ? `Additional details: ${description}. ` : ''}Make it visually clear, educational, and suitable for learning. Style: clean, modern educational illustration with clear labels and visual elements that explain the concept effectively.`;

    // Generate the image using OpenAI
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
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
        output_format: 'png'
      }),
    });

    if (!imageResponse.ok) {
      const errorData = await imageResponse.text();
      console.error('OpenAI Image API error:', errorData);
      throw new Error('Failed to generate image');
    }

    const imageData = await imageResponse.json();
    
    if (!imageData.data || !imageData.data[0]) {
      throw new Error('No image data received from OpenAI');
    }

    // For gpt-image-1, the response contains base64 data
    const imageBase64 = imageData.data[0].b64_json;
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    // Generate detailed explanation using ChatGPT
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

    if (!explanationResponse.ok) {
      const errorData = await explanationResponse.text();
      console.error('OpenAI Chat API error:', errorData);
      throw new Error('Failed to generate explanation');
    }

    const explanationData = await explanationResponse.json();
    const explanation = explanationData.choices[0].message.content;

    console.log('Successfully generated visual explanation');

    return new Response(JSON.stringify({ 
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