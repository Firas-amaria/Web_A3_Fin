'use client';
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * The login page component that handles the login request from the user.
 * @returns {JSX.Element} - The JSX for the login page.
 */

const Login = () => {
    /**
     * State variable to hold any error message during login.
     * @type {React.useState<string | null>}
     */
    const [error, setError] = useState(null);
    /**
     * State variable to track whether the form is currently being submitted.
     * @type {React.useState<boolean>}
     */
    const [submitting, setSubmitting] = useState(false);

    /**
     * The router object to navigate to different routes.
     * @type {ReturnType<typeof useRouter>}
     */
    const router = useRouter();

    /**
     * Event handler for the login form submission.
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        const formData = new FormData(e.target);

        /**
         * Attempts to sign in the user using the provided credentials.
         * @type {ReturnType<typeof signIn>}
         */
        const response = await signIn("credentials", {
            redirect: false,
            email: formData.get("email"),
            password: formData.get("password"),
            role: formData.get("role"),
        });

        setSubmitting(false);
        if (!response.error) {
            router.push("/dashboard");
            router.refresh();
        } else {
            console.log(response);
            setError('Invalid credentials');
        }
    }

    return (
        <div className="w-full pt-10">
            <div className="w-full m-auto max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-md sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <h5 className="text-xl font-medium text-gray-900 dark:text-white text-center">Sign in</h5>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                    </div>
                    <div>
                        <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Login as</label>
                        <select id="role" name="role" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option>Select role</option>
                            <option value="student">Student</option>
                            <option value="lecturer">Lecturer</option>
                        </select>
                    </div>

                    {error && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{submitting ? 'Logging...' : 'Login to your account'}</button>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                        Not registered? <Link href="/auth/register" className="text-blue-700 hover:underline dark:text-blue-500">Create account</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login