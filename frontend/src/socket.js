import { io } from "socket.io-client";

const socket = io("https://jobsphere-backend-dvb0.onrender.com");

export default socket;