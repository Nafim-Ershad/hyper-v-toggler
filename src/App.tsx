import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css';

function App() {
  const [status, setStatus] = useState('Checking...');
  const [statusStyle, setStatusStyle] = useState<React.CSSProperties>({
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '5px',
    marginTop: '20px'
  });
  const [scanStyle, setScanStyle] = useState<React.CSSProperties>({
    backgroundColor: '#fff',
    padding: '10px',
    border: "1px solid black",
    borderRadius: '16px',
    marginTop: '20px',
    cursor: "pointer"
  });
  
  const checkStatus = async () => {
    try {
      const result = await invoke<string>('check_status');
      setStatus(`Current Status: Hyper-V ${result}`);
      setStatusStyle({
        ...statusStyle,
        backgroundColor: result === 'Enabled' ? '#d4edda' : '#f8d7da'
      });
    } catch (error) {
      console.error('Status check failed:', error);
      setStatus('Error checking status');
      setStatusStyle({ ...statusStyle, backgroundColor: '#fff3cd' });
    }
  };

  const sfc = async () => {
    try {
      await invoke<string>("sfc_scan");
    } catch (error) {
      console.error('Scan failed:', error);
      alert('Error Scanning');
    }
  }

  const enableHyperV = async () => {
    try {
      await invoke('enable_hyper_v');
      alert('Hyper-V enabled! Please restart your computer.');
      await checkStatus();
    } catch (error) {
      console.error('Enable failed:', error);
      alert('Error enabling Hyper-V!');
    }
  };

  const disableHyperV = async () => {
    try {
      await invoke('disable_hyper_v');
      alert('Hyper-V disabled! Please restart your computer.');
      await checkStatus();
    } catch (error) {
      console.error('Disable failed:', error);
      alert('Error disabling Hyper-V!');
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="container">
      <>
      <h1>System File Checker</h1>
      <div onClick={sfc} style={scanStyle}>Run Now</div>
      </>
      <>
        <h1>Hyper-V Control</h1>
        <div className="button-group">
          <button onClick={enableHyperV} className="enable-button">
            Enable Hyper-V
          </button>
          <button onClick={disableHyperV} className="disable-button">
            Disable Hyper-V
          </button>
        </div>
        <div id="status" style={statusStyle}>
          {status}
        </div>
      </>
    </div>
  );
}

export default App;