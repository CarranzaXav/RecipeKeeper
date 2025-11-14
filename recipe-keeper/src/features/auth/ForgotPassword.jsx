import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRequestPasscodeMutation } from "./authApiSlice";

const carriers = [
  { key: "att", label: "AT&T" },
  { key: "verizon", label: "Verizon" },
  { key: "tmobile", label: "T-Mobile" },
  { key: "metropcs", label: "MetroPCS" },
  { key: "boost", label: "Boost Mobile" },
  { key: "uscellular", label: "U.S. Cellular" },
  { key: "googlefi", label: "Google Fi" },
  { key: "cricket", label: "Cricket" },
];

const ForgotPassword = () => {
  const [phone, setPhone] = useState("");
  const [carrier, setCarrier] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef(null);
  const navigate = useNavigate();
  const [requestPasscode, { isLoading }] = useRequestPasscodeMutation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    try {
      const payload = await requestPasscode({ phone, carrier }).unwrap();
      // payload: {otpUserId, maskedPhone, username}
      navigate("/verify-passcode", {
        state: { ...payload, phone, carrier },
        replace: true,
      });
    } catch (err) {
      setErrMsg(err?.data?.message || "Failed to send code");
      errRef.current?.focus();
    }
  };

  return (
    <div className="w-full pt-12 h-96">
      <section
        className="
			grid
			w-9/10 sm:w-8/10 md:w-6/10 lg:w-1/2 xl:w-2/5
			h-72 md:h-60
			my-auto
			px-1.5
			justify-self-center
			bg-[var(--LOGIN-SIGNUP)]
			rounded-xl
			"
        title="Forgot Password"
      >
        <header>
          <h1>Forgot Password</h1>
        </header>

        <main>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>

          <form onSubmit={onSubmit} className="forgotPwdForm">
            <div className="forgotPwdPhoneBlock">
              <label htmlFor="phone" className="forgotPwdLabel">
                Phone Number:
              </label>
              <input
                type="tel"
                id="phone"
                className="forgotPwdInput"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 555-1234"
                required
              />
            </div>

            <div className="forgotPwdCarrierBlock">
              <label htmlFor="carrier" className="forgotPwdCarrierLabel">
                Carrier:{" "}
              </label>
              <select
                className="forgotPwdInput"
                id="carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select your carrier
                </option>
                {carriers.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <button className="forgotPwdBtn" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Passcode"}
            </button>
          </form>
        </main>

        <footer className="forgotPwdFooter">
          <div className="forgotPwdFooterBtnContainer">
            <Link className="loginFormButton" to="/login">
              Back to Login
            </Link>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default ForgotPassword;
