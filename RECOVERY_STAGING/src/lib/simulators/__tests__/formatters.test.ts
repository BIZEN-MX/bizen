/**
 * Unit Tests for Formatters
 */

import { describe, it, expect } from '@jest/globals';
import {
  currencyMXN,
  pct,
  formatNumber,
  clamp,
  roundTo,
  formatMonths,
} from '../formatters';

describe('Formatters', () => {
  describe('currencyMXN', () => {
    it('should format currency correctly', () => {
      const formatted = currencyMXN(12345.67);
      expect(formatted).toContain('12,345.67');
      expect(formatted).toContain('MXN');
    });
    
    it('should handle zero', () => {
      const formatted = currencyMXN(0);
      expect(formatted).toContain('0.00');
    });
    
    it('should handle negative numbers', () => {
      const formatted = currencyMXN(-500.50);
      expect(formatted).toContain('-');
      expect(formatted).toContain('500.50');
    });
  });
  
  describe('pct', () => {
    it('should format percentage correctly', () => {
      expect(pct(8.5)).toBe('8.50%');
      expect(pct(100)).toBe('100.00%');
      expect(pct(0.5)).toBe('0.50%');
    });
  });
  
  describe('formatNumber', () => {
    it('should format with thousands separator', () => {
      const formatted = formatNumber(1234567);
      expect(formatted).toContain('1,234,567');
    });
  });
  
  describe('clamp', () => {
    it('should clamp to min', () => {
      expect(clamp(5, 10, 20)).toBe(10);
    });
    
    it('should clamp to max', () => {
      expect(clamp(25, 10, 20)).toBe(20);
    });
    
    it('should not clamp if in range', () => {
      expect(clamp(15, 10, 20)).toBe(15);
    });
  });
  
  describe('roundTo', () => {
    it('should round to specified decimals', () => {
      expect(roundTo(12.3456, 2)).toBe(12.35);
      expect(roundTo(12.3456, 0)).toBe(12);
      expect(roundTo(12.3456, 3)).toBe(12.346);
    });
  });
  
  describe('formatMonths', () => {
    it('should format months only', () => {
      expect(formatMonths(5)).toBe('5 meses');
      expect(formatMonths(1)).toBe('1 mes');
    });
    
    it('should format years only', () => {
      expect(formatMonths(12)).toBe('1 año');
      expect(formatMonths(24)).toBe('2 años');
    });
    
    it('should format years and months', () => {
      expect(formatMonths(15)).toBe('1 año, 3 meses');
      expect(formatMonths(26)).toBe('2 años, 2 meses');
    });
  });
});

