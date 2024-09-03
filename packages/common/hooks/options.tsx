import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { apiCall } from '../redux/actions';
import { MetaData, getDefaultMetaData } from '../models';
import { getPaginationParameters } from '../redux/sagas';

interface OptionsHook<T> {
  options: T[];
  refreshOptions: () => void;
  searchOptions: (value?: any, key?: string) => void;
}

/* eslint-disable import/prefer-default-export */
export const useOptions = <T,>(
  endpoint: string,
  searchable?: boolean,
  defaultFilter?: MetaData<T>
): OptionsHook<T> => {
  const reduxDispatch = useDispatch();
  const [options, setOptions] = useState<T[]>([]);

  const [refresh, setRefresh] = useState(false);
  const finalDefautFilter = defaultFilter ?? getDefaultMetaData();
  const [filter, setFilter] = useState<MetaData<T>>(finalDefautFilter);

  useEffect(() => {
    let finalEndpoint = `${endpoint}`;
    if (searchable) {
      finalEndpoint = `${endpoint}?${getPaginationParameters(filter)}`;
    }
    reduxDispatch(
      apiCall(
        finalEndpoint,
        (res) => {
          let options = res;
          if (searchable) {
            options = res?.records;
          }
          setOptions(options || []);
        },
        (err) => {
          console.log(err);
        }
      )
    ); // eslint-disable-line no-console
  }, [refresh]);

  const refreshOptions = () => {
    setFilter(finalDefautFilter);
    setRefresh((prevRefresh) => !prevRefresh);
  };

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

  const searchOptions = (value?: any, key: string = 'search') => {
    updateFilters({
      filters: {
        [key]: value,
      },
    });
    setRefresh((prevRefresh) => !prevRefresh);
  };

  return { options, refreshOptions, searchOptions };
};
