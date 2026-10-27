import { useEffect, useMemo, useState } from "react";
import { subscribeEquipments } from "../services/equipments";

export function useEquipments() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const unsub = subscribeEquipments(
      (list) => {
        setItems(list);
        setLoading(false);
        setError(null);
        setLastUpdate(new Date());
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const bySituation = useMemo(() => {
    const map = {};
    for (const item of items) (map[item.situation] ||= []).push(item);
    return map;
  }, [items]);

  return { items, bySituation, loading, error, lastUpdate };
}

export function useClock(intervalMs = 1000) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
