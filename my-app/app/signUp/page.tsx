"use client";
import "../styles/style.css"
import Image from "next/image"

import viewPassword from "../../public/viewPass.svg"
import hidePassword from "../../public/hidePass.svg"
import { useState, useRef } from "react";
import { signUpZod } from "@/lib/zod";
import { useRouter } from "next/navigation";
export default function SignUp() {
    const [viewPass, setViewPass] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [errorContent, setErrorContent] = useState<string>("asjhdafadbjb");
    const [code, setCode] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [step, setStep] = useState<number>(1);

    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const router = useRouter();
    const goToDashboard = () => {
        router.push("/");
    };

    const handleContinue = async () => {
        const result = signUpZod.safeParse({
            username: usernameRef.current?.value,
            email: emailRef.current?.value,
            password: passwordRef.current?.value
        });

        if (!result.success) {
            setShowError(true);
            const errorMessage = Object.values(result.error.flatten().fieldErrors).flat()[0];
            setErrorContent(errorMessage || "Invalid input.");
            return;
        }

        setShowError(false);

        await getVerificationCode();
    };

    const getVerificationCode = async () => {
        try {
            const params = new URLSearchParams({ email });

            const response = await fetch("/api/verificationCode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (!response.ok) {
                setShowError(true);
                setErrorContent(data.message || "Failed to send verification code.");
                return;
            }

            setShowError(false);
            setCode("");
            setStep(2);

        } catch (error) {
            console.error("Failed to request verification code:", error);
            setShowError(true);
            setErrorContent("Something went wrong. Please try again.");
        }
    };

    const handleVerifyCode = async () => {
        try {
            const response = await fetch("/api/verifyCode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    code,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setShowError(true);
                setErrorContent(data.message || "Invalid verification code.");
                return;
            }

            setShowError(false);
            await handleSignUp();

        } catch (error) {
            console.error("Verification failed:", error);
            setShowError(true);
            setErrorContent("Something went wrong. Please try again.");
        }
    };

    const handleSignUp = async () => {
        try {
            const response = await fetch("/api/signUp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: usernameRef.current?.value,
                    email,
                    password: passwordRef.current?.value,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setShowError(true);
                setErrorContent(data.message || "Failed to create account.");
                return;
            }

            setShowError(false);
            setStep(3);

        } catch (error) {
            console.error("Signup failed:", error);
            setShowError(true);
            setErrorContent("Something went wrong. Please try again.");
        }
    };

    return (
        <main className="sign-up-main-container w-screen h-screen flex items-center justify-center">
            <div className="sign-up-group w-[80%] max-w-200 lg:max-w-300 min-w-80 md:min-w-150 max-h-min flex flex-col gap-2.5">
                {step != 3 ? (<h1 className="text-(--lime) text-[32px] font-light">Sign Up</h1>) : <></>}
                <div className="sign-up-container grid grid-cols-[1fr_auto] gap-5 items-stretch">
                    <div className="sign-up-left min-w-[45%] flex flex-col justify-between h-max ">
                        {step == 1 ?
                            (<div className="sign-up-form flex-1 rounded-[10px] p-5 pt-10 shadow-[10px_10px_15px_var(--background)]">
                                <div className="input-group">
                                    <label className="input-label">Username</label>
                                    <input ref={usernameRef} type="text" className="input-box"></input>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Email</label>
                                    <input ref={emailRef} onChange={(e) => setEmail(e.target.value)} type="text" className="input-box"></input>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Password</label>
                                    <div className="password-input flex">
                                        <input ref={passwordRef} type={viewPass ? "text" : "password"} className="input-box"></input>
                                        <button
                                            className="view-password bg-(--purple) h-8.75 w-8.75 flex items-center justify-center ml-2.5 shrink-0 rounded-[3px] cursor-pointer"
                                            onClick={() => setViewPass(!viewPass)}
                                        >
                                            <Image
                                                src={viewPass ? viewPassword : hidePassword}
                                                alt={viewPass ? "view password" : "hide password"}
                                                width={30}
                                                height={30}
                                            ></Image>
                                        </button>
                                    </div>
                                </div>
                                <p className={`text-(--purple) text-center ${showError ? "block" : "hidden"}`}>{errorContent + "*"}</p>
                                <button
                                    className="input-submit bg-(--lime) w-full text-(--background) font-bold rounded-[3px] min-h-12 my-5 cursor-pointer"
                                    onClick={handleContinue}
                                >Continue</button>
                            </div>)
                            : step == 2 ?
                                (<div className="sign-up-form flex-1 rounded-[10px] p-5 pt-10 shadow-[10px_10px_15px_var(--background)]">
                                    <div className="flex flex-col gap-2 text-center">
                                        <h2 className="text-2xl font-semibold mb-10">Check your email</h2>

                                        <p className="text-sm font-bold mb-10">
                                            We've sent a 6-digit verification code to
                                            <span className="font-semibold text-gray-900"> {email}</span>.
                                            Enter the code below to verify your account.
                                        </p>

                                    </div>
                                    <div className=" flex gap-5 items-center">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={6}
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                                            className="mb-10 input-box min-h-12 text-3xl text-center tracking-widest"></input>
                                    </div>
                                    <p className="mb-5 text-xs">
                                        The verification code will expire in{" "}
                                        <span className="font-medium text-(--lime)">5 minutes</span>.
                                        Didn't receive it? Check your spam folder or <a className="text-(--purple) underline cursor-pointer" onClick={getVerificationCode}>request a new code</a>.
                                    </p>
                                    <p className={`text-(--purple) text-center ${showError ? "block" : "hidden"}`}>{errorContent + "*"}</p>

                                    <button
                                        type="submit"
                                        className="input-submit bg-(--lime) w-full text-(--background) font-bold rounded-[3px] min-h-12 mb-5 mt-2 cursor-pointer"
                                        onClick={handleVerifyCode}
                                    >Verify Code</button>
                                </div>) :
                                (<div className="sign-up-form flex-1 rounded-[10px] p-5 pt-10 shadow-[10px_10px_15px_var(--background)]">
                                    <div className="flex flex-col gap-2 text-center">
                                        <h2 className="text-2xl font-semibold">
                                            Welcome to Lythical!
                                        </h2>

                                        <p className="text-sm my-10">
                                            Your account has been successfully created. We're excited to have you on board!
                                        </p>
                                        <button
                                            type="submit"
                                            className="input-submit bg-(--lime) w-full text-(--background) font-bold rounded-[3px] min-h-12 mb-5 cursor-pointer"
                                            onClick={goToDashboard}
                                        >Go to Dashboard</button>
                                    </div>
                                </div>
                                )
                        }
                        {step !== 3 ? (
                            <div className="sign-up-link p-5 text-center text-(--highlight) rounded-[10px] mt-5 shadow-[10px_10px_15px_var(--background)]">
                                Already have an account? <a className="text-(--purple) cursor-pointer">Sign In</a>
                            </div>
                        ) : <></>}
                    </div>
                    <div className="hidden xl:block sign-up-right aspect-square h-full w-auto bg-(--lime) rounded-[10px]  box-shadow: 10px 10px 15px var(--background);">

                    </div>
                </div>
            </div>

        </main>
    )
}