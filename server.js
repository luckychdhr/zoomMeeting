const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;
const cors = require('cors');
const KJUR = require('jsrsasign')

const ZOOM_API_URL = 'https://api.zoom.us/v2/users/me/meetings';

app.use(cors());
app.use(express.json());

let users = ['Lucky', 'Siddarth']

let meetings = []

const SDKKEY = process.env.SDKKEY
const SDKSECRET = process.env.SDKSECRET
const AUTH = process.env.AUTH

const getZoomToken = async () => {
    const url = 'https://zoom.us/oauth/token';

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${AUTH}`,
    };

    const data = new URLSearchParams({
        grant_type: 'account_credentials',
        account_id: 'pAlWVb6EToWWtH3QZ45_4A',
    });

    try {
        const response = await axios.post(url, data, { headers });
        return response.data
    } catch (error) {
        return error
    }
};

const generateSignature = (key, secret, meetingNumber, role) => {

    const iat = Math.round(new Date().getTime() / 1000) - 30
    const exp = iat + 60 * 60 * 2
    const oHeader = { alg: 'HS256', typ: 'JWT' }

    const oPayload = {
        sdkKey: key,
        appKey: key,
        mn: meetingNumber,
        role: role,
        iat: iat,
        exp: exp,
        tokenExp: exp
    }

    const sHeader = JSON.stringify(oHeader)
    const sPayload = JSON.stringify(oPayload)
    const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, secret)
    return sdkJWT
}

const getZoomMeetingList = async (ZOOM_API_KEY) => {
    try {
        const response = await axios.get('https://api.zoom.us/v2/users/me/meetings', {
            headers: {
                Authorization: `Bearer ${ZOOM_API_KEY}`,
            },
            params: {
                type: 2,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching meeting list:', error);
    }
};

app.post('/get-jwt', async (req, res) => {
    const { meetingId } = req?.body;
    try {
        const data = await generateSignature(SDKKEY, SDKSECRET, meetingId, 0);
        res.json(data)
    } catch (error) {
        res.status(500).send('Error generating jwt');
    }
});

app.post('/create-meeting', async (req, res) => {
    const meetingDetails = req.body;
    const zoomApiKey = await getZoomToken()

    if (!zoomApiKey?.access_token) {
        res.status(500).send('Error generating token');
    }
    const headers = {
        Authorization: `Bearer ${zoomApiKey.access_token}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(ZOOM_API_URL, meetingDetails, { headers });
        const obj = { ...response.data, username: meetingDetails?.username || '' }
        meetings = [obj, ...meetings]
        res.json(obj);
    } catch (error) {
        console.error('Error creating Zoom meeting:', error);
        res.status(500).send('Error creating Zoom meeting');
    }
});

app.get('/get-meetings', async (req, res) => {
    const zoomApiKey = await getZoomToken()
    if (!zoomApiKey?.access_token) {
        res.status(500).send('Error generating token');
    }
    try {
        console.log('meetings:::',meetings)
        // const meetings = await getZoomMeetingList(zoomApiKey?.access_token);
        res.json(meetings)
    } catch (error) {
        console.error('Error creating Zoom meeting:', error);
        res.status(500).send('Error fetching meetings');
    }
});


app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
