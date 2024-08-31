import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Close, SmartToy } from '@mui/icons-material';

const schema = yup.object().shape({
    userInput: yup.string().required('Message is required'),
});

const Chatbot = ({ chatOptions, setShowChatBot, showChatBot }) => {
    const apiKey = process.env.REACT_APP_OPEN_AI_KEY

    console.log(apiKey, 'apikey')
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const {
        primaryBackground,
        secondaryBackground,
        accentColor,
        buttonBackground,
        buttonHover,
        textPrimary,
        textSecondary,
        userMessageBackground,
        botMessageBackground,
        errorText
    } = chatOptions.colors;

    const onSubmit = async ({ userInput }) => {
        setIsLoading(true);
        const newChatHistory = [...chatHistory, { sender: 'user', message: userInput }];
        setChatHistory(newChatHistory);

        try {
            const response = await axios.post(
                chatOptions.serviceUrl,
                {
                    model: chatOptions.model,
                    messages: [{ role: 'user', content: userInput }],
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const botMessage = response.data.choices[0].message.content;
            setChatHistory([...newChatHistory, { sender: 'bot', message: botMessage }]);
        } catch (error) {
            setChatHistory([...newChatHistory, { sender: 'bot', message: 'Error: Could not fetch response' }]);
        } finally {
            setIsLoading(false);
            reset();
        }
    };

    const chatEndRef = useRef(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory]);


    return (
        <>
            {showChatBot ? (
                <div
                    className={`max-w-md min-w-[350px] mx-auto p-4 rounded shadow-md absolute bottom-8 right-8 transition-all duration-500 transform ${showChatBot ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ backgroundColor: primaryBackground }}
                >
                    <div className="flex items-center justify-between pb-2">
                        <p className="text-xl font-bold font-primary" style={{ color: textPrimary }}>{chatOptions.title}</p>
                        <button onClick={() => setShowChatBot(false)}>
                            <Close style={{ color: textSecondary }} />
                        </button>
                    </div>
                    <div className="h-64 overflow-y-auto border p-2 mb-4 rounded" style={{ backgroundColor: secondaryBackground, borderColor: textSecondary }}>
                        {chatHistory.map((chat, index) => (
                            <div key={index} className={`mb-2 text-sm ${chat.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                <span className={`inline-block p-2 rounded`} style={{ backgroundColor: chat.sender === 'user' ? userMessageBackground : botMessageBackground, color: chat.sender === 'user' ? textPrimary : primaryBackground }}>
                                    {chat.message}
                                </span>
                            </div>
                        ))}
                        <div ref={chatEndRef}></div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex">
                        <input
                            type="text"
                            {...register('userInput')}
                            className="flex-1 p-2 border rounded-l"
                            placeholder="Type your message..."
                            style={{ backgroundColor: secondaryBackground, color: primaryBackground, borderColor: textSecondary }}
                        />
                        <button type="submit" className="p-2 rounded-r" style={{ backgroundColor: buttonBackground, color: textPrimary }}>
                            {isLoading ? '...' : 'Send'}
                        </button>
                    </form>
                    {errors.userInput && <p className="text-xs mt-2" style={{ color: errorText }}>{errors.userInput.message}</p>}
                </div>
            ) : (
                <div
                    onClick={() => setShowChatBot(true)}
                    className="cursor-pointer absolute bottom-8 right-8 w-12 h-12 rounded-full transition-transform duration-300 transform hover:scale-110"
                    style={{ backgroundColor: accentColor }}
                ></div>
            )}
        </>
    );



};

export default Chatbot;
