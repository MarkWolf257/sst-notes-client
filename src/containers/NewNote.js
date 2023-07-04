import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./NewNote.css";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";

export default function NewNote() {
    const navigate = useNavigate();
    const [content, setContent] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [path, setPath] = useState([]);
    const [notes, setNotes] = useState([0]);
    const [files, setFiles] = useState([]);

    function handleFileChange(event) {
        const index = event.target.index;
        files[index] = event.target.files[0];
        setFiles((oldArray) => [...oldArray.slice(0, index), files[index], ...oldArray.slice(index+1)]);
        if (event.target.files.length !== 0 && files[index].type.includes('image')) {
            setPath((oldArray) => [...oldArray.slice(0, index), URL.createObjectURL(files[index]), ...oldArray.slice(index+1)]);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        for (let index of notes) {
            if (files[index] && files[index].size > config.MAX_ATTACHMENT_SIZE) {
                alert(
                    `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`
                );
                return;
            }
        }

        setIsLoading(true);

        try {
            for (let index of notes) {
                const attachment = files[index] ? await s3Upload(files[index]) : null;
                await createNote({ content: content[index], attachment });
            }
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }

        navigate("/");

        /*if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(
                `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`
            );
            return;
        }

        setIsLoading(true);

        try {
            const attachment = file.current ? await s3Upload(file.current) : null;

            await createNote({ content, attachment });
            navigate("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }*/
    }

    function createNote(note) {
        return API.post("notes", "/notes", {
            body: note
        });
    }

    function renderInput(index) {
        return (
            <div>
                <Form.Group controlId="content">
                    <Form.Control
                        value={content[index]}
                        as="textarea"
                        onChange={(e) => setContent((oldArray) => [...oldArray.slice(0, index), e.target.value, ...oldArray.slice(index+1)])}
                    />
                </Form.Group>
                <Form.Group controlId="file">
                    <Form.Label>Attachment</Form.Label>
                    <Form.Control index={0} onChange={handleFileChange} type="file" />
                </Form.Group>
                {path[index] && <img src={path[index]} alt="" />}
                
            </div>
        );
    }

    return (
        <div className="NewNote">
            <Form onSubmit={handleSubmit}>
                {notes.map((index) => renderInput(index))}
                <Button className="mb-4" onClick={() => setNotes((oldArray) => [...oldArray, oldArray.length])}>Add Note</Button>
                <Button variant="danger" disabled={notes.length < 2} onClick={async function() {
                    await setNotes((oldArray) => oldArray.slice(0, -1));
                    setContent((oldArray) => oldArray.slice(0, notes.length-1));
                    setFiles((oldArray) => oldArray.slice(0, notes.length-1));
                    setPath((oldArray) => oldArray.slice(0, notes.length-1))
                }}>Remove Note</Button>
                <LoaderButton
                    block
                    type="submit"
                    size="lg"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={function() {
                        for (let p of content) {
                            if (!p) return true;
                        }
                        return false;
                    }}
                >
                    Create
                </LoaderButton>
            </Form>
        </div>
    );
}