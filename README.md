# 🛡️ Mata

A Progressive Web App (PWA) that turns old smartphones into peer-to-peer security cameras using WebRTC. 
"Mata" means "Eye" in several languages, symbolizing its purpose to keep an eye on your belongings.

## ✨ Features

- **Peer-to-Peer Streaming:** Uses WebRTC for secure, direct device-to-device video streaming with minimal latency.
- **Two Distinct Modes:**
  - 📷 **Camera Mode:** Leave an old device at home to act as the security camera.
  - 📱 **Viewer Mode:** Use your primary device to connect to the camera and monitor remotely.
- **Privacy First:** No video streams are routed through central servers. Your video goes directly from the camera to the viewer.
- **Progressive Web App (PWA):** Installable on any device (iOS, Android, Desktop) right from the browser.
- **No Signup Required:** Generate a connection ID and pair your devices instantly.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite
- **P2P Communication:** [PeerJS](https://peerjs.com/) (WebRTC)
- **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mata
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

### Building for Production

To create a production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

## 📖 How to Use

1. **Open the App** on the device you want to use as a **Camera**.
2. Select **Camera Mode**. The app will request camera permissions and generate a unique **Connection ID**.
3. **Open the App** on your primary device (the **Viewer**).
4. Select **Viewer Mode**.
5. Enter the **Connection ID** displayed on the camera device to establish a secure P2P stream.
6. You are now securely monitoring your space!

## 📂 Project Structure

- `src/components/Home.jsx`: The landing page to choose between Camera and Viewer modes.
- `src/components/CameraMode.jsx`: Handles local media streams and waits for incoming PeerJS connections.
- `src/components/ViewerMode.jsx`: Connects to the Camera peer and displays the remote video stream.
- `src/App.jsx`: Main application wrapper and state management.

## 📄 License
This project is open-source. Feel free to use and modify!
