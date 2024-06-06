import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_READY_CHECK } from '../utils/queries';
import { UPDATE_READY_CHECK } from '../utils/mutations';
import { useSocket } from './SocketContext';
import Auth from '../utils/auth';

function LiveReadyCheckPage() {
  const { id } = useParams();
  const socket = useSocket();
  const currentUser = Auth.getProfile().data.username;

  const [updatedReadyCheckData, setUpdatedReadyCheckData] = useState({});
  const [selectedResponse, setSelectedResponse] = useState('');

  const { loading, error, data } = useQuery(QUERY_READY_CHECK, {
    variables: { readyCheckId: id },
  });

  const [updateReadyCheck] = useMutation(UPDATE_READY_CHECK);

  useEffect(() => {
    if (socket) {
      socket.on('readyCheckUpdate', (update) => {
        // handle the update
        // use mutations and useSocket here
        // response first, then append user data before send
        
      });
    }
  }, [socket]);

  const handleUpdateReadyCheck = () => {
    updateReadyCheck({
      variables: {
        readyCheckId: id,
        input: updatedReadyCheckData,
      },
    }).then((result) => {
      console.log('Ready check updated successfully:', result);
    }).catch((error) => {
      console.error('Error updating ready check:', error);
    });
  };

  const handleRSVPSelection = (response) => {
    setSelectedResponse(response);
    setUpdatedReadyCheckData({ ...updatedReadyCheckData, attendees: [{ user: currentUser, status: response }] });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { title, description, activity, timing, attendees, owner } = data.readyCheck;
  const isOwner = owner === currentUser;

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      <p>{activity}</p>
      <p>{timing}</p>
      <ul>
        {attendees.map((attendee) => (
          <li key={attendee.user._id}>
            {attendee.user.username} - {attendee.status}
          </li>
        ))}
      </ul>
      {isOwner ? (
        <form onSubmit={handleUpdateReadyCheck}>
          {/* Add form fields to update ready check */}
          <button type="submit">Update Ready Check</button>
        </form>
      ) : (
        <div>
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
