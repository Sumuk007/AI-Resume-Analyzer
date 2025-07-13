import { useState, useEffect } from 'react'
import "./index.css"; // Ensure you have Tailwind CSS imported
import Form from './components/Form'
import Header from './components/Header';
import Footer from './components/Footer';

function App() {

  const [serverStatus, setServerStatus] = useState('checking');

  // Function to check server status
  const checkServerStatus = async () => {
    try {
      setServerStatus('checking');
      
      // Replace with your actual health check endpoint
      const response = await fetch('https://ai-resume-analyzer-htsu.onrender.com', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        setServerStatus('live');
      } else {
        setServerStatus('waking');
        // Retry after a delay if server is waking up
        setTimeout(checkServerStatus, 3000);
      }
    } catch (error) {
      console.error('Server status check failed:', error);
      
      // If it's a timeout or network error, server might be waking up
      if (error.name === 'TimeoutError' || error.name === 'TypeError') {
        setServerStatus('waking');
      } else {
        setServerStatus('offline');
      }
    }
  };

  // Check server status on component mount
  useEffect(() => {
    checkServerStatus();
    
    // Set up periodic status checks (every 30 seconds)
    const interval = setInterval(checkServerStatus, 30000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Function to manually refresh server status
  const refreshServerStatus = () => {
    checkServerStatus();
  };

  return (
    <>
      <Header serverStatus={serverStatus} />
      <Form serverStatus={serverStatus} onRefreshStatus={refreshServerStatus} 
      />
      <Footer />
    </>
  )
}

export default App;
