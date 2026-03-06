import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    // Webhook verification for WhatsApp/Twilio
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid verification' }, { status: 403 });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('WhatsApp Webhook Received:', JSON.stringify(body, null, 2));

        // TODO: Map WhatsApp sender to Supabase User Profile
        // TODO: Handle media (attachments) - upload to Supabase Storage
        // TODO: Trigger AI analysis

        return NextResponse.json({ status: 'received' });
    } catch (error: any) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
