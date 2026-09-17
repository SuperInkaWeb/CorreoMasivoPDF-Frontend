const fs = require('fs');
const targetPath = './src/environments/environment.ts';

const content = `export const environment = {
  production: true,
  apiUrl: '${process.env.API_URL}',
  auth0: {
    domain: '${process.env.AUTH0_DOMAIN}',
    clientId: '${process.env.AUTH0_CLIENT_ID}',
    audience: '${process.env.AUTH0_AUDIENCE}'
  },
  allowedList: ['${process.env.API_URL}/*']
};
`;

fs.writeFileSync(targetPath, content);
console.log('environment.ts creado con variables de Vercel');