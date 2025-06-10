import { useDispatch } from "react-redux";
import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken, setCredentials } from "./authSlice";

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
          if (isMounted) {
            const {accessToken} = await refresh().unwrap();
            dispatch(setCredentials({accessToken}))
            setIsVerified(true);
          }
        } catch (err) {
          if (isMounted) {
            console.log("Refresh token failed: ", err);
            // Allow rendering login page on failure
            setIsVerified(true);
          }
        }
      } else if (isMounted) {
        // If token exists, no need to verify
        setIsVerified(true);
      }
    };
    verifyRefreshToken();

    return () => {
      isMounted = false;
    };
  }, [token, persist, refresh]);

  let content;

  if (!persist) {
    // If perstistance is disabled, render child components
    console.log("Persistence disabled");
    content = <Outlet />;
  } else if (isLoading) {
    // Show loader during token verification
    console.log("Loading...");
    content = <p>Loading</p>;
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
