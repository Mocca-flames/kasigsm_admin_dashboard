import { toast } from 'react-hot-toast'

export const notifySuccess = (message) => toast.success(message)
export const notifyError = (message) => toast.error(message)
export const notifyInfo = (message) => toast(message)
export const notifyWarning = (message) => toast(message, {
  style: {
    background: 'var(--color-warning-dim)',
    border: '1px solid var(--color-warning)',
  },
  icon: '⚠️',
})