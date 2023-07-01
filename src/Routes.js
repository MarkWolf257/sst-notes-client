import React from "react";
import { Route, Routes as Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import ResetPassword from "./containers/ResetPassword";
import Settings from "./containers/Settings";
import ChangePassword from "./containers/ChangePassword";
import ChangeEmail from "./containers/ChangeEmail";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/" element={<Home />} />

            <Route exact path="/login" element={
                <UnauthenticatedRoute>
                    <Login />
                </UnauthenticatedRoute>
            } />
            <Route exact path="/signup" element={
                <UnauthenticatedRoute>
                    <Signup />
                </UnauthenticatedRoute>
            } />
            <Route exact path="/login/reset" element={
                <UnauthenticatedRoute>
                    <ResetPassword />
                </UnauthenticatedRoute>
            } />

            <Route exact path="/settings" element={
                <AuthenticatedRoute>
                    <Settings />
                </AuthenticatedRoute>
            } />
            <Route exact path="/settings/password" element={
                <AuthenticatedRoute>
                    <ChangePassword />
                </AuthenticatedRoute>
            } />
            <Route exact path="/settings/email" element={
                <AuthenticatedRoute>
                    <ChangeEmail />
                </AuthenticatedRoute>
            } />

            <Route exact path="/notes/new" element={
                <AuthenticatedRoute>
                    <NewNote />
                </AuthenticatedRoute>
            } />
            <Route exact path="/notes/:id" element={
                <AuthenticatedRoute>
                    <Notes />
                </AuthenticatedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
        </Switch>
    );
}