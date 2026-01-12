import 'dotenv/config';
import { createApp } from './server';

const PORT = Number.parseInt(process.env['PORT'] ?? '3001', 10);

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env['NODE_ENV'] ?? 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
