import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_READY_CHECK } from '../utils/queries';
import { UPDATE_READY_CHECK } from '../utils/mutations';
import { useSocket } from './SocketContext';

function LiveReadyCheckPage() {
  const { id } = useParams();
  const socket = useSocket();
  const currentUser = { username: 'testuser' };

  const [updatedReadyCheckData, setUpdatedReadyCheckData] = useState({});
  const [selectedResponse, setSelectedResponse] = useState('Pending'); // Initialize selectedResponse to 'Pending'
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
        const msgArr = msg.split('|');
        item.innerHTML = `<strong>${msgArr[0]}:</strong> ${msgArr[1]} <span class="text-sm text-gray-500">${msgArr[2]}</span>`;
        item.classList.add('border-b', 'py-2');
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = inputRef.current.value;
    if (message.trim() !== '') {
      const timestamp = new Date().toLocaleTimeString();
      socket.emit('chat message', `${currentUser.username}|${message}|${timestamp}`);
      inputRef.current.value = '';
    }
  };

  const handleRSVPSelection = (response) => {
    setSelectedResponse(response);
    // Update the selected response in the updatedReadyCheckData state
    setUpdatedReadyCheckData({ ...updatedReadyCheckData, reply: response });
  };

  if (readyCheckLoading) return <div className="py-4">Loading...</div>;
  if (error) return <div className="py-4">Error: {error.message}</div>;

  const { title, owner, timing, activity, invitees, description } = readyCheckdata.getReadyCheck || {};
  const isOwner = owner === currentUser;

  return (
    <div className="p-4 border border-gray-300 rounded">
      <h1 className="text-2xl font-semibold text-center mb-4">{title}</h1>
      <div className="mb-4">
        {timing && <p>When: {timing}</p>}
        {owner?.username && <p>Owner: {owner?.username}</p>}
        {activity && <p>Activity: {activity}</p>}
        {description && <p>Description: {description}</p>}
      </div>
      {isOwner && (
        <button onClick={handleEditReadyCheck} className="btn btn-sm btn-secondary">
          Edit ReadyCheck
        </button>
      )}
      {!isOwner && (
        <div className="mt-4">
          <label className="block mb-2">
            RSVP Options:
            <div className="flex flex-wrap gap-2">
              {/* Add button for 'Pending' option */}
              <button
                onClick={() => handleRSVPSelection('Pending')}
                className={`btn btn-sm ${selectedResponse === 'Pending' ? 'btn-primary' : 'btn-outline-primary'}`}
              >
                Pending
              </button>
              <button
                onClick={() => handleRSVPSelection('Ready')}
                className={`btn btn-sm ${selectedResponse === 'Ready' ? 'btn-success' : 'btn-outline-success'}`}
              >
                I'm Ready
              </button>
              <button
                onClick={() => handleRSVPSelection('Maybe')}
                className={`btn btn-sm ${selectedResponse === 'Maybe' ? 'btn-warning' : 'btn-outline-warning'}`}
              >
                Maybe
              </button>
              <button
                onClick={() => handleRSVPSelection('Declined')}
                className={`btn btn-sm ${selectedResponse === 'Declined' ? 'btn-error' : 'btn-outline-error'}`}
              >
                I Can't Join
              </button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-4">
              {/* Pending RSVP */}
              <div className="col-span-1">
                <p className="font-semibold">Pending</p>
                {invitees &&
                  invitees
                    .filter((invitee) => invitee.reply === 'Pending')
                    .map((invitee) => <p key={invitee._id}>{invitee.user.username}</p>)}
              </div>
              <div className="col-span-1">
                <p className="font-semibold">Ready</p>
                {invitees &&
                  invitees
                    .filter((invitee) => invitee.reply === 'Ready')
                    .map((invitee) => <p key={invitee._id}>{invitee.user.username}</p>)}
              </div>
              <div className="col-span-1">
                <p className="font-semibold">Maybe</p>
                {invitees &&
                  invitees
                    .filter((invitee) => invitee.reply === 'Maybe')
                    .map((invitee) => <p key={invitee._id}>{invitee.user.username}</p>)}
              </div>
              <div className="col-span-1">
                <p className="font-semibold">Declined</p>
                {invitees &&
                  invitees
                    .filter((invitee) => invitee.reply === 'Declined')
                    .map((invitee) => <p key={invitee._id}>{invitee.user.username}</p>)}
              </div>

            </div>
            {/* Display username beneath the chosen option */}
            <p className="text-sm mt-2">
              {selectedResponse && `${currentUser.username} - ${selectedResponse}`}
            </p>
          </label>
        </div>
      )}

      {/* Messaging System */}
      <div className="border-t border-gray-300 mt-4 pt-4">
        <h3 className="mb-2">ReadyCheck Live Chat</h3>
        <ul ref={messagesRef} className="overflow-y-auto max-h-60"></ul>
        <form onSubmit={handleSendMessage} className="mt-4 flex">
          <input ref={inputRef} autoComplete="off" className="form-input flex-grow mr-2" />
          <button type="submit" className="btn btn-sm btn-primary">Send</button>
        </form>
      </div>
    </div>
  );
}

export default LiveReadyCheckPage;

