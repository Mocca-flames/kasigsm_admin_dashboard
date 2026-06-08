import React from 'react'
import { Toaster as HotToaster } from 'react-hot-toast'

export const Toaster = () => {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          boxShadow: 'var(--shadow-md)',
          minWidth: '280px',
        },
        success: {
          style: {
            background: 'var(--color-success-dim)',
            border: '1px solid var(--color-success)',
          },
          iconTheme: {
            primary: 'var(--color-success)',
            secondary: 'var(--bg-card)',
          },
        },
        error: {
          style: {
            background: 'var(--color-danger-dim)',
            border: '1px solid var(--color-danger)',
          },
          iconTheme: {
            primary: 'var(--color-danger)',
            secondary: 'var(--bg-card)',
          },
        },
      }}
    />
  )
}