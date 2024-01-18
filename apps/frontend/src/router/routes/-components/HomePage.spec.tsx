import { render } from '@testing-library/react';

import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HomePage />);
    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { getByText } = render(<HomePage />);
    expect(getByText(/hello world!/i)).toBeTruthy();
  });
});
