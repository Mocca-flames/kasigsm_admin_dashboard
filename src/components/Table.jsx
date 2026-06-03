import React from 'react';
import '../styles/Table.css';

/**
 * TABLE COMPONENT
 * Reusable table for displaying data
 * 
 * PROPS:
 * - columns: Array of column definitions
 *   Example: [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }]
 * - data: Array of data objects
 * - onEdit: Function to handle edit action
 * - onDelete: Function to handle delete action
 * 
 * HOW TO USE:
 * <Table 
 *   columns={columns} 
 *   data={users}
 *   onEdit={(row) => handleEdit(row)}
 *   onDelete={(row) => handleDelete(row)}
 * />
 */

const Table = ({ columns, data, onEdit, onDelete, renderActions }) => {
    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>{column.label}</th>
                        ))}
                        {(onEdit || onDelete || renderActions) && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '40px' }}>
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, idx) => (
                            <tr key={idx}>
                                {columns.map((column) => (
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
                                                    ✏️
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    className="action-btn"
                                                    onClick={() => onDelete(row)}
                                                    title="Delete"
                                                >
                                                    🗑️
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