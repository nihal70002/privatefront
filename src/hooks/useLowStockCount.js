import { useEffect, useState } from "react";
import api from "../api/axios";

export default function useLowStockCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await api.get("/warehouse/inventory/low-stock/count");
        setCount(Number(res.data.count) || 0);
      } catch (err) {
        setCount(0);
      }
    };

    fetchCount();
  }, []);

  return count;
}
