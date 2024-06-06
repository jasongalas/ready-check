import React, { useState, useEffect } from 'react';
import FriendsList from './FriendsList';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_READY_CHECK } from '../utils/mutations';
import { QUERY_INVITEES } from '../utils/queries'
import { useSocket } from '../pages/SocketContext';
// import Auth from '../utils/auth';

function ReadyCheckForm({ userId }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [activity, setActivity] = useState('');
    const [timing, setTiming] = useState('');
    const [invitees, setInvitees] = useState([]);
    const responseOptions = [`I'm In`, `I'm Out`, `Maybe`];

    const { loading: inviteesLoading, data: inviteeData } = useQuery(QUERY_INVITEES);
    console.log(inviteeData)

    const [readyCheck, setReadyCheck] = useState({
        title: '',
        description: '',
        activity: '',
        timing: '',
        invitees: [],
    });

    const navigate = useNavigate();
    const socket = useSocket();

    const [createReadyCheck, { loading, error }] = useMutation(CREATE_READY_CHECK, {
        onCompleted: (data) => {
            console.log("DATA", data)
            navigate(`/readycheck/${data.createReadyCheck._id}`);
        }
    });

    const handleReadyCheck = (e) => {
        console.log(e.target)
        console.log(readyCheck)
        const { name, value } = e.target;
        setReadyCheck({ ...readyCheck, name: value })
    }

    // const setRecipients = (recipients) => {
    //     setReadyCheck({ ...readyCheck, recipients: [...recipients] })
    // }

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
        // console.log("TITLE:", title, "ACTIVITY:", activity, "TIMING:", timing, "DESCRIPTION:", description, "INVITEES:", invitees)
        const { data } = await createReadyCheck({
            variables: {
                input:
                {
                    title,
                    activity,
                    timing,
                    description,
                    inviteeIds: invitees,
                }
            }
        });

        if (data) {
            socket.emit('createReadyCheck', data.createReadyCheck);
        }
    };

    return (
        <form id="readyCheckForm" onSubmit={handleSubmit}>
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
            <label>Invitees</label>
            {inviteesLoading == true ? <div>Loading...</div> :
                <select 
                onChange={(e) => { console.log(e.target.value); setInvitees([e.target.value])}}
                >{inviteeData.getUsers.map((user) => {
                    return <option value={user._id}>
                        {user.username}
                    </option>
                })}</select>
            }

            <button id="submitReadyCheck" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Ready Check'}
            </button>
            {error && <p>Error: {error.message}</p>}
        </form>
    );
}

export default ReadyCheckForm;
