import Navbar from '@/components/layout/Navbar/Navbar';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">Dashboard</div>
    </div>
  );
}
