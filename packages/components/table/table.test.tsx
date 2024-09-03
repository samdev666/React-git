import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Table, { formatDate } from '.';

describe('Table Component', () => {
  it('matches snapshot when given props', () => {
    const specs = [
      { id: 'name', label: 'Name' },
      { id: 'age', label: 'Age' },
    ];

    const data = [
      { id: 1, name: 'John Doe', age: 25 },
      { id: 2, name: 'Jane Doe', age: 30 },
    ];

    const metadata = {
      page: 1,
      limit: 10,
      total: 20,
      order: 'name',
      direction: 'asc',
      filters: {},
      allowedFilters: {},
    };

    const { asFragment } = render(
      <Table
        specs={specs}
        data={data}
        metadata={metadata}
        emptyMessage="No data available."
        disableSorting={['age']}
        actionLabel="Actions"
        updateFilters={() => {}}
        getId={(row) => row.id}
        fetchPage={() => {}}
        updateLimit={() => {}}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('formatDate Function', () => {
  it('formats date strings correctly', () => {
    const formattedDate = formatDate('2023-04-01');
    expect(formattedDate).toEqual('01 Apr 2023');

    const invalidFormattedDate = formatDate('invalid-date');
    expect(invalidFormattedDate).toEqual('Invalid date');

    const nullFormattedDate = formatDate(null);
    expect(nullFormattedDate).toEqual('');

    const undefinedFormattedDate = formatDate(undefined);
    expect(undefinedFormattedDate).toEqual('');

    const emptyStringFormattedDate = formatDate('');
    expect(emptyStringFormattedDate).toEqual('');
  });
});
