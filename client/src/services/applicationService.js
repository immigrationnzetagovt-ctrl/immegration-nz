import api from './api';

export const applicationService = {
  // Submit new application
  async createApplication(data) {
    const response = await api.post('/applications', data);
    return response.data;
  },

  // Get active user's application
  async getMyApplication() {
    const response = await api.get('/applications/my-application');
    return response.data;
  },

  // Get specific application by ID
  async getApplicationById(id) {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Download generated PDF document
  async downloadPdf(id = 'current') {
    const response = await api.get(`/applications/${id}/pdf`, {
      responseType: 'blob',
    });

    // Extract filename from Content-Disposition header if available
    let filename = `VisaPath_Demo_Application_${id}.pdf`;
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.indexOf('filename=') !== -1) {
      const match = disposition.match(/filename="?([^";]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    // Create a local object URL to trigger immediate download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return true;
  },
};
