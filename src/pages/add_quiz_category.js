import React, { useState, useEffect } from "react";
import { useFormik } from 'formik';
import axios from "axios";
import { base_url } from "../utils/constants";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddQuizCategory = () => {
    useEffect(() => {
        const storedLoginResult = JSON.parse(localStorage.getItem('login_result'));
        console.log("Login Result:", storedLoginResult);
        setLoginResult(storedLoginResult);

    }, [])

    const [loginResult, setLoginResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: { title: '' },
        initialErrors: {
            title: 'Title is required',

        },
        validate: (values) => {
            const errors = {};
            if (!values.title) {
                errors.title = 'Title is required';
            }
            return errors;
        },
        onSubmit: (values, { setSubmitting }) => {
            handleSubmit(values);
            setSubmitting(false);
        },
    });

    const handleSubmit = async (values) => {
        const token = loginResult.token;
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        setLoading(true);

        try {
            // Perform the API POST call using Axios
            const response = await axios.post(`${base_url}/quiz/category/create`, values, { headers });
            if (response.status === 200) {
                if (response.data && response.data.code) {
                    if (response.data.code === 404) {
                        toast.error(response.data.message);
                    } else {
                        toast.success(response.data.message);
                        formik.resetForm();
                    }
                }
            } else {
                // Handle errors, e.g., display an error message
                console.error("Error:", response.data);
            }
        } catch (error) {
            // Handle network errors
            console.error("Network Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="bg-gray-50 h-screen">
                <section className=" mx-auto bg-white shadow-md mt-10">
                    <div className="py-8 px-4 mx-auto">
                        <h2 className="mb-4 text-xl font-bold text-gray-900">Add a new quiz category</h2>
                        <form className="mt-10" onSubmit={formik.handleSubmit}>
                            <div className="w-full">
                                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Quiz Title</label>
                                <input type="text" name="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="General Knowledge" onChange={formik.handleChange}
                                    value={formik.values.title} />
                                {formik.touched.title && formik.errors.title && (
                                    <div className="text-red-500">{formik.errors.title}</div>
                                )}
                            </div>
                            <div className="flex justify-center mt-4">
                                <button type="submit" className={`inline-flex items-center px-5 py-2.5 mt-4  text-sm font-medium text-center text-white  rounded-lg focus:ring-4  ${formik.isValid ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-300' : 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-300'}`}>
                                    {loading ? "Loading..." : "Add Quiz Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
            <ToastContainer />
        </div>
    )
};

export default AddQuizCategory;