import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import { Auth } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { useFormFields } from "../libs/hooksLib";
import { Link } from "react-router-dom";
import FacebookButton from "../components/FacebookButton";

export default function Login() {
    const { userHasAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: ""
    });

    function validateForm() {
        return fields.email.length > 0 && fields.password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        try {
            await Auth.signIn(fields.email, fields.password);
            userHasAuthenticated(true);
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function handleFbLogin () {
        userHasAuthenticated(true);
    }

    return (
        <div className="Login">
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={fields.email}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Link to="/login/reset">Forgot password?</Link>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Login
                </LoaderButton>
                <hr className="mt-4 mb-4" />
                <FacebookButton
                    onLogin={handleFbLogin}
                />
            </Form>
        </div>
    );
}