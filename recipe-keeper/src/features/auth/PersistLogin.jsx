import { useDispatch } from "react-redux";
import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken, setCredentials } from "./authSlice";
import Loader from '../../Components/Loader'

const PersistLogin = () => {
  // Check if persistence is enabled
  const [persist] = usePersist();
  // Get the current token from Redux
  const token = useSelector(selectCurrentToken);
  // State to track verification
  const [isVerified, setIsVerified] = useState(false);

  const dispatch = useDispatch();


  //Mutation for refreshing token
  const [refresh, { isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
  let isMounted = true;

  const verifyRefreshToken = async () => {
    if (!token && persist) {
      try {
        const { accessToken } = await refresh().unwrap();
        dispatch(setCredentials({ accessToken }));
        if (isMounted) setIsVerified(true);
      } catch (err) {
        console.log("Refresh token failed: ", err);
        if (isMounted) setIsVerified(true); // still allow login route to render
      }
    } else {
      if (isMounted) setIsVerified(true);
    }
  };

  verifyRefreshToken();

  return () => {
    isMounted = false;
  };
}, [token, persist, refresh, dispatch]);

  let content;

  if (!persist) {
    // If perstistance is disabled, render child components
    console.log("Persistence disabled");
    content = <Outlet />;
  } else if (isLoading) {
    // Show loader during token verification
    console.log("Loading...");
    content = <div className='flex mt-24 h-96 justify-center'><Loader/></div>;
  } else if (isError) {
    // Show error message if refresh token fails
    console.log("Error during token refresh: ", error?.data?.message);
    content = (
      <div className="errmsg">
        {error?.data?.message || "An error occurred"}
        <Link to="/login">Please log in again</Link>
      </div>
    );
  } else if (isVerified && (token || isSuccess)) {
    // Render child components if token exists or refresh succeeded
    content = <Outlet />;
  } else if (isVerified && !token) {
    // Redirect to login page if verification is complete but no token exist
    content = (
      <div className="errmsg">
        <Link to="/login">Please log in</Link>
      </div>
    );
  }

  return content;
};

export default PersistLogin;
