import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import {BrowserRouter as Router, useNavigate} from 'react-router-dom';


test('renders learn react link', () => {
  render(<Router><App /></Router>);
  const linkElement = screen.getByText(/Log List/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders logger system', () => {
  const {container} = render(<Router><App /></Router>);
  expect(container).toMatchSnapshot();
});

test("Test search button event", async () => {
  render(<Router><App /></Router>);
  const searchButton = screen.getByText(/Search/i);
  fireEvent.click(searchButton);
});