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
    <div className="w-full mt-4 md:mt-12 h-96">
      <section
        className="
			grid
			w-9/10 sm:w-8/10 md:w-6/10 lg:w-1/2 xl:w-2/5
			h-64 md:h-60
			my-auto
			px-1.5
			justify-self-center
			bg-[var(--LOGIN-SIGNUP)]
			rounded-xl
      border-4 lg:border-8
      border-t-purple-200 border-l-purple-200
      border-r-purple-400/50 border-b-purple-400/50
			"
        title="Forgot Password"
      >
        <header
          className="
          md:py-2
          mt-2
          flex
          self-center
          justify-center
          "
        >
          <h1
            className="
          text-white
            text-sm sm:text-2xl
            font-semibold
            flex
            self-center
            tracking-[6px]
          "
          >
            Forgot Password
          </h1>
        </header>

        <main
          className="
        w-full
        h-full
        justify-items-center
        content-center
        "
        >
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>

          <form onSubmit={onSubmit} className="forgotPwdForm">
            <div
              className="forgotPwdPhoneBlock
              flex

            "
            >
              <label
                htmlFor="phone"
                className="forgotPwdLabel
              text-white
              w-6/10
              "
              >
                Phone Number:
              </label>
              <input
                type="tel"
                id="phone"
                className="forgotPwdInput
                bg-white
                rounded-xl
                w-1/2
                md:pl-6
                pr-0
                py-0 md:py-0.5
                cursor-pointer
                text-xs
                "
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 555-1234"
                required
              />
            </div>

            <div
              className="forgotPwdCarrierBlock
              flex
              py-2
              justify-between md:justify-normal
            "
            >
              <label
                htmlFor="carrier"
                className="forgotPwdCarrierLabel
                text-white
                md:w-6/10
                pr-2
              "
              >
                Carrier:{" "}
              </label>
              <select
                className="forgotPwdInput
                  w-1/2
                  text-xs
                bg-white
                  rounded-xl
                  md:pl-2
                  py-0.5
                  cursor-pointer
                "
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

            <button
              className="forgotPwdBtn
              flex
              justify-self-center
              my-1.5
              text-sm
            bg-white
              rounded-xl
              px-2
              py-0.5
              cursor-pointer
              hover:shadow-xl hover:shadow-purple-400
              hover:text-purple-500
            "
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Passcode"}
            </button>
          </form>
        </main>

        <footer
          className="forgotPwdFooter
          flex flex-row-reverse
        "
        >
          <div
            className="forgotPwdFooterBtnContainer
            pr-2
            text-xs
           
          "
          >
            <Link
              className="loginFormButton
             hover:bg-white
            hover:rounded-xl
            hover:py-0.5
            hover:px-2
            "
              title="Login Page"
              to="/login"
            >
              Back to Login
            </Link>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default ForgotPassword;
