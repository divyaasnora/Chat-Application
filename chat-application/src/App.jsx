import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

export default function App() {
    const timer = useRef(null);
    const socket = useRef(null);

    const [userName, setUserName] = useState('');
    const [showNamePopup, setShowNamePopup] = useState(true);
    const [inputName, setInputName] = useState('');
    const [typers, setTypers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        
        socket.current = io('http://localhost:4600');

        socket.current.on('roomNotice', (userName) => {
            console.log(`${userName} joined`);
        });

        socket.current.on('chatMessage', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        socket.current.on('typing', (userName) => {
            setTypers(prev =>
                prev.includes(userName) ? prev : [...prev, userName]
            );
        });

        socket.current.on('stopTyping', (userName) => {
            setTypers(prev => prev.filter(t => t !== userName));
        });

        return () => {
            socket.current.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!text) return;

        socket.current.emit('typing', userName);
        clearTimeout(timer.current);

        timer.current = setTimeout(() => {
            socket.current.emit('stopTyping', userName);
        }, 1000);

        return () => clearTimeout(timer.current);
    }, [text, userName]);

    function formatTime(ts) {
        const d = new Date(ts);
        return `${String(d.getHours()).padStart(2, '0')}:${String(
            d.getMinutes()
        ).padStart(2, '0')}`;
    }

    function handleNameSubmit(e) {
        e.preventDefault();
        if (!inputName.trim()) return;

        socket.current.emit('joinRoom', inputName.trim());
        setUserName(inputName.trim());
        setShowNamePopup(false);
    }

    function sendMessage() {
        if (!text.trim()) return;

        const msg = {
            id: Date.now(),
            sender: userName,
            text,
            ts: Date.now(),
        };

        setMessages(prev => [...prev, msg]);
        socket.current.emit('chatMessage', msg);
        setText('');
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <div className="app">
            {showNamePopup && (
                <div className="overlay">
                    <div className="popup">
                        <h2>Enter your name</h2>
                        <p>This name will be visible in chat</p>
                        <form onSubmit={handleNameSubmit}>
                            <input
                                autoFocus
                                value={inputName}
                                onChange={e => setInputName(e.target.value)}
                                placeholder="Your name"
                            />
                            <button type="submit">Continue</button>
                        </form>
                    </div>
                </div>
            )}

            {!showNamePopup && (
                <div className="chat">
                    <div className="chat-header">
                        <div className="avatar">
                            {userName[0]?.toUpperCase()}
                        </div>

                        <div className="chat-info">
                            <div className="title">Realtime group chat</div>
                            {typers.length > 0 && (
                                <div className="typing">
                                    {typers.join(', ')} is typing...
                                </div>
                            )}
                        </div>

                        <div className="signed">
                            Signed in as <b>{userName}</b>
                        </div>
                    </div>

                    <div className="messages">
                        {messages.map(m => {
                            const mine = m.sender === userName;
                            return (
                                <div
                                    key={m.id}
                                    className={`message-row ${mine ? 'mine' : ''}`}
                                >
                                    <div className="message">
                                        <div className="text">{m.text}</div>
                                        <div className="meta">
                                            <span>{m.sender}</span>
                                            <span>{formatTime(m.ts)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="input-area">
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}
