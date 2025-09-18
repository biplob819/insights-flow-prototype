/**
 * Accessibility Service
 * Provides comprehensive accessibility support for WCAG 2.1 AA compliance
 * Implements Phase 1 requirement: Accessibility & Compliance
 */

import { ControlType, ControlConfig } from '../components/DashboardBuilder/types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ContrastResult {
  ratio: number;
  passes: {
    aa: boolean;
    aaa: boolean;
  };
  foreground: string;
  background: string;
}

export interface ARIAAttributes {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean;
  'aria-pressed'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  'aria-relevant'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  'aria-disabled'?: boolean;
  'aria-readonly'?: boolean;
  'aria-multiselectable'?: boolean;
  'aria-orientation'?: 'horizontal' | 'vertical';
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
  role?: string;
  tabIndex?: number;
}

export interface AccessibilityReport {
  score: number; // 0-100
  violations: AccessibilityViolation[];
  warnings: AccessibilityWarning[];
  recommendations: string[];
}

export interface AccessibilityViolation {
  id: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  element: string;
  description: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagCriteria: string;
  howToFix: string;
}

export interface AccessibilityWarning {
  id: string;
  element: string;
  description: string;
  recommendation: string;
}

export interface AccessibilityService {
  validateARIA(element: HTMLElement): ValidationResult;
  checkKeyboardNavigation(container: HTMLElement): boolean;
  validateColorContrast(element: HTMLElement): ContrastResult;
  generateARIALabels(controlConfig: ControlConfig): ARIAAttributes;
  enhanceElement(element: HTMLElement, controlType: ControlType, config?: ControlConfig): void;
  testAccessibility(container: HTMLElement): Promise<AccessibilityReport>;
  announceToScreenReader(message: string, priority?: 'polite' | 'assertive'): void;
}

class AccessibilityServiceImpl implements AccessibilityService {
  private announcer: HTMLElement | null = null;

  constructor() {
    this.initializeAnnouncer();
  }

  /**
   * Initialize screen reader announcer element
   */
  private initializeAnnouncer(): void {
    if (typeof window === 'undefined') return;

    this.announcer = document.createElement('div');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    this.announcer.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;
    document.body.appendChild(this.announcer);
  }

  /**
   * Validate ARIA attributes on an element
   */
  validateARIA(element: HTMLElement): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for required ARIA attributes
    const role = element.getAttribute('role');
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledby = element.getAttribute('aria-labelledby');

    // Ensure element has accessible name
    if (!ariaLabel && !ariaLabelledby && !element.textContent?.trim()) {
      const tagName = element.tagName.toLowerCase();
      if (['button', 'input', 'select', 'textarea'].includes(tagName)) {
        errors.push('Interactive element must have an accessible name');
      }
    }

    // Validate role-specific requirements
    if (role) {
      switch (role) {
        case 'button':
          if (!ariaLabel && !element.textContent?.trim()) {
            errors.push('Button role requires accessible name');
          }
          break;
        
        case 'slider':
          if (!element.hasAttribute('aria-valuemin') || 
              !element.hasAttribute('aria-valuemax') || 
              !element.hasAttribute('aria-valuenow')) {
            errors.push('Slider role requires aria-valuemin, aria-valuemax, and aria-valuenow');
          }
          break;
        
        case 'combobox':
          if (!element.hasAttribute('aria-expanded')) {
            errors.push('Combobox role requires aria-expanded');
          }
          break;
        
        case 'listbox':
          if (!element.hasAttribute('aria-multiselectable')) {
            warnings.push('Listbox should specify aria-multiselectable');
          }
          break;
      }
    }

    // Check for invalid ARIA attribute combinations
    if (element.hasAttribute('aria-hidden') && element.getAttribute('aria-hidden') === 'true') {
      if (element.hasAttribute('tabindex') && parseInt(element.getAttribute('tabindex') || '0') >= 0) {
        errors.push('Element with aria-hidden="true" should not be focusable');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Check keyboard navigation support
   */
  checkKeyboardNavigation(container: HTMLElement): boolean {
    const focusableElements = this.getFocusableElements(container);
    
    // Check if all interactive elements are keyboard accessible
    for (const element of focusableElements) {
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex === '-1' && !element.hasAttribute('aria-hidden')) {
        return false; // Element is not keyboard accessible
      }
    }

    // Check for proper tab order
    const tabbableElements = focusableElements.filter(el => {
      const tabIndex = parseInt(el.getAttribute('tabindex') || '0');
      return tabIndex >= 0;
    });

    // Ensure logical tab order
    const tabIndices = tabbableElements.map(el => 
      parseInt(el.getAttribute('tabindex') || '0')
    );
    
    const sortedIndices = [...tabIndices].sort((a, b) => a - b);
    const isLogicalOrder = tabIndices.every((index, i) => index === sortedIndices[i]);

    return isLogicalOrder;
  }

  /**
   * Validate color contrast ratios
   */
  validateColorContrast(element: HTMLElement): ContrastResult {
    const styles = window.getComputedStyle(element);
    const foreground = styles.color;
    const background = styles.backgroundColor;

    const ratio = this.calculateContrastRatio(foreground, background);

    return {
      ratio,
      passes: {
        aa: ratio >= 4.5,
        aaa: ratio >= 7
      },
      foreground,
      background
    };
  }

  /**
   * Generate appropriate ARIA attributes for control types
   */
  generateARIALabels(controlConfig: ControlConfig): ARIAAttributes {
    const attributes: ARIAAttributes = {};
    const { controlId, label, description, required } = controlConfig;

    // Basic attributes
    attributes['aria-label'] = label || controlId;
    
    if (description) {
      attributes['aria-describedby'] = `${controlId}-description`;
    }

    if (required) {
      attributes['aria-required'] = true;
    }

    return attributes;
  }

  /**
   * Enhance element with accessibility features
   */
  enhanceElement(element: HTMLElement, controlType: ControlType, config?: ControlConfig): void {
    // Generate ARIA attributes
    if (config) {
      const ariaAttributes = this.generateARIALabels(config);
      
      Object.entries(ariaAttributes).forEach(([key, value]) => {
        if (value !== undefined) {
          element.setAttribute(key, String(value));
        }
      });
    }

    // Add control-specific enhancements
    switch (controlType) {
      case 'slider':
      case 'range-slider':
        this.enhanceSlider(element, config);
        break;
      
      case 'list-values':
      case 'segmented':
        this.enhanceListControl(element, config);
        break;
      
      case 'switch':
      case 'checkbox':
        this.enhanceBooleanControl(element, config);
        break;
      
      case 'date':
      case 'date-range':
        this.enhanceDateControl(element, config);
        break;
      
      default:
        this.enhanceGenericControl(element, config);
    }

    // Add keyboard event handlers
    this.addKeyboardHandlers(element, controlType);
    
    // Add focus management
    this.addFocusManagement(element);
  }

  /**
   * Test accessibility of a container
   */
  async testAccessibility(container: HTMLElement): Promise<AccessibilityReport> {
    const violations: AccessibilityViolation[] = [];
    const warnings: AccessibilityWarning[] = [];
    const recommendations: string[] = [];

    // Test all focusable elements
    const focusableElements = this.getFocusableElements(container);

    for (const element of focusableElements) {
      // ARIA validation
      const ariaResult = this.validateARIA(element);
      ariaResult.errors.forEach(error => {
        violations.push({
          id: `aria-${Date.now()}-${Math.random()}`,
          severity: 'serious',
          element: this.getElementSelector(element),
          description: error,
          wcagLevel: 'AA',
          wcagCriteria: '4.1.2 Name, Role, Value',
          howToFix: 'Add appropriate ARIA attributes to provide accessible name and role'
        });
      });

      // Color contrast validation
      const contrastResult = this.validateColorContrast(element);
      if (!contrastResult.passes.aa) {
        violations.push({
          id: `contrast-${Date.now()}-${Math.random()}`,
          severity: 'serious',
          element: this.getElementSelector(element),
          description: `Color contrast ratio ${contrastResult.ratio.toFixed(2)}:1 does not meet WCAG AA standards`,
          wcagLevel: 'AA',
          wcagCriteria: '1.4.3 Contrast (Minimum)',
          howToFix: 'Increase color contrast to at least 4.5:1 for normal text'
        });
      }

      // Keyboard accessibility
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex === '-1' && !element.hasAttribute('aria-hidden')) {
        violations.push({
          id: `keyboard-${Date.now()}-${Math.random()}`,
          severity: 'critical',
          element: this.getElementSelector(element),
          description: 'Interactive element is not keyboard accessible',
          wcagLevel: 'A',
          wcagCriteria: '2.1.1 Keyboard',
          howToFix: 'Ensure element is focusable via keyboard navigation'
        });
      }
    }

    // Check for keyboard navigation
    const hasKeyboardNav = this.checkKeyboardNavigation(container);
    if (!hasKeyboardNav) {
      violations.push({
        id: `nav-${Date.now()}`,
        severity: 'critical',
        element: this.getElementSelector(container),
        description: 'Container does not support proper keyboard navigation',
        wcagLevel: 'A',
        wcagCriteria: '2.1.1 Keyboard',
        howToFix: 'Implement logical tab order and keyboard event handlers'
      });
    }

    // Generate recommendations
    if (violations.length === 0) {
      recommendations.push('Consider adding skip links for better navigation');
      recommendations.push('Test with actual screen readers for optimal experience');
    }

    // Calculate score
    const totalTests = focusableElements.length * 3 + 1; // ARIA + contrast + keyboard per element + navigation
    const passedTests = totalTests - violations.length;
    const score = Math.round((passedTests / totalTests) * 100);

    return {
      score,
      violations,
      warnings,
      recommendations
    };
  }

  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.announcer) return;

    this.announcer.setAttribute('aria-live', priority);
    this.announcer.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      if (this.announcer) {
        this.announcer.textContent = '';
      }
    }, 1000);
  }

  /**
   * Get all focusable elements in container
   */
  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selector = [
      'button',
      'input',
      'select',
      'textarea',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]',
      '[role="slider"]',
      '[role="combobox"]',
      '[role="listbox"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
  }

  /**
   * Calculate color contrast ratio
   */
  private calculateContrastRatio(foreground: string, background: string): number {
    const fgLuminance = this.getLuminance(foreground);
    const bgLuminance = this.getLuminance(background);
    
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Get relative luminance of a color
   */
  private getLuminance(color: string): number {
    // This is a simplified implementation
    // In production, you'd want a more robust color parsing library
    const rgb = this.parseColor(color);
    if (!rgb) return 0;

    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Parse color string to RGB values
   */
  private parseColor(color: string): [number, number, number] | null {
    // Simplified color parsing - in production use a proper color library
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    return null;
  }

  /**
   * Get CSS selector for element
   */
  private getElementSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  /**
   * Enhance slider controls
   */
  private enhanceSlider(element: HTMLElement, config?: ControlConfig): void {
    element.setAttribute('role', 'slider');
    element.setAttribute('aria-orientation', 'horizontal');
    
    if (config?.minValue !== undefined) {
      element.setAttribute('aria-valuemin', String(config.minValue));
    }
    if (config?.maxValue !== undefined) {
      element.setAttribute('aria-valuemax', String(config.maxValue));
    }
  }

  /**
   * Enhance list controls
   */
  private enhanceListControl(element: HTMLElement, config?: ControlConfig): void {
    element.setAttribute('role', 'listbox');
    
    if (config?.multiSelect) {
      element.setAttribute('aria-multiselectable', 'true');
    }
  }

  /**
   * Enhance boolean controls
   */
  private enhanceBooleanControl(element: HTMLElement, config?: ControlConfig): void {
    if (element.tagName.toLowerCase() === 'button') {
      element.setAttribute('role', 'switch');
    }
  }

  /**
   * Enhance date controls
   */
  private enhanceDateControl(element: HTMLElement, config?: ControlConfig): void {
    element.setAttribute('role', 'textbox');
    element.setAttribute('aria-placeholder', 'Select date');
  }

  /**
   * Enhance generic controls
   */
  private enhanceGenericControl(element: HTMLElement, config?: ControlConfig): void {
    if (!element.getAttribute('role')) {
      element.setAttribute('role', 'textbox');
    }
  }

  /**
   * Add keyboard event handlers
   */
  private addKeyboardHandlers(element: HTMLElement, controlType: ControlType): void {
    element.addEventListener('keydown', (e) => {
      switch (controlType) {
        case 'slider':
        case 'range-slider':
          this.handleSliderKeys(e, element);
          break;
        
        case 'list-values':
          this.handleListKeys(e, element);
          break;
        
        default:
          this.handleGenericKeys(e, element);
      }
    });
  }

  /**
   * Handle slider keyboard events
   */
  private handleSliderKeys(e: KeyboardEvent, element: HTMLElement): void {
    const step = parseFloat(element.getAttribute('step') || '1');
    const min = parseFloat(element.getAttribute('aria-valuemin') || '0');
    const max = parseFloat(element.getAttribute('aria-valuemax') || '100');
    const current = parseFloat(element.getAttribute('aria-valuenow') || '0');

    let newValue = current;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, current + step);
        break;
      
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, current - step);
        break;
      
      case 'Home':
        newValue = min;
        break;
      
      case 'End':
        newValue = max;
        break;
      
      default:
        return;
    }

    e.preventDefault();
    element.setAttribute('aria-valuenow', String(newValue));
    
    // Dispatch change event
    element.dispatchEvent(new CustomEvent('change', { detail: { value: newValue } }));
  }

  /**
   * Handle list keyboard events
   */
  private handleListKeys(e: KeyboardEvent, element: HTMLElement): void {
    // Implementation for list navigation
    // This would handle arrow keys, Enter, Space, etc.
  }

  /**
   * Handle generic keyboard events
   */
  private handleGenericKeys(e: KeyboardEvent, element: HTMLElement): void {
    // Basic keyboard handling for generic controls
    if (e.key === 'Enter' || e.key === ' ') {
      element.click();
    }
  }

  /**
   * Add focus management
   */
  private addFocusManagement(element: HTMLElement): void {
    element.addEventListener('focus', () => {
      element.classList.add('focus-visible');
    });

    element.addEventListener('blur', () => {
      element.classList.remove('focus-visible');
    });
  }
}

// Export singleton instance
export const accessibilityService = new AccessibilityServiceImpl();

// Export React hook for accessibility features
export function useAccessibility() {
  const enhanceElement = (element: HTMLElement | null, controlType: ControlType, config?: ControlConfig) => {
    if (element) {
      accessibilityService.enhanceElement(element, controlType, config);
    }
  };

  const announce = (message: string, priority?: 'polite' | 'assertive') => {
    accessibilityService.announceToScreenReader(message, priority);
  };

  const testAccessibility = async (container: HTMLElement) => {
    return accessibilityService.testAccessibility(container);
  };

  return {
    enhanceElement,
    announce,
    testAccessibility,
    validateARIA: accessibilityService.validateARIA,
    checkKeyboardNavigation: accessibilityService.checkKeyboardNavigation,
    validateColorContrast: accessibilityService.validateColorContrast
  };
}
