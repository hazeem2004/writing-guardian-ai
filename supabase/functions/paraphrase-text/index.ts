const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text?.trim()) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate multiple paraphrasing options with meaning preservation
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert paraphrasing assistant. Your task is to:
1. Rewrite the given text to reduce plagiarism while PRESERVING THE EXACT MEANING
2. Provide 3 different paraphrasing options with varying styles
3. Use synonyms, restructure sentences, and change sentence order
4. Ensure each version maintains the original intent and key information
5. Make the text natural and human-like

Return your response as a JSON object with this structure:
{
  "paraphrased": "the best paraphrased version",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "similarity_reduction": "estimated percentage of similarity reduction"
}`
          },
          {
            role: "user",
            content: `Please paraphrase this text:\n\n${text}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "paraphrase_text",
              description: "Return paraphrased versions of the text with meaning preservation",
              parameters: {
                type: "object",
                properties: {
                  paraphrased: {
                    type: "string",
                    description: "The best paraphrased version"
                  },
                  suggestions: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of 3 alternative paraphrasing options"
                  },
                  similarity_reduction: {
                    type: "string",
                    description: "Estimated percentage of similarity reduction (e.g., '60-70%')"
                  }
                },
                required: ["paraphrased", "suggestions", "similarity_reduction"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "paraphrase_text" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to paraphrase text" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI Response:", JSON.stringify(data));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in response");
      return new Response(
        JSON.stringify({ error: "Invalid AI response format" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in paraphrase-text function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
