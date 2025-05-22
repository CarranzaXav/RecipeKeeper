import React from 'react';

const Loader = () => {
  return (
    <div className='loaderContainer'>
      <iframe
        style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}
        width="800"
        height="450"
        src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/Ulwk47hPGraa1pfwArDggo/Untitled?node-id=36-4&t=8Afbymicl8vfQbIG-1"
        allowFullScreen
        title="Figma Loader"
      ></iframe>
    </div>
  );
};

export default Loader;
