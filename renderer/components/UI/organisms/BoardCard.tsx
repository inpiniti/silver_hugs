import React from 'react';
import Paper from "@mui/material/Paper";

import Text from '../molecules/Text'

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from "@mui/material/Box";

import { Icon } from '../../../type/Icon'

type BoardCard = {
  icon?: Icon,
  title?: string,
  rows?: any[],
  boxHeight?: number,
  columns?: GridColDef[],
}

function BoardCard({icon, title, rows, boxHeight = 371, columns = [
  {
    field: 'id',
    headerName: '번호',
    width: 50,
  },
  {
    field: '대상',
    headerName: '대상',
    editable: true,
    width: 100,
  },
  {
    field: '분야',
    headerName: '분야',
    editable: true,
    width: 100,
  },
  {
    field: '프로그램명',
    headerName: '프로그램명',
    editable: true,
    width: 300,
  },
  {
    field: '강사명',
    headerName: '강사명',
    width: 200,
  },
]}: BoardCard) {
  return (
    <React.Fragment>
      <Paper style={{padding: '1rem'}}>
        <Text icon={icon} value={title} />
        <Box sx={{ height: boxHeight, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={30}
            experimentalFeatures={{ newEditingApi: true }}
            disableColumnMenu
            hideFooter
          />
        </Box>
      </Paper>
    </React.Fragment>
  );
};

export default BoardCard;
