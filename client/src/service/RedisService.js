import axiosClient from './AxiosService'

class RedisService {

  info = () => {
    return axiosClient.get('/info');
  }

  clients = () => {
    return axiosClient.get('/clients');
  }

  allKeys = (cursor) => {
    return axiosClient.get('/database/keys', { params: { cursor: cursor } });
  }

  searchKey = (key, cursor) => {
    return axiosClient.get('/database/search', { params: { key: key, cursor: cursor } });
  }

  fetchValue = (key, cursor) => {
    return axiosClient.get('/database/value', { params: { key: key, cursor: cursor } });
  }

  fetchType = (key) => {
    return axiosClient.get('/database/type', { params: { key: key } });
  }

}

export default new RedisService();