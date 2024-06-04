import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_READY_CHECK } from '../utils/queries';
import { UPDATE_READY_CHECK } from '../utils/mutations';

function LiveReadyCheckPage() {
    const { id } = useParams();

    const [updatedReadyCheckData, setUpdatedReadyCheckData] = useState({});
    const [selectedResponse, setSelectedResponse] = useState('');

    // Queries & mutations
    const { loading, error, data } = useQuery(QUERY_READY_CHECK, {
        variables: { readyCheckId: id },
    });
    const [updateReadyCheck] = useMutation(UPDATE_READY_CHECK);

    // Function to handle updating the ready check
    const handleUpdateReadyCheck = () => {
        updateReadyCheck({
            variables: {
                readyCheckId: id,
                input: updatedReadyCheckData,
            },
        })
            .then((result) => {
                console.log('Ready check updated successfully:', result);
            })
            .catch((error) => {
                console.error('Error updating ready check:', error);
            });
    };

    // Function to handle RSVP selection
    const handleRSVPSelection = (response) => {
        setSelectedResponse(response);
        setUpdatedReadyCheckData({ ...updatedReadyCheckData, attendees: [{ user: currentUser, status: response }] });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const { title, description, activity, timing, attendees } = data.readyCheck;

    // Check if the current user is the owner of the ready check
    const isOwner = data.readyCheck.owner === currentUser; // Replace currentUser with the actual logged-in user

    return (
        <div>
            <h1>{title}</h1>
            <p>{description}</p>
            <p>{activity}</p>
            <p>{timing}</p>
            {/* RSVP list */}
            <ul>
                {attendees.map((attendee) => (
                    <li key={attendee.user._id}>
                        {attendee.user.username} - {attendee.status}
                    </li>
                ))}
            </ul>
            {/* Conditional rendering based on user type */}
            {isOwner ? (
                // Version for owner with edit button
                <form onSubmit={handleUpdateReadyCheck}>
                    {/* Add form fields to update ready check */}
                    <button type="submit">Update Ready Check</button>
                </form>
            ) : (
                // Version for invitee with RSVP options
                <div>
                    {/* RSVP options */}
                    <label>
                        RSVP Options:
                        <select value={selectedResponse} onChange={(e) => handleRSVPSelection(e.target.value)}>
                            <option value="">Select an option</option>
                            <option value="accepted">I'm Ready</option>
                            <option value="maybe">Maybe</option>
                            <option value="denied">I Can't Join</option>
                        </select>
                    </label>
                </div>
            )}
        </div>
    );
}

export default LiveReadyCheckPage;
