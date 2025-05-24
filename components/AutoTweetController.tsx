'use client';
import { useState, useEffect } from 'react';

interface AutoTweetStatus {
    running: boolean;
    nextRun?: string;
}

export default function AutoTweetController() {
    const [status, setStatus] = useState<AutoTweetStatus>({ running: false });
    const [loading, setLoading] = useState(false);
    const [scheduleTime, setScheduleTime] = useState('0 11 * * *');
    const [timezone, setTimezone] = useState('UTC');

    const fetchStatus = async () => {
        try {
            const response = await fetch('/api/auto-tweet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'status' })
            });
            const data = await response.json();
            setStatus(data);
        } catch (error) {
            console.error('Failed to fetch status:', error);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleStart = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/auto-tweet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'start',
                    config: {
                        enabled: true,
                        scheduleTime,
                        timezone
                    }
                })
            });

            if (response.ok) {
                await fetchStatus();
                alert('Auto-tweet started successfully!');
            } else {
                const error = await response.json();
                alert(`Failed to start: ${error.error}`);
            }
        } catch (error) {
            alert('Failed to start auto-tweet');
        }
        setLoading(false);
    };

    const handleStop = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/auto-tweet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'stop' })
            });

            if (response.ok) {
                await fetchStatus();
                alert('Auto-tweet stopped successfully!');
            }
        } catch (error) {
            alert('Failed to stop auto-tweet');
        }
        setLoading(false);
    };

    const handleTweetNow = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/auto-tweet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'tweet-now' })
            });

            if (response.ok) {
                alert('Tweet posted successfully!');
            } else {
                const error = await response.json();
                alert(`Failed to tweet: ${error.error}`);
            }
        } catch (error) {
            alert('Failed to post tweet');
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Auto Tweet Controller</h2>

            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    Status: <span className={status.running ? 'text-green-600' : 'text-red-600'}>
                        {status.running ? 'Running' : 'Stopped'}
                    </span>
                </p>
                {status.nextRun && (
                    <p className="text-sm text-gray-600">
                        Next run: {new Date(status.nextRun).toLocaleString()}
                    </p>
                )}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                    Schedule (Cron format):
                </label>
                <input
                    type="text"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="0 12 * * *"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Default: 0 12 * * * (12:00 PM daily)
                </p>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                    Timezone:
                </label>
                <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                </select>
            </div>

            <div className="space-y-2">
                {!status.running ? (
                    <button
                        onClick={handleStart}
                        disabled={loading}
                        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        {loading ? 'Starting...' : 'Start Auto Tweet'}
                    </button>
                ) : (
                    <button
                        onClick={handleStop}
                        disabled={loading}
                        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-50"
                    >
                        {loading ? 'Stopping...' : 'Stop Auto Tweet'}
                    </button>
                )}

                <button
                    onClick={handleTweetNow}
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Tweeting...' : 'Tweet Now'}
                </button>
            </div>
        </div>
    );
}