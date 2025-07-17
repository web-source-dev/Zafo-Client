'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Clock, Play, Square, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import api from '@/api/api';
import { useLanguage } from '@/i18n/language-context';

interface SchedulerStatus {
  isRunning: boolean;
  activeJobs: string[];
  nextTransfer: string;
}

export default function SchedulerManagement() {
  const { t } = useLanguage();
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
      setMessage({ type: 'error', text: t('admin.failedToFetchSchedulerStatus') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartScheduler = async () => {
    try {
      setIsLoading(true);
      const response = await api.post('/admin/scheduler/start');
      if (response.success) {
        setMessage({ type: 'success', text: t('admin.schedulerStarted') });
        fetchStatus();
      }
    } catch (error) {
      console.error('Error starting scheduler:', error);
      setMessage({ type: 'error', text: t('admin.failedToStartScheduler') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopScheduler = async () => {
    try {
      setIsLoading(true);
      const response = await api.post('/admin/scheduler/stop');
      if (response.success) {
        setMessage({ type: 'success', text: t('admin.schedulerStoppedSuccess') });
        fetchStatus();
      }
    } catch (error) {
      console.error('Error stopping scheduler:', error);
      setMessage({ type: 'error', text: t('admin.failedToStopScheduler') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunTransferNow = async () => {
    try {
      setIsRunningTransfer(true);
      const response = await api.post('/admin/scheduler/run-transfer');
      if (response.success) {
        setMessage({ type: 'success', text: t('admin.transferCompleted') });
        fetchStatus();
      }
    } catch (error) {
      console.error('Error running transfer:', error);
      setMessage({ type: 'error', text: t('admin.failedToRunTransfer') });
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
          {t('admin.scheduler')}
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
              <p className="mt-2 text-gray-600">{t('admin.loading')}</p>
            </div>
          ) : status ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{t('admin.schedulerStatus')}</h3>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      status.isRunning ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className={status.isRunning ? 'text-green-600' : 'text-red-600'}>
                      {status.isRunning ? t('admin.schedulerRunning') : t('admin.schedulerStopped')}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{t('admin.nextTransfer')}</h3>
                  <p className="text-gray-600">
                    {formatNextTransfer(status.nextTransfer)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">{t('admin.activeJobs')}</h3>
                <ul className="space-y-1">
                  {status.activeJobs.map((job, index) => (
                    <li key={index} className="text-blue-800 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {job}
                    </li>
                  ))}
                  {status.activeJobs.length === 0 && (
                    <li className="text-blue-800">{t('admin.noActiveJobs')}</li>
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
                    {t('admin.stopScheduler')}
                  </Button>
                ) : (
                  <Button
                    onClick={handleStartScheduler}
                    disabled={isLoading}
                    className="flex items-center"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {t('admin.startScheduler')}
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
                      {t('admin.runningTransfer')}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t('admin.runTransferNow')}
                    </>
                  )}
                </Button>

                <Button
                  onClick={fetchStatus}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  {t('admin.refreshStatus')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <AlertCircle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">{t('admin.failedToLoadSchedulerStatus')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.schedulerHowItWorks')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('admin.schedulerAutomatedTransferProcess')}</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>{t('admin.schedulerRunsDaily')}</li>
                <li>{t('admin.schedulerFindsPaidTickets')}</li>
                <li>{t('admin.schedulerTransfersRevenue')}</li>
                <li>{t('admin.schedulerUpdatesStatus')}</li>
                <li>{t('admin.schedulerLogsResults')}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('admin.schedulerRequirements')}</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>{t('admin.eventMustBeCompleted')}</li>
                <li>{t('admin.ticketMustBePaid')}</li>
                <li>{t('admin.organizerMustHaveStripe')}</li>
                <li>{t('admin.platformMustHaveFunds')}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('admin.schedulerManualControls')}</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>{t('admin.startStopScheduler')}</li>
                <li>{t('admin.runImmediateTransfers')}</li>
                <li>{t('admin.monitorTransferStatus')}</li>
                <li>{t('admin.viewNextTransferTime')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 