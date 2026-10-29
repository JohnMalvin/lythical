import "../styles/style.css"
import Image from "next/image"

import viewPassword from "../../public/globe.svg"
export default function SignIn() {

  return (
    <main className="sign-up-main-container w-screen h-screen flex items-center justify-center">
      <div className="sign-up-group w-[80%] max-w-200 lg:max-w-300 min-w-80 md:min-w-150 max-h-min flex flex-col gap-2.5">
        <h1 className="text-(--lime) text-[32px] font-light">Sign In</h1>
        <div className="sign-up-container grid grid-cols-[1fr_auto] gap-5 items-stretch">
          <div className="sign-up-left min-w-[45%] flex flex-col justify-between h-max ">
            <form className="sign-up-form flex-1 rounded-[10px] p-5 pt-10 shadow-[10px_10px_15px_var(--background)]">
              <div className="input-group">
                <label className="input-label">Username or email</label>
                <input type="text" className="input-box"></input>
              </div>
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
              <button type="submit" className="input-submit bg-(--lime) w-full text-(--background) font-bold rounded-[3px] min-h-12 my-5 cursor-pointer">Sign In</button>
            </form>
            <div className="sign-up-link p-5 text-center text-(--highlight) rounded-[10px] mt-5 shadow-[10px_10px_15px_var(--background)]">
              New to Lythical? <a className="text-(--purple) cursor-pointer">Creat an account</a>
            </div>
          </div>
          <div className="hidden xl:block sign-up-right aspect-square h-full w-auto bg-(--lime) rounded-[10px]  box-shadow: 10px 10px 15px var(--background);">

          </div>
        </div>
      </div>

    </main>
  )
}