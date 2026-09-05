import { createConsola } from "consola";

const isDev = process.env.NODE_ENV === "development";

// Khởi tạo thư viện Consola
// Ở môi trường production, ta set level = 0 (chỉ hiện Error, Fatal). 
// Ở development, set level = 3 (hiện Info, Warn, Success, Error).
export const logger = createConsola({
  level: isDev ? 3 : 0,
  formatOptions: {
    colors: true,
    date: isDev,
  },
});
