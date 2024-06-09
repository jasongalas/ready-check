import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_READY_CHECK } from '../utils/mutations';
import { QUERY_INVITEES, QUERY_ME } from '../utils/queries';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../pages/SocketContext';

function ReadyCheckForm({ userId, onReadyCheckCreated }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [activity, setActivity] = useState('');
    const [timing, setTiming] = useState(new Date().toISOString().slice(0, 16)); // default to current time
    const [invitees, setInvitees] = useState([]);

    const { loading: meLoading, data: meData } = useQuery(QUERY_ME);

    const navigate = useNavigate();
    const socket = useSocket();

    const [createReadyCheck, { loading, error }] = useMutation(CREATE_READY_CHECK, {
        update(cache, { data: { createReadyCheck } }) {
            const { me } = cache.readQuery({ query: QUERY_ME });

            cache.writeQuery({
                query: QUERY_ME,
                data: { me: { ...me, ownedReadyChecks: [...me.ownedReadyChecks, createReadyCheck] } }
            });
        },
        onCompleted: (data) => {
            navigate(`/readycheck/${data.createReadyCheck._id}`);
            if (onReadyCheckCreated) {
                onReadyCheckCreated();
            }
            socket.emit('createReadyCheck', data.createReadyCheck);
        }
    });

    useEffect(() => {
        if (socket) {
            socket.on('readyCheckCreated', (readyCheck) => {
                console.log('ReadyCheck created:', readyCheck);
            });

            return () => {
                socket.off('readyCheckCreated');
            };
        }
    }, [socket]);

    useEffect(() => {
        const localTime = new Date().toLocaleString('en-CA', { hour12: false }).replace(",", "");
        setTiming(localTime.slice(0, 16));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createReadyCheck({
            variables: {
                input: {
                    title,
                    activity,
                    timing,
                    description,
                    inviteeIds: invitees,
                    ownerId: userId, // Assign the owner ID
                }
            }
        });
    };

    const handleInviteeClick = (id) => {
        setInvitees((prevInvitees) =>
            prevInvitees.includes(id)
                ? prevInvitees.filter((inviteeId) => inviteeId !== id)
                : [...prevInvitees, id]
        );
    };

    if (meLoading) {
        return <div>Loading...</div>;
    }

    const friends = meData?.me?.friends || [];

    return (
        <div>
            <h3 className="font-bold text-center p-3 text-3xl">Create Ready Check</h3>
            <form id="readyCheckForm" onSubmit={handleSubmit}>
                <div className="label">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="input input-bordered w-full max-w-xs"
                    />
                </div>
                <div className="label">
                    <label>Activity:</label>
                    <input
                        type="text"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        required
                        className="input input-bordered w-full max-w-xs"
                    />
                </div>
                <div className="label">
                    <label>Timing:</label>
                    <input
                        type="datetime-local"
                        value={timing}
                        onChange={(e) => setTiming(e.target.value)}
                        required
                        className="input input-bordered w-full max-w-xs"
                    />
                </div>
                <div className="label">
                    <label>Description (optional):</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="textarea w-full max-w-xs textarea-bordered"
                    />
                </div>
                <div className="flex flex-wrap gap-2 mb-2 justify-center" style={{ flexDirection: 'row' }}>
                    {invitees.map((inviteeId) => {
                        const invitee = friends.find((friend) => friend._id === inviteeId);
                        return (
                            <button
                                key={invitee._id}
                                type="button"
                                onClick={() => handleInviteeClick(invitee._id)}
                                className="btn btn-primary m-2"
                            >
                                {invitee.username}
                            </button>
                        );
                    })}
                </div>
                <div className="label">
                    <label>Invitees:</label>
                    <select
                        className="select select-bordered w-full max-w-xs"
                        onChange={(e) => handleInviteeClick(e.target.value)}
                    >
                        <option value="">Select Invitees</option>
                        {friends.map((friend) => (
                            <option key={friend._id} value={friend._id}>
                                {friend.username}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="justify-center modal-action">
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Ready Check'}
                    </button>
                    {error && <p>Error: {error.message}</p>}
                </div>
            </form>
        </div>
    );
}

export default ReadyCheckForm;
