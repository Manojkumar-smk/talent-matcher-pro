import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

const API_BASE_URL = "https://ai-portfolio-validator-2.onrender.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path");
    
    if (!path) {
      return new Response(
        JSON.stringify({ error: "Missing path parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const targetUrl = `${API_BASE_URL}${path}`;
    console.log(`Proxying ${req.method} request to: ${targetUrl}`);

    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      const body = await req.text();
      if (body) {
        fetchOptions.body = body;
      }
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: { 
        ...corsHeaders, 
        "Content-Type": response.headers.get("Content-Type") || "application/json" 
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    const errorMessage = error instanceof Error ? error.message : "Proxy request failed";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
