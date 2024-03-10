import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import FormControl from '@mui/material/FormControl';
import loader from '../images/loader.gif';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from './BaseUrl';
import imageCompression from 'browser-image-compression';
import { LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});





const Profile = () => {
  const [values, setValues] = useState({
    image: '',
    user_id: localStorage.getItem('user_id'),
  });
  const [getfollow, setFollow] = useState([]);
  const [follower, setFollower] = useState([]);
  const [hide , setHide] = useState(false);
  const [posts, setposts] = useState([]);
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [progress , setprogress] = useState(false)
  const [prodata, setPro] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [detail, setDetails] = useState({
    firstname: '',
    lastname: '',
    designation: '',
    date: '',
    location: '',
    gender: '',
    user_id: localStorage.getItem('user_id')

    
  })


  const profile_img = localStorage.getItem('profile_pic');

  const Designation = [
    {
      value: 'Select',
      label: 'Select Designation',
    },
    {
      value: 'Student',
      label: 'Student',
    },
    {
      value: 'Homemakers',
      label: 'Homemakers',
    },
    {
      value: 'Senior Citizens',
      label: 'Senior Citizens',
    },
    {
      value: 'Agriculturist',
      label: 'Agriculturist',
    },
    {
      value: 'Propriters',
      label: 'Propriters',
    },
    {
      value: 'Professionals',
      label: 'Professionals',
    },
    {
      value: 'Other',
      label: 'Other',
    },
  ];



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function proflepost() { }
  useEffect(() => {
    proflepost();
  }, []);

  useEffect(() => {
    const data = {
      user_id: localStorage.getItem('user_id'),
    };

    async function getfollowing() {
      axios
        .post(`${BASE_URL}/following`, data)
        .then((res) => {
          setFollow(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getfollowing();
  }, []);




  useEffect(() => {
    const data = {
      user_id: localStorage.getItem('user_id'),
    };



    async function getPosts() {
      axios
        .post(`${BASE_URL}/posts_count`, data)
        .then((res) => {
          setposts(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getPosts();
  }, []);


  async function getProfiledata() {

    const data = {
      user_id: localStorage.getItem("user_id")
    }
    axios.post(`${BASE_URL}/profile_data`, data)
      .then((res) => {
        setPro(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    getProfiledata()
  }, [])



  useEffect(() => {
    const data = {
      user_id: localStorage.getItem('user_id'),
    };

    async function getfollower() {
      axios
        .post(`${BASE_URL}/follower`, data)
        .then((res) => {
          setFollower(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getfollower();
  }, []);


  async function ImageBase64(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    const data = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

    return data;
  }

  // const loggeduser = localStorage.getItem('userName');

  // const handleUpload = async (e) => {
  //   setHide(true)
  //   const data = await ImageBase64(e.target.files[0]);
  //   const file = e.target.files[0];
  //   // setImage(file);
  //   setValues((prev) => {
  //     return {
  //       ...prev,
  //       image: data,
  //     };
  //   });
  // };

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    setHide(true)

    const data = await ImageBase64(event.target.files[0]);
    setValues((prev) => {
      return {
        ...prev,
        image: data,
      };
    });
    // Check if the file has a valid extension
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'mp4'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      // console.log('Invalid file type. Please upload a .png, .jpg, or .mp4 file.');
      return;
    }

     console.log(file, "jhsd");
     console.log('file instanceof Blob', file instanceof Blob); // true
     console.log(`file size ${file.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      let convertedFile;

      if (fileExtension === 'mp4') {
        setImage(file)
      } else {
        // Handle image file using imageCompression library
        const compressedFile = await imageCompression(file, options);
        console.log("nbchjvbhj");
        console.log(compressedFile);
        console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

        // Convert Blob to File with the desired extension
        const fileName = `compressedFile.${fileExtension}`;
        convertedFile = new File([compressedFile], fileName, { type: `image/${fileExtension}` });
        await setImage(convertedFile);
      }


      // You can replace the following line with your own logic to handle the converted file
    } catch (error) {
      console.log(error);
    }
  }

  const Navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    setprogress(true)
    const formData = new FormData();
    formData.append('image', image);
    formData.append('user_id', values.user_id);

    fetch(`${BASE_URL}/profile_pic`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {

        const profile = data[0].profile_image
        localStorage.setItem("profile_pic", profile)
        Navigate('/dash')
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      })
      .finally(()=>{
        setprogress(false)
      })
  };

  const onhandleSubmit = (e) => {
    // e.preventDefault()
    // const data = {
    //   firstname : detail.firstname,
    //   lastname : detail.lastname,

    // }
    axios.post(`${BASE_URL}/user_details`, detail)
      .then((res) => {
      
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // const onhandleChange = (event) => {
  //   setDetails((prev) => ({ ...prev, [event.target.name]: [event.target.value] }));
  // }

  // const onhandleChange = (e, index) => {
  //   setDetails((prev) => {
  //      return {
  //        ...prev,
  //        [e.target.name]: e.target.value,
  //      };
  //   });
  //  };
  
  const handleImageLoad = () => {
    console.log('Image loaded successfully!');
    setIsLoading(false);
  };

  const handleImageError = () => {
    console.error('Error loading image.');
    setIsLoading(false);
  };
   const onhandleChange = (e) => {
    setDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
     
    <div className='page-container'>
      {
        prodata.map((item,index) => {
          return (
            <div className='tab-content' key={index}>
              <div className='tab-pane active'>
                <div className='myprofile-holder'>
                  <div className='myprofile-img'>
                    <div className='img-frame'>
                      <div className='profile-pic'>
                        {/* {isLoading && <div style={{position :"absolute", left:"50px"}}>Loading...</div>} */}
                        {isLoading && <div><img src={loader}  alt='' /></div>}
                     
                        <img src={values.image !== '' ? values.image : `https://thetalentclub.co.in/upload/profile/${item.profile_image}`} a id='output' width='200' alt='profile'    onLoad={handleImageLoad} onError={handleImageError}/>
                      </div>
                    </div>
                    {progress ? <LinearProgress  sx={{color :"red"}} />: null}
                    <form onSubmit={handleSubmit} method='POST'>
                      <input id='pro-pic' type='file' name='post' accept='image/*' onChange={handleImageUpload} />
                     {hide ? <button type='submit' className='btn-upload' style={{ marginTop: '5px' }}>
                        Upload
                      </button> : null}
                    </form>
                  </div>
                  <div className='myprofile-des' style={{ position: 'relative' }}>
                    <div className='profiledetails'>
                      <h2 id='h1_username'>{item.firstname}</h2>
                      <h4 id='h1_designation'>{item.designation}</h4>
                      <h4 id='h1_designation'>{item.address}</h4>
                    </div>
                    <p className='edit-p mt-3 py-1'>Message</p>
                    <p className='edit'>
                      {' '}
                      <i className='ri-edit-fill' onClick={handleClickOpen}></i>
                    </p>
                  </div>

                  <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                    <AppBar sx={{ position: 'relative' }} style={{ background: '#E73758' }}>
                      <Toolbar>
                        <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
                          <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
                          Edit Profile
                        </Typography>
                        <Button type='submit' autoFocus color='inherit' onClick={onhandleSubmit}>
                          save
                        </Button>
                      </Toolbar>
                    </AppBar>
                    <Box component='form' autoComplete='off' style={{ padding: '10px 10px' }}>
                    <TextField id='standard-basic' fullWidth label='First Name' name="firstname" onChange={onhandleChange} />
                      
                    </Box>
                    <Box component='form' autoComplete='off' style={{ padding: '5px 10px' }}>
                      <TextField id='standard-basic' fullWidth label='Last Name' name="lastname" onChange={onhandleChange} />
                    </Box>
                    <Box component='form' autoComplete='off' style={{ padding: '5px 10px' }}>
                      <TextField id='standard-basic' fullWidth select defaultValue='Select' name='designation' onChange={onhandleChange}>
                        {Designation.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                    <Box component='form' autoComplete='off' style={{ padding: '5px 10px' }}>
                      <TextField id='standard-basic' fullWidth label='Location' name="location" value={item.address} onChange={onhandleChange} />
                    </Box>
                    <Box component='form' autoComplete='off' style={{ padding: '5px 10px' }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker', 'DateTimePicker', 'TimePicker', 'DateRangePicker']}></DemoContainer>
                        <DemoItem label='BirthDate'>
                          <DatePicker disableFuture views={['year', 'month', 'day']} value={detail.date} onChange={(newValue) => setDetails({ ...detail, date: newValue })} />
                        </DemoItem>
                      </LocalizationProvider>
                    </Box>
                    <Box component='form' autoComplete='off' style={{ padding: '5px 10px' }}>
                      <FormControl>
                        <FormLabel id='demo-row-radio-buttons-group-label'>Gender</FormLabel>
                        <RadioGroup row aria-labelledby='demo-row-radio-buttons-group-label' name='gender' onChange={onhandleChange}>
                          <FormControlLabel value='female' control={<Radio />} label='Female' />
                          <FormControlLabel value='male' control={<Radio />} label='Male' />
                          <FormControlLabel value='other' control={<Radio />} label='Other' />
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  </Dialog>

                </div>
              </div>
            </div>
          )
        })
      }


      <div className='card'>
        <div className='followstatus row p-2'>
          {follower?.data?.map((item, index) => {
            return (
              <div className='text-center col-4' key={index}>
                <p>Followers</p>
                <span>{item.follower}</span>
              </div>
            );
          })}
          {getfollow?.data?.map((item, index) => {
            return (
              <div className='text-center col-4' key={index}>
                <p>Following</p>
                <span>{item.following === null ? 0 : item.following}</span>
              </div>
            );
          })}
          {posts?.data?.map((item, index) => {
            return (
              <div className='text-center col-4' key={index}>
                <p>Posts</p>
                <span>{item.post === null ? 0 : item.post}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
