import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_READY_CHECK, UPDATE_READY_CHECK } from '../utils/mutations';

function CreateReadyCheckPage({ readyCheckData }) {
    const navigate = useNavigate();

    const [readyCheck, setReadyCheck] = useState({
        title: '',
        activity: '',
        timing: '',
        description: '',
        users: '',
        responseOptions: [
            { text: "I'm Ready", value: 'accepted' },
            { text: "Maybe", value: 'maybe' },
            { text: "I Can't Join", value: 'declined' }
        ]
    });
    const [mutationFunction, { loading, error }] = useMutation(readyCheckData ? UPDATE_READY_CHECK : CREATE_READY_CHECK);

    useEffect(() => {
        if (readyCheckData) {
            setReadyCheck(readyCheckData);
        }
    }, [readyCheckData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await mutationFunction({ variables: { input: readyCheck } });
            const newReadyCheck = data.createReadyCheck || data.updateReadyCheck;
            navigate(`/rsvp/${newReadyCheck.id}`);
        } catch (err) {
            console.error('Error creating or updating Ready Check:', err);
        }
    };

    return (
        <div>
            <h1>{readyCheckData ? 'Edit' : 'Create'} Ready Check</h1>
            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                    type="text"
                    value={readyCheck.title}
                    onChange={(e) => setReadyCheck({ ...readyCheck, title: e.target.value })}
                />
                <label>Get Ready For...</label>
                <input
                    type="text"
                    value={readyCheck.activity}
                    onChange={(e) => setReadyCheck({ ...readyCheck, activity: e.target.value })}
                />
                <label>When to be ready</label>
                <input
                    type="datetime-local"
                    value={readyCheck.timing}
                    onChange={(e) => setReadyCheck({ ...readyCheck, timing: e.target.value })}
                />
                <label>Description</label>
                <textarea
                    value={readyCheck.description}
                    onChange={(e) => setReadyCheck({ ...readyCheck, description: e.target.value })}
                />
                <label>Recipients</label>
                <input
                    type="text"
                    value={readyCheck.users}
                    onChange={(e) => setReadyCheck({ ...readyCheck, users: e.target.value })}
                />
                <label>RSVP Options</label>
                <div>
                    {readyCheck.responseOptions.map((option, index) => (
                        <div key={index}>
                            <input
                                type="checkbox"
                                id={option.value}
                                value={option.value}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setReadyCheck(prevState => {
                                        const updatedOptions = prevState.responseOptions.map((o, i) => {
                                            if (index === i) {
                                                return { ...o, selected: checked };
                                            } else {
                                                return o;
                                            }
                                        });
                                        return { ...prevState, responseOptions: updatedOptions };
                                    });
                                }}
                            />
                            <label htmlFor={option.value}>{option.text}</label>
                        </div>
                    ))}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : `${readyCheckData ? 'Update' : 'Create'} Ready Check`}
                </button>
                {error && <p>Error {readyCheckData ? 'updating' : 'creating'} Ready Check: {error.message}</p>}
            </form>
        </div>
    );
}

export default CreateReadyCheckPage;
