import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = "http://localhost:3030/";

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);

        socket.on('receiveMessage', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        socket.on('errorMessage', (msg) => {
            setError(msg);
        });

        return () => socket.disconnect();
    }, []);

    const handleSend = () => {
        const socket = socketIOClient(ENDPOINT);
        socket.emit('sendMessage', { sender: username, content: input });
        setInput('');
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="text"
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
            {error && <p>{error}</p>}
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}: </strong>{msg.content}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Chat;
