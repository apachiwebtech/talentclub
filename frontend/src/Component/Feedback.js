import axios from 'axios';
import React, { useState } from 'react';
import { BASE_URL } from './BaseUrl';

const Feedback = () => {
  const [value, setValues] = useState({
    message: '',
    subject: '',
    user_id: localStorage.getItem('user_id'),
  });

  const handleinput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    axios
      .post(`${BASE_URL}/feedback`, value)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className='mt70 mx-2'>
      <div className='feed-head'>
        <p className='mb-0'>Send your feedback, queries or suggestions to us.</p>
      </div>

      <div className='mt-3'>
        <form onSubmit={onSubmit}>
          <div className='mb-3'>
            <label htmlFor='exampleFormControlInput1' className='form-label'>
              Subject
            </label>
            <input type='text' className='form-control' id='exampleFormControlInput1' placeholder='subject' name='subject' onChange={handleinput} />
          </div>
          <div className='mb-3'>
            <label htmlFor='exampleFormControlTextarea1' className='form-label'>
              Message
            </label>
            <textarea className='form-control' id='exampleFormControlTextarea1' rows='3' placeholder='message' onChange={handleinput} name='message'></textarea>
          </div>
          <button className='btn btn-sm btn-danger' type='submit'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
