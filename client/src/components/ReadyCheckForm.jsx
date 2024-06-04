


import React, { useState } from 'react';
import UserList from './UserList';
import ResponseOptions from './ResponseOptions';
import { useHistory } from 'react-router-dom';
import { createReadyCheck } from '../utils/api';

function ReadyCheckForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [activity, setActivity] = useState('');
    const [timing, setTiming] = useState('');
    const [recipients, setRecipients] = useState([]);
    const [responseOptions, setResponseOptions] = useState([]);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const readyCheck = {
            title,
            description,
            activity,
            timing,
            recipients,
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
                    value={activity} 
                    onChange={(e) => setActivity(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>When to be ready</label>
                <input 
                    type="datetime-local" 
                    value={timing} 
                    onChange={(e) => setTiming(e.target.value)} 
                    required 
                />
            </div>
            <UserList recipients={recipients} setRecipients={setRecipients} />
            <ResponseOptions responseOptions={responseOptions} setResponseOptions={setResponseOptions} />
            <button type="submit">Create Ready Check</button>
        </form>
    );
}

export default ReadyCheckForm;
