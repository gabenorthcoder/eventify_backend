import { google, calendar_v3 } from "googleapis";
import dotenv from "dotenv";

dotenv.config();


const oauth2Client = new google.auth.OAuth2(
    String(process.env.GOOGLE_CALENDER_CLIENT_ID)!,
    String(process.env.GOOGLE_CALENDER_CLIENT_SECRET)!,
    String(process.env.GOOGLE_CALENDER_REDIRECT_URI)!
);




export const getAuthURL = (event: string, redirectUri:string) => {
  const scopes = ["https://www.googleapis.com/auth/calendar.events"];
  const stateDetails = JSON.stringify({ 
    event,            
    redirectUri         
  });
  return oauth2Client.generateAuthUrl({
    access_type: "offline",         
    scope: scopes,                      
    state: Buffer.from(stateDetails).toString("base64"),                 

  });
};



export const getTokens = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};


export const addEventToGoogleCalendar = async (tokens: any, eventDetails: any): Promise<calendar_v3.Schema$Event> => {
  oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const event = {
    summary: eventDetails.summary,
    location: eventDetails.location,
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.startDateTime,
      timeZone: "Europe/London",
    },
    end: {
      dateTime: eventDetails.endDateTime,
      timeZone: "Europe/London",
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });

  return response.data;
};
