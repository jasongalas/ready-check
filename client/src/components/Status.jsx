import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_STATUS } from '../utils/mutations';

function Status({ userId, currentUser, initialStatus }) {
    const [status, setStatus] = useState(initialStatus);
    const [editing, setEditing] = useState(false);
    const [newStatus, setNewStatus] = useState(status);
    const [updateStatus] = useMutation(UPDATE_USER_STATUS);

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const { data } = await updateStatus({
                variables: {
                    userId,
                    status: newStatus
                }
            });
            setStatus(data.updateUserStatus.status);
            setEditing(false);
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleCancelClick = () => {
        setEditing(false);
        setNewStatus(status);
    };

    return (
        <div>
            {editing ? (
                <div>
                    <input
                        type="text"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                    />
                    <button onClick={handleSaveClick}>Save</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                </div>
            ) : (
                <div>
                    <span>{status}</span>
                    {userId === currentUser.id && (
                        <button onClick={handleEditClick}>Edit</button>
                    )}
                </div>
            )}
        </div>
    );
}

Status.propTypes = {
    userId: PropTypes.string.isRequired,
    currentUser: PropTypes.shape({
        id: PropTypes.string.isRequired
    }).isRequired,
    initialStatus: PropTypes.string
};

Status.defaultProps = {
    initialStatus: ''
};

export default Status;
