"use client"
import * as React from 'react';
import styles from "./page.module.css";
import { styled } from '@mui/material/styles';
import { Button } from "@mui/material";
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

export default function Home() {
  const [progress, setProgress] = React.useState(0);
  const [file, setFile] = React.useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      uploadFile(selectedFile);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('video', file);
    //formData.append('image', '');
    //formData.append('phoneNumber', '');
    //formData.append('tweetData', '');
    //formData.append('hastTags', '');

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
          // File upload successful
          // You can handle success here if needed
        } else {
          // File upload failed
          // You can handle failure here if needed
        }
      }
    };

    xhr.send(formData);
  };

  return (
    <main className={styles.main}>
      <Box sx={{ width: '100%' }}>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
        {progress > 0  && (
          <LinearProgressWithLabel value={progress} sx={{ mt: 2 }} />
        )}
      </Box>
    </main>
  );
}
