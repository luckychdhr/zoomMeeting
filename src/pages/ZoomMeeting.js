import React, { useState } from 'react';
import { createZoomMeeting, fetchMeetings, getJWT } from '../api/zoom';

const ZoomMeeting = () => {
    const [meetingDetails, setMeetingDetails] = useState(null);
    const [error, setError] = useState(null);

    const handleCreateMeeting = async () => {
        try {
            const data = await createZoomMeeting();
            console.log('createZoomMeeting:::', data);

            if (data) {
                setMeetingDetails(data);
            }
        } catch (err) {
            setError('Error creating the meeting. Please try again.');
        }
    };

    const getMeetings = async () => {
        try {
            const data = await fetchMeetings();
            console.log('fetchMeetings:::', data);

        } catch (err) {
            setError('Error creating the meeting. Please try again.');
        }
    };

    const getJWTToken = async () => {
        try {
            const data = await getJWT({ meetingId: 94311592106 });
            console.log('getJWTgetJWTgetJWTgetJWT:::', data);

        } catch (err) {
            setError('Error creating the meeting. Please try again.');
        }
    };

    return (
        <div>
            <h1>Zoom Meeting Creation</h1>
            <button onClick={handleCreateMeeting}>Create Zoom Meeting</button>
            <button onClick={getMeetings}>getMeetings</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {meetingDetails && (
                <div>
                    <h2>Meeting Created!</h2>
                    <p><strong>Topic:</strong> {meetingDetails.topic}</p>
                    <p><strong>Join URL:</strong> <a href={meetingDetails.join_url} target="_blank" rel="noopener noreferrer">Join Now</a></p>
                    <p><strong>Meeting ID:</strong> {meetingDetails.id}</p>
                    <p><strong>Start Time:</strong> {new Date(meetingDetails.start_time).toLocaleString()}</p>
                    <button onClick={getMeetings}>
                        Fetch
                    </button>
                </div>
            )}
        </div>
    );
};

export default ZoomMeeting;
