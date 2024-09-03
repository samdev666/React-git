import {
  PagedEntity,
  getDefaultMetaData,
  getDefaultModalState,
} from './baseEntities';

describe('MetaData', () => {
  it('getDefaultMetaData should return the default MetaData', () => {
    const defaultMetaData = getDefaultMetaData();
    expect(defaultMetaData).toEqual({
      order: '',
      direction: 'asc',
      total: 0,
      page: 1,
      limit: 10,
      filters: {},
      allowedFilters: [],
    });
  });
});

describe('ModalActionProps', () => {
  it('getDefaultModalState should return the default ModalState', () => {
    const defaultModalState = getDefaultModalState();
    expect(defaultModalState).toEqual({
      show: false,
      title: '',
      body: '',
      className: '',
      resolveText: '',
      resolveMessage: '',
      rejectText: '',
      data: {},
      resolveDisabled: false,
      resolveWithPromise: undefined,
      rejectDisabled: false,
      rejectWithPromise: undefined,
      reject: expect.any(Function),
      resolve: expect.any(Function),
    });
  });

  it('resolve and reject should be called when using the resolved and rejected functions', async () => {
    const defaultModalState = getDefaultModalState();
    await expect(defaultModalState.reject()).rejects.not.toThrow();
    await expect(defaultModalState.resolve()).resolves.not.toThrow();
  });
});

describe('PagedEntity', () => {
  it('PagedEntity should have the correct shape', () => {
    const pagedEntity: PagedEntity<any> = {
      metadata: {
        order: 'propertyName',
        direction: 'asc',
        total: 10,
        page: 1,
        limit: 10,
        filters: {},
        allowedFilters: ['propertyName'],
      },
      records: [],
      requestDate: new Date(),
    };
    expect(pagedEntity).toEqual({
      metadata: {
        order: 'propertyName',
        direction: 'asc',
        total: 10,
        page: 1,
        limit: 10,
        filters: {},
        allowedFilters: ['propertyName'],
      },
      records: [],
      requestDate: expect.any(Date),
    });
  });
});

describe('Option', () => {
  it('Option should have the correct shape', () => {
    const option = {
      id: 1,
      label: 'Option 1',
    };
    expect(option).toEqual({
      id: 1,
      label: 'Option 1',
    });
  });
});
