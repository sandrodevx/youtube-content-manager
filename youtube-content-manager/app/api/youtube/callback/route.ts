import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

// Constantes para la API de YouTube usando variables de entorno
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/api/youtube/callback';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // Verificar si hay error
    if (error) {
      return NextResponse.redirect(
        new URL(`/accounts/import?error=${error}`, request.url)
      );
    }
    
    // Verificar código de autorización
    if (!code) {
      return NextResponse.redirect(
        new URL('/accounts/import?error=no_code', request.url)
      );
    }
    
    // Verificar estado para protección CSRF
    // Nota: localStorage no está disponible en el servidor
    // En una implementación real, deberías usar cookies seguras para esto
    /* En lugar de verificar el estado aquí, se hará en el cliente con:
    const savedState = typeof window !== 'undefined' ? localStorage.getItem('oauth_state') : null;
    if (!savedState || savedState !== state) {
      return NextResponse.redirect(
        new URL('/accounts/import?error=invalid_state', request.url)
      );
    }
    */
    
    // Intercambiar código por tokens
    const tokenResponse = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Error obteniendo tokens:', errorData);
      return NextResponse.redirect(
        new URL('/accounts/import?error=token_exchange_failed', request.url)
      );
    }
    
    const tokenData = await tokenResponse.json();
    
    // Obtener datos de canales con el token de acceso
    const channelsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&mine=true`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: 'application/json',
        },
      }
    );
    
    if (!channelsResponse.ok) {
      console.error('Error obteniendo canales:', await channelsResponse.json());
      return NextResponse.redirect(
        new URL('/accounts/import?error=channel_fetch_failed', request.url)
      );
    }
    
    const channelsData = await channelsResponse.json();
    
    // Guardar tokens y datos en cookies seguras o sessionStorage para uso posterior
    // NOTA: En una aplicación real, estos tokens deberían almacenarse de manera segura en el servidor
    const responseUrl = new URL(`/accounts/import?success=true&access_token=${tokenData.access_token}`, request.url);
    
    // Redirigir a la página de importación con parámetros de éxito
    return NextResponse.redirect(responseUrl);
    
  } catch (error) {
    console.error('Error en el callback de OAuth:', error);
    return NextResponse.redirect(
      new URL('/accounts/import?error=unexpected_error', request.url)
    );
  }
} 