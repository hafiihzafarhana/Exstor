import React, { createContext, useState, ReactNode } from "react";

// Definisi interface untuk Context
interface ModalContextType {
  isModalOpen: boolean;
  modalType: "folder" | "file" | null;
  triggerLeft: boolean;
  setTriggerLeft: (value: boolean) => void;
  openModal: (type: "folder" | "file") => void;
  closeModal: () => void;
}

// Context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Provider untuk ModalContext
export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"folder" | "file" | null>(null);
  const [triggerLeft, setTriggerLeft] = useState<boolean>(false);

  const openModal = (type: "folder" | "file") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        modalType,
        openModal,
        closeModal,
        triggerLeft,
        setTriggerLeft,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext };
