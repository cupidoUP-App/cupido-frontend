import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ScrollToTopButton from './ScrollToTopButton';

describe('ScrollToTopButton', () => {
  it('should be hidden initially', () => {
    render(<ScrollToTopButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-0');
  });

  it('should become visible after scrolling down', () => {
    render(<ScrollToTopButton />);
    const button = screen.getByRole('button');
    
    
    fireEvent.scroll(window, { target: { pageYOffset: 400 } });
    
    expect(button).not.toHaveClass('opacity-0');
  });

  it('should scroll to top when clicked', () => {
    window.scrollTo = vi.fn(); // Mock scrollTo function
    render(<ScrollToTopButton />);
    const button = screen.getByRole('button');

    // Make button visible
    fireEvent.scroll(window, { target: { pageYOffset: 400 } });
    
    // Click the button
    fireEvent.click(button);
    
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
