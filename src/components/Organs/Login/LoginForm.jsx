import React, { useState } from 'react'
import Button from '../../Atoms/Button'
function LoginForm() {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <form className="flex overflow-hidden flex-col items-center px-0 py-9 mt-20 w-full bg-white rounded-3xl border border-indigo-500 border-solid max-md:mt-10 max-sm:px-0 max-sm:py-6">
            <div className="flex flex-col self-stretch px-14 py-0 w-full leading-snug max-md:px-5 max-md:py-0 max-sm:px-4 max-sm:py-0">
                <h1 className="self-center text-3xl font-semibold leading-none text-black max-sm:text-2xl">
                    Welcome Back !
                </h1>
                <p className="self-center mt-5 text-base font-medium leading-none text-black text-opacity-50 max-sm:text-sm">
                    Please enter your details
                </p>

                <div className="mt-14 max-md:mt-10">
                    <label htmlFor="email" className="sr-only">Email or Phone Number</label>
                    <div className="flex overflow-hidden gap-1 px-3 py-3.5 bg-white rounded-lg border border-solid border-zinc-300 text-stone-900 text-opacity-50">
                        <i className="ti ti-mail" aria-hidden="true" />
                        <input
                            id="email"
                            type="text"
                            placeholder="Email/Phone Number"
                            className="w-full border-none bg-transparent"
                        />
                    </div>
                </div>

                <div className="mt-5">
                    <label htmlFor="password" className="sr-only">Password</label>
                    <div className="flex overflow-hidden gap-5 justify-between items-center px-3 py-3.5 w-full whitespace-nowrap bg-white rounded-lg border border-solid border-zinc-300 text-stone-900 text-opacity-50">
                        <div className="flex gap-1 items-center flex-1">
                            <i className="ti ti-lock" aria-hidden="true" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full border-none bg-transparent"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            <i className="ti ti-eye" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    className="flex gap-1.5 self-end mt-5 cursor-pointer text-indigo-500 text-opacity-60"
                >
                    <i className="ti ti-key" aria-hidden="true" />
                    <span>Forgot Password</span>
                </button>
            </div>

            <Button
                type="submit"
                variant="primary"
                className="mt-14 max-md:mt-10"
            >
                Login
            </Button>

            <Button
                type="button"
                variant="secondary"
                className="mt-6"
            >
                Login with Google
            </Button>

            <div className="flex gap-1 items-center mt-14 max-w-full w-[223px] max-md:mt-10">
                <span className="leading-snug text-black text-opacity-70">
                    Don't have an account?
                </span>
                <button
                    type="button"
                    className="tracking-normal leading-none text-indigo-500"
                >
                    Sign Up
                </button>
            </div>
        </form>
    )
}

export default LoginForm
