import axios from 'axios';


const BASE_URL = 'https://zoommeeting-uagx.onrender.com';
// const BASE_URL = 'http://localhost:5000';

export const createZoomMeeting = async () => {

  const currentDate = new Date()
  // const futureDate = new Date(currentDate.getTime() + 100 * 60 * 1000);

  const meetingDetails = {
    topic: 'Test Meeting',
    type: 2, // Scheduled meeting
    // start_time: futureDate,
    start_time: '2025-03-12T15:08:00Z', 
    duration: 30, // 30 minutes
    timezone: 'Asia/Kolkata', // Adjust to your time zone
    agenda: 'Test Meeting 21',
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: false,
      // join_before_host: true,
      mute_upon_entry: true,
      audio: 'voip',
    },
  };

  try {
    const response = await axios.post(`${BASE_URL}/create-meeting`, meetingDetails);
    console.log('Meeting Created:', response.data);
    return response.data
  } catch (error) {
    console.error('Error creating meeting:', error);
  }
};

export const fetchMeetings = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get-meetings`);
    console.log('Meetings:', response.data);
  } catch (error) {
    console.error('Error fetching meetings:', error);
  }
}


export const getJWT = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/get-jwt`, data);
    return response?.data
  } catch (error) {
    console.error('Error fetching meetings:', error);
  }
}
