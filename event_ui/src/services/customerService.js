const API_URL = "http://localhost:5000/api/Customer";

export const CustomerService = {
    // 1. Register
    register: (data) => fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // 2. Login
    login: (credentials) => fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    }).then(res => res.json()),

    // 3. Post New Event (Sends one object with Event + Venue info)
    createEvent: (organizerId, eventData) => fetch(`${API_URL}/${organizerId}/create-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
    }).then(res => res.json())
};