


import React, { useState } from 'react';
import UserList from './UserList';
import ResponseOptions from './ResponseOptions';
import { useHistory } from 'react-router-dom';
import { createReadyCheck } from '../utils/api';

function ReadyCheckForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [whatToBeReadyFor, setWhatToBeReadyFor] = useState('');
    const [whenToBeReady, setWhenToBeReady] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [responseOptions, setResponseOptions] = useState([]);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const readyCheck = {
            title,
            description,
            whatToBeReadyFor,
            whenToBeReady,
            selectedUsers,
            responseOptions
        };
        
        const newReadyCheck = await createReadyCheck(readyCheck);
        history.push(`/rsvp/${newReadyCheck.id}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Description</label>
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>What to be ready for</label>
                <input 
                    type="text" 
                    value={whatToBeReadyFor} 
                    onChange={(e) => setWhatToBeReadyFor(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>When to be ready</label>
                <input 
                    type="datetime-local" 
                    value={whenToBeReady} 
                    onChange={(e) => setWhenToBeReady(e.target.value)} 
                    required 
                />
            </div>
            <UserList selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
            <ResponseOptions responseOptions={responseOptions} setResponseOptions={setResponseOptions} />
            <button type="submit">Create Ready Check</button>
        </form>
    );
}

export default ReadyCheckForm;
