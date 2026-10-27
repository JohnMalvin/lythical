export default function SignIn() {

    return (
        <>
            <main className="flex w-screen h-screen bg-(--background) justify-center items-center">

                <div className="sign-in-container border-amber-400 border-2 w-[60%] h-30 min-w-[400] position-x">
                    <div className="sign-in-left w-[500px] border-2  px-5">
                        <div className="input-group border-2 w-[100%] flex flex-col">
                            <label className=" text-[24px]">Username or email address</label>
                            <input type="text" value="sajhdghj" className="mt-2 text-[24px] outline-2 outline-(--lime) h-[40px] w-full"></input>
                        </div>
                    </div>
                    <div className="sign-in-right"></div>
                </div>
            </main>
        </>
    )
}