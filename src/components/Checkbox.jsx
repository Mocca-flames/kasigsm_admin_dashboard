import React, { forwardRef } from 'react';
import '../styles/Checkbox.css';
import Icon from './Icons';

/**
 * CHECKBOX COMPONENT
 * Custom checkbox with label and various states
 *
 * Props:
 * - checked: boolean
 * - disabled: boolean
 * - required: boolean
 * - label: string
 * - helperText: string
 * - error: string
 * - indeterminate: boolean
 * - onChange: function
 * - ...other props
 */

const Checkbox = forwardRef(({
  checked = false,
  disabled = false,
  required = false,
  label,
  helperText,
  error,
  indeterminate = false,
  onChange,
  className = '',
  ...props
}, ref) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const checkboxClasses = [
    'checkbox',
    checked ? 'checkbox-checked' : '',
    indeterminate ? 'checkbox-indeterminate' : '',
    disabled ? 'checkbox-disabled' : '',
    error ? 'checkbox-error' : '',
    className
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'checkbox-container',
    disabled ? 'checkbox-container-disabled' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <label className="checkbox-wrapper">
        <input
          ref={ref}
          type="checkbox"
          className="checkbox-input"
          checked={checked}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          {...props}
        />
        <span className={checkboxClasses}>
          {indeterminate ? <Icon name="minus" size={14} /> : checked ? <Icon name="check" size={14} /> : ''}
        </span>
        {label && (
          <span className="checkbox-label">
            {label}
            {required && <span className="checkbox-required">*</span>}
          </span>
        )}
      </label>

      {(error || helperText) && (
        <div className={`checkbox-message ${error ? 'checkbox-message-error' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;