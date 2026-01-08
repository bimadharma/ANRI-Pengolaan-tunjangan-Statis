import React from "react";
import { Modal } from "antd";

interface ComponentModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onOk: () => void;
    okText?: string;
    cancelText?: string;
}

export const ComponentModal: React.FC<ComponentModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    onOk,
    okText = "Simpan",
    cancelText = "Batal",
}) => {
    return (
        <Modal
            title={title}
            open={isOpen}
            onOk={onOk}
            onCancel={onClose}
            okText={okText}
            cancelText={cancelText}
            centered
            width={600}
        >
            {children}
        </Modal>
    );
};