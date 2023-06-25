import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";

export default function AuthenticatedRoute({ children, ...rest }) {
    const { pathname, search } =  useLocation();
    const { isAuthenticated } = useAppContext();
    return (
        isAuthenticated ? (
            children
        ) : (
            <Navigate to={
                `/login?redirect=${pathname}${search}`
            } />
        )
    );
}