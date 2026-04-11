import api from './api';

const analysisService = {
    getRecentSessions: async () => {
        return api.get('/analysis/history?limit=5');
    },

    getAllSessions: async () => {
        return api.get('/analysis/history');
    },

    getSessionDetails: async (id) => {
        return api.get(`/analysis/${id}`);
    },

    startAnalysis: async (url) => {
        return api.post('/analysis/start', { url });
    },

    generateAI: async (id) => {
        return api.post(`/analysis/${id}/ai`);
    },

    getDashboardStats: async () => {
        return api.get('/analysis/stats');
    }
};

export default analysisService;
