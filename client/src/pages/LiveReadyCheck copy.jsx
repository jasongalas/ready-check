import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_READY_CHECK } from '../utils/queries';
import { UPDATE_READY_CHECK, RSVP_READY_CHECK, SEND_CHAT_MESSAGE } from '../utils/mutations';
import { useSocket } from './SocketContext';

function LiveReadyCheckPage() {
  const { id } = useParams();
  const socket = useSocket();
  const currentUser = { username: 'win', id: '66622c3c93f1ad069edcbf5d' };

  const [updatedReadyCheckData, setUpdatedReadyCheckData] = useState({});
  const [selectedResponse, setSelectedResponse] = useState('Pending');
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const [messageInput, setMessageInput] = useState('');
  const messagesRef = useRef(null);

  const { loading, error, data } = useQuery(QUERY_READY_CHECK, {
    variables: { id },
  });

  const [updateReadyCheck] = useMutation(UPDATE_READY_CHECK);
  const [rsvpReadyCheck] = useMutation(RSVP_READY_CHECK);
  const [sendChatMessage] = useMutation(SEND_CHAT_MESSAGE);

  useEffect(() => {
    if (socket) {
      socket.on('readyCheckUpdate', (update) => {
        // Handle the update
      });

      socket.on('chat message', (msg) => {
        chatMessages(msg);
        const item = document.createElement('li');
        const msgArr = msg.split('|');
        item.innerHTML = `<strong>${msgArr[0]}:</strong> ${msgArr[1]} <span class="text-sm text-gray-500">${msgArr[2]}</span>`;
        item.classList.add('border-b', 'py-2');
        messagesRef.current.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
      });
    }

    return () => {
      if (socket) {
        socket.off('chat message');
      }
    };
  }, [socket]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageInput.trim() !== '') {
      const timestamp = new Date().toLocaleTimeString();
      const message = `${currentUser.username}|${messageInput}|${timestamp}`;
      try {
        await sendChatMessage({ variables: { readyCheckId: id, userId: currentUser.username, content: messageInput } });
        setMessageInput('');
      } catch (error) {
        console.error('Error sending message:', error.message);
      }
    }
  };

  const handleRSVPSelection = async (response) => {
    setSelectedResponse(response);
    try {
      console.log("ID", id, "CURRENT USER ID", currentUser.id, "REPLY", response)
      await rsvpReadyCheck({
        variables: { readyCheckId: id, userId: currentUser.id, reply: response },
        refetchQueries: [{query: QUERY_READY_CHECK}]
      });
    } catch (error) {
      console.error('Error responding to ReadyCheck:', error.message);
    }
  };

  if (loading) return <div className="py-4">Loading...</div>;
  if (error) return <div className="py-4">Error: {error.message}</div>;

  const { title, owner, timing, activity, invitees, description, RSVPs, chatMessages } = data.getReadyCheck || {};
  const isOwner = owner?.username === currentUser.username;

  console.log(RSVPs)

  return (
    <div className="p-4 border border-gray-300 rounded">
      <h1 className="text-2xl font-semibold text-center mb-4">{title}</h1>
      <div className="mb-4">
        {timing && <p>When: {timing}</p>}
        {owner?.username && <p>Owner: {owner.username}</p>}
        {activity && <p>Activity: {activity}</p>}
        {description && <p>Description: {description}</p>}
      </div>
      {isOwner && (
        <button onClick={() => {}} className="btn btn-sm btn-secondary">
          Edit ReadyCheck
        </button>
      )}
      {!isOwner && (
        <div className="mt-4">
          <label className="block mb-2">
            RSVP Options:
            <div className="flex flex-wrap gap-2">
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
              <div className="col-span-1">
                <p className="font-semibold">Pending</p>
                {invitees &&
                  invitees
                    .filter((RSVPs) => RSVPs.reply === 'Pending')
                    .map((RSVPs) => <p key={RSVPs._id}>{RSVPs.user.username}</p>)}
              </div>
              <div className="col-span-1">
                <p className="font-semibold">Ready</p>
                {invitees &&
                  invitees
                    .filter((RSVPs) => RSVPs.reply === 'Ready')
                    .map((RSVPs) => <p key={RSVPs._id}>{RSVPs.user.username}</p>)}
              </div>
              <div className="col-span-1">
                <p className="font-semibold">Maybe</p>
                {invitees &&
                  invitees
                    .filter((RSVPs) => RSVPs.reply === 'Maybe')
                    .map((RSVPs) => <p key={RSVPs._id}>{RSVPs.user.username}</p>)}
              </div>
              <div className="col-span-1">
                <p className="font-semibold">Declined</p>
                {invitees &&
                  invitees
                    .filter((RSVPs) => RSVPs.reply === 'Declined')
                    .map((RSVPs) => <p key={RSVPs._id}>{RSVPs.user.username}</p>)}
              </div>
            </div>
            <p className="text-sm mt-2">
              {selectedResponse && `${currentUser.username} - ${selectedResponse}`}
            </p>
          </label>
        </div>
      )}

      {/* Messaging System */}
      <div className="border-t border-gray-300 mt-4 pt-4">
        <h3 className="mb-2">ReadyCheck Live Chat</h3>
        <ul ref={messagesRef} className="overflow-y-auto max-h-60">
          {chatMessages?.map((msg, index) => (
            <li key={index}>
              <strong>{msg.user.username}:</strong> {msg.content} <span className="text-sm text-gray-500">{msg.timestamp}</span>
            </li>
          ))}
        </ul>
        <form onSubmit={handleSendMessage} className="mt-4 flex">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            autoComplete="off"
            className="form-input flex-grow mr-2"
          />
          <button type="submit" className="btn btn-sm btn-primary">Send</button>
        </form>
      </div>
    </div>
  );
}

export default LiveReadyCheckPage;
