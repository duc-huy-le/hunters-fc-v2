// export const environment = {
//   apiBaseUrl: 'http://localhost:3000',
//   // apiBaseUrl: 'https://salad-todo-daily.onrender.com',
//   // apiBaseUrl: 'https://blushing-blue-long-underwear.cyclic.cloud',
//   production: false
// };
import { defaultEnvironment } from './environment.default';

export const environment = {
  ...defaultEnvironment,
  production: true,
  apiBaseUrl: 'https://authoritysitemaster.com',
  // apiBaseUrl: 'https://blushing-blue-long-underwear.cyclic.cloud',
  // apiBaseUrl: 'https://salad-task-api.fly.dev',
};
