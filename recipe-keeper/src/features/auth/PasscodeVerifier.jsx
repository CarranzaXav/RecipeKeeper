import {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate, Link} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useVerifyPasscodeMutation } from './authApiSlice';

const PasscodeVerifier = () => {
    const {state} = useLocation(); //{otpUserId, maskedPhone, username}
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [code, setCode] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const errRef = useRef(null)
    const [verifyPasscode, {isLoading}] = useVerifyPasscodeMutation();

    useEffect(() => {
        if(!state?.otpUserId){
            navigate('/forgot-password', {replace: true})
        }
    }, [state, navigate])

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrMsg('');
        try{
            const {accessToken} = await verifyPasscode({
                otpUserId: state.otpUserId,
                code,
            }).unwrap();

            dispatch(setCredentials({ accessToken}))
            navigate('/', {replace: true})
        } catch(err){
            setErrMsg(err?.data?.message || "Verification failed")
            errRef.current?.focus();
        }
    }

  return (
    
    <section className='PassVerifier'>
        <header className="passVerifierHeader">
            <h1 className="passVerifierTitle">Enter Passcode</h1>
        </header>

        <main className="passVerifierMain">
            <p className="mb-2">
                Code sent to <strong>{state?.maskedPhone}</strong> for account <strong>{state?.username}</strong>.
            </p>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live='assertive'>
                {errMsg}
            </p>

            <form onSubmit={onSubmit} className="passVerifierForm">
                <div className="passVerifierUsername">
                    <label htmlFor="code" className="passVerifierLabel">
                    6-Digit Code:
                    </label>
                    <input
                        id='code'
                        className='passVerifierInput'
                        type='text'
                        inputMode='numeric'
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                        placeholder='******'
                        required
                    />
                </div>
            </form>
        
        </main>

        <footer className="passVerifierFooter">
            <div className="passVerifierFooterBtnContainer">
                <Link className='passVerifierButton' to='/forgot-password'>Back</Link>
            </div>
        </footer>

    </section>

  )
}

export default PasscodeVerifier