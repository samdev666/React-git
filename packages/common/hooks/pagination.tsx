import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import {
  MetaData,
  PagedEntity,
  PaginatedEntity,
  getDefaultMetaData,
} from '../models';
import { getPaginationParameters } from '../redux/sagas';
import { paginatedApiCall } from '../redux/actions';
import moment from 'moment';

interface PaginationData<T> {
  entity: PagedEntity<T>;
  filter: MetaData<T>;
  updateFilters(filter: Partial<MetaData<T>>): void;
  applyFilters(loadMore?: boolean): void;
  resetFilters(): void;
  loadMore(): void;
  fetchPage(page?: number): void;
  updateLimit(limit?: number): void;
  connectFilter: (
    name: string,
    extraProps?: Record<any, any>
  ) => (Filter: any) => any;
  getParamsUrl(): string;
}
export const usePagination = <T,>(
  paginatedEntity: PaginatedEntity,
  defaultFilter?: MetaData<T>
): PaginationData<T> => {
  const reduxDispatch = useDispatch();
  const entity: PagedEntity<T> = useSelector(
    (state: any) => state?.[paginatedEntity.key]
  ) ?? {
    metadata: {
      total: 0,
      page: 0,
      limit: 0,
      filters: {},
      allowedFilters: [],
    },
    records: [],
  };
  const {
    total = 0,
    page = 0,
    limit = 0,
    allowedFilters = [],
  } = entity?.metadata || {};
  const finalDefautFilter = defaultFilter ?? getDefaultMetaData();
  const [filter, setFilter] = useState<MetaData<T>>(finalDefautFilter);
  const [refreshEntity, setRefreshEntity] = useState({
    refresh: false,
    loadMore: false,
  });
  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      total,
      page,
      limit,
      allowedFilters: [...allowedFilters],
    }));
  }, [total, page, limit, allowedFilters]);
  useEffect(() => {
    reduxDispatch(
      paginatedApiCall(
        paginatedEntity.name,
        paginatedEntity.api,
        { ...filter },
        refreshEntity.loadMore
      )
    );
  }, [refreshEntity.refresh]);
  const updateFilters = (partialFilter: Partial<MetaData<T>>): void => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      ...partialFilter,
      page: finalDefautFilter.page,
      allowedFilters: [
        ...prevFilter.allowedFilters,
        ...(partialFilter?.allowedFilters ?? []),
      ],
      filters: {
        ...prevFilter.filters,
        ...(partialFilter?.filters ?? {}),
      },
    }));
  };
  const applyFilters = (loadMore = false) => {
    setRefreshEntity((prevRefresh) => ({
      ...prevRefresh,
      loadMore,
      refresh: !prevRefresh.refresh,
    }));
  };
  const debouncedApplyFilter = useCallback(debounce(applyFilters, 300), []);
  const resetFilters = () => {
    setFilter(finalDefautFilter);
    applyFilters();
  };
  const loadMore = () => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      page: prevFilter.page + 1,
    }));
    applyFilters(true);
  };
  const fetchPage = (page?: number) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      page: page || 1,
    }));
    applyFilters();
  };
  const updateLimit = (limit?: number) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      limit: limit || defaultFilter?.limit,
      page: 1,
    }));
    applyFilters();
  };

  const connectFilter =
    (
      name: string,
      {
        autoApplyFilters,
        useDebounce,
        formatValue,
        multipleFilter,
        filterKeys,
        valueKeys,
        formatFilterValue,
        formatMultipleFilterValue,
        ...extraProps
      }: Record<any, any> = {}
    ) =>
    (Filter: any) =>
      (
        <Filter
          {...extraProps}
          key={name}
          value={(() => {
            if (multipleFilter) {
              const resultingObject = valueKeys.reduce(
                (acc: any, valueKey: any, index: number) => {
                  const filterKey = filterKeys[index];
                  acc[valueKey] = formatValue
                    ? formatValue(filter.filters[filterKey])
                    : filter.filters[filterKey];
                  return acc;
                },
                {}
              );
              return resultingObject;
            }
            return formatValue
              ? formatValue(filter?.filters?.[name])
              : filter?.filters?.[name];
          })()}
          onChange={(value: any) => {
            const updatedFilters: { [key: string]: string } = {};
            if (multipleFilter) {
              const filteredValues = formatMultipleFilterValue(value);
              filterKeys.forEach((filterKey: any, index: number) => {
                updatedFilters[filterKey] = value[Object.keys(value)[index]]
                  ? filteredValues[index]
                  : null;
              });
            } else {
              updatedFilters[name] = formatFilterValue
                ? formatFilterValue(value)
                : value;
            }
            updateFilters({ filters: updatedFilters });
            if (autoApplyFilters) {
              if (useDebounce) {
                debouncedApplyFilter();
              } else {
                applyFilters();
              }
            }
          }}
        />
      );

  const getParamsUrl = (): string => getPaginationParameters(filter);
  return {
    entity,
    filter,
    updateFilters,
    applyFilters,
    resetFilters,
    loadMore,
    fetchPage,
    updateLimit,
    connectFilter,
    getParamsUrl,
  };
};
export default usePagination;
