import React, { useState } from 'react';
import FriendsList from './FriendsList';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_READY_CHECK } from '../utils/mutations';
import { useSocket } from '../pages/SocketContext';
import Auth from '../utils/auth';

function ReadyCheckForm() {
    const [readyCheck, setReadyCheck] = useState({
        title: '',
        description: '',
        activity: '',
        timing: '',
        recipients: [],
    });

    const navigate = useNavigate();
    const socket = useSocket();

    const [createReadyCheck, { loading, error }] = useMutation(CREATE_READY_CHECK, {
        onCompleted: (data) => {
            navigate(`/readycheck/${data.createReadyCheck.id}`);
        }
    });

    const handleReadyCheck = (e) => {
        const {name, value} = e.target;
        setReadyCheck({...readyCheck, name: value})
    }

    const setRecipients = (recipients) => {
        setReadyCheck({...readyCheck, recipients: [...recipients]})
    }

    useEffect(() => {
        if (socket) {
            socket.on('readyCheckCreated', (readyCheck) => {
                console.log('ReadyCheck created:', readyCheck);
                // Additional logic to handle the created ReadyCheck if necessary
            });

            // Clean up the event listener when the component unmounts
            return () => {
                socket.off('readyCheckCreated');
            };
        }
    }, [socket]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { data } = await createReadyCheck({ variables: { input: readyCheck } });

        if (data) {
            socket.emit('createReadyCheck', data.createReadyCheck);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input 
                    type="text" 
                    value={readyCheck.title} 
                    onChange={handleReadyCheck} 
                    required 
                    name="title"
                />
            </div>
            <div>
                <label>When to be ready</label>
                <input 
                    type="datetime-local" 
                    value={readyCheck.timing} 
                    onChange={handleReadyCheck} 
                    required 
                    name="timing"
                />
            </div>
            <div>
                <label>What to be ready for</label>
                <input 
                    type="text" 
                    value={readyCheck.activity} 
                    onChange={handleReadyCheck} 
                    required 
                    name="activity"
                />
            </div>
            <div>
                <label>Description</label>
                <textarea 
                    value={readyCheck.description} 
                    onChange={handleReadyCheck}  
                    name="description"
                />
            </div>
            <FriendsList setRecipients={setRecipients} />

            <button id="submitReadyCheck" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Ready Check'}
            </button>
            {error && <p>Error: {error.message}</p>}
        </form>
    );
}

export default ReadyCheckForm;
