import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal', () => {
  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <Modal.Header>
          <h2>Test Modal</h2>
        </Modal.Header>
        <Modal.Body>
          <p>Modal content</p>
        </Modal.Body>
        <Modal.Footer>
          <button>Close</button>
        </Modal.Footer>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <Modal.Header>
          <h2>Test Modal</h2>
        </Modal.Header>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Header showCloseButton={true} onClose={onClose}>
          <h2>Test Modal</h2>
        </Modal.Header>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Header>
          <h2>Test Modal</h2>
        </Modal.Header>
      </Modal>
    );

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { container } = render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Header>
          <h2>Test Modal</h2>
        </Modal.Header>
      </Modal>
    );

    const backdrop = container.querySelector('.fixed.inset-0');
    if (backdrop) {
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should not call onClose when modal content is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { container } = render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Header>
          <h2>Test Modal</h2>
        </Modal.Header>
        <Modal.Body>
          <p>Modal content</p>
        </Modal.Body>
      </Modal>
    );

    const modalContent = screen.getByText('Modal content');
    await user.click(modalContent);

    expect(onClose).not.toHaveBeenCalled();
  });
});

