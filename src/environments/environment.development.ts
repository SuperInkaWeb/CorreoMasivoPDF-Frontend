export const environment = {

  production: false,
  apiUrl: 'http://localhost:8000/api',
  auth0: {
    domain: 'dev-sz4fx5wrtcwh5kdb.us.auth0.com',
    clientId: 'tmvnEHQdUbwLaDvagPdNNqiAvJyTwJp',
    audience: 'https://automatizador-sunat.com/api'
  },
  allowedList: ['http://localhost:8000/*', 'http://127.0.0.1:8000/*','https://mpbackendautomatizadorcorreo.onrender.com/*']
};
