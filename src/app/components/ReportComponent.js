"use client";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, Input, InputLabel, MenuItem, Select, TablePagination, Tooltip } from "@mui/material";
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
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
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
  const initialRefreshInterval = parseInt(localStorage.getItem('refreshInterval')) || 30;
  const [refreshInterval, setRefreshInterval] = useState(initialRefreshInterval);
  const [startdateUse, setStartDateUse] = useState('');
  const [enddateUse, setEndDateUse] = useState('');
  const [numberFilter, setNumberFilter] = useState('None');
  const [hashtagFilter, setHashtagFilter] = useState('None');
  const [statusFilter, setStatusFilter] = useState('None');
  const [tweetDataFilter, setTweetDataFilter] = useState('None');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const uname = searchParams.get('uname');
  const pass = searchParams.get('pass');
  const [dialogContent, setDialogContent] = useState('');
  const [screeshotUrl, setScreeshotUrl] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const data = props.creds.reports.data || [];
  
  const filterDataByDate = (data, startdate, enddate, numberFilter, hashtagFilter, statusFilter,tweetDataFilter) => {
    let filteredData = data;
    /* if (!startdate || !enddate) {
        return data;
    } */
    if (startdate && enddate) {
      const startDateObj = new Date(startdate);
      const endDateObj = new Date(enddate);
      endDateObj.setHours(23, 59, 59, 999); // Include the entire end date
  
      filteredData = filteredData.filter((item) => {
        const createdAt = new Date(item.createdAt);
        return createdAt >= startDateObj && createdAt <= endDateObj;
      });
    }

    if (numberFilter && numberFilter !== 'None') {
      filteredData = filteredData.filter(item => item.number.includes(numberFilter));
    }

    if (hashtagFilter && hashtagFilter !== 'None') {
      filteredData = filteredData.filter(item => item.tweet_hash && item.tweet_hash.includes(hashtagFilter));
    }
    //tweetDataFilter
    if (statusFilter && statusFilter !== 'None') {
      filteredData = filteredData.filter(item => item.status.toLowerCase() === statusFilter.toLowerCase());
    }
    if (tweetDataFilter && tweetDataFilter !== 'None') {
      filteredData = filteredData.filter(item => item.tweet_data && item.tweet_data.includes(tweetDataFilter));
    }

    return filteredData;
  };

  const filteredData = filterDataByDate(data, startdateUse, enddateUse, numberFilter, hashtagFilter, statusFilter,tweetDataFilter);
    
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
  const handleAutoRefresh = () => {
    window.location.reload();
    //router.push(`/reports?uname=${uname}&pass=${pass}&startdate=${startdate}&enddate=${enddate}`);
  };
  React.useEffect(() => {
    const intervalId = setInterval(handleAutoRefresh, refreshInterval * 1000); // Convert seconds to milliseconds
    return () => clearInterval(intervalId); // Cleanup function to clear the interval on component unmount
  }, [refreshInterval]); // Trigger the effect whenever the refreshInterval changes

  const handleIntervalChange = (e) => {
    setRefreshInterval(e.target.value);
    localStorage.setItem('refreshInterval', e.target.value); // Store the refresh interval in localStorage
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth={'xl'} sx={{ position: 'relative', }}>
      {/* <Image src={`/screenshots/file.png`}  alt="Screenshot" width={400} height={400}/> */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ mr: 2 }}>
            <InputLabel htmlFor="startdate">Start Date</InputLabel>
            <input id="startdate" type="date" value={startdateUse} onChange={(e) => setStartDateUse(e.target.value)} />
          </Box>
          <Box sx={{ mr: 2 }}>
            <InputLabel htmlFor="enddate">End Date</InputLabel>
            <input id="enddate" type="date" value={enddateUse} onChange={(e) => setEndDateUse(e.target.value)} />
          </Box>
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

      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{ mr: 2 }}>
          <InputLabel htmlFor="startdate">Start Date</InputLabel>
          <input id="startdate" type="date" value={startdateUse} onChange={(e) => setStartDateUse(e.target.value)} />
        </Box>
        <Box sx={{ mr: 2 }}>
          <InputLabel htmlFor="enddate">End Date</InputLabel>
          <input id="enddate" type="date" value={enddateUse} onChange={(e) => setEndDateUse(e.target.value)} />
        </Box>
        <Box sx={{ mr: 2 }}>
          <InputLabel htmlFor="number-filter">Number</InputLabel>
          <Select
            id="number-filter"
            value={numberFilter}
            onChange={(e) => setNumberFilter(e.target.value)}
            sx={{ minWidth: 80 }}
          >
            <MenuItem value="None"><em>None</em></MenuItem>
            {[...new Set(data.map(item => item.number))].map((number, index) => (
              <MenuItem key={index} value={number}>{number}</MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={{ mr: 2 }}>
          <InputLabel htmlFor="hashtag-filter">Hashtag</InputLabel>
          <Select
            id="hashtag-filter"
            value={hashtagFilter}
            onChange={(e) => setHashtagFilter(e.target.value)}
            sx={{ minWidth: 80 }}
          >
            <MenuItem value="None"><em>None</em></MenuItem>
            {[...new Set(data.map(item => item.tweet_hash))].map((hash, index) => (
              <MenuItem key={index} value={hash}>{hash}</MenuItem>
            ))}
          </Select>
        </Box>
        <Box>
          <InputLabel htmlFor="status-filter">Status</InputLabel>
          <Select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 80 }}
          >
            <MenuItem value="None"><em>None</em></MenuItem>
            {['Pending', 'InProgress', 'Completed', 'Failed'].map((status, index) => (
              <MenuItem key={index} value={status.toLowerCase()}>{status}</MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding:'0',
          margin:'0' // Ensures the Box takes full viewport height to center vertically
        }}
      >
        <InputLabel htmlFor="textinput" sx={{ color: '#000', marginRight: 1 }}><b>Autorefresh In -</b></InputLabel>
        <input 
          id="textinput" 
          type="number" 
          value={refreshInterval}
          style={{ height: '35px',lineHeight: '35px',width:'80px', padding: '0px',textAlign: 'center', }}
          onChange={handleIntervalChange} 
        /> 
      </Box> */}




    <Box sx={{ p: 3, background: 'linear-gradient(50deg, #21CBF3 30%, #2196F3 90%)',height: '230px' }}>
      
        <Button  onClick={() => window.location.href = `/?uname=${uname}&pass=${pass}`} sx={{  position: 'absolute', top: '12px', left: '45px',  color: 'white',  background: '#3371FF',  }}>
          <Typography variant="button" sx={{ marginLeft: '2px' }}>Goto Campaign</Typography>
        </Button>
        <Box component="h2" sx={{ fontSize: '2rem', fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', mb: 3 }}>
          {uname.toUpperCase()} Account Reports
        </Box>{/*  //setTweetDataFilter */}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ position: 'absolute', top: '160px', left: '45px',  }}>
            <InputLabel htmlFor="startdate" sx={{color:"#000"}}><b>Start Date</b></InputLabel>
            <Input id="startdate" sx={{pl:1,pr:1,height:40, minWidth: 100, backgroundColor: '#FFBE33' }} type="date" value={startdateUse} onChange={(e) => setStartDateUse(e.target.value)} />
          </Box>
          <Box sx={{ position: 'absolute', top: '160px', left: '210px', }}>
            <InputLabel htmlFor="enddate" sx={{color:"#000"}}><b>End Date</b></InputLabel>
            <Input id="enddate" type="date"  sx={{height:40, pl:1,pr:1,minWidth: 100, backgroundColor: '#FFBE33' }} value={enddateUse} onChange={(e) => setEndDateUse(e.target.value)} />
          </Box>
          
          <Box sx={{ position: 'absolute', top: '160px', right: '220px',}}>
            <InputLabel htmlFor="hashtag-filter" sx={{color:"#000"}}><b>Tweet Data</b></InputLabel>
            <Select
              id="hashtag-filter"
              value={tweetDataFilter}
              onChange={(e) => setTweetDataFilter(e.target.value)}
              sx={{ width: 160,height:40, backgroundColor: '#FFC733' }}
            >
              <MenuItem value="None"><em>None</em></MenuItem>
              {[...new Set(data.map(item => item.tweet_data))].map((hash, index) => (
                <MenuItem key={index} value={hash}>{hash}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{position: 'absolute', top: '160px', right: '400px', }}>
            <InputLabel htmlFor="number-filter" sx={{color:"#000"}}><b>Number</b></InputLabel>
            <Select
              id="number-filter"
              value={numberFilter}
              onChange={(e) => setNumberFilter(e.target.value)}
              sx={{ width: 160,height:40, backgroundColor: '#FFC733' }}
            >
              <MenuItem value="None"><em>None</em></MenuItem>
              {[...new Set(data.map(item => item.number))].map((number, index) => (
                <MenuItem key={index} value={number}>{number}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ position: 'absolute', top: '160px', right: '45px',}}>
            <InputLabel htmlFor="hashtag-filter" sx={{color:"#000"}}><b>Hashtag</b></InputLabel>
            <Select
              id="hashtag-filter"
              value={hashtagFilter}
              onChange={(e) => setHashtagFilter(e.target.value)}
              sx={{ width: 160,height:40, backgroundColor: '#FFC733' }}
            >
              <MenuItem value="None"><em>None</em></MenuItem>
              {[...new Set(data.map(item => item.tweet_hash))].map((hash, index) => (
                <MenuItem key={index} value={hash}>{hash}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ position: 'absolute', top: '160px', left: '375px', }}>
            <InputLabel htmlFor="status-filter" sx={{color:"#000"}}><b>Status</b></InputLabel>
            <Select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ width: 160,height:40, backgroundColor: '#FFC733' }}
            >
              <MenuItem value="None"><em>None</em></MenuItem>
              {['Pending', 'InProgress', 'Completed', 'Failed'].map((status, index) => (
                <MenuItem key={index} value={status.toLowerCase()}>{status}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ position: 'absolute', top: '105px', left: '650px', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0, m: 0, background: 'linear-gradient(90deg, #ff7e5f, #feb47b)', borderRadius: '8px', padding: '8px' }}>
            <InputLabel htmlFor="textinput" sx={{ color: '#000', mr: 1 }}><b>Autorefresh In -</b></InputLabel>
            <input
              id="textinput"
              type="number"
              value={refreshInterval}
              style={{ height: '35px', lineHeight: '35px', width: '80px', padding: '0px', textAlign: 'center' }}
              onChange={handleIntervalChange}
            />
          </Box>
        </Box>
        <Button variant="contained" sx={{ position: 'absolute', top: '12px', right: '45px',color: '#000', background: 'linear-gradient(90deg, #ff7e5f, #feb47b)' }} onClick={handleExcelDownload}>
            <Typography variant="button" sx={{ marginLeft: '2px' }}>Download Excel</Typography>
        </Button>
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
        <DialogContent>
          <Image src={`/screenshots/${screeshotUrl}`}  sizes="100vw" width={500}  height={500}  style={{width: '100%', height: 'auto', }} alt="Screenshot"   />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
