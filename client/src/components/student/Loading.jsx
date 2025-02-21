import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Loading = () => {
  const { path } = useParams(); // Destructure `path` from useParams
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`); // Corrected string interpolation
      }, 5000);

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [path, navigate]); // Added `path` and `navigate` to the dependency array

  return (
    <div>
      <h1>Loading...</h1>
      {/* You can add a loading spinner or any other loading indicator here */}
    </div>
  );
};

export default Loading;