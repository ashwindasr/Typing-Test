import axios from 'axios';

export default {
  get_string: async () => {
    let res = await axios.get('/api/get_string');
    return res.data.text || [];
  }
}