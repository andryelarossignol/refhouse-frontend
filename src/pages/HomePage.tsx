import { AvailabilityCard, TimelineCard, UpcomingScalesCard } from '../components/home/HomeCards'
import { DashboardLayout } from '../components/home/DashboardLayout'

export function HomePage() {
  return (
    <DashboardLayout>
      <section className="dashboard-content">
        <h1 className="dashboard-greeting">Olá, Ithalo Carneiro!</h1>

        <div className="dashboard-grid">
          <div className="dashboard-column">
            <UpcomingScalesCard />
            <AvailabilityCard />
          </div>

          <TimelineCard />
        </div>
      </section>
    </DashboardLayout>
  )
}
