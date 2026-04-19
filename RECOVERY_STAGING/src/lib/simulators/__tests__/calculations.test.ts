/**
 * Unit Tests for Financial Calculations
 */

import { describe, it, expect } from '@jest/globals';
import {
  pmt,
  fv,
  timeToGoal,
  payoffSchedule,
  calculateMinimumPayment,
  amortization,
  futurePrice,
  requiredIncomeForPurchasingPower,
} from '../calculations';

describe('Financial Calculations', () => {
  describe('pmt (Payment calculation)', () => {
    it('should calculate monthly payment correctly', () => {
      const payment = pmt(20000, 12, 12);
      expect(payment).toBeCloseTo(1776.98, 2);
    });
    
    it('should handle zero interest rate', () => {
      const payment = pmt(12000, 0, 12);
      expect(payment).toBe(1000);
    });
    
    it('should return 0 for zero principal', () => {
      const payment = pmt(0, 12, 12);
      expect(payment).toBe(0);
    });
  });
  
  describe('fv (Future Value calculation)', () => {
    it('should calculate future value with contributions', () => {
      const futureValue = fv(1000, 500, 8, 24);
      expect(futureValue).toBeGreaterThan(13000);
      expect(futureValue).toBeLessThan(15000);
    });
    
    it('should handle zero interest rate', () => {
      const futureValue = fv(1000, 500, 0, 12);
      expect(futureValue).toBe(7000);
    });
    
    it('should return initial amount when months is 0', () => {
      const futureValue = fv(5000, 500, 8, 0);
      expect(futureValue).toBe(5000);
    });
  });
  
  describe('timeToGoal', () => {
    it('should calculate months to reach goal', () => {
      const result = timeToGoal(1000, 500, 8, 10000);
      expect(result.months).toBeGreaterThan(0);
      expect(result.finalValue).toBeGreaterThanOrEqual(10000);
      expect(result.error).toBeUndefined();
    });
    
    it('should return 0 months if target already reached', () => {
      const result = timeToGoal(10000, 500, 8, 5000);
      expect(result.months).toBe(0);
      expect(result.finalValue).toBe(10000);
    });
    
    it('should detect impossible goals', () => {
      const result = timeToGoal(100, 0, 5, 10000);
      expect(result.error).toBeDefined();
    });
  });
  
  describe('payoffSchedule', () => {
    it('should calculate payoff schedule correctly', () => {
      const result = payoffSchedule(10000, 24, 1000);
      expect(result.months).toBeGreaterThan(0);
      expect(result.months).toBeLessThan(15);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.rows.length).toBe(result.months);
    });
    
    it('should detect payment too low', () => {
      const result = payoffSchedule(10000, 24, 50);
      expect(result.error).toBeDefined();
      expect(result.months).toBe(0);
    });
    
    it('should pay off balance completely', () => {
      const result = payoffSchedule(5000, 18, 500);
      const lastRow = result.rows[result.rows.length - 1];
      expect(lastRow.balance).toBeLessThan(1);
    });
  });
  
  describe('calculateMinimumPayment', () => {
    it('should calculate minimum based on percentage', () => {
      const payment = calculateMinimumPayment(10000, 5, 200);
      expect(payment).toBe(500);
    });
    
    it('should use floor when percentage is too low', () => {
      const payment = calculateMinimumPayment(1000, 5, 200);
      expect(payment).toBe(200);
    });
    
    it('should not exceed balance', () => {
      const payment = calculateMinimumPayment(150, 5, 200);
      expect(payment).toBe(150);
    });
  });
  
  describe('amortization', () => {
    it('should calculate amortization correctly', () => {
      const result = amortization(20000, 35, 18, 500, 50);
      expect(result.payment).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.totalCost).toBeGreaterThan(20000);
      expect(result.cat).toBeGreaterThan(35); // CAT should be higher than APR due to fees
      expect(result.rows.length).toBe(18);
    });
    
    it('should include fees in total cost', () => {
      const resultWithFees = amortization(20000, 35, 18, 500, 50);
      const resultWithoutFees = amortization(20000, 35, 18, 0, 0);
      expect(resultWithFees.totalCost).toBeGreaterThan(resultWithoutFees.totalCost);
    });
  });
  
  describe('futurePrice (inflation)', () => {
    it('should calculate future price with inflation', () => {
      const future = futurePrice(100, 5, 3);
      expect(future).toBeCloseTo(115.76, 2);
    });
    
    it('should return same price with 0% inflation', () => {
      const future = futurePrice(100, 0, 5);
      expect(future).toBe(100);
    });
    
    it('should compound correctly', () => {
      const oneYear = futurePrice(100, 10, 1);
      const twoYears = futurePrice(100, 10, 2);
      expect(twoYears).toBeCloseTo(121, 0);
    });
  });
  
  describe('requiredIncomeForPurchasingPower', () => {
    it('should calculate required income increase', () => {
      const required = requiredIncomeForPurchasingPower(10000, 5, 3);
      expect(required).toBeGreaterThan(10000);
      expect(required).toBeCloseTo(11576, 0);
    });
  });
});

