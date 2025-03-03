# MoodTunes

MoodTunes is a React Native app that allows users to select a mood and discover music videos on YouTube that match their selected mood. The app features a clean, gradient-based UI with smooth transitions.

## Features
- Select a mood from a beautifully designed list.
- Fetches relevant music videos from YouTube using the YouTube API.
- Displays results in a stylish, gradient-themed card layout.
- Allows users to play selected music videos directly within the app.

## Technologies Used
- **React Native**: For building the mobile application.
- **Expo**: To simplify the development process.
- **React Native Paper**: For UI components.
- **Expo Linear Gradient**: For attractive gradient backgrounds.
- **YouTube API**: To fetch and play music videos.
- **Axios**: For API requests.
- **React Native YouTube Iframe**: To embed and control YouTube videos.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/royanikseresht/MoodTunes.git
   cd moodtunes
   ```
2. Install dependencies:
   ```sh
   yarn install
   ```
3. Start the app:
   ```sh
   npx expo start
   ```

## Usage
- Run the app on an emulator or a physical device.
- Select a mood from the home screen.
- View a list of YouTube music videos related to the selected mood.
- Tap on a video to play it inside the app.

## API Key Configuration
This project uses the YouTube Data API. Replace `YOUTUBE_API_KEY` in `ResultsScreen.js` with your own API key:
```js
const YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY";
```

## Future Improvements
- Add more moods and refine search queries.
- Implement user preferences and history.
- Improve UI animations for a smoother experience.
- Add dark mode support.

## Contributing
Feel free to contribute by submitting issues or pull requests. 🚀

---
Developed with ❤️ by Roya Nikseresht.

