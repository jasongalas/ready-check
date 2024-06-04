import React, { useState } from 'react';
import UserList from './UserList';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_READY_CHECK } from '../utils/mutations';

function ReadyCheckForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [activity, setActivity] = useState('');
    const [timing, setTiming] = useState('');
    const [recipients, setRecipients] = useState([]);
    const responseOptions = [`I'm In`, `I'm Out`, `Maybe`];
    const navigate = useNavigate();

    const [createReadyCheck, { loading, error }] = useMutation(CREATE_READY_CHECK, {
        onCompleted: (data) => {
            navigate(`/rsvp/${data.createReadyCheck.id}`);
        }
    });

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
        
        await createReadyCheck({ variables: { input: readyCheck } });
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
            <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Ready Check'}
            </button>
            {error && <p>Error: {error.message}</p>}
        </form>
    );
}

export default ReadyCheckForm;
