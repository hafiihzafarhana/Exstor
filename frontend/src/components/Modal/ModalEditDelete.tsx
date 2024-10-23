import { useState } from "react";
import { SubItem } from "../../pages/Dashboard/interface";

interface ModalEditDeleteProps {
  item: SubItem;
  type: string;
  onClose: () => void;
  onEdit: (newName: { name: string }) => void;
  onDelete: (id: string) => void;
}

const ModalEditDelete: React.FC<ModalEditDeleteProps> = ({
  item,
  onDelete,
  onEdit,
  onClose,
}) => {
  const [newName, setNewName] = useState(item ? item.name : ""); // State untuk menyimpan nama baru

  if (!item) return null; // Jika tidak ada item, jangan tampilkan modal

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-md shadow-lg w-1/3">
        <div className="flex items-center justify-between p-2 border-b">
          <h2 className="font-semibold">Options for {item.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            &times; {/* Simbol untuk menutup modal */}
          </button>
        </div>

        {/* Input untuk mengedit nama item */}
        <div className="p-4">
          <label className="block mb-2">Rename:</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New name"
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex justify-between p-4 border-t">
          {/* Tombol untuk menyimpan perubahan */}
          <button
            onClick={() => {
              onEdit({ name: newName as string }); // Panggil fungsi edit dengan data baru
              onClose(); // Tutup modal setelah edit
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit
          </button>

          {/* Tombol untuk menghapus item */}
          <button
            onClick={() => {
              onDelete(item.id as string); // Panggil fungsi delete
              onClose(); // Tutup modal setelah delete
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditDelete;
