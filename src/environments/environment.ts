// export const environment = {
//   apiBaseUrl: 'http://localhost:3000',
//   // apiBaseUrl: 'https://salad-todo-daily.onrender.com',
//   // apiBaseUrl: 'https://blushing-blue-long-underwear.cyclic.cloud',
//   production: false
// };
import { defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  // apiBaseUrl: 'http://localhost/',
  // apiBaseUrl: 'https://web.nguoidepsh.com/',
  apiBaseUrl: 'https://authoritysitemaster.com/',
  apiVersion: 'v2',
  // apiBaseUrl: 'https://salad-todo-daily.onrender.com',
  // apiBaseUrl: 'https://blushing-blue-long-underwear.cyclic.cloud',
  // apiBaseUrl: 'https://salad-task-api.fly.dev',
};
