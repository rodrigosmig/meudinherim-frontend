import { render, screen } from '@testing-library/react';
import { Switch } from '../../../components/Inputs/Switch';

describe('Switch Component', () => {
  it('renders correctly switch label', () => {
    render(
      <Switch id="test" label="Switch Test" />
    )

    expect(screen.getByText('Switch Test')).toBeInTheDocument()
  })
})