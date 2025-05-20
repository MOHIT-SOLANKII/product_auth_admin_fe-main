/**
 * API service for batch operations
 */

interface APIBatchItem {
  id: number;
  batch_excel_path: string;
  qr_count: number;
  batch_excel: string;
  upload_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface APIBatchListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: APIBatchItem[];
}

export interface BatchData {
  id: string;
  name: string;
  status: 'Uploaded' | 'Pending';
  dateUploaded: string;
  completedDate: string;
  qrCount: number;
  excelUrl: string;
}

// Base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://stgproductauth.karmaalab.com';

// Auth token - in a real app, this should come from a secure authentication flow
const AUTH_TOKEN = import.meta.env.VITE_API_TOKEN || '';

export const batchService = {
  getAll: async (): Promise<BatchData[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/qr/batch-list`, {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch batches');
      }

      const data = await response.json() as APIBatchListResponse;
      return data.results.map((item) => {
        const fileName = item.batch_excel_path.split('/').pop() || 'Unknown';
        return {
          id: String(item.id),
          name: fileName,
          status: item.upload_completed ? 'Uploaded' : 'Pending',
          qrCount: item.qr_count,
          excelUrl: item.batch_excel,
          dateUploaded: new Date(item.created_at).toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          }),
          completedDate: item.upload_completed ? new Date(item.updated_at).toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          }) : '-'
        };
      });
    } catch (error) {
      console.error('Error fetching batches:', error);
      return [];
    }
  },

  searchBatches: async (query: string): Promise<BatchData[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/qr/batch-list?search=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to search batches');
      }
      const data = await response.json() as APIBatchListResponse;
      return data.results.map((item) => {
        const fileName = item.batch_excel_path.split('/').pop() || 'Unknown';
        return {
          id: String(item.id),
          name: fileName,
          status: item.upload_completed ? 'Uploaded' : 'Pending',
          qrCount: item.qr_count,
          excelUrl: item.batch_excel,
          dateUploaded: new Date(item.created_at).toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          }),
          completedDate: item.upload_completed ? new Date(item.updated_at).toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          }) : '-'
        };
      });
    } catch (error) {
      console.error('Error searching batches:', error);
      return [];
    }
  },

  uploadBatch: async (file: File): Promise<{ success: boolean; message: string; batch?: BatchData }> => {
    try {
      const formData = new FormData();
      formData.append('qr_code', file);
      const response = await fetch(`${API_BASE_URL}/api/qr/excel-upload-async`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to upload file');
      }
      const now = new Date();
      const formattedDate = now.toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
      return {
        success: true,
        message: 'File uploaded successfully. Processing will continue in the background.',
        batch: {
          id: String(Date.now()),
          name: file.name,
          status: 'Pending',
          qrCount: 0,
          excelUrl: '',
          dateUploaded: formattedDate,
          completedDate: formattedDate
        }
      };
    } catch (error) {
      console.error('Error uploading batch:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to upload file'
      };
    }
  }
};
