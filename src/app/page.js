"use client";
import * as React from 'react';
import styles from "./page.module.css";
import { styled } from '@mui/material/styles';
import { Button } from "@mui/material";
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Swal from 'sweetalert2';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

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
const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 }
];
export default function Home() {
  const [progress, setProgress] = React.useState(0);
  const [file, setFile] = React.useState(null);
  const [formData, setFormData] = useState({
    number: '',
    content: '',
    tags: [],
    file: null,
  });
  const [isUploadSuccess, setIsUploadSuccess] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(false); // State for loader
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' }); // State for alert

  const checkFormValidity = () => {
    const { number, content } = formData;
    setIsFormValid(number !== '' && content !== '' && isUploadSuccess);
  };

  React.useEffect(() => {
    checkFormValidity();
  }, [formData, isUploadSuccess]);

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
        setImagePreview(event.target.result);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    try {
      

      const data = {
        phoneNumber: formData.number,
        tweetData: formData.content,
        hashTags: (formData.tags || []).map(tag => tag).join(','),
        fileUrl: fileUrl,
      };
      const res = await fetch('/api/expressapi', {
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

  const uploadFile = async (file, type) => {
    const formData = new FormData();
    if (type === 'image') {
      formData.append('image', file);
    }
    if (type === 'video') {
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
  

  return (
    <Container maxWidth={'xl'} sx={{ position: 'relative' }}>
      <Typography variant="h4">Post</Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 5,
          width: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TextField
          label="Number"
          type="number"
          name="number"
          value={formData.number}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
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
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
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
        
        {/* <TextField
          label="Tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          sx={{ mb: 2 }}
        /> */}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: '20%', maxHeight: '200px', marginBottom: '10px' }}
          />
        )}
        <Box sx={{ width: '100%' }}>
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
          {progress > 0 && (
            <LinearProgressWithLabel value={progress} sx={{ mt: 2 }} />
          )}
        </Box>
        <Box mx={{ mt: 5, mb: 5 }}>&nbsp;</Box>
        <Button type="submit" variant="contained" disabled={!isFormValid}>
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
    </Container>
  );
}
