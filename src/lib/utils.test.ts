import { cn } from './utils';
import { describe, it, expect } from 'vitest';

describe('cn utility', () => {
  it('should merge and deduplicate classes', () => {
    // Basic merging
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');

    // Overriding classes
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');

    // Conditional classes
    expect(cn('base', true && 'conditional', false && 'not-included')).toBe('base conditional');

    // Merging with conflicting tailwind classes
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('m-4', 'mx-2')).toBe('m-4 mx-2');
  });
});
