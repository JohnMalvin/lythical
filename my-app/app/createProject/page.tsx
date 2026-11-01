import "../styles/style.css"
import Image from "next/image"
import verified from "../../public/globe.svg"

export default function CreateProject() {
    return (
        <>
            <main className="w-screen h-screen flex items-center justify-center">
                <div className="w-85 md:w-[50%] max-w-200">
                    <h1 className="text-(--lime) font-bold text-2xl mb-5">Create Project</h1>
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
                        <p className="font-bold text-center my-10 text-xl">Let's Get Started!!</p>
                        <div className="md:px-5">
                            <label className="text-(--lime)"> Name your project</label>
                            <div className="flex items-center gap-2">
                                <input className="input-box"></input>
                                <div className="h-7 bg-(--purple) aspect-square flex items-center justify-center rounded-4xl">
                                    <Image
                                        src={verified}
                                        alt="view password"
                                        width={20}
                                        height={20}
                                    ></Image>
                                </div>
                            </div>
                            <button type="submit" className="input-submit bg-(--lime) w-full text-(--background) font-bold rounded-[3px] min-h-12 mt-5 cursor-pointer">Continue</button>
                        </div>
                    </div>
                </div>
            </main>

        </>
    )
}