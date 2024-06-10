import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_READY_CHECK, QUERY_ME } from '../utils/queries';
import { UPDATE_READY_CHECK, RSVP_READY_CHECK, SEND_CHAT_MESSAGE, DELETE_READY_CHECK } from '../utils/mutations';
import { useSocket } from './SocketContext';
import { parse } from 'date-fns';

function LiveReadyCheckPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { data: userData, loading: meLoading } = useQuery(QUERY_ME); // Fetch current user's data

  const [editMode, setEditMode] = useState(false);
  const [updatedReadyCheckData, setUpdatedReadyCheckData] = useState({});
  const [selectedResponse, setSelectedResponse] = useState('Pending');
  const [messageInput, setMessageInput] = useState('');
  const messagesRef = useRef(null);

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
      invitees: data.getReadyCheck.invitees.map(invitee => invitee._id) // Add invitees to the state
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
          inviteeIds: updatedReadyCheckData.invitees // Include inviteeIds in the mutation variables
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

  const handleInviteeClick = (id) => {
    setUpdatedReadyCheckData((prevData) => ({
      ...prevData,
      invitees: prevData.invitees.includes(id)
        ? prevData.invitees.filter((inviteeId) => inviteeId !== id)
        : [...prevData.invitees, id],
    }));
  };

  const handleButtonWrapperClick = (e) => {
    e.stopPropagation();
  };

  if (loading || meLoading) return <div className="py-4">Loading...</div>;
  if (error) return <div className="py-4">Error: {error.message}</div>;

  const { title, owner, timing, activity, invitees, description, RSVPs, chatMessages } = data.getReadyCheck || {};
  const isOwner = owner?.username === userData.me.username; // Use current user's data

  // Function to calculate remaining time until the ready check's set timing
  const calculateTimeRemaining = () => {
    if (!data || !data.getReadyCheck) return null;

    // Parse the date string into a valid Date object
    const readyCheckTime = parse(data.getReadyCheck.timing, "MMMM do',' yyyy 'at' hh:mm a", new Date()).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = readyCheckTime - currentTime;

    if (isNaN(timeDifference) || timeDifference <= 0) {
      console.log("Invalid time difference or time has passed.");
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }; // Handle invalid date or time has passed
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const renderCountdown = () => {
    const remainingTime = calculateTimeRemaining();

    // Check if countdown is finished
    if (remainingTime.days === 0 && remainingTime.hours === 0 && remainingTime.minutes === 0 && remainingTime.seconds === 0) {
      return <p className="text-3xl font-bold">It's Time!</p>;
    }

    // Render countdown if it's not finished
    return (
      <div className="text-center">
        <p className="text-sm mb-0">Time Remaining:</p>
        <div className="grid grid-flow-col gap-5 auto-cols-max text-center justify-center">
          <div className="flex flex-col">
            <span className="countdown font-mono text-4xl">
              <span style={{ '--value': remainingTime.days }}></span>
            </span>
            days
          </div>
          <div className="flex flex-col">
            <span className="countdown font-mono text-4xl">
              <span style={{ '--value': remainingTime.hours }}></span>
            </span>
            hours
          </div>
          <div className="flex flex-col">
            <span className="countdown font-mono text-4xl">
              <span style={{ '--value': remainingTime.minutes }}></span>
            </span>
            min
          </div>
          <div className="flex flex-col">
            <span className="countdown font-mono text-4xl">
              <span style={{ '--value': remainingTime.seconds }}></span>
            </span>
            sec
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-end">
        {isOwner && !editMode && (
          <>
            <button onClick={handleEditReadyCheck} className="btn btn-sm btn-warning">
              Edit ReadyCheck
            </button>
            <button onClick={handleDeleteReadyCheck} className="btn btn-sm btn-error ml-2">
              Delete ReadyCheck
            </button>
          </>
        )}
        {isOwner && editMode && (
          <button onClick={handleDeleteReadyCheck} className="btn btn-sm btn-error ml-2">
            Delete ReadyCheck
          </button>
        )}
      </div>
      <h1 className="text-4xl font-semibold text-center mb-4">{title}</h1>
      <div className="text-center mb-4">
        {renderCountdown()}
      </div>
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
            <label>
              Invitees:
              <div className="flex flex-wrap gap-2 mb-2 justify-center" style={{ flexDirection: 'row' }}>
                {userData.me.friends.map((friend) => (
                  <button
                    key={friend._id}
                    type="button"
                    onClick={() => handleInviteeClick(friend._id)}
                    className={`btn ${updatedReadyCheckData.invitees.includes(friend._id) ? 'btn-primary' : 'btn-outline-primary'} m-2`}
                  >
                    {friend.username}
                  </button>
                ))}
              </div>
            </label>
            <button onClick={handleSaveReadyCheck} className="btn btn-sm btn-primary">
              Save
            </button>
            <button onClick={() => setEditMode(false)} className="btn btn-sm btn-warning ml-3">
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <div className="p-4 bg-gray-800 text-white rounded-md w-5/12 shadow-xl">
              {timing && <p className="text-center">When: <b>{timing}</b></p>}
              {owner?.username && <p className="text-center">Owner: <b>{owner.username}</b></p>}
              {activity && <p className="text-center">Activity: <b>{activity}</b></p>}
              {description && <p className="text-center">Description: <b>{description}</b></p>}
              <p className="text-center mt-4">Invitees:</p>
              {invitees.map((invitee) => (
                <p className="text-center" key={invitee._id}>{invitee.username}</p>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h2 className="text-xl text-center font-semibold">RSVP Options:</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
          <button
            onClick={() => handleRSVPSelection('Pending')}
            className={`btn ${selectedResponse === 'Pending' ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            Pending
          </button>
          <button
            onClick={() => handleRSVPSelection('Ready')}
            className={`btn ${selectedResponse === 'Ready' ? 'btn-success' : 'btn-outline-success'}`}
          >
            I'm Ready
          </button>
          <button
            onClick={() => handleRSVPSelection('Maybe')}
            className={`btn ${selectedResponse === 'Maybe' ? 'btn-warning' : 'btn-outline-warning'}`}
          >
            Maybe
          </button>
          <button
            onClick={() => handleRSVPSelection('Declined')}
            className={`btn ${selectedResponse === 'Declined' ? 'btn-error' : 'btn-outline-error'}`}
          >
            I Can't Join
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-1">
          <div className="pr-4">
            {RSVPs.filter((rsvp) => rsvp.reply === 'Pending').map((rsvp) => (
              <p className="text-center" key={rsvp.user._id}>{rsvp.user.username}</p>
            ))}
          </div>
          <div className="pr-4">
            {RSVPs.filter((rsvp) => rsvp.reply === 'Ready').map((rsvp) => (
              <p className="text-center" key={rsvp.user._id}>{rsvp.user.username}</p>
            ))}
          </div>
          <div className="pr-4">
            {RSVPs.filter((rsvp) => rsvp.reply === 'Maybe').map((rsvp) => (
              <p className="text-center" key={rsvp.user._id}>{rsvp.user.username}</p>
            ))}
          </div>
          <div>
            {RSVPs.filter((rsvp) => rsvp.reply === 'Declined').map((rsvp) => (
              <p className="text-center" key={rsvp.user._id}>{rsvp.user.username}</p>
            ))}
          </div>
        </div>
      </div>
      <h2 className="text-xl font-semibold mt-5">Messages:</h2>
      <div className="mt-2 bottom-border border-gray-300 rounded-md p-0">
        <div>
          {chatMessages.length === 0 ? (
            <div className="alert bg-gray-400 text-black shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12c0-4.418-3.582-8-8-8S5 7.582 5 12s3.582 8 8 8 8-3.582 8-8z"
                  />
                </svg>
                <span>No messages yet. Be the first to say something!</span>
              </div>
            </div>
          ) : (
            <ul ref={messagesRef} className="chat-messages p-3 max-h-48 overflow-auto border border-gray-300 bg-gray-900 rounded-md">
              {chatMessages.slice(-10).map((message, index) => (
                <li key={message._id} className={`py-2 ${index % 2 === 0 ? 'bg-transparent' : 'bg-gray-700 bg-opacity-20'} rounded-md`}>
                  <strong>{message.user.username}:</strong> {message.content}{' '}
                  <span className="text-sm text-gray-500">{message.timestamp}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4 p-4 rounded-lg shadow-lg">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <input
              type="text"
              className="flex-1 px-4 py-2 mr-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
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
    </div>
  );
}

export default LiveReadyCheckPage;
