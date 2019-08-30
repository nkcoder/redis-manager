import axiosClient from './AxiosService'

class RedisService {

  // /info
  info = () => {
    return axiosClient.get('/info');
  }

  // /clients
  clients = () => {
    return axiosClient.get('/clients');
  }

  killClient = clientId => {
    return axiosClient.delete(`/clients/${clientId}`)
  }

  // /keys
  allKeys = cursor => {
    return axiosClient.get('/database/keys', { params: { cursor: cursor } });
  }

  searchKey = (key, cursor) => {
    return axiosClient.get('/database/search', { params: { key: key, cursor: cursor } });
  }

  getValue = (key, cursor) => {
    return axiosClient.get(`/database/value`, { params: { key: key, cursor: cursor } });
  }

  getType = key => {
    return axiosClient.get('/database/type', { params: { key: key } });
  }

  expireKey = (key, seconds) => {
    return axiosClient.put('/database/expire', { key: key, seconds: seconds })
  }

  deleteKeys = keys => {
    return axiosClient.delete("/database/delete", { params: { keys: keys } });
  }

  ttlOfKey = key => {
    return axiosClient.get('/database/ttl', { params: { key: key } });
  }

  switchDataBase = index => {
    return axiosClient.put('/database/switch-db', { index: index });
  }

}

export default new RedisService();