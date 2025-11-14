import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import {
  useVerifyPasscodeMutation,
  useRequestPasscodeMutation,
} from "./authApiSlice";

const RESEND_COOLDOWN_SECONDS = 60;

const PasscodeVerifier = () => {
  const { state } = useLocation(); //{otpUserId, maskedPhone, username}
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const errRef = useRef(null);

  const [verifyPasscode, { isLoading }] = useVerifyPasscodeMutation();
  const [requestPasscode, { isLoading: isResending }] =
    useRequestPasscodeMutation();

  const [meta, setMeta] = useState(() => ({
    otpUserId: state?.otpUserId,
    maskedPhone: state?.maskedPhone,
    username: state?.username,
    phone: state?.phone,
    carrier: state?.carrier,
  }));

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!state?.otpUserId || !state?.phone || !state?.carrier) {
      navigate("/forgot-password", { replace: true });
    }
  }, [state, navigate]);

  useEffect(() => {
    if (!cooldown) return;
    const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setInfoMsg("");
    try {
      const { accessToken } = await verifyPasscode({
        otpUserId: state.otpUserId,
        code,
      }).unwrap();

      dispatch(setCredentials({ accessToken }));
      navigate("/", { replace: true });
    } catch (err) {
      setErrMsg(err?.data?.message || "Verification failed");
      errRef.current?.focus();
    }
  };

  const onResend = async () => {
    setErrMsg("");
    setInfoMsg("");
    try {
      const payload = await requestPasscode({
        phone: meta.phone,
        carrier: meta.carrier,
      }).unwrap();
      setMeta((m) => ({ ...m, ...payload }));
      setInfoMsg(`Code resent to ${payload.maskedPhone}.`);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setErrMsg(err?.data?.message || "Could not resend code");
      errRef.current?.focus();
    }
  };

  return (
    <section className="PassVerifier">
      <header className="passVerifierHeader">
        <h1 className="passVerifierTitle">Enter Passcode</h1>
      </header>

      <main className="passVerifierMain">
        <p className="mb-2">
          Code sent to <strong>{meta.maskedPhone}</strong> for account{" "}
          <strong>{meta.username}</strong>.
        </p>

        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        {infoMsg ? (
          <p className="infoMsg" aria-live="polite">
            {infoMsg}
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="passVerifierForm">
          <div className="passVerifierUsername">
            <label htmlFor="code" className="passVerifierLabel">
              6-Digit Code:
            </label>
            <input
              id="code"
              className="passVerifierInput"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="******"
              required
            />
          </div>

          <button className="passVerifierBtn" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <div className="mt-3">
          <button
            className="passVerifierResendBtn"
            onClick={onResend}
            disabled={isResending || cooldown > 0}
            type="button"
            aria-disabled={isResending || cooldown > 0}
          >
            {isResending
              ? "Resending..."
              : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend code"}
          </button>
        </div>

        {/* help tips */}
        <div className="mt-4 text-sm opacity-80">
          <p>
            <strong>Didn’t get a code?</strong>
          </p>
          <ul className="list-disc ml-5">
            <li>Confirm your carrier selection.</li>
            <li>
              Check signal / wait up to 2 minutes — email-to-SMS can be slow.
            </li>
            <li>
              Make sure your number can receive SMS and isn’t on Do Not Disturb.
            </li>
            <li>
              If still stuck, go back and try another carrier or
              <a
                href={`mailto:carranzax7gmail.com`}
                className="contactSupportLink"
              >
                contact support.
              </a>
            </li>
          </ul>
        </div>
      </main>

      <footer className="passVerifierFooter">
        <div className="passVerifierFooterBtnContainer">
          <Link className="passVerifierButton" to="/forgot-password">
            Back
          </Link>
        </div>
      </footer>
    </section>
  );
};

export default PasscodeVerifier;
