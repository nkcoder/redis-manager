import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 6000
});

axiosClient.interceptors.request.use(function (request) {
  console.log('request, url: %s, params: %s, body: %s', request.url, JSON.stringify(request.params, request.body));
  return request;
});

axiosClient.interceptors.response.use(function (response) {
  console.log('response: ', response.status, response.data);
  return response;
})

export default axiosClient;