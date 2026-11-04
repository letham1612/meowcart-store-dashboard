
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { dashboardApi } from "../../../api/dashboard.api";

import type {
  ApiState,
  DashboardData,
} from "../../../types/dashboard.types";

export function useDashboard() {
  const [state, setState] = useState<
    ApiState<DashboardData>
  >({
    data: null,
    loading: true,
    error: null,
  });

  const controllerRef = useRef<AbortController | null>(
    null
  );

  const refresh = useCallback(async () => {
    // Cancel an older request before starting a new one.
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const data = await dashboardApi.getSummary(
        controller.signal
      );

      if (!controller.signal.aborted) {
        setState({
          data,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      if (controller.signal.aborted) return;

      setState({
        data: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load dashboard",
      });
    }
  }, []);

  useEffect(() => {
    void refresh();

    return () => {
      controllerRef.current?.abort();
    };
  }, [refresh]);

  return {
    ...state,
    refresh,
  };
}
