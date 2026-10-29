import '../styles/style.css';
import Image from 'next/image';

import viewPassword from '../../public/globe.svg';

export default function SignIn() {
  return (
    <main className="sign-in-main-container flex w-screen h-screen justify-center items-center">
      <div className="sign-in-group w-[80%] max-w-200 lg:max-w-300 min-w-80 md:min-w-150 max-h-min flex flex-col gap-2.5">
        <h1 className="text-(--lime) text-[32px] font-light">Sign In</h1>
        {/* central container (contains left and right boxes) */}
        <div className="sign-in-container grid grid-cols-2 gap-5 items-stretch">
          {/* left box */}
          <div className="sign-in-left min-w-0 flex flex-col justify-between">
            {/* Form to sign in */}
            <form className="sign-in-form flex-1 rounded-[10px] p-5 pt-10 shadow-[10px_10px_15px_var(--background)]">
              {/* Input the email or username */}
              <div className="input-group">
                <label className="input-label">Username or Email</label>
                <input type="text" className="input-box"></input>
              </div>
              {/* Input password */}
              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="password-input flex">
                  <input type="password" className="input-box"></input>
                  <button className="view-password bg-(--lime) h-8.75 w-8.75 flex items-center justify-center ml-2.5 shrink-0 rounded-[3px] cursor-pointer">
                    <Image
                      src={viewPassword}
                      alt="view password"
                      width={20}
                      height={20}
                    ></Image>
                  </button>
                </div>
              </div>
              {/* Sign In button */}
              <button
                type="submit"
                className="input-submit bg-(--lime) w-full text-(--background) font-bold rounded-[3px] min-h-12 my-5 cursor-pointer"
              >
                Sign In
              </button>
              {/* Sign up if no account */}
              <div className="sign-up-link p-5 text-center text-(--highlight) rounded-[10px] mt-5 shadow-[10px_10px_15px_var(--background)]">
                New to Lythical?{' '}
                <a className="text-(--purple) cursor-pointer">
                  Create new account
                </a>
              </div>
            </form>
          </div>
          {/* right box */}
          <div className="sign-in-right min-w-0 bg-(--lime) rounded-[10px] shadow-[10px_10px_15px_var(--background)]"></div>
        </div>
      </div>
    </main>
  );
}
