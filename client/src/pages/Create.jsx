import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_READY_CHECK } from '../utils/mutations';

function CreateReadyCheckPage() {
    const [readyCheck, setReadyCheck] = useState({
        title: '',
        whatToBeReadyFor: '',
        whenToBeReady: '',
        description: '',
        users: '',
        responseOptions: [
            { text: "I'm Ready", value: 'accepted' },
            { text: "I'll be Late", value: 'accepted-late' },
            { text: "I Can't Join", value: 'denied' }
        ]
    });
    const history = useHistory();
    const [createReadyCheck, { loading, error }] = useMutation(CREATE_READY_CHECK);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await createReadyCheck({ variables: { input: readyCheck } });
            const createdReadyCheck = data.createReadyCheck;
            history.push(`/rsvp/${createdReadyCheck.id}`);
        } catch (err) {
            console.error('Error creating Ready Check:', err);
        }
    };

    const handleResponseOptionsChange = (newOptions) => {
        setReadyCheck({ ...readyCheck, responseOptions: newOptions });
    };

    return (
        <div>
            <h1>Create Ready Check</h1>
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
                    value={readyCheck.whatToBeReadyFor}
                    onChange={(e) => setReadyCheck({ ...readyCheck, whatToBeReadyFor: e.target.value })}
                />
                <label>When to be ready</label>
                <input
                    type="datetime-local"
                    value={readyCheck.whenToBeReady}
                    onChange={(e) => setReadyCheck({ ...readyCheck, whenToBeReady: e.target.value })}
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Ready Check'}
                </button>
                {error && <p>Error creating Ready Check: {error.message}</p>}
            </form>
        </div>
    );
}

export default CreateReadyCheckPage;
