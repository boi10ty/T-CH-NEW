import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Get client IP from request headers (works with most hosting providers)
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                   request.headers.get('x-real-ip') ||
                   request.headers.get('cf-connecting-ip') ||
                   'unknown';

        // Use ip-api.com for free IP geolocation (no API key needed)
        const response = await fetch(`http://ip-api.com/json/${ip.trim()}?fields=countryCode`, {
            // Cache for 1 hour to prevent delays
            next: { revalidate: 3600 }
        });

        const data = await response.json();
        const countryCode = data.countryCode || 'US';

        return NextResponse.json({ countryCode, ip });
    } catch (error) {
        console.error('Country detection error:', error);
        // Default to US if detection fails
        return NextResponse.json({ countryCode: 'US', ip: 'unknown' });
    }
}
