import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Competition from '@/models/Competition';

export async function GET(req) {
  try {
    await dbConnect();
    const competitions = await Competition.find({}).sort({ startDate: 1 });
    return NextResponse.json({ competitions: JSON.parse(JSON.stringify(competitions)) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
