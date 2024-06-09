import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_READY_CHECK, QUERY_ME } from '../utils/queries';
import { UPDATE_READY_CHECK, RSVP_READY_CHECK, SEND_CHAT_MESSAGE, DELETE_READY_CHECK } from '../utils/mutations';
import { useSocket } from './SocketContext';

function LiveReadyCheckPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { data: userData } = useQuery(QUERY_ME); // Fetch current user's data

  const [editMode, setEditMode] = useState(false);
  const [updatedReadyCheckData, setUpdatedReadyCheckData] = useState({});
  const [selectedResponse, setSelectedResponse] = useState(isOwner ? 'Ready' : 'Pending');
  const [messageInput, setMessageInput] = useState('');
  const messagesRef = useRef(null);

  const isOwner = owner?.username === userData.me.username; 

  const { loading, error, data, refetch } = useQuery(QUERY_READY_CHECK, {
    variables: { id },
  });

  const [updateReadyCheck] = useMutation(UPDATE_READY_CHECK);
  const [rsvpReadyCheck] = useMutation(RSVP_READY_CHECK);
  const [sendChatMessage] = useMutation(SEND_CHAT_MESSAGE);
  const [deleteReadyCheck] = useMutation(DELETE_READY_CHECK);

  useEffect(() => {
    if (socket) {
      socket.on('readyCheckUpdate', (update) => {
        setUpdatedReadyCheckData(update);
      });

      socket.on('chat message', (msg) => {
        const item = document.createElement('li');
        const msgArr = msg.split('|');
        const timestamp = new Date(msgArr[2]).toLocaleTimeString(); // Format the timestamp
        item.innerHTML = `<strong>${msgArr[0]}:</strong> ${msgArr[1]} <span class="text-sm text-gray-500">${timestamp}</span>`;
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
      const message = `${userData.me.username}|${messageInput}|${timestamp}`; // Use current user's data
      try {
        await sendChatMessage({ variables: { readyCheckId: id, userId: userData.me._id, content: messageInput } }); // Use current user's ID
        setMessageInput('');
      } catch (error) {
        console.error('Error sending message:', error.message);
      }
    }
  };

  const handleRSVPSelection = async (response) => {
    setSelectedResponse(response);
    try {
      await rsvpReadyCheck({
        variables: { readyCheckId: id, userId: userData.me._id, reply: response },
        refetchQueries: [{ query: QUERY_READY_CHECK }]
      });
      // Store selected response in local storage
      localStorage.setItem('selectedResponse', response);
    } catch (error) {
      console.error('Error responding to ReadyCheck:', error.message);
    }
  };

  useEffect(() => {
    const storedResponse = localStorage.getItem('selectedResponse');
    if (storedResponse) {
      setSelectedResponse(storedResponse);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom of messages container when chatMessages changes
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [data?.getReadyCheck?.chatMessages]); // Listen for changes in chatMessages

  const handleEditReadyCheck = () => {
    const localTime = new Date().toLocaleString('en-CA', { hour12: false }).replace(",", "").slice(0, 16);
    setEditMode(true);
    setUpdatedReadyCheckData({
      title: data.getReadyCheck.title,
      timing: localTime,
      activity: data.getReadyCheck.activity,
      description: data.getReadyCheck.description,
    });
  };

  const handleSaveReadyCheck = async () => {
    try {
      await updateReadyCheck({
        variables: {
          id,
          title: updatedReadyCheckData.title,
          activity: updatedReadyCheckData.activity,
          timing: updatedReadyCheckData.timing,
          description: updatedReadyCheckData.description,
        },
      });
      setEditMode(false);
      refetch();
      socket.emit('readyCheckUpdate', updatedReadyCheckData);
    } catch (error) {
      console.error('Error updating ReadyCheck:', error.message);
    }
  };

  const handleDeleteReadyCheck = async () => {
    try {
      console.log(`Deleting ReadyCheck with ID: ${id}`);
      await deleteReadyCheck({ variables: { id } });
      navigate('/'); // Redirect to another page after deletion
    } catch (error) {
      console.error('Error deleting ReadyCheck:', error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedReadyCheckData({
      ...updatedReadyCheckData,
      [name]: value,
    });
  };

  const handleButtonWrapperClick = (e) => {
    e.stopPropagation();
  };

  if (loading) return <div className="py-4">Loading...</div>;
  if (error) return <div className="py-4">Error: {error.message}</div>;

  const { title, owner, timing, activity, invitees, description, RSVPs, chatMessages } = data.getReadyCheck || {};

  return (
    <div className="p-4 border border-gray-300 rounded">
      <h1 className="text-2xl font-semibold text-center mb-4">{title}</h1>
      <div className="mb-4">
        {editMode ? (
          <div>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={updatedReadyCheckData.title}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </label>
            <label>
              When:
              <input
                type="datetime-local"
                name="timing"
                value={updatedReadyCheckData.timing}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </label>
            <label>
              Activity:
              <input
                type="text"
                name="activity"
                value={updatedReadyCheckData.activity}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={updatedReadyCheckData.description}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
              />
            </label>
            <button onClick={handleSaveReadyCheck} className="btn btn-primary mt-2">Save</button>
          </div>
        ) : (
          <>
            {timing && <p>When: {timing}</p>}
            {owner?.username && <p>Owner: {owner.username}</p>}
            {activity && <p>Activity: {activity}</p>}
            {description && <p>Description: {description}</p>}
          </>
        )}
      </div>
      {isOwner && !editMode && (
        <>
          <button onClick={handleEditReadyCheck} className="btn btn-sm btn-secondary">
            Edit ReadyCheck
          </button>
          <button onClick={handleDeleteReadyCheck} className="btn btn-sm btn-danger ml-2">
            Delete ReadyCheck
          </button>
        </>
      )}
      {
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
                <h2 className="text-xl font-semibold">Invitees:</h2>
                {invitees.map((invitee) => (
                  <p key={invitee.username}>{invitee.username}</p>
                ))}
              </div>
              <div className="col-span-3">
                <h2 className="text-xl font-semibold">RSVPs:</h2>
                {RSVPs.map((rsvp) => (
                  <p key={rsvp._id}>
                    {rsvp.user.username}: {rsvp.reply}
                  </p>
                ))}
              </div>
            </div>
          </label>
        </div>
      }
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Messages:</h2>
        <ul ref={messagesRef} className="chat-messages max-h-48 overflow-auto">
          {chatMessages.slice(-10).map((message) => (
            <li key={message._id} className="border-b py-2">
              <strong>{message.user.username}:</strong> {message.content}{' '}
              <span className="text-sm text-gray-500">{message.timestamp}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <form onSubmit={handleSendMessage} className="flex flex-row items-center">
          <input
            type="text"
            className="flex-1 px-2 py-1 border border-gray-300 rounded mr-2"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default LiveReadyCheckPage;
