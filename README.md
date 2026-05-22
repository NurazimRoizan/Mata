# Mata

A Progressive Web App (PWA) that turns old smartphones into peer-to-peer security cameras using WebRTC. 
"Mata" means "Eye" in several languages, symbolizing its purpose to keep an eye on your belongings.

## Live App

No installation required! Since Mata is a Progressive Web App (PWA), you can use it right away directly from your browser. 

👉 **[Try Mata Live](https://nurazimroizan.github.io/Mata/)** 👈

## Features

- **Peer-to-Peer Streaming:** Uses WebRTC for secure, direct device-to-device video streaming with minimal latency.
- **Two Distinct Modes:**
  - **Camera Mode:** Leave an old device at home to act as the security camera.
  - **Viewer Mode:** Use your primary device to connect to the camera and monitor remotely.
- **Motion Detection & Push Notifications:** The camera mode uses HTML5 Canvas to scan video frames for motion. If movement is detected, it broadcasts an alert via WebRTC Data Channels, triggering a native Push Notification on the Viewer device!
- **Neobrutalist UI:** Features a bold, chaotic "slanted sticker" design using a high-contrast Midnight Black, Cyan, and Hot Pink color palette.
- **Privacy First:** No video streams are routed through central servers. Your video goes directly from the camera to the viewer.
- **Progressive Web App (PWA):** Installable on any device (iOS, Android, Desktop) right from the browser.
- **No Signup Required:** Generate a connection ID and pair your devices instantly.

## Tech Stack

- **Frontend:** React 19, Vite
- **P2P Communication:** [PeerJS](https://peerjs.com/) (WebRTC)
- **Icons:** Lucide React
- **Deployment:** GitHub Pages (Automated via GitHub Actions)

## How to Use

1. **Open the App** on the device you want to use as a **Camera**.
2. Select **Camera Mode**. The app will request camera permissions and generate a unique **Connection ID**. You can adjust the Motion Sensitivity slider to your preference.
3. **Open the App** on your primary device (the **Viewer**).
4. Select **Viewer Mode** and allow Push Notification permissions if prompted.
5. Enter the **Connection ID** displayed on the camera device to establish a secure P2P stream.
6. You are now securely monitoring your space! If motion is detected, your Viewer device will receive a push notification.

## Project Structure

- `src/components/Home.jsx`: The landing page to choose between Camera and Viewer modes.
- `src/components/CameraMode.jsx`: Handles local media streams, HTML5 canvas motion detection, and waits for incoming PeerJS connections.
- `src/components/ViewerMode.jsx`: Connects to the Camera peer, displays the remote video stream, and handles incoming Push Notifications.
- `src/App.jsx`: Main application wrapper and state management.

## License
This project is open-source. Feel free to use and modify!
