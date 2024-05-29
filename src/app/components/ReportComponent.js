"use client";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TablePagination } from "@mui/material";
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { useSearchParams } from 'next/navigation';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { format, parseISO } from 'date-fns';
import Image from 'next/image'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useRouter } from 'next/navigation';

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function ReportComponent(props) {
  const [startdateUse, setStartDateUse] = useState('');
  const [enddateUse, setEndDateUse] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const uname = searchParams.get('uname');
  const pass = searchParams.get('pass');
  const [dialogContent, setDialogContent] = useState('');
  const [screeshotUrl, setScreeshotUrl] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const startdate = searchParams.get('startdate');
  const enddate = searchParams.get('enddate');
  const data = props.creds.reports.data || [];
  
  const filterDataByDate = (data, startdate, enddate) => {
    if (!startdate || !enddate) {
      return data;
    }
    const startDateObj = new Date(startdate.split('-').reverse().join('-'));
    const endDateObj = new Date(enddate.split('-').reverse().join('-'));
    endDateObj.setHours(23, 59, 59, 999); // Include the entire end date
  
    return data.filter((item) => {
      const createdAt = new Date(item.createdAt);
      return createdAt >= startDateObj && createdAt <= endDateObj;
    });
  };

  const filteredData = filterDataByDate(data, startdate, enddate);
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'orange';
      case 'inprogress':
        return 'blue';
      case 'completed':
        return 'green';
      case 'failed':
        return 'red';
      default:
        return 'grey';
    }
  };
  

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'N/A';
    }
    try {
      return format(parseISO(dateString), 'dd-MM-yyyy HH:mm:ss');
    } catch (error) {
      console.error('Invalid date format:', dateString);
      return 'Invalid Date';
    }
  };
  
  const formatDate2 = (dateString) => {
    if (!dateString) {
      return 'N/A';
    }
    try {
      return format(parseISO(dateString), 'dd-MM-yyyy');
    } catch (error) {
      console.error('Invalid date format:', dateString);
      return 'Invalid Date';
    }
  };

  const handleGoClick = () => {
    router.push(`/reports?uname=${uname}&pass=${pass}&startdate=${formatDate2(startdateUse)}&enddate=${formatDate2(enddateUse)}`);
  };

  const handleExcelDownload = () => {
    const excelData = filteredData.map(row => [
      row.number,
      row.username,
      row.tweet_data,
      row.tweet_hash,
      formatDate(row.createdAt),
      row.status
    ]);
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(excelBlob, 'report.xlsx');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleStatusInfoClick = (statusInfo,screenUrl) => {
    setScreeshotUrl(screenUrl);
    setDialogContent(statusInfo);
    setOpenDialog(true);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogContent('');
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth={'xl'} sx={{ position: 'relative', }}>
      {/* <Image src={`/screenshots/file.png`}  alt="Screenshot" width={400} height={400}/> */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ mr: 2 }}>
            <InputLabel htmlFor="startdate">Start Date</InputLabel>
            <input id="startdate" type="date" value={startdateUse} onChange={(e) => setStartDateUse(e.target.value)} />
          </Box>
          <Box sx={{ mr: 2 }}>
            <InputLabel htmlFor="enddate">End Date</InputLabel>
            <input id="enddate" type="date" value={enddateUse} onChange={(e) => setEndDateUse(e.target.value)} />
          </Box>
          <Button sx={{ color: 'white', background: 'linear-gradient(50deg, #21CBF3 30%, #2196F3 90%)',mr: 2 }} onClick={handleGoClick} variant="contained">Go</Button>
        </Box>
        <Box component="h2" sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}>
          {uname.toUpperCase()} Account Reports
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="contained" sx={{ color: 'white', background: 'linear-gradient(50deg, #21CBF3 30%, #2196F3 90%)', mr: 2 }} onClick={() => router.push(`/?uname=${uname}&pass=${pass}`)}>
            Goto campaign
          </Button>
          <Button variant="contained" sx={{ color: 'white', background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)' }} onClick={handleExcelDownload}>
            Download Excel
          </Button>
        </Box>
      </Box>
      <TableContainer sx={{ mt: 5, mb: 5 }} component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Number</strong></TableCell>
              <TableCell><strong>Tweet Data</strong></TableCell>
              <TableCell><strong>Hash(#)</strong></TableCell>
              <TableCell><strong>StartDate</strong></TableCell>
              <TableCell><strong>FinishDate</strong></TableCell>
              <TableCell><strong>StatusInfo</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">{row.number}</TableCell>
                  <TableCell>{row.tweet_data}</TableCell>
                  <TableCell>{row.tweet_hash}</TableCell>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                  <TableCell>{formatDate(row.updatedAt)}</TableCell>
                  <TableCell>
                    <Typography 
                      sx={{ 
                        color: getStatusColor(row.status), 
                        fontWeight: 'bold',
                        cursor: row.status.toLowerCase() === 'failed' ? 'pointer' : 'default'
                      }}
                      onClick={row.status.toLowerCase() === 'failed' ? () => handleStatusInfoClick(row.status_info,row.screenshot_path) : null}
                    >
                      {row.status_info}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: getStatusColor(row.status), color: 'white' }}
                    >
                      {row.status}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="h6" align="center">No data available</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogContent}</DialogTitle>
        <DialogContent>
          <Image src={`/screenshots/${screeshotUrl}`}  alt="Screenshot"  width={800} height={600} />
          {/* <img src={`/screenshots/${screeshotUrl}`}  /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
