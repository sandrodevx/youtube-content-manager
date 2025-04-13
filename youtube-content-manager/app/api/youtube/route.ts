import { NextResponse } from 'next/server';

// Constantes para la API de YouTube usando variables de entorno
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/api/youtube/callback';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';

// Función para obtener datos de canales de YouTube
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('access_token');
    
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Token de acceso requerido' },
        { status: 400 }
      );
    }
    
    // Obtener canales del usuario autenticado
    const channelsResponse = await fetch(
      `${YOUTUBE_API_BASE}/channels?part=snippet,statistics,contentDetails&mine=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );
    
    if (!channelsResponse.ok) {
      const errorData = await channelsResponse.json();
      throw new Error(`Error al obtener canales: ${JSON.stringify(errorData)}`);
    }
    
    const channelsData = await channelsResponse.json();
    
    // Si hay canales, obtener videos recientes del primer canal
    let recentVideos = [];
    
    if (channelsData.items && channelsData.items.length > 0) {
      const firstChannelId = channelsData.items[0].id;
      const uploadsPlaylistId = channelsData.items[0].contentDetails?.relatedPlaylists?.uploads;
      
      if (uploadsPlaylistId) {
        // Obtener videos recientes del canal
        const videosResponse = await fetch(
          `${YOUTUBE_API_BASE}/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
            },
          }
        );
        
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          
          // Obtener estadísticas de los videos
          const videoIds = videosData.items.map((item: any) => item.contentDetails.videoId).join(',');
          
          const videoStatsResponse = await fetch(
            `${YOUTUBE_API_BASE}/videos?part=statistics&id=${videoIds}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
              },
            }
          );
          
          if (videoStatsResponse.ok) {
            const videoStatsData = await videoStatsResponse.json();
            
            // Mapear videos con sus estadísticas
            recentVideos = videosData.items.map((video: any) => {
              const videoId = video.contentDetails.videoId;
              const stats = videoStatsData.items.find((v: any) => v.id === videoId)?.statistics || {};
              
              return {
                id: videoId,
                title: video.snippet.title,
                publishedAt: video.snippet.publishedAt,
                thumbnail: video.snippet.thumbnails?.medium?.url || '',
                statistics: {
                  viewCount: parseInt(stats.viewCount || '0'),
                  likeCount: parseInt(stats.likeCount || '0'),
                  commentCount: parseInt(stats.commentCount || '0'),
                },
              };
            });
          }
        }
      }
    }
    
    return NextResponse.json(
      {
        success: true,
        data: {
          channels: channelsData.items || [],
          recentVideos,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en la API de YouTube:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Error al obtener datos de YouTube' },
      { status: 500 }
    );
  }
}

// Función para intercambiar el código de autorización por tokens
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Verificar si hay código de autorización
    if (!body.authCode) {
      return NextResponse.json(
        { success: false, message: 'Se requiere código de autorización' },
        { status: 400 }
      );
    }
    
    // Intercambiar código por tokens
    const tokenResponse = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: body.authCode,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Error en la autenticación: ${JSON.stringify(errorData)}`);
    }
    
    const tokenData = await tokenResponse.json();
    
    return NextResponse.json(
      {
        success: true,
        message: 'Autenticación exitosa',
        data: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          expiresIn: tokenData.expires_in,
          tokenType: tokenData.token_type,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en la autenticación de YouTube:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error en el proceso de autenticación'
      },
      { status: 500 }
    );
  }
} 