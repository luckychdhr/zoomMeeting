import axios from 'axios';

export const createZoomMeeting = async () => {

  const meetingDetails = {
    topic: 'Test Meeting',
    type: 2, // Scheduled meeting
    start_time: '2025-03-08T13:08:00Z', 
    duration: 30, // 30 minutes
    timezone: 'Asia/Kolkata', // Adjust to your time zone
    agenda: 'Discuss project updates',
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: true,
      mute_upon_entry: true,
      audio: 'voip',
    },
  };

  try {
    const response = await axios.post('http://localhost:5000/create-meeting', meetingDetails);
    console.log('Meeting Created:', response.data);
    return response.data
  } catch (error) {
    console.error('Error creating meeting:', error);
  }
};

export const fetchMeetings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-meetings');
      console.log('Meetings:', response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  }


export const getJWT = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/get-jwt',data);
      return response?.data
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  }
