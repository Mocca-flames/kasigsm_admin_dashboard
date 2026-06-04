import React, { useRef, useEffect } from 'react';
import { CountUp } from 'countup.js';
import '../styles/Card.css';

export const Card = ({ title, children, action, className = '' }) => {
    return (
        <div className={`card ${className}`}>
            {title && (
                <div className="card-header">
                    <h3 className="card-title">{title}</h3>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
};

const parseVal = (val) => {
    if (typeof val === 'number') return { num: val, prefix: '', suffix: '' };
    const str = String(val);
    const numMatch = str.match(/[\d]+[.,]?\d*/);
    const num = numMatch ? parseFloat(numMatch[0].replace(/,/g, '')) : 0;
    const prefixMatch = str.match(/^[^\d]*/);
    const prefix = prefixMatch ? prefixMatch[0] : '';
    return { num, prefix };
};

export const StatCard = ({ icon, label, value, change, positive, color = 'primary', className = '' }) => {
    const counterRef = useRef(null);
    const countUpRef = useRef(null);

    useEffect(() => {
        if (!counterRef.current) return;

        const { num, prefix } = parseVal(value);

        if (countUpRef.current) {
            countUpRef.current.reset();
        }

        countUpRef.current = new CountUp(counterRef.current, num, {
            duration: 1.4,
            separator: ',',
            decimal: '.',
            prefix,
            useEasing: true,
            enableScrollSpy: false,
        });

        countUpRef.current.start();

        return () => {
            if (countUpRef.current) {
                countUpRef.current.reset();
                countUpRef.current = null;
            }
        };
    }, [value]);

    return (
        <div className={`stat-card ${className}`} data-color={color}>
            <div className="stat-header">
                <div className={`stat-icon ${color}`}>
                    {icon}
                </div>
            </div>
            <div className="stat-value">
                <span className="countup-target" ref={counterRef} />
            </div>
            <div className="stat-label">{label}</div>
            {change && (
                <span className={`stat-change ${positive ? 'positive' : 'negative'}`}>
                    {positive ? '\u2191' : '\u2193'} {change}
                </span>
            )}
        </div>
    );
};
