export const auth: Auth = {
  login: (username: string) => {
    auth.status = 'loggedIn';
    auth.username = username;
  },
  logout: () => {
    auth.status = 'loggedOut';
    auth.username = undefined;
  },
  status: 'loggedOut',
  username: undefined,
};

export type Auth = {
  login: (username: string) => void;
  logout: () => void;
  status: 'loggedOut' | 'loggedIn';
  username?: string;
};
