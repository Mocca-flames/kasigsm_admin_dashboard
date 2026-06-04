import React, { useState, useRef, useEffect } from 'react';
import '../styles/Table.css';
import Icon from './Icons';

const Table = ({ columns, data, onEdit, onDelete, renderActions }) => {
    const [showColumnMenu, setShowColumnMenu] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(() => columns.map(c => c.key));
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowColumnMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleColumn = (key) => {
        setVisibleColumns(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    };

    const activeColumns = columns.filter(c => visibleColumns.includes(c.key));

    return (
        <div className="table-container">
            <div className="table-toolbar">
                <div className="column-toggle-wrapper" ref={menuRef}>
                    <button
                        className="column-toggle-btn"
                        onClick={() => setShowColumnMenu(!showColumnMenu)}
                        title="Toggle columns"
                    >
                        <Icon name="columns" size={16} />
                    </button>
                    {showColumnMenu && (
                        <div className="column-toggle-menu">
                            {columns.map(col => (
                                <label key={col.key} className="column-toggle-option">
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns.includes(col.key)}
                                        onChange={() => toggleColumn(col.key)}
                                    />
                                    <span>{col.label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        {activeColumns.map((column) => (
                            <th key={column.key}>{column.label}</th>
                        ))}
                        {(onEdit || onDelete || renderActions) && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={activeColumns.length + 1} style={{ textAlign: 'center', padding: '40px' }}>
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, idx) => (
                            <tr key={idx}>
                                {activeColumns.map((column) => (
                                    <td key={column.key}>
                                        {column.render ? column.render(row) : row[column.key]}
                                    </td>
                                ))}
                                {(onEdit || onDelete || renderActions) && (
                                    <td>
                                        <div className="action-buttons">
                                            {onEdit && (
                                                <button
                                                    className="action-btn"
                                                    onClick={() => onEdit(row)}
                                                    title="Edit"
                                                >
                                                    <Icon name="edit" size={16} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    className="action-btn"
                                                    onClick={() => onDelete(row)}
                                                    title="Delete"
                                                >
                                                    <Icon name="trash" size={16} />
                                                </button>
                                            )}
                                            {renderActions && renderActions(row)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;