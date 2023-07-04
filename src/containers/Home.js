import React, { useState, useEffect } from "react";
import "./Home.css";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API, Storage } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";

export default function Home() {
    const [notes, setNotes] = useState([]);
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const [pattern, setPattern] = useState("");
    const [selected, setSelected] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) {
                return;
            }

            try {
                const notes = await loadNotes();
                for (let note of notes) {
                    if (note.attachment) note.attachmentURL = await Storage.vault.get(note.attachment);
                }
                setNotes(notes);
            } catch (e) {
                onError(e);
            }

            setIsLoading(false);
        }

        onLoad();
    }, [isAuthenticated, isDeleting]);

    function loadNotes() {
        return API.get("notes", "/notes");
    }

    async function deleteNote() {
        let p;
        selected.forEach(element => {
            p = API.del("notes", `/notes/${element}`);
        });
        return p;
    }

    async function handleDelete(event) {
        event.preventDefault();

        const confirmed = selected.length === 0 ? function() {
            alert("No file selected!");
            return false;
        }() : window.confirm(
            "Are you sure you want to delete the selected note(s)?"
        );

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteNote();
        } catch (e) {
            onError(e);
            
        }
        setSelected([]);
        setIsDeleting(false);
    }

    function handleCheck(e) {
        if (e.target.checked){
            setSelected((oldArray) => [...oldArray, e.target.id]);
        } else {
            setSelected(function(oldArray) {
                const a = oldArray.indexOf(e.target.id);
                return [...oldArray.slice(0,a), ...oldArray.slice(a+1)];
            });
        }
    }


    function renderNotesList(notes) {
        return (
            <>
                <LinkContainer to="/notes/new">
                    <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                        <BsPencilSquare size={17} />
                        <span className="ml-2 font-weight-bold">Create a new note</span>
                    </ListGroup.Item>
                </LinkContainer>
                <div style={{maxHeight: '60vh', overflow: 'auto'}}>
                    {notes.map(({ noteId, content, createdAt, attachment, attachmentURL }) => (
                        <> {content.includes(pattern) &&
                            <ListGroup.Item action>
                                <Form.Check type="checkbox" key={noteId} id={noteId} className="hello" autocomplete="off" label={
                                    <LinkContainer key={noteId} to={`/notes/${noteId}`}>
                                        <ListGroup.Item action>
                                            <span className="font-weight-bold">
                                                {content.trim().split("\n")[0]}
                                            </span>
                                            <br />
                                            <span className="text-muted">
                                                Created: {new Date(createdAt).toLocaleString()}
                                            </span>
                                            <br />
                                            {attachment && <span className="text-muted">Attachment: {attachment}</span>}
                                            <br />
                                            {attachmentURL && <img src={attachmentURL} alt="" />}
                                        </ListGroup.Item>
                                    </LinkContainer>
                                } onChange={handleCheck}/>
                            </ListGroup.Item>
                        } </>
                    ))}
                </div>
            </>
        );
    }

    function renderLander() {
        return (
            <div className="lander">
                <h1>Scratch</h1>
                <p className="text-muted">A simple note taking app</p>
                <div className="pt-3">
                    <Link to="/login" className="btn btn-info btn-lg mr-3">
                        Login
                    </Link>
                    <Link to="/signup" className="btn btn-success btn-lg">
                        Signup
                    </Link>
                </div>
            </div>
        );
    }

    function renderNotes() {
        return (
            <div className="notes">
                <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
                <Form.Label>Search Bar</Form.Label>
                <Form.Control className="mb-3" type="text" placeholder="Search" onChange={(e) => {setPattern(e.target.value)}} />
                <LoaderButton variant="danger" onClick={handleDelete} disabled={selected.length === 0} isLoading={isDeleting}>Delete</LoaderButton>
                <hr />
                <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
            </div>
        );
    }

    return (
        <div className="Home">
            {isAuthenticated ? renderNotes() : renderLander()}
        </div>
    );
}