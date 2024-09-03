import React from 'react';
import {
  Card, Table,
} from '@wizehub/components';
import { StyledVisibilityIcon } from '@wizehub/components/table/styles';

interface Props {

}

const EndingSoon: React.FC<Props> = () => (
  <Card
    cardCss={{ margin: '20px' }}
    noHeaderPadding
  >
    <Table
      specs={[
        {
          id: 'sno',
          label: 'S.No',
        },
        {
          id: 'tenantName',
          label: 'Tenant name',
        },
        {
          id: 'dateExpiring',
          label: 'Date expiring on',
        },
        {
          id: 'ending',
          label: 'Ending in',
        },
      ]}
      data={[
        {
          sno: '01',
          tenantName: 'Tenant 1',
          dateExpiring: '18 Apr 2024',
          ending: '5 days',
        },
        {
          sno: '02',
          tenantName: 'Tenant 2',
          dateExpiring: '18 Apr 2024',
          ending: '5 days',
        },
        {
          sno: '03',
          tenantName: 'Tenant 3',
          dateExpiring: '18 Apr 2024',
          ending: '5 days',
        },
        {
          sno: '03',
          tenantName: 'Tenant 4',
          dateExpiring: '18 Apr 2024',
          ending: '5 days',
        },
      ]}
      metadata={{
        order: '',
        direction: 'asc',
        total: 0,
        page: 1,
        limit: 10,
        filters: {},
        allowedFilters: [],
      }}
      actions={[
        {
          id: 'view',
          component: <StyledVisibilityIcon />,
          onClick: () => { },
        },
      ]}
    />
  </Card>
);

export default EndingSoon;
