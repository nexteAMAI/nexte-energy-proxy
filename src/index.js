// CORS Proxy for Energy Market APIs
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const targetURL = url.searchParams.get('url');
    
    // CORS headers - Allow requests from your training deck
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://nexte-AM.github.io',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ 
        status: 'ok',
        message: 'CORS proxy is running',
        timestamp: new Date().toISOString()
      }), {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      });
    }

    // Proxy request to target API
    if (!targetURL) {
      return new Response(JSON.stringify({ 
        error: 'Missing target URL parameter',
        usage: 'Add ?url=YOUR_API_ENDPOINT to the request'
      }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    try {
      // Fetch data from target API
      const response = await fetch(targetURL);
      const data = await response.text();
      
      return new Response(data, {
        status: response.status,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error.message,
        targetURL: targetURL
      }), {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      });
    }
  }
};
