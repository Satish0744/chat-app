export interface ModalProps {
  /** Controls whether the modal is open or closed */
  isOpen: boolean;
  /** Function to call when the modal should close */
  onClose: () => void;
  /** Title of the modal */
  title: string;
  /** Content to render inside the modal */
  children: React.ReactNode;
  /** Size of the modal */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Whether to close the modal when clicking the overlay */
  closeOnOverlayClick?: boolean;
  /** Additional CSS classes */
  className?: string;
}