/* eslint-disable no-void */
import Navbar from '@/components/layout/Navbar/Navbar';
import VideoCard from '@/components/common/VideoCard/VideoCard';
import PlaylistCard from '@/components/common/PlaylistCard/PlaylistCard';
import { useNavigate } from 'react-router-dom';
import { TextInput } from '@markfoster314/marduk';
import thumbnailImage from '../../../../../internals/smt3.jpg';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const playlistThumbnails = [thumbnailImage, thumbnailImage, thumbnailImage];

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-search">
          <TextInput
            type="text"
            id="dashboard-search"
            name="dashboard-search"
            placeholder="Search..."
            required={false}
          />
        </div>
        <div className="dashboard-grid">
          <PlaylistCard
            playlistUrl="/playlist/example"
            thumbnails={playlistThumbnails}
            title="Example Playlist"
            videoCount={15}
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log('Playlist clicked');
            }}
          />
          <VideoCard
            videoUrl="https://www.youtube.com/watch?v=8L8Nh67PbO4"
            thumbnail={thumbnailImage}
            title="Example Video"
            completionPercentage={65}
            onClick={() => {
              // eslint-disable-next-line no-console
              void navigate(`/video/8L8Nh67PbO4`);
            }}
          />
          <VideoCard
            videoUrl="https://www.youtube.com/watch?v=8L8Nh67PbO4"
            thumbnail={thumbnailImage}
            title="Example Video"
            completionPercentage={65}
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log('Video clicked');
            }}
          />
          <VideoCard
            videoUrl="https://www.youtube.com/watch?v=8L8Nh67PbO4"
            thumbnail={thumbnailImage}
            title="Example Video"
            completionPercentage={65}
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log('Video clicked');
            }}
          />
          <VideoCard
            videoUrl="https://www.youtube.com/watch?v=8L8Nh67PbO4"
            thumbnail={thumbnailImage}
            title="Example Video"
            completionPercentage={65}
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log('Video clicked');
            }}
          />
        </div>
      </div>
    </div>
  );
}
