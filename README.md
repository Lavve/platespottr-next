# Rate limits

Rate Limiting UX Tasks

1. Smart Request Management

[ ] Implement request queuing for high-frequency actions

[ ] Add request debouncing for rapid user interactions

[ ] Batch multiple operations where possible

[ ] Prioritize critical requests over non-critical ones

3. Offline & Caching Strategy

[ ] Implement aggressive caching for GET requests (friends, user data)

[ ] Add offline-first functionality for core features (add and remove numbers)

[ ] Queue actions when offline and sync when back online

3. User Experience Enhancements

[ ] Implement optimistic UI updates for better perceived performance

4. Error Handling & Recovery

[ ] Graceful degradation when rate limited

[ ] Automatic retry with exponential backoff

[ ] User-friendly error messages with actionable suggestions

[ ] Fallback to cached data when API unavailable

5. Specific Feature Optimizations

A. User Management:

[ ] Cache user profile data

B. Friend System:

[ ] Cache friend lists locally

[ ] Implement friend request queuing

C. Number Management:

[ ] Optimize number adding/removing with local state

[ ] Batch number operations when possible

1. Progressive Enhancement

[ ] Ensure core functionality works without API

[ ] Implement service worker for caching

[ ] Add background sync capabilities

6. Technical Implementation

[ ] Update API service to handle 429 responses

[ ] Add rate limit tracking in React Query if possible

[ ] Add retry logic with proper backoff strategies

Priority Order:

- High Priority: Error handling, caching, offline functionality

- Medium Priority: Visual feedback, request optimization

- Low Priority: Advanced features, monitoring, education

# TODO

- [ ] Add Estonia plates
- [ ] Add Lithuania plates
- [ ] Add snackbars for feedback
- [ ] Add support for authentication
- [ ] Add API calls to backend using react-query
- [ ] Visa ändring av nummer med animering
- [ ] Vertical stats bars
- [ ] If API calls fails, keep in localstorage and sync next time online
- [ ] Move all types to the types folder

# DONE

- [x] Add support for getUserMedia() to start the camera. Use jsQR to extract the slug from QR code
- [x] Progress vid långtryck
- [x] Genial borde vara genialisk
- [x] Målade borde vara målar
- [x] Stäng vänner om sista tagits bort
- [x] Friends button disabled if no requests
- [x] Add support for url_handlers in manifest.json, middleware and routes
- [x] Confirm when removing last plate from the list
- [x] Add Finnish plates and language, also add countries in settings
