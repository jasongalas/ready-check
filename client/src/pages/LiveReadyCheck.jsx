import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams from react-router-dom
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_READY_CHECK } from '../utils/queries';
import { UPDATE_READY_CHECK } from '../utils/mutations';
import { useSocket } from './SocketContext';

function LiveReadyCheckPage() {
  const { id } = useParams();
  const socket = useSocket();
  const currentUser = { username: 'testuser' };

  const [updatedReadyCheckData, setUpdatedReadyCheckData] = useState({});
  const [selectedResponse, setSelectedResponse] = useState('');
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);

  const { loading: readyCheckLoading, error, data: readyCheckdata } = useQuery(QUERY_READY_CHECK, {
    variables: { id },
  });

  const [updateReadyCheck] = useMutation(UPDATE_READY_CHECK);

  useEffect(() => {
    if (socket) {
      socket.on('readyCheckUpdate', (update) => {
        // handle the update
        // use mutations and useSocket here
        // response first, then append user data before send
      });

      // Handle receiving chat messages
      socket.on('chat message', (msg) => {
        const item = document.createElement('li');
        item.textContent = msg;
        messagesRef.current.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
      });
    }

    // Cleanup function for removing event listener
    return () => {
      if (socket) {
        socket.off('chat message');
      }
    };
  }, [socket]);

  function formatDate(timestamp) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' };
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, options);
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = inputRef.current.value;
    if (message.trim() !== '') {
      socket.emit('chat message', message);
      inputRef.current.value = '';
    }
  };

  const handleRSVPSelection = (response) => {
    setSelectedResponse(response);
    // Add username beneath the chosen option
    setUpdatedReadyCheckData({ ...updatedReadyCheckData, attendees: [{ user: currentUser, status: response }] });
  };

  if (readyCheckLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { title, owner, timing, activity, attendees, description } = readyCheckdata.getReadyCheck || {};
  const isOwner = owner === currentUser;

  return (
    <div>
      <h1>{title}</h1>
      <p>Timing: {timing}</p>
      <p>Owner: {owner?.username}</p>
      <p>{activity}</p>
      <p>{description}</p>
      {attendees && (
        <ul>
          {attendees.map((attendee) => (
            <li key={attendee._id}>
              {attendee.username} - {attendee.reply}
            </li>
          ))}
        </ul>
      )}
      {isOwner ? (
        <form onSubmit={updateReadyCheck}>
          {/* Add form fields to update ready check */}
          <button type="submit">Update Ready Check</button>
        </form>
      ) : (
        <div>
          <label>
            RSVP Options:
            <div>
              <button onClick={() => handleRSVPSelection('ready')} style={{ backgroundColor: selectedResponse === 'ready' ? 'lightgreen' : '' }}>I'm Ready</button>
              <button onClick={() => handleRSVPSelection('maybe')} style={{ backgroundColor: selectedResponse === 'maybe' ? 'lightyellow' : '' }}>Maybe</button>
              <button onClick={() => handleRSVPSelection('declined')} style={{ backgroundColor: selectedResponse === 'declined' ? 'lightcoral' : '' }}>I Can't Join</button>
            </div>

            {/* Display username beneath the chosen option */}
            <p>
              {selectedResponse && `${currentUser.username} - ${selectedResponse}`}
            </p>
          </label>
        </div>
      )}

      {/* Messaging System */}
      <ul ref={messagesRef}></ul>
      <form ref={formRef} onSubmit={handleSendMessage}>
        <input ref={inputRef} autoComplete="off" /><button>Send</button>
      </form>
    </div>
  );
}

export default LiveReadyCheckPage;