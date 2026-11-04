
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { dashboardApi } from "../../../api/dashboard.api";

import type { ApiState } from "../../../types/dashboard.types";
import type { LowStockData } from "../../../types/product.types";

export function useLowStock() {
  const [state, setState] = useState<
    ApiState<LowStockData>
  >({
    data: null,
    loading: true,
    error: null,
  });

  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  // Cursor used to fetch each visited page.
  const [cursorHistory, setCursorHistory] = useState<
    (string | null)[]
  >([null]);

  const controllerRef = useRef<AbortController | null>(
    null
  );

  const currentCursor = cursorHistory[pageIndex] ?? null;

  const refresh = useCallback(async () => {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setState((previous) => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const data = await dashboardApi.getLowStock(
        currentCursor,
        pageSize,
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
            : "Failed to load products",
      });
    }
  }, [currentCursor, pageSize]);

  useEffect(() => {
    void refresh();

    return () => {
      controllerRef.current?.abort();
    };
  }, [refresh]);

  function nextPage() {
    if (
      state.loading ||
      !state.data?.pageInfo.hasNextPage ||
      !state.data.pageInfo.endCursor
    ) {
      return;
    }

    const nextCursor = state.data.pageInfo.endCursor;
    const nextIndex = pageIndex + 1;

    setCursorHistory((previous) => [
      ...previous.slice(0, nextIndex),
      nextCursor,
    ]);

    setPageIndex(nextIndex);
  }

  function previousPage() {
    if (state.loading || pageIndex === 0) {
      return;
    }

    setPageIndex((previous) => previous - 1);
  }

  function changePageSize(size: number) {
    if (!Number.isInteger(size) || size < 1) {
      return;
    }

    setState((previous) => ({
      ...previous,
      data: null,
      loading: true,
      error: null,
    }));

    setCursorHistory([null]);
    setPageIndex(0);
    setPageSize(size);
  }

  return {
    ...state,
    page: pageIndex + 1,
    pageSize,
    hasPrevious: pageIndex > 0,
    refresh,
    nextPage,
    previousPage,
    changePageSize,
  };
}
