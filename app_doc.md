# Laundry Solutions Android App Documentation



## Build and Setup Instructions

### Prerequisites

- Node.js (>= v20.17.0)
- React Native CLI or Expo
- Android Studio (for emulator testing)
- MySQL database (backend)
- API server (Node.js with Express.js)

### Setup Steps

1. **Clone the Repository:**
   ```sh
   git clone https://github.com/patelayush9876/Laundry_app.git
   cd Laundry_app
   ```
2. **Install Dependencies:**
   ```sh
   npm install
   ```

3. **Run the App on an Emulator or Physical Device:**
   ```sh
   npx expo start  

   or

   npx expo start -c
   ```

## Code Walkthrough

### Key Components

- **Index.tsx** (Main Screen)
  - Displays search input, buttons, and results.
  - Fetches vendor data from the API.
  - Implements Toast notifications for fetching status.

- **models/VendorServices.js** (API Calls)
  - Handles API integration with backend.

- **index.tsx** (Location Services)
  - Fetches the user's current location using Expo Location.

## API Integration

### Endpoints Used

1. **Fetch Nearby Vendors**
   ```sh
   GET /api/vendors/nearby?latitude={lat}&longitude={long}
   ```
2. **Fetch Vendors by City**
   ```sh
   GET /api/vendors/location?location_name={city_name}
   ```

### Sample API Call

```ts
axios.get("http://192.168.29.89:5000/api/vendors/location", { params: { location_name: "Delhi" } })
```

## Testing

### Manual Testing

- Test searches using city names and service keywords.
- Verify real-time location fetching.
- Check API responses for valid data.


## Contribution Guidelines

1. Fork the repository and clone locally.
2. Create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
3. Commit changes with descriptive messages.
4. Push to GitHub and submit a Pull Request.

## Troubleshooting

### Common Issues

- **App Not Starting:** Ensure `expo-cli` is running.
- **API Not Responding:** Verify backend is running and accessible.
- **Emulator Issues:** Restart Metro bundler and clear cache:
  ```sh
  npx react-native start --reset-cache
  ```

## Appendices

- **Expo Location Docs:** [https://docs.expo.dev/versions/latest/sdk/location/](https://docs.expo.dev/versions/latest/sdk/location/)
- **React Native Docs:** [https://reactnative.dev/docs/getting-started](https://reactnative.dev/docs/getting-started)

