import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchReadyCheck, updateReadyCheck } from '../utils/api';

function RSVPPage() {
    const { id } = useParams();
    const [readyCheck, setReadyCheck] = useState(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const loadReadyCheck = async () => {
            const readyCheckData = await fetchReadyCheck(id);
            setReadyCheck(readyCheckData);
        };
        loadReadyCheck();
    }, [id]);

    const handleSave = async () => {
        const updatedCheck = await updateReadyCheck(id, readyCheck);
        setReadyCheck(updatedCheck);
        setEditing(false);
    };

    if (!readyCheck) return <div>Loading...</div>;

    return (
        <div>
            <h1>RSVP for {readyCheck.title}</h1>
            {editing ? (
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={readyCheck.title}
                        onChange={(e) => setReadyCheck({ ...readyCheck, title: e.target.value })}
                    />
                    <label>Description</label>
                    <textarea
                        value={readyCheck.description}
                        onChange={(e) => setReadyCheck({ ...readyCheck, description: e.target.value })}
                    />
                    {/* Add more fields as necessary */}
                    <button onClick={handleSave}>Save</button>
                </div>
            ) : (
                <div>
                    <p>{readyCheck.description}</p>
                    {/* Display more details */}
                    <button onClick={() => setEditing(true)}>Edit</button>
                </div>
            )}
            <h2>Responses</h2>
            <ul>
                {readyCheck.responses.map((response) => (
                    <li key={response.userId}>{response.userName}: {response.answer}</li>
                ))}
            </ul>
        </div>
    );
}

export default RSVPPage;
