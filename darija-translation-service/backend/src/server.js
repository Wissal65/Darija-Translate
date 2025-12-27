import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in .env file');
  console.error('Please add your Gemini API key to the .env file');
  process.exit(1);
}

const server = app.listen(PORT, HOST, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Context-Aware Darija Translation Service');
  console.log('='.repeat(60));
  console.log(`📡 Server running on: http://${HOST}:${PORT}`);
  console.log(`🌐 Local access: http://localhost:${PORT}`);
  console.log('\n📍 Available Endpoints:');
  console.log(`   POST ${HOST}:${PORT}/api/translate`);
  console.log(`   POST ${HOST}:${PORT}/api/translate-voice`);
  console.log(`   GET  ${HOST}:${PORT}/api/contexts`);
  console.log(`   GET  ${HOST}:${PORT}/health`);
  console.log('\n✅ Features Enabled:');
  console.log('   • Automatic context detection');
  console.log('   • Audio signal extraction');
  console.log('   • Context-aware translation');
  console.log('   • Manual context override');
  console.log('\n🤖 AI Model: Google Gemini 2.5 Flash');
  console.log('='.repeat(60) + '\n');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});