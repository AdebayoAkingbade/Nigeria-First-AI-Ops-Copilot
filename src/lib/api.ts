import { supabase } from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * A wrapper around fetch that automatically injects the Supabase JWT
 * into the Authorization header for requests to the Spring Boot backend.
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers = new Headers(options.headers || {});
    
    if (session?.access_token) {
        headers.set('Authorization', `Bearer ${session.access_token}`);
    }
    
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    // Handle empty responses (like 204 No Content)
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}
