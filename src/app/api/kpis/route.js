import { NextResponse } from 'next/server';
import { isDashboardAuthenticated } from '@/lib/utils/dashboardAuth';
import KPIMetricsService from '@/lib/services/KPIMetricsService';

export async function GET(request) {
  const authenticated = await isDashboardAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || KPIMetricsService.currentPeriod();
  const format = searchParams.get('format');

  try {
    const [data, periods] = await Promise.all([
      KPIMetricsService.computeForPeriod(period),
      KPIMetricsService.listPeriods(),
    ]);

    if (format === 'csv') {
      return new NextResponse(buildCSV(data), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="kpis-${period}.csv"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    return NextResponse.json(
      { success: true, period, availablePeriods: periods.length ? periods : [period], data },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('[kpis] échec lecture Firestore:', error.message);
    return NextResponse.json({ success: false, error: 'firestore_unavailable' }, { status: 502 });
  }
}

function buildCSV(data) {
  const rows = [
    ['KPI', 'Valeur', 'Unité', 'Cible', 'Statut'],
    [data.kpi1_formCompletion.label, data.kpi1_formCompletion.value, '%', data.kpi1_formCompletion.targetLabel, data.kpi1_formCompletion.status],
    [data.kpi2_mapInteraction.label, data.kpi2_mapInteraction.value, '%', data.kpi2_mapInteraction.targetLabel, data.kpi2_mapInteraction.status],
    [data.kpi3_traffic.label, data.kpi3_traffic.value, 'visiteurs', data.kpi3_traffic.targetLabel, data.kpi3_traffic.status],
    [data.kpi4_satisfaction.label, data.kpi4_satisfaction.value, '%', data.kpi4_satisfaction.targetLabel, data.kpi4_satisfaction.status],
  ];
  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
}