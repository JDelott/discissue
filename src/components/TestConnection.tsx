import { useState, useEffect } from 'react';

export default function TestConnection() {
  const [status, setStatus] = useState('Testing connection...');
  const [pingResult, setPingResult] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try different URLs to see which one works
        const urls = [
          'http://localhost:3002/api/ping',
          'http://127.0.0.1:3002/api/ping',
          `${window.location.protocol}//${window.location.hostname}:3002/api/ping`
        ];
        
        setStatus('Testing multiple URLs...');
        
        for (const url of urls) {
          try {
            setStatus(`Trying ${url}...`);
            const response = await fetch(url, {
              credentials: 'include',
              headers: {
                'Accept': 'application/json'
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              setPingResult(`Success with ${url}: ${JSON.stringify(data)}`);
              setStatus('Connection successful!');
              return;
            }
          } catch (e) {
            console.log(`Failed with ${url}:`, e);
          }
        }
        
        setStatus('All connection attempts failed');
      } catch (error) {
        setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    testConnection();
  }, []);

  const handleManualTest = async () => {
    try {
      setStatus('Testing manually...');
      const url = 'http://localhost:3002/api/ping';
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPingResult(`Manual test success: ${JSON.stringify(data)}`);
        setStatus('Manual connection successful!');
      } else {
        setStatus(`Manual test failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setStatus(`Manual test error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-2">Connection Test</h2>
      <div className="mb-2">Status: {status}</div>
      {pingResult && <div className="mb-2">Result: {pingResult}</div>}
      <button 
        onClick={handleManualTest}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Connection Manually
      </button>
    </div>
  );
}
