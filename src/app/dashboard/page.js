import { isDashboardAuthenticated } from '@/lib/utils/dashboardAuth';
import DashboardLogin from './DashboardLogin';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const authenticated = await isDashboardAuthenticated();
  return authenticated ? <DashboardClient /> : <DashboardLogin />;
}