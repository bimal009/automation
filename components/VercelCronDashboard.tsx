'use client';
import { useState } from 'react';

export default function VercelCronDashboard() {
    const [loading, setLoading] = useState(false);
    const [lastResult, setLastResult] = useState<any>(null);

    const testGeneration = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/test-generation');
            const data = await response.json();
            setLastResult(data);
        } catch (error) {
            setLastResult({ success: false, error: 'Failed to test generation' });
        }
        setLoading(false);
    };

    const manualTweet = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/manual-tweet', { method: 'POST' });
            const data = await response.json();
            setLastResult(data);
        } catch (error) {
            setLastResult({ success: false, error: 'Failed to post tweet' });
        }
        setLoading(false);
    };

    const triggerCron = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/cron/auto-tweet');
            const data = await response.json();
            setLastResult(data);
        } catch (error) {
            setLastResult({ success: false, error: 'Failed to trigger cron' });
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Vercel Auto Tweet Dashboard</h2>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Cron Schedule</h3>
                <p className="text-blue-700">
                    Tweets automatically every day at 12:00 PM UTC<br />
                    <span className="text-sm">Configure in vercel.json: "0 12 * * *"</span>
                </p>
            </div>

            <div className="space-y-3 mb-6">
                <button
                    onClick={testGeneration}
                    disabled={loading}
                    className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 disabled:opacity-50"
                >
                    {loading ? 'Testing...' : '🧪 Test Content Generation'}
                </button>

                <button
                    onClick={manualTweet}
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Posting...' : '📤 Post Tweet Now'}
                </button>

                <button
                    onClick={triggerCron}
                    disabled={loading}
                    className="w-full bg-purple-500 text-white p-3 rounded hover:bg-purple-600 disabled:opacity-50"
                >
                    {loading ? 'Triggering...' : '⚡ Trigger Cron Manually'}
                </button>
            </div>

            {lastResult && (
                <div className={`p-4 rounded-lg ${lastResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <h3 className={`font-semibold mb-2 ${lastResult.success ? 'text-green-800' : 'text-red-800'}`}>
                        Last Result
                    </h3>
                    <pre className="text-sm overflow-x-auto">
                        {JSON.stringify(lastResult, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}