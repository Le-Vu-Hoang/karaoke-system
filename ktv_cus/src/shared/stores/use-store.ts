import { useState, useEffect } from 'react';

/**
 * Custom hook giúp tránh lỗi Hydration Mismatch trong Next.js khi sử dụng Zustand với persist.
 * Hook này trì hoãn việc trả về state thực tế cho đến khi component đã được mount ở client-side.
 *
 * @param store Hook Zustand của bạn
 * @param selector Hàm selector để lấy một phần state (ví dụ: (state) => state.items)
 * @returns Trả về giá trị của selector hoặc undefined trong quá trình SSR/Hydration
 */
export function useStore<T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  selector: (state: T) => F
): F | undefined {
  const result = store(selector) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
}
