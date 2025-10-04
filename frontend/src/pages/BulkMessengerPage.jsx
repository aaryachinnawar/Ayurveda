import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const BulkMessengerPage = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [message, setMessage] = useState('');
  const [concurrency, setConcurrency] = useState(5);
  const [dryRun, setDryRun] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [summary, setSummary] = useState(null);
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsLoading(true);
    setStatus('Uploading CSV and sending messages...');

    const formData = new FormData();
    formData.append('csv', csvFile);
    formData.append('message', message);
    formData.append('concurrency', concurrency.toString());
    formData.append('dryRun', dryRun.toString());

    try {
      const response = await fetch('http://localhost:3000/api/send', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to send messages');
      }

      setStatus('Completed');
      setSummary(data.summary);
      setResults(data.results || []);
      toast.success(`Messages sent successfully! ${data.summary.succeeded} succeeded, ${data.summary.failed} failed`);
    } catch (error) {
      console.error('Error:', error);
      setStatus('Error: ' + error.message);
      toast.error('Failed to send messages: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusClass = (result) => {
    if (result.dryRun) return 'bg-yellow-100 text-yellow-800';
    if (result.ok) return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (result) => {
    if (result.dryRun) return 'DRY';
    if (result.ok) return 'OK';
    return 'FAIL';
  };

  const getInfoText = (result) => {
    if (result.ok) {
      return result.dryRun ? 'Dry run' : (result.data ? 'Sent' : 'OK');
    }
    return result.status ? `HTTP ${result.status}` : (result.error || 'Error');
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center py-8 bg-[#F7F5ED]">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#3B5D2A]">Bulk WhatsApp Messenger</h2>
        <p className="text-center text-black mb-8">
          Upload a CSV with customer names and phone numbers, craft a message, and send via WhatsApp Cloud API.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CSV Upload */}
          <div className="space-y-2">
            <label htmlFor="csv" className="block text-sm font-medium text-black">
              CSV File
            </label>
            <input
              type="file"
              id="csv"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#A8BFA0] file:text-[#3B5D2A] hover:file:bg-[#9BB092]"
              required
            />
            <p className="text-xs text-black">
              CSV must include a phone column (e.g., phone, phonenumber, mobile, whatsapp). 
              Optional name column for personalization. Phone numbers must include country code (E.164), e.g., 919876543210.
            </p>
          </div>

          {/* Message Template */}
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-black">
              Message Template
            </label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi {{name}}, this is a reminder for your appointment."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A8BFA0] focus:border-transparent text-black"
              required
            />
            <p className="text-xs text-black">
              Use variables like <code className="bg-gray-100 px-1 rounded">{'{{name}}'}</code> and <code className="bg-gray-100 px-1 rounded">{'{{phone}}'}</code>.
            </p>
          </div>

          {/* Concurrency and Dry Run */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="concurrency" className="block text-sm font-medium text-black">
                Concurrency
              </label>
              <input
                type="number"
                id="concurrency"
                min="1"
                max="20"
                value={concurrency}
                onChange={(e) => setConcurrency(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A8BFA0] focus:border-transparent"
              />
              <p className="text-xs text-black">How many messages to send in parallel.</p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  className="rounded border-gray-300 text-[#A8BFA0] focus:ring-[#A8BFA0]"
                />
                <span className="text-sm font-medium text-black">Dry Run</span>
              </label>
              <p className="text-xs text-black">If enabled, messages won't be sent. Useful to verify parsing and preview.</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#A8BFA0] text-[#3B5D2A] px-8 py-3 rounded-full font-semibold hover:bg-[#9BB092] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3B5D2A]"></div>
                  Sending...
                </>
              ) : (
                'Send Messages'
              )}
            </button>
          </div>
        </form>

        {/* Status Section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-black">Status</h3>
          <div className="text-sm text-black mb-2">{status}</div>
          
          {summary && (
            <div className="text-sm text-black mb-4">
              Total: {summary.total} | Succeeded: {summary.succeeded} | Failed: {summary.failed}
            </div>
          )}

          {results.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">#</th>
                    <th className="text-left py-2">To</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Info</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2">{idx + 1}</td>
                      <td className="py-2">{result.to || '-'}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(result)}`}>
                          {getStatusText(result)}
                        </span>
                      </td>
                      <td className="py-2">
                        <pre className="whitespace-pre-wrap max-w-xs text-xs">
                          {typeof getInfoText(result) === 'string' 
                            ? getInfoText(result) 
                            : JSON.stringify(getInfoText(result)).slice(0, 100)}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-black">
          <p>Configure your WhatsApp Cloud API credentials in <code>.env</code> on the server. This app does not store your data.</p>
        </div>
      </div>
    </div>
  );
};

export default BulkMessengerPage;
