import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import {
  useVerifyPasscodeMutation,
  useRequestPasscodeMutation,
} from "./authApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

const RESEND_COOLDOWN_SECONDS = 60;

const PasscodeVerifier = () => {
  const { state } = useLocation(); //{otpUserId, maskedPhone, username}
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [isVisible, setIsVisible] = useState(true);
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

  const showHelpMsg = async (e) => {
    setIsVisible((prev) => !prev);
  };

  const helpMsg = !isVisible ? "visible" : "hidden";

  return (
    <section
      className="PassVerifier
      grid
			w-9/10 sm:w-8/10 md:w-6/10 lg:w-1/2 xl:w-2/5
			h-full md:h-full
			mt-4 md:mt-12
			px-1.5
			justify-self-center
			bg-[var(--LOGIN-SIGNUP)]
			rounded-xl
      border-4 lg:border-8
      border-t-purple-200 border-l-purple-200
      border-r-purple-400/50 border-b-purple-400/50
    "
    >
      <header
        className="passVerifierHeader
        py-4 md:py-2
        mt-2
        flex
        self-center
        justify-center
      "
      >
        <h1
          className="passVerifierTitle
        text-white
          text-base sm:text-2xl
          font-semibold
          flex
          self-center
          tracking-[6px]
        "
        >
          Enter Passcode
        </h1>
      </header>

      <main
        className="passVerifierMain
        w-full
        h-full
        justify-items-center
        content-center
      "
      >
        <div
          className="
          grid grid-cols-2
          w-auto
          text-xs md:text-sm
        "
        >
          <p>Code sent to</p>
          <strong className="mx-0.5">{meta.maskedPhone}</strong>
          <p className="mx-0.5">for account</p>
          <strong className="w-1/4 mx-0.5">{meta.username}</strong>.
        </div>

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

        <form
          onSubmit={onSubmit}
          className="passVerifierForm
          w-6/10
          flex
          flex-col
          items-center
          gap-2
          bg-[VAR(--BGCOLOR)]
          inset-shadow-sm inset-4 inset-shadow-purple-700
          py-2
          rounded-md
        "
        >
          <div
            className="passVerifierUsername
            flex
            flex-col
            items-center
          "
          >
            <label
              htmlFor="code"
              className="passVerifierLabel
              pb-1.5
              text-xs md:text-sm
            "
            >
              6-Digit Code:
            </label>
            <input
              id="code"
              className="passVerifierInput
              bg-white
              w-2/5
              rounded-2xl
              flex
              pl-4
              text-xs md:text-sm
              "
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="******"
              required
            />
          </div>

          <button
            className="passVerifierBtn
            bg-[VAR(--NAVBAR)]
            w-2/5
            rounded-2xl
            flex
            justify-center
            text-xs md:text-sm
            hover:cursor-pointer
          "
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Submit"}
          </button>
        </form>

        <div className="mt-3">
          <button
            className="passVerifierResendBtn
              border-2
              border-white
              rounded-2xl
              p-1
              hover:cursor-pointer
              text-white
              text-xs md:text-sm
              font-light
              tracking-[1px]
              hover:border-black hover:text-black 
            "
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
        <div
          className="mt-4 text-sm opacity-80 hover:cursor-pointer"
          onClick={showHelpMsg}
        >
          <p>
            <strong
              className="pr-1.5
                justify-content-center
                justify-self-center
                flex
                mb-2.5
                text-xs md:text-sm
            "
            >
              Didn’t get a code
              <FontAwesomeIcon
                className="ml-1.5
                  flex
                  self-center  
                "
                icon={faQuestionCircle}
              ></FontAwesomeIcon>
            </strong>
          </p>
          <ul
            className={`${helpMsg}
          list-disc ml-5 text-xs md:text-sm grid gap-y-2.5 justify-center`}
          >
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
                className="contactSupportLink mx-0.5 font-bold"
              >
                contact support.
              </a>
            </li>
          </ul>
        </div>
      </main>

      <footer
        className="passVerifierFooter
        flex flex-row-reverse
        mr-1.5
        mb-1
      "
      >
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
