import { render } from '@testing-library/react';

import Ui from '../components/ui';

describe('Ui', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Ui />);
    expect(baseElement).toBeTruthy();
  });
});
