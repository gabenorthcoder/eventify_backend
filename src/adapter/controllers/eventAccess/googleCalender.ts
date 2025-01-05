import express from "express";
import { endOfDay } from 'date-fns';

import { getAuthURL, getTokens, addEventToGoogleCalendar } from "../../../infrastructure/googleCalender";
import { EventRepository } from "../../../infrastructure/repository/eventRepository";
const googleCalenderAuth = express.Router();

googleCalenderAuth.get("/auth/google/calender", (req, res) => {
const redirecturi =  req.query.redirecturi as string;
  const event = req.query.event as string;
  const url = getAuthURL(event, redirecturi);
  res.redirect(url);
});

const googleCalenderCallBack = express.Router()

googleCalenderCallBack.get("/auth/google/calender/callback", async (req, res) => {
  try {
  
    const stateData = JSON.parse(
      Buffer.from(req.query.state as string, "base64").toString()
    );
    const code = req.query.code as string;
    const tokens = await getTokens(code);
  
    const eventRepository = new EventRepository();

    const calenderEvent = await eventRepository.findEventById(Number(stateData.event));


    const eventDetails = {
      summary: calenderEvent.title || "New Event",
      location: calenderEvent.address || "Online",
      description: calenderEvent.description || "No description",
      startDateTime: calenderEvent.date || new Date(),
      endDateTime: endOfDay(calenderEvent.date) || new Date(),
    };

    const event = await addEventToGoogleCalendar(tokens, eventDetails);

    const encodedEvent = encodeURIComponent(JSON.stringify(event));
    res.redirect(`${stateData.redirectUri}/auth/google/calender/callback?event=${encodedEvent}`);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export {googleCalenderAuth, googleCalenderCallBack} ;
