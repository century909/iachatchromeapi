const HF_API_URL = process.env.HF_API_URL || 'https://router.huggingface.co/v1/chat/completions';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { prompt } = JSON.parse(event.body || '{}');

    if (!prompt || typeof prompt !== 'string') {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    // Verificación explícita del token en entorno local/dev
    if (!process.env.HF_TOKEN) {
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'Missing HF_TOKEN environment variable',
        }),
      };
    }

    const model = process.env.HF_MODEL || 'Qwen/Qwen2.5-7B-Instruct';

    // Log de diagnóstico mínimo (token ofuscado)
    const tokenInfo = process.env.HF_TOKEN ? `hf_***${process.env.HF_TOKEN.slice(-4)}` : 'missing';
    console.log('[hf-router] POST %s model=%s token=%s', HF_API_URL, model, tokenInfo);

    // Llamada directa al Router (API OpenAI-compatible)
    const body = JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 256,
    });

    const resp = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      console.error('HF Router error:', resp.status, errText);
      return {
        statusCode: resp.status || 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'Upstream error from HF Router',
          debug: { status: resp.status, body: errText.slice(0, 2000) },
        }),
      };
    }

    const data = await resp.json();
    const aiText = data?.choices?.[0]?.message?.content?.trim() ?? '';

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ response: aiText || '' }),
    };
  } catch (error) {
    // Registro detallado para diagnóstico en consola del servidor
    let bodyText;
    try {
      bodyText = await error?.response?.text?.();
    } catch (_) {}

    console.error('Error in function:', {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      status: error?.status ?? error?.response?.status,
      bodyText,
    });

    // Exponer información de debug en la respuesta para acelerar el diagnóstico
    const payload = {
      error: 'Internal server error',
      debug: {
        message: error?.message,
        name: error?.name,
        status: error?.status ?? error?.response?.status,
      },
    };
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify(payload),
    };
  }
};