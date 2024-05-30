"use client";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TablePagination } from "@mui/material";
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
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

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

export default function ChildComponent(props) {
  const router = useRouter()
  const [progress, setProgress] = React.useState(0);
  const [progress2, setProgress2] = React.useState(0);
  const [file, setFile] = React.useState(null);
  const [formData, setFormData] = useState({ number: [], content: '', tags: [], file: null, });
  const [isUploadSuccess, setIsUploadSuccess] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [videoPreview, setVideoPreview] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imagePreviewProfile, setImagePreviewProfile] = useState('');
  const [numberOfProfile, setNumberOfProfile] = useState();
  const [fileUrl, setFileUrl] = useState('');
  const [fileUrlProfile, setFileUrlProfile] = useState('');
  const [loading, setLoading] = useState(false); 
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [proxies, setProxies] = useState('');
  const [validProxies, setValidProxies] = useState('');
  const [numberOptions, setNumberOptions] = useState(props.creds.numbers); 
  const [selection, setSelection] = useState('manual');
  const [selectedFileProfile, setSelectedFileProfile] = useState(null);
  const [error, setError] = useState('');
  const searchParams = useSearchParams()
  const uname = searchParams.get('uname')
  const pass = searchParams.get('pass')

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleOpenModal2 = () => {
    setOpenModal2(true);
  };
  const handleSelectionChange = (event) => {
    setSelection(event.target.value);
  };
  
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleCloseModal2 = () => {
    setOpenModal2(false);
  };
  const checkFormValidity = () => {
    const { number, content } = formData;
    setIsFormValid(number.length > 0 && content.trim() !== '' && isUploadSuccess);
  };
  React.useEffect(() => {
    checkFormValidity();
    validateProxies(proxies);
  }, [formData,proxies,isUploadSuccess]);
  const handleFileChangeProfile = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedFileProfile(selectedFile);
    if (selectedFile) {
      const mimeType = selectedFile.type;
      const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (supportedImageTypes.includes(mimeType)) {
        uploadProfile(selectedFile, 'image');
      }
      const reader = new FileReader();
      reader.onload = (event) => {
          setImagePreviewProfile(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleFileChange = (event) => {
    setIsFormValid(false);
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const mimeType = selectedFile.type;
      const supportedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const supportedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime'];

      if (supportedImageTypes.includes(mimeType)) {
        uploadFile(selectedFile, 'image');
      }
      if (supportedVideoTypes.includes(mimeType)) {
        uploadFile(selectedFile, 'video');
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (supportedVideoTypes.includes(mimeType)) {
          setVideoPreview(event.target.result);
        } else {
          setImagePreview(event.target.result);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    checkFormValidity();
  };
  const handleChangeTag = (event, newValue) => {
    setFormData({ ...formData, tags: newValue || [] }); // Ensure newValue is not undefined
  };
  const handleNumberChangeProfile = (event) => {
    const value = event.target.value;
    setNumberOfProfile(value);
  }
  const handleNumberChange = (event) => {
    const value = event.target.value;
    if (value.includes('all')) {
      if (formData.number.length === numberOptions.length) {
        setFormData({ ...formData, number: [] });
      } else {
        setFormData({ ...formData, number: numberOptions });
      }
    } else {
      setFormData({ ...formData, number: value });
    }
    checkFormValidity();
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true); // Show loader

  //   try {
  //     const data = {
  //       phoneNumber: formData.number,
  //       tweetData: formData.content,
  //       hashTags: (formData.tags || []).map(tag => tag).join(','),
  //       fileUrl: fileUrl,
  //     };
  //     const res = await fetch('/api/expressapi', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     const data2 = await res.json();
  //     if (data2.status === 'Success') {
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Success',
  //         text: 'Post submitted successfully!',
  //       });
  //     } else {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error',
  //         text: 'Error submitting post.',
  //       }).then(() => {
  //         window.location.reload(); // Reload the page after the Swal modal is closed
  //       });
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: 'Error uploading image.',
  //     });
  //     console.error('Error uploading image:', error);
  //   } finally {
  //     setLoading(false); // Hide loader
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader
    // const fileName = fileUrl.split('/').pop();
    try {
      const data = {
        phoneNumber: formData.number,
        tweetData: formData.content,
        hashTags: (formData.tags || []).map(tag => tag).join(','),
        fileUrl: fileUrl,
        uname: uname,
      };
      const res = await fetch('/api/postapi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
      const data2 = await res.json();
      if (data2.status === 'Success') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Post submitted successfully!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error submitting post.',
        }).then(() => {
          window.location.reload(); // Reload the page after the Swal modal is closed
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error uploading image.',
      });
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };
  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    // setLoading(true); // Show loader
    if (!numberOfProfile) {
      setError('Please select a number.');
      return;
    }
    if (!fileUrlProfile) {
      setError('Please upload a profile picture.');
      return;
    }
    try {
      const data = {
        phoneNumber: numberOfProfile,
        fileUrl: fileUrlProfile,
      };
      const res = await fetch('/api/uploadProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
      const data2 = await res.json();
      if (data2.status === 'Success') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Profile Updated successfully!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error profile update.',
        }).then(() => {
          window.location.reload(); // Reload the page after the Swal modal is closed
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error uploading profile.',
      });
      console.error('Error uploading profile:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  }
  const uploadProfile = async (file, type) => {
      const MAX_IMAGE_SIZE_MB = 5; // Maximum image file size in MB
      const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024; // Maximum image file size in bytes
      const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
      const formData = new FormData();
      if (type === 'image') {
        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            setIsFormValid(false);
            alert(`Image file size should not exceed ${MAX_IMAGE_SIZE_MB} MB.`);
            return;
        }
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setIsFormValid(false);
            alert('Invalid image file type. Allowed types are JPEG, PNG, GIF, BMP, and WEBP.');
            return;
        }
        formData.append('profile', file);
      }

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload');
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          setProgress2(percentCompleted);
        }
      });
  
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            // setIsFormValid(true);
            const responseJson = JSON.parse(xhr.responseText);
            console.log('Response JSON:', responseJson);
            setFileUrlProfile(responseJson.data.path);
          } else {
            setIsFormValid(false);
          }
        }
      };
      xhr.send(formData);
  };
  const uploadFile = async (file, type) => {
    const MAX_VIDEO_SIZE_MB = 512; // Maximum video file size in MB
    const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024; // Maximum video file size in bytes
    const MAX_IMAGE_SIZE_MB = 5; // Maximum image file size in MB
    const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024; // Maximum image file size in bytes
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    const formData = new FormData();
   
    if (type === 'image') {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
          setIsFormValid(false);
          alert(`Image file size should not exceed ${MAX_IMAGE_SIZE_MB} MB.`);
          return;
      }

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          setIsFormValid(false);
          alert('Invalid image file type. Allowed types are JPEG, PNG, GIF, BMP, and WEBP.');
          return;
      }
      formData.append('image', file);
    }
    if (type === 'video' && file.size > MAX_VIDEO_SIZE_BYTES) {
      setIsFormValid(false);
      alert(`Video file size should not exceed ${MAX_VIDEO_SIZE_MB} MB.`);
      return;
    }else{
      formData.append('video', file);
    }
    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/api/upload');
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        setProgress(percentCompleted);
      }
    });

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          setIsFormValid(true);
          const responseJson = JSON.parse(xhr.responseText);
          console.log('Response JSON:', responseJson);
          setFileUrl(responseJson.data.path);
        } else {
          setIsFormValid(false);
        }
      }
    };

    xhr.send(formData);
  };
  
  const handleProxiesChange = (e) => {
    const input = e.target.value;
    setProxies(input);
    validateProxies(input);
  };
  const validateProxies = (input) => {
    const proxyPattern = /^(?:[\w]+:[\w]+@)?[\d.]+:\d+$/; // Pattern for username:password@ip:port or ip:port
    const sanitizedInput = input
      .split(/[\n,]+/) // Split by new lines or commas
      .map((proxy) => proxy.trim())
      .filter((proxy) => proxyPattern.test(proxy)); // Filter only valid proxies

    setValidProxies(sanitizedInput.join(', ')); // Join valid proxies into a comma-separated string
  };
  const handleSubmitProxies = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader
    setOpenModal(false);
    try {
      const res = await fetch('/api/proxies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({proxies:validProxies}),
      });

      const data2 = await res.json();
      if (data2.status === 'Success') {
        console.log("data",data2)
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Proxies successfully Inserted!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error submitting post.',
        }).then(() => {
          window.location.reload(); // Reload the page after the Swal modal is closed
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error uploading image.',
      });
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const startIndex = page * rowsPerPage;
  const paginatedRows = props?.creds?.combinedArray.slice(startIndex, startIndex + rowsPerPage);
  return (
    <Container maxWidth={'xl'} sx={{ position: 'relative',pt:3 }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ textAlign: 'left', color: '#1976d2', fontWeight: 'bold' }}>
            Welcome {(props?.creds?.user).toUpperCase()}
          </Typography>
          <Typography variant="h4" sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', color: '#ff5722', fontWeight: 'bold' }}>
            <img width='40' src="https://www.freepnglogos.com/new-twitter-x-logo-transparent-png-4.png" alt="Twitter Logo" /> 
            Post
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {props.creds.user === 'zia' && (
              <>
                <Button 
                    variant="contained" 
                    sx={{ 
                      mr: 2, 
                      background: 'linear-gradient(50deg, #21CBF3 30%, #2196F3 90%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #4A00E0 30%, #8E2DE2 90%)',
                      }
                    }} 
                    onClick={handleOpenModal}
                >
                    Add Proxies
                </Button>
                <Button 
                    variant="contained" 
                    sx={{ 
                      mr: 2, 
                      background: 'linear-gradient(50deg, #21CBF3 30%, #2196F3 90%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #4A00E0 30%, #8E2DE2 90%)',
                      }
                    }} 
                    onClick={handleOpenModal2}
                >
                    Add Profile
                </Button>
              </>
            )}
            <Button 
              variant="contained" 
              sx={{ 
                mr: 2, 
                background: 'linear-gradient(50deg, #21CBF3 30%, #2196F3 90%)', 
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                }
              }} 
              onClick={() => router.push(`/reports?uname=${uname}&pass=${pass}`)}
            >
              Reports
            </Button>
          </Box>
        </Box>
        <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 5,
          mb:5,
          p:3,
          width: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor:"white"
        }}
      >
          
        <FormControl sx={{ minWidth: 120, mb: 2 }}>
          <InputLabel id="number-label">Number</InputLabel>
          <Select
            labelId="number-label"
            id="number"
            multiple   
            value={formData.number}
            onChange={handleNumberChange}
            label="Number"
            required
          >
            <MenuItem value="all">
              <em>All</em>
            </MenuItem>
            {numberOptions?.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Content"
          multiline
          rows={4}
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <Autocomplete
          multiple
          id="tags-filled"
          onChange={handleChangeTag}
          options={[]}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="filled"
              label="Tags"
              placeholder="tags"
            />
          )}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: '20%', maxHeight: '200px', marginBottom: '10px' }}
          />
        )}
        {videoPreview && (
          <video
            controls
            src={videoPreview}
            style={{ maxWidth: '20%', maxHeight: '200px', marginBottom: '10px' }}
          />
        )}
        <Box sx={{ width: '100%',mt:3,mb:3 }}>
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
          {progress > 0 && (
            <LinearProgressWithLabel value={progress} sx={{ mt: 2 }} />
          )}
        </Box>
        <Button mx={{mt:3,mb:3 }}  type="submit" variant="contained" disabled={!isFormValid}>
          Submit
        </Button>
        {loading && (
          <CircularProgress
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1, // Ensures it appears above other content
            }}
          />
        )}

        
        </Box>
      {
          props.creds.user ==='zia' &&
          <>
            <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="lg">
              <DialogTitle sx={{ textAlign: 'center', fontSize: '2rem' }}>Enter Proxies</DialogTitle>
              <DialogContent>
                <Typography variant="subtitle1">Enter proxies in comma separated or proxy per line:</Typography>
                <Typography variant="subtitle1" sx={{ color: 'red' }}>username:password@ip:port or ip:port</Typography>
                <TextField
                  multiline
                  rows={4}
                  value={proxies}
                  onChange={handleProxiesChange}
                  fullWidth
                  variant="outlined"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal}>Close</Button>
                <Button onClick={handleSubmitProxies} color="primary" variant="contained">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openModal2} onClose={handleCloseModal2} fullWidth maxWidth="md">
              <DialogTitle sx={{ textAlign: 'center', fontSize: '2rem' }}>Upload Profile Pic</DialogTitle>
              <DialogContent sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 300, mb: 2 }}>
                  <InputLabel id="number-label">Number</InputLabel>
                  <Select
                    labelId="number-label"
                    id="number"
                    value={numberOfProfile}
                    onChange={handleNumberChangeProfile}
                    label="Number"
                    required
                  >
                    {numberOptions?.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                  {imagePreviewProfile && (
                      <img
                        src={imagePreviewProfile}
                        alt="Preview"
                        style={{ maxWidth: '20%',marginTop:"10px",marginBottom:"20px", maxHeight: '230px', marginBottom: '10px' }}
                      />
                    )}
                  <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    Upload Profile Pic
                    <input type="file" style={{ display: 'none' }} onChange={handleFileChangeProfile} />
                  </Button>
                  {progress2 > 0 && (
                    <LinearProgressWithLabel value={progress2} sx={{ mt: 2 }} />
                  )}
                  {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal2}>Close</Button>
                <Button onClick={handleSubmitProfile} color="primary" variant="contained">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </>
      }
      {
        props.creds.user === 'zia' &&
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box component="h2">Registered Accounts</Box>
          </Box>
          <TableContainer sx={{mt:5,mb:5}} component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Username</strong></TableCell>
                  <TableCell><strong>Number</strong></TableCell>
                  <TableCell><strong>Twitter Link</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows?.map((row, index) => {
                  const [number, username] = row.split(' - ');
                  return (
                        <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {username}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {number}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <a href={`https://x.com/${username}`}  target="_blank" className="link">https://x.com/{username}</a>
                        </TableCell>
                      </TableRow>
                        
                  );
                })}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]} // You can customize the rows per page options
              component="div"
              count={props?.creds?.combinedArray.length} // Total number of rows
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </>
      }
      
    </Container>
  );
}
