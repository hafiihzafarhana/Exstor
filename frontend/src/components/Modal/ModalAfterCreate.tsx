import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { IoMdClose } from "react-icons/io";

type OnAddItem = (newItem: { name: string; type: string }) => void;

interface ModalAfterCreateProps {
  onAddItem: OnAddItem; // Menggunakan tipe data OnAddItem
}

const ModalAfterCreate: React.FC<ModalAfterCreateProps> = ({ onAddItem }) => {
  const { isModalOpen, modalType, closeModal } = useModal();
  const [itemName, setItemName] = useState("");

  const handleCreate = () => {
    if (itemName.trim()) {
      // Kirim data kembali ke Explorer
      const newItem = {
        name: itemName,
        type: modalType === null ? "folder" : modalType, // Pastikan type tidak null
      };
      onAddItem(newItem); // Sesuaikan dengan struktur item Anda
      setItemName(""); // Reset input
      closeModal(); // Tutup modal setelah action
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-[300px]">
        <h2 className="text-lg font-bold mb-4 flex flex-row items-center justify-between">
          <p>{modalType === "folder" ? "Create Folder" : "Create File"}</p>
          <IoMdClose
            className="cursor-pointer"
            onClick={() => {
              closeModal();
            }}
          />
        </h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder={modalType === "folder" ? "Folder Name" : "File Name"}
            className="border p-2 rounded-md"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            onClick={handleCreate}
          >
            {modalType === "folder" ? "Create Folder" : "Create File"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAfterCreate;
