import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_READY_CHECK } from '../utils/queries';
import { UPDATE_READY_CHECK } from '../utils/mutations';

function RSVPPage() {
    const { id } = useParams();
    const [editing, setEditing] = useState(false);
    const { loading, error, data } = useQuery(QUERY_READY_CHECK, { variables: { id } });
    const [updateReadyCheck] = useMutation(UPDATE_READY_CHECK);

    const readyCheck = data ? data.readyCheck : null;

    const [editedReadyCheck, setEditedReadyCheck] = useState(readyCheck);

    useEffect(() => {
        if (readyCheck) {
            setEditedReadyCheck(readyCheck);
        }
    }, [readyCheck]);

    const handleSave = async () => {
        try {
            const { data } = await updateReadyCheck({
                variables: {
                    id,
                    input: {
                        title: editedReadyCheck.title,
                        whatToBeReadyFor: editedReadyCheck.whatToBeReadyFor,
                        whenToBeReady: editedReadyCheck.whenToBeReady,
                        description: editedReadyCheck.description,
                        responseOptions: editedReadyCheck.responseOptions
                    }
                }
            });
            setEditedReadyCheck(data.updateReadyCheck);
            setEditing(false);
        } catch (err) {
            console.error('Error updating Ready Check:', err);
        }
    };

    const groupResponses = () => {
        const groups = {
            "No Reply": [],
            "I'm Ready": [],
            "I'll be Late": [],
            "I Can't Join": []
        };

        readyCheck.users.forEach((user) => {
            const response = readyCheck.responses.find(r => r.userId === user.id);
            if (response) {
                groups[response.answer].push(user);
            } else {
                groups["No Reply"].push(user);
            }
        });

        return groups;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading Ready Check: {error.message}</div>;

    const responseGroups = groupResponses();

    return (
        <div>
            <h1>RSVP for {editedReadyCheck.title}</h1>
            {editing ? (
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={editedReadyCheck.title}
                        onChange={(e) => setEditedReadyCheck({ ...editedReadyCheck, title: e.target.value })}
                    />
                    <label>Description</label>
                    <textarea
                        value={editedReadyCheck.description}
                        onChange={(e) => setEditedReadyCheck({ ...editedReadyCheck, description: e.target.value })}
                    />
                    <label>Get Ready For...</label>
                    <input
                        type="text"
                        value={editedReadyCheck.whatToBeReadyFor}
                        onChange={(e) => setEditedReadyCheck({ ...editedReadyCheck, whatToBeReadyFor: e.target.value })}
                    />
                    <label>When to be ready</label>
                    <input
                        type="datetime-local"
                        value={editedReadyCheck.whenToBeReady}
                        onChange={(e) => setEditedReadyCheck({ ...editedReadyCheck, whenToBeReady: e.target.value })}
                    />
                    <label>Response options</label>
                    {editedReadyCheck.responseOptions.map((option, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                    const newOptions = [...editedReadyCheck.responseOptions];
                                    newOptions[index] = e.target.value;
                                    setEditedReadyCheck({ ...editedReadyCheck, responseOptions: newOptions });
                                }}
                            />
                        </div>
                    ))}
                    <button onClick={handleSave}>Save</button>
                </div>
            ) : (
                <div>
                    <p>{editedReadyCheck.description}</p>
                    <p>{editedReadyCheck.whatToBeReadyFor}</p>
                    <p>{new Date(editedReadyCheck.whenToBeReady).toLocaleString()}</p>
                    {/* Display more details */}
                    <button onClick={() => setEditing(true)}>Edit</button>
                </div>
            )}
            <h2>Responses</h2>
            <div>
                {Object.keys(responseGroups).map((group) => (
                    <div key={group}>
                        <h3>{group}</h3>
                        <ul>
                            {responseGroups[group].map((user) => (
                                <li key={user.id}>{user.name}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RSVPPage;
