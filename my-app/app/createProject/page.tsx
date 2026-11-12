"use client";

import "../styles/style.css"
import Image from "next/image"
import verified from "../../public/verified.svg"
import { useEffect, useState } from "react"

export default function CreateProject() {
    const [step, setStep] = useState<Number>(1);
    const [stepDesc, setStepDesc] = useState<String>("Let's Get Started!!");
    const [showError, setShowError] = useState<boolean>(false);

    useEffect(() => {
        if (step == 1) {
            setStepDesc("Let's Get Started");
        } else if (step == 2) {
            setStepDesc("Tell us more about your project!")
        } else if (step == 3) {

        }
    }, [step]);
    return (
        <>
            <main className="w-screen h-screen flex items-center justify-center">
                <div className="w-85 md:w-[50%] max-w-170">
                    <h1 className="text-(--lime) font-bold text-2xl mb-2">Create Project</h1>
                    <div className="create-container rounded-xl md:w-full border-2 border-(--lime) bg-(--shades) p-6">
                        <div className="w-full flex items-center justify-between lg:px-20 mt-10">
                            <div className="step-circle-active">
                                <p className="step-number">1</p>
                            </div>
                            <div className="step-line"></div>
                            <div className="step-circle">
                                <p className="step-number">2</p>
                            </div>
                            <div className="step-line"></div>
                            <div className="step-circle">
                                <p className="step-number">3</p>
                            </div>
                        </div>
                        <div className="font-bold text-center my-10 text-xl px-10 md:px-0">{
                            step == 1 || step == 2 ? (
                                step == 1
                                    ? "Let's Get Started!!"
                                    : "Tell us more about your project"
                            ) : (
                                <>
                                    Connect <span className="text-(--purple)">Lythical</span><br></br> to your project
                                </>
                            )}
                        </div>
                        <div className="md:px-5 ">
                            {
                                step == 1 || step == 2 ?
                                    step == 1 ? (
                                        <>
                                            <label className="text-(--lime)"> Name your project</label>
                                            <div className="flex items-center gap-2">
                                                <input className="input-box"></input>
                                                <div className="h-7  aspect-square flex items-center justify-center rounded-4xl">
                                                    <Image
                                                        src={verified}
                                                        alt="view password"
                                                        width={35}
                                                        height={35}
                                                    ></Image>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <label className="text-(--lime)"> Description</label>
                                            <div className="flex items-center gap-2">
                                                <textarea className="input-box min-h-30 max-h-30" rows={3}></textarea>
                                            </div>
                                        </>
                                    )
                                    : (
                                        <>
                                            <p>Nothing here yet</p>
                                        </>
                                    )
                            }
                            {
                                showError && (
                                    <p className="text-center text-xs text-(--purple) mt-5">
                                        error: message here
                                    </p>
                                )
                            }
                            <button type="submit" className="input-submit bg-(--lime) w-full text-(--background) font-bold rounded-[3px] min-h-12 mt-5 cursor-pointer">Continue</button>
                        </div>
                    </div>
                </div>
            </main>

        </>
    )
}