import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  GetAllRootResponse,
  GetCreateResponse,
  SubItem,
} from "../../../interface";
import {
  create,
  onDelete,
  onUpdate,
  openFile,
  openFolder,
} from "../../../Service";
import { FaFolder, FaFile } from "react-icons/fa";
import ModalAfterCreate from "../../../../../components/Modal/ModalAfterCreate";
import { useModal } from "../../../../../hooks/useModal";
import ModalEditDelete from "../../../../../components/Modal/ModalEditDelete";

const Explorer = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [subItems, setSubItems] = useState<SubItem[]>([]);
  const navigate = useNavigate();
  const { setTriggerLeft } = useModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SubItem | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<{ name: string; url: string }[]>(
    [{ name: "Root", url: "/explorer" }]
  );

  useEffect(() => {
    const fetchSubItems = async () => {
      setLoading(true); // Mulai loading
      try {
        const rootId = localStorage.getItem("rootId");
        const data: GetAllRootResponse = await openFolder(
          id === undefined ? (rootId as string) : (id as string)
        );

        setSubItems(data.result as SubItem[]);
      } catch (error) {
        console.error("Error fetching sub items:", error);
      } finally {
        setLoading(false); // Selesai loading
      }
    };

    fetchSubItems(); // Panggil fungsi fetch
  }, [id]);

  const handleClose = () => setIsModalOpen(false);

  const createItem = async (
    newItem: { name: string; type: string },
    parentId: string
  ) => {
    try {
      const createdItem: GetCreateResponse = await create(
        { name: newItem.name, type: newItem.type },
        parentId
      ); // Menggunakan service create

      // Pastikan result ada dan memiliki tipe SubItem
      return createdItem.result as SubItem; // Cast ke SubItem jika perlu
    } catch (error) {
      console.error("Error creating item:", error);
      throw error; // Lemparkan error untuk ditangani di luar
    }
  };

  const handleAddItem = async (newItem: { name: string; type: string }) => {
    try {
      const rootId = localStorage.getItem("rootId");
      const parentId = id === undefined ? (rootId as string) : (id as string);
      const createdItem = await createItem(newItem, parentId); // Pastikan parentId didefinisikan
      if (id === undefined) {
        setTriggerLeft(true);
      }
      // Perbarui state dengan memeriksa tipe
      setSubItems((prevItems) => [...prevItems, createdItem]); // Tambahkan item baru ke state
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  const handleContextMenu = (event: React.FormEvent, item: SubItem) => {
    event.preventDefault(); // Mencegah menu konteks default
    setSelectedItem(item); // Simpan item yang dipilih
    setIsModalOpen(true); // Tampilkan modal
  };

  const handleUpdateItem = async (itemId: string, newName: string) => {
    try {
      const updatedItem: GetCreateResponse = await onUpdate(itemId, newName); // Memanggil API atau service untuk update

      if (id === undefined) {
        setTriggerLeft(true);
      }

      setSubItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId
            ? { ...item, name: updatedItem.result?.name }
            : item
        )
      ); // Perbarui nama item dalam state tanpa refresh
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await onDelete(itemId); // Fungsi API untuk menghapus item
      console.log(itemId);

      if (id === undefined) {
        setTriggerLeft(true);
      }

      setSubItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      ); // Update state dengan menghapus item
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };
  const handleFolderClick = (name: string, url: string) => {
    setBreadcrumb((prev) => {
      // Temukan indeks item yang memiliki URL yang sama
      const existingIndex = prev.findIndex((item) => item.url === url);

      if (existingIndex !== -1) {
        // Jika ditemukan, ambil elemen sebelum indeks yang ditemukan
        return [
          ...prev.slice(0, existingIndex + 1), // Ambil semua item sampai dan termasuk item yang ditemukan
        ];
      }

      // Jika tidak ditemukan, tambahkan item baru
      return [
        ...prev,
        { name, url }, // Tambahkan item baru
      ];
    });
  };

  return (
    <div className="p-2 max-h-[100vh] overflow-y-auto">
      <ModalAfterCreate onAddItem={handleAddItem} />
      <nav className="mb-2 flex flex-row gap-4 items-center">
        Route:
        {breadcrumb.map((item, index) => (
          <span
            className="font-bold"
            key={index}
            onClick={() =>
              handleFolderClick(item.name as string, item.url as string)
            }
          >
            <Link to={item.url}>{item.name}</Link>
            {index < breadcrumb.length - 1 && " > "}
          </span>
        ))}
      </nav>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : subItems.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-4">
            {subItems.map((item) => (
              <div
                key={item.id}
                className={`p-2 rounded-md transition-transform transform hover:scale-105 cursor-pointer`}
                onDoubleClick={async () => {
                  if (item.type === "folder") {
                    // Logika untuk membuka folder
                    setBreadcrumb((prev) => [
                      ...prev,
                      {
                        name: item.name as string,
                        url: `/explorer/${item.id}`,
                      },
                    ]);
                    navigate(`/explorer/${item.id}`);
                  } else {
                    // Logika untuk membuka file
                    try {
                      const response = await openFile(item.id as string);
                      console.log("Response from opening file:", response);
                    } catch (error) {
                      console.error("Error opening file:", error);
                    }
                  }
                }}
                onContextMenu={(event) => handleContextMenu(event, item)}
              >
                <div className="flex flex-col items-center">
                  <div className="mb-2">
                    {item.type === "folder" ? (
                      <FaFolder size={24} />
                    ) : (
                      <FaFile size={24} />
                    )}
                  </div>
                  <h3 className="font-semibold text-center text-[12px]">
                    {item.name}
                  </h3>
                </div>
              </div>
            ))}
            {isModalOpen && (
              <ModalEditDelete
                item={selectedItem as SubItem}
                onDelete={(id: string) => {
                  handleDeleteItem(id); // Panggil handleDeleteItem dengan id
                  setIsModalOpen(false); // Tutup modal setelah menghapus item
                }}
                onEdit={(newName: { name: string }) => {
                  handleUpdateItem(selectedItem?.id as string, newName.name); // Panggil fungsi handleUpdateItem
                  setIsModalOpen(false);
                }}
                onClose={handleClose}
                type={selectedItem?.type as string}
              />
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No items found.</p>
      )}
    </div>
  );
};

export default Explorer;
