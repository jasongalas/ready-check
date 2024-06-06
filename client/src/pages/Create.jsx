import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_READY_CHECK } from '../utils/mutations';
import { io } from 'socket.io-client';

const socket = io();

const CreateReadyCheck = () => {
    const [formState, setFormState] = useState({
        owner: '',
        title: '',
        activity: '',
        timing: '',
        description: '',
    });

    const [createReadyCheck, { error, data }] = useMutation(CREATE_READY_CHECK);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await createReadyCheck({
                variables: { input: formState },
            });
            socket.emit('createReadyCheck', formState); // Assuming you want to emit the ready check creation event to the server
        } catch (error) {
            console.error('Error creating ready check:', error);
        }
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <input
                name="owner"
                onChange={handleChange}
                placeholder="Owner"
            />
            <input
                name="title"
                onChange={handleChange}
                placeholder="Title"
            />
            <input
                name="activity"
                onChange={handleChange}
                placeholder="Activity"
            />
            <input
                name="timing"
                onChange={handleChange}
                placeholder="Timing"
                type="datetime-local"
            />
            <input
                name="description"
                onChange={handleChange}
                placeholder="Description"
            />
            <button type="submit">Create Ready Check</button>
        </form>
    );
};

export default CreateReadyCheck;
