// Función para generar IDs únicos
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Función para obtener session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Función para obtener visitor ID
function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  
  let visitorId = localStorage.getItem('analytics_visitor_id');
  if (!visitorId) {
    visitorId = generateUUID();
    localStorage.setItem('analytics_visitor_id', visitorId);
  }
  return visitorId;
}

// Configuración de analytics
const FASTAPI_URL = 'https://databoard-analytics.fly.dev';
const API_KEY = '88e538de-1c57-4940-8935-f01e2e8781a5';

// Enviar evento de analytics
export async function trackEvent(eventData: Record<string, any> = {}) {
  if (typeof window === 'undefined') return false;
  
  try {
    const event = {
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer || undefined,
      title: document.title,
      user_agent: navigator.userAgent,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      session_id: getSessionId(),
      visitor_id: getVisitorId(),
      event_type: 'pageview',
      ...eventData
    };
    
    // Fire-and-forget: no esperar respuesta para no bloquear la ruta crítica
    // keepalive permite que la request continúe incluso si la página se cierra
    // priority: 'low' asegura que no compita con recursos críticos
    fetch(`${FASTAPI_URL}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify(event),
      keepalive: true, // Permite que la request continúe incluso si la página se cierra
      // @ts-ignore - priority no está en todos los tipos pero es soportado
      priority: 'low' as RequestPriority // Baja prioridad para no competir con recursos críticos
    }).catch(() => {
      // Silent failure - no afectar la aplicación
      // El tracking es opcional y no debe romper la UX
    });
    
    // Retornar true inmediatamente (fire-and-forget)
    return true;
  } catch (error) {
    return false;
  }
}

// Registrar pageview
export function trackPageView() {
  trackEvent({ event_type: 'pageview' });
}

// Trackear clicks en proyectos (como 'click')
export function trackProjectClick(projectName: string, projectUrl: string) {
  trackEvent({
    event_type: 'click',
    event_props: {
      action: 'project_click',
      project_name: projectName,
      project_url: projectUrl
    }
  });
}

// Trackear cambio de idioma (como 'click')
export function trackLanguageChange(newLanguage: string) {
  trackEvent({
    event_type: 'click',
    event_props: {
      action: 'language_change',
      language: newLanguage
    }
  });
}

// Trackear toggle de dark mode (como 'click')
export function trackThemeChange(newTheme: string) {
  trackEvent({
    event_type: 'click',
    event_props: {
      action: 'theme_change',
      theme: newTheme
    }
  });
}
