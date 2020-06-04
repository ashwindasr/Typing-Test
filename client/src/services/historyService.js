import axios from 'axios';

export default {
  post_my_score: async (params) => {
    let res = await axios.post('/api/history', params);
    return res.data.error;
  },
  get_percentile: async (params) => {
    let res = await axios.get('/api/history/all', params);
    return res.data;
  }
}