import React, { useState } from 'react';
import { useEffect } from 'react';
import { BASE_URL } from './BaseUrl';

const TodaysOffer = () => {
  const [offer, setOffer] = useState([]);

  useEffect(() => {
    Offerdetail();
  }, []);

  async function Offerdetail() {
    const data = await fetch(`${BASE_URL}/awt_offers`);

    const json = await data.json();

    setOffer(json);
  }

  return (
    <div className='page-container'>
      {offer.map((item ,index) => {
        return (
          <div className='card p-3 my-3' key={index}>
            <div className='offer-img text-center'>
              <img src={item.image} alt='offer1' />
            </div>
            <h2 className='offer-title'>{item.title}</h2>
            <span className='offer-discount'>{item.percent}% Disc</span>
            <span className='offer-discount'>{item.percent}% Discount</span>
          </div>
        );
      })}
    </div>
  );
};

export default TodaysOffer;
