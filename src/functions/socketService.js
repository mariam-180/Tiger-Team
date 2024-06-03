// // src/socketService.js
// import {io} from 'socket.io-client';

// const SOCKET_URL = process.env.REACT_APP_SOCKET_SERVER_URL;

// export const socket = io(SOCKET_URL, {
//   transports: ['websocket'],
//   autoConnect: true,
// });

// socket.on('connect', () => {
//   console.log('Connected to socket server');
// });

// socket.on('connect_error', (err) => {
//   console.error('Connection error:', err);
// });

// export const subscribeToReservations = (cb) => {
//   socket.on('new_reservation', (reservation) => cb(null, reservation));
//   socket.on('update_reservation', (reservation) => cb(null, reservation));
//   socket.on('delete_reservation', (data) => cb(null, data));
// };
