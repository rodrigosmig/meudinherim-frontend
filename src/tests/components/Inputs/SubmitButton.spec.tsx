import { render, screen } from '@testing-library/react';
import { SubmitButton } from '../../../components/Inputs/SubmitButton';

describe('SubmitButton Component', () => {
  it('renders correctly button label', () => {
    render(
      <SubmitButton label="Submit Test" />
    )

    expect(screen.getByText('Submit Test')).toBeInTheDocument()
  })
})