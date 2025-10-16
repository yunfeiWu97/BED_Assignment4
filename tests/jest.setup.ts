/**
 * Global Jest setup for mocking Firebase Admin auth.
 * This prevents tests from calling real Firebase services.
 */
jest.mock("../config/firebaseConfig", () => {
  const mockAuth = {
    verifyIdToken: jest.fn(),          
    getUser: jest.fn(),               
    setCustomUserClaims: jest.fn(),    
  };
  return { auth: mockAuth };
});

export {};
