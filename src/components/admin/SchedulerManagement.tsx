'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Clock, Play, Square, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import api from '@/api/api';

interface SchedulerStatus {
  isRunning: boolean;
  activeJobs: string[];
  nextTransfer: string;
}

export default function SchedulerManagement() {
  const [status, setStatus] = useState<SchedulerStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunningTransfer, setIsRunningTransfer] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<SchedulerStatus>('/admin/scheduler/status');
      if (response.success && response.data) {
        setStatus(response.data);
      }
    } catch (error) {
      console.error('Error fetching scheduler status:', error);
      setMessage({ type: 'error', text: 'Failed to fetch scheduler status' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartScheduler = async () => {
    try {
      setIsLoading(true);
      const response = await api.post('/admin/scheduler/start');
      if (response.success) {
        setMessage({ type: 'success', text: 'Scheduler started successfully' });
        fetchStatus();
      }
    } catch (error) {
      console.error('Error starting scheduler:', error);
      setMessage({ type: 'error', text: 'Failed to start scheduler' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopScheduler = async () => {
    try {
      setIsLoading(true);
      const response = await api.post('/admin/scheduler/stop');
      if (response.success) {
        setMessage({ type: 'success', text: 'Scheduler stopped successfully' });
        fetchStatus();
      }
    } catch (error) {
      console.error('Error stopping scheduler:', error);
      setMessage({ type: 'error', text: 'Failed to stop scheduler' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunTransferNow = async () => {
    try {
      setIsRunningTransfer(true);
      const response = await api.post('/admin/scheduler/run-transfer');
      if (response.success) {
        setMessage({ type: 'success', text: 'Transfer completed successfully' });
        fetchStatus();
      }
    } catch (error) {
      console.error('Error running transfer:', error);
      setMessage({ type: 'error', text: 'Failed to run transfer' });
    } finally {
      setIsRunningTransfer(false);
    }
  };

  const formatNextTransfer = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Automated Payment Transfer Scheduler
          </CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <div className={`mb-4 p-3 rounded-lg flex items-center ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2" />
              )}
              {message.text}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : status ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Scheduler Status</h3>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      status.isRunning ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className={status.isRunning ? 'text-green-600' : 'text-red-600'}>
                      {status.isRunning ? 'Running' : 'Stopped'}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Next Transfer</h3>
                  <p className="text-gray-600">
                    {formatNextTransfer(status.nextTransfer)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Active Jobs</h3>
                <ul className="space-y-1">
                  {status.activeJobs.map((job, index) => (
                    <li key={index} className="text-blue-800 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {job}
                    </li>
                  ))}
                  {status.activeJobs.length === 0 && (
                    <li className="text-blue-800">No active jobs</li>
                  )}
                </ul>
              </div>

              <div className="flex flex-wrap gap-3">
                {status.isRunning ? (
                  <Button
                    onClick={handleStopScheduler}
                    disabled={isLoading}
                    variant="outline"
                    className="flex items-center"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop Scheduler
                  </Button>
                ) : (
                  <Button
                    onClick={handleStartScheduler}
                    disabled={isLoading}
                    className="flex items-center"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Scheduler
                  </Button>
                )}

                <Button
                  onClick={handleRunTransferNow}
                  disabled={isRunningTransfer}
                  variant="outline"
                  className="flex items-center"
                >
                  {isRunningTransfer ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Running Transfer...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Run Transfer Now
                    </>
                  )}
                </Button>

                <Button
                  onClick={fetchStatus}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  Refresh Status
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <AlertCircle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Failed to load scheduler status</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Automated Transfer Process</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>The scheduler runs daily at 2:00 AM (Swiss time)</li>
                <li>It finds all paid tickets for completed events</li>
                <li>Transfers 90% of ticket revenue to organizers (after 10% platform fee)</li>
                <li>Updates ticket transfer status to 'completed' or 'failed'</li>
                <li>Logs all transfer results for monitoring</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Event must be completed (end date passed)</li>
                <li>Ticket must be paid and not already transferred</li>
                <li>Organizer must have a connected Stripe account</li>
                <li>Platform must have sufficient funds for transfers</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Manual Controls</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Start/Stop scheduler as needed</li>
                <li>Run immediate transfers for testing</li>
                <li>Monitor transfer status and results</li>
                <li>View next scheduled transfer time</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 