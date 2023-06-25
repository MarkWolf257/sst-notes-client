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