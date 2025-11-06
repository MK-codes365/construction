import { NextResponse } from 'next/server';

export async function GET() {
  const blueprints = [
    {
      name: 'Site A Main Building',
      url: 'https://example.com/blueprints/site-a-main.pdf',
      description: 'Main building blueprint for Site A',
      updated: '2025-11-01',
    },
    {
      name: 'Site B Warehouse',
      url: 'https://example.com/blueprints/site-b-warehouse.pdf',
      description: 'Warehouse blueprint for Site B',
      updated: '2025-10-28',
    },
    {
      name: 'Site C Parking Area',
      url: 'https://example.com/blueprints/site-c-parking.pdf',
      description: 'Parking area blueprint for Site C',
      updated: '2025-10-15',
    },
  ];

  return NextResponse.json({ status: 'ok', blueprints });
}
