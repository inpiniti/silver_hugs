import React from 'react';
import Paper from "@mui/material/Paper";
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const url = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?' +
  'serviceKey=Js10J2bn%2B03d15sWQ6w2qep%2B3QWjnpJeOhm9N%2FzhRxVRngOLJsxVZ6ApZMHVFRlOj5zwGilQXZju8HVYTH0IXA%3D%3D&' +
  'pageNo=1&' +
  'numOfRows=1000&' +
  'dataType=XML&' +
  'base_date=20221215&' +
  'base_time=0500&' +
  'nx=35&' +
  'ny=129'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

function ParticipationInteractiveClasses() {
  return (
    <React.Fragment>
      <Paper elevation={3} style={{padding: '.5rem'}}>
        쌍방향 수업참여
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
      </Paper>
    </React.Fragment>
  );
};

export default ParticipationInteractiveClasses;
