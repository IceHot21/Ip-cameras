import React from 'react';
import YMStyles from '../styles/YandexMap.module.css';
{/* <script src="https://maps.api.2gis.ru/2.0/loader.js?pkg=full"></script> */}

const YandexMap = ({ width, height, coordinates, handleParametrEditing}) => {
const mapUrl = `https://static.maps.2gis.com/1.0?s=896x672@2x&c=${coordinates}&z=18`

  return (
    <div className={YMStyles.yandexMapContainer}>
      <iframe style={{width: width, height: height, overflow: 'hidden', position: 'relative', zIndex: '99999'}}  src={mapUrl} alt="Карта вашего производства"></iframe>
    </div>
  );
};

export default YandexMap;