import axios from 'axios';
import React, { useState } from 'react';
import md5 from 'js-md5';
import { BASE_URL } from './BaseUrl';

const Setting = () => {
  const [value, setValues] = useState({
    user_id: localStorage.getItem('user_id'),
    password: '',
  });

  const pass = value.password;
  const hashpassword = md5(pass);

  const onhandlesubmit = (e) => {
    e.preventDefault();

    const data = {
      password: hashpassword,
      user_id: localStorage.getItem('user_id'),
    };

    axios
      .post(`${BASE_URL}/change_pass`, data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleinput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };
  return (
    <div className='help'>
      <form onSubmit={onhandlesubmit}>
        <div className='form' >
          <p style={{ background: '#eee', padding: '15px', fontSize: '14px' }}>Change Passsword</p>

          <div className='name-holder'>
            <label htmlFor='password'>New Password</label>
            <input type='password' name='password' className='form-control' id='password' value={value.password}  onChange={handleinput} placeholder='New password'  />
          </div>
          <div className='name-holder'>
            <label htmlFor='cpassword'>Confirm Password</label>
            <input type='text' name='cpassword' className='form-control' id='cpassword'  placeholder='Confirm password'  />
          </div>
          <button type='submit'>Send</button>
        </div>
      </form>
    </div>
  );
};

export default Setting;
