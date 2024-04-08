import axios from "axios";
import { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { Link } from "react-router-dom";
import "./SignIn.css";
import successicon from "./../../assets/done-icon.svg";
import erroricon from "./../../assets/red-x-icon.svg";

interface FormValues {
    username: string;
    email: string;
    password: string;
}

function validateEmail(value: string) {
    let error;
    if (!value) {
        error = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        error = "Invalid email address";
    }
    return error;
}

function validatePassword(value: string) {
    let error;
    if (!value || value.length < 8) {
        error = "Must be at least 8 characters";
    }
    return error;
}

function validateName(value: string) {
    let error;
    if (!value || value.length < 5) {
        error = "Required";
    }
    return error;
}

function SignIn() {
    const [isSignIn, setIsSignIn] = useState(false);
    const [notSignIn, setNotSignIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("Error!");

    const getRegistration = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
        try {
            const res = await axios.post("http://localhost:8080/auth/sign-up", values);
            console.log("Sign in success: ", res);
            setIsSignIn(true);
        } catch (error) {
            setNotSignIn(true);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setErrorMessage(error.response?.data?.message || "Error!");
            console.error("Sign in failed: ", error);
        } finally {
            actions.setSubmitting(false);
        }
    };

    return (
        <div className="display-container">
            <div className="main-container">
                <div className="preForm-container">
                    {isSignIn && (
                        <div className="IsSignIn">
                            <img src={successicon} width={"20px"} height={"20px"} style={{ marginRight: "5px" }} /> Success!
                        </div>
                    )}
                    {notSignIn && (
                        <div className="NotSignIn">
                            <img src={erroricon} width={"20px"} height={"20px"} style={{ marginRight: "5px" }} /> {errorMessage}
                        </div>
                    )}
                    <h1>Create an account</h1>
                    <p>Lets get started with your 30 days free trial.</p>
                    <Formik
                        initialValues={{
                            username: "",
                            email: "",
                            password: "",
                        }}
                        onSubmit={(values, actions) => {
                            getRegistration(values, actions);
                        }}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form className="form-container">
                                <Field name="username" validate={validateName} className="input-field" placeholder="  Username" />
                                {errors.username && touched.username && <div className="error">{errors.username}</div>}

                                <Field name="email" validate={validateEmail} className="input-field" placeholder="  Email" />
                                {errors.email && touched.email && <div className="error">{errors.email}</div>}

                                <Field name="password" validate={validatePassword} className="input-field" placeholder="  Password" />
                                {errors.password && touched.password && <div className="error">{errors.password}</div>}

                                <button type="submit" className="btn-sub" disabled={isSubmitting}>
                                    {isSubmitting ? "Creating Account..." : "Create account"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                    <button className="btn-google">Sign up with Google</button>
                    <div className="link-login">
                        Already have an account? <Link to="/" className="loginlink">Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
