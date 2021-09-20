import { render, screen } from "../../utils/test-utils";
import { AuthContext } from "../../contexts/AuthContext";
import Profile from "../../pages/profile";
import { useAccountBalance } from "../../hooks/useAccountBalance";

const useAccountBalanceMocked = useAccountBalance as jest.Mock<any>;

jest.mock('../../hooks/useAccountBalance');

const signIn = jest.fn();
const signOut = jest.fn();
const setUser = jest.fn();
const isAuthenticated = true;
const user = {
  id: 1,
  name: 'test',
  email: 'test@test.com',
  avatar: 'test',
  enable_notification: false
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/profile'
      }
    }
  }
})

describe('Profile Component', () => {
  it('renders inputs correctly', async () => {
    useAccountBalanceMocked.mockImplementation(() => ({ isLoading: true }));
    
    render(
      <AuthContext.Provider value={{signIn, signOut, setUser, user, isAuthenticated}}>
        <Profile userUpdated={user} />
      </AuthContext.Provider>
    )

    expect(screen.getByDisplayValue(user.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(user.email)).toBeInTheDocument();
  });
})