import { render } from '@testing-library/react';

import { WelcomePage } from './WelcomePage';

describe('WelcomePage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WelcomePage />);
    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { getByText } = render(<WelcomePage />);
    expect(getByText(/hello world!/i)).toBeTruthy();
  });
});
