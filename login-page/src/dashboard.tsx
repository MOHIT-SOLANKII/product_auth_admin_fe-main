import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { batchService } from './services/api';
import type { BatchData } from './services/api';

const Dashboard: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [batchData, setBatchData] = useState<BatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data when component mounts
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        // This would be replaced by actual API call in the future
        const data = await batchService.getAll();
        setBatchData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching batches:', err);
        setError('Failed to load batch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  // Function to handle search submit
  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await fetch('https://stgproductauth.karmaalab.com/api/qr/admin-search', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ4MDc4Mjk2LCJpYXQiOjE3NDc0NzM0OTYsImp0aSI6IjFhOGNiNmVhZGVjMTQ0Yjc5ZGY1YjRkYmU2YTgyZTFlIiwidXNlcl9pZCI6Mn0.JOZiRWkwTWKYRISI0qlkLfwRra6BrANQ2OO6SDLNX-k',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qr_code: searchQuery }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message); // Display success message
      } else {
        alert(result.error); // Display error message
      }

      setError(null);
    } catch (err) {
      console.error('Error searching QR:', err);
      setError('Failed to search QR. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle adding a new batch
  const handleAddBatch = () => {
    // Create a hidden file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx,.xls';
    
    // Handle file selection
    fileInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        console.log('Selected file:', file.name);
        
        try {
          setLoading(true);
          // This would be an actual API call in the future
          const response = await batchService.uploadBatch(file);
          
          if (response.success && response.batch) {
            // Add the new batch to the existing data
            setBatchData(prev => [response.batch!, ...prev]);
            alert(`File uploaded: ${file.name}`);
          } else {
            setError('Failed to upload file. Please try again.');
          }
        } catch (err) {
          console.error('Error uploading file:', err);
          setError('Failed to upload file. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    // Trigger file input click
    fileInput.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      <div className="absolute top-6 left-6">
        <div className="flex flex-col items-start">
          <img src="/logo.jpg" alt="Finolex" className="h-12 w-auto" />
        </div>
      </div>

      <div className="flex justify-center pt-24 pb-16 px-4 w-full">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 mx-auto">
          <h1 className="text-2xl font-semibold text-center mb-2">Product Data</h1>
          <p className="text-gray-600 text-center mb-6">Upload latest product data in excel format</p>
          
          {/* Add Batch Button */}
          <div className="flex justify-center mb-8">
            <button 
              onClick={handleAddBatch}
              className="bg-blue-400 hover:bg-blue-500 text-white font-normal py-2 px-6 rounded-md transition-colors"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Add Batch'}
            </button>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {/* Search Bar */}
          <div className="flex items-center mb-6">
            <div className="relative flex-grow mr-2">
              <input
                type="text"
                placeholder="Search QR"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 pl-4 pr-10"
                disabled={loading}
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                {/* Search icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
            <button 
              onClick={handleSearchSubmit}
              className="bg-blue-100 text-blue-500 border border-blue-200 py-2 px-6 rounded-md hover:bg-blue-200"
              disabled={loading || !searchQuery.trim()}
            >
              {loading ? 'Searching...' : 'Submit'}
            </button>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto border border-gray-300 rounded-lg p-4"> {/* Added border and padding */}
            {loading && !batchData.length ? (
              <div className="py-8 text-center text-gray-500">
                Loading batch data...
              </div>
            ) : batchData.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No batch data available. Please upload a batch.
              </div>
            ) : (
              <div className="overflow-y-auto max-h-96"> {/* Added vertical scroll */}
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-100">
                      <th className="py-3 px-4 font-medium text-gray-700">Batch</th>
                      <th className="py-3 px-4 font-medium text-gray-700">Upload Status</th>
                      <th className="py-3 px-4 font-medium text-gray-700">Date Uploaded</th>
                      <th className="py-3 px-4 font-medium text-gray-700">Uploaded Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchData.map((batch) => (
                      <tr key={batch.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <a href="#" className="text-blue-500 hover:underline">
                            {batch.name}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 text-xs rounded-full ${
                            batch.status === 'Uploaded' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {batch.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{batch.dateUploaded}</td>
                        <td className="py-3 px-4 text-gray-600">{batch.completedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center px-4">
        <div className="flex items-center gap-2">
          <img src="/rewardify-logo.png" alt="Rewardify Logo" className="h-8 w-auto" />
          <span className="text-xs text-gray-500 cursor-default">
            Rewardify - Loyalty & Reward Management System A Solution by Karmaa Lab (
            <a 
              href="https://karmaalab.com" 
              className="underline text-gray-500 hover:text-blue-500"
              target="_blank" 
              rel="noopener noreferrer"
            >
              karmaalab.com
            </a>
            )
          </span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;