export interface ToastMessage {
  type: 'message' | 'success' | 'error';
  message: string;
  read: boolean;
}
