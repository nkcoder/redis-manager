import axiosClient from './AxiosService'

class RedisService {

  info() {
    return axiosClient.get('/info');
  }

  clients() {
    return axiosClient.get('/clients');
  }

}

export default new RedisService();