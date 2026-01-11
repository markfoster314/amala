import Navbar from '@/components/layout/Navbar/Navbar';
import VideoCard from '@/components/common/VideoCard/VideoCard';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-grid">
          <VideoCard
            videoUrl="https://www.youtube.com/watch?v=8L8Nh67PbO4"
            title="Example Video"
            completionPercentage={65}
            onClick={() => {
              // Handle video click/navigation
              // eslint-disable-next-line no-console
              console.log('Video clicked');
            }}
          />
          <VideoCard
            videoUrl="https://www.youtube.com/watch?v=8L8Nh67PbO4"
            title="Example Video"
            completionPercentage={65}
            onClick={() => {
              // Handle video click/navigation
              // eslint-disable-next-line no-console
              console.log('Video clicked');
            }}
          />
          <VideoCard
            videoUrl="https://www.youtube.com/watch?v=8L8Nh67PbO4"
            title="Example Video"
            completionPercentage={65}
            onClick={() => {
              // Handle video click/navigation
              // eslint-disable-next-line no-console
              console.log('Video clicked');
            }}
          />
          <VideoCard
            videoUrl="https://www.youtube.com/watch?v=8L8Nh67PbO4"
            title="Example Video"
            completionPercentage={65}
            onClick={() => {
              // Handle video click/navigation
              // eslint-disable-next-line no-console
              console.log('Video clicked');
            }}
          />
        </div>
      </div>
    </div>
  );
}
