import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  GetAllRootResponse,
  GetCreateResponse,
  SubItem,
} from "../../../interface";
import {
  bulkDelete,
  copyItem,
  copyPasteItem,
  create,
  fileUploader,
  onDelete,
  onUpdate,
  openFile,
  openFolder,
} from "../../../Service";
import { FaFolder, FaFile, FaCheck } from "react-icons/fa";
import ModalAfterCreate from "../../../../../components/Modal/ModalAfterCreate";
import { useModal } from "../../../../../hooks/useModal";
import ModalEditDelete from "../../../../../components/Modal/ModalEditDelete";
import * as ContextMenu from "@radix-ui/react-context-menu";
import "./redix_ui.css";
import { FaChevronRight } from "react-icons/fa";

const Explorer = () => {
  // untuk ambil id params dari url
  const { id } = useParams<{ id: string }>();

  // loading item
  const [loading, setLoading] = useState(false);

  // untuk menampung items
  const [subItems, setSubItems] = useState<SubItem[]>([]);

  // navigasi
  const navigate = useNavigate();

  // dibuatkan usecontext untuk trigger untuk sidebar apabila ada perubahan (CRUD) pada right bar
  const { setTriggerLeft } = useModal();

  // untuk membuka dan menutup modal rename dan delete
  const [isModalOpen, setIsModalOpen] = useState(false);

  // =====================================================================
  // kedua useState ini akan berfungsi untuk copy paste, copy here
  // ini untuk mendapatkan data yang akan diedit atau delete

  const [selectedItem, setSelectedItem] = useState<SubItem | null>(null);

  // dan ini untuk radix
  const [subItemDetect, setSubItemDetect] = useState<SubItem>({});
  // =====================================================================

  // untuk breadcrumb, di setting root dengan /explorer
  const [breadcrumb, setBreadcrumb] = useState<{ name: string; url: string }[]>(
    [{ name: "Root", url: "/explorer" }]
  );

  //=========================
  // untuk sort by
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | "type">(
    "createdAt"
  );
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  // ========================

  // ===============================
  // untuk selected items
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );

  // function untuk klik item satu per satu
  const handleItemClick = (
    id: string,
    index: number,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const newSelectedItems = new Set(selectedItems);

    if (event.shiftKey && lastSelectedIndex !== null) {
      // Select range if shift is held down
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      for (let i = start; i <= end; i++) {
        newSelectedItems.add(subItems[i].id as string);
      }
    } else {
      // Toggle the clicked item
      if (newSelectedItems.has(id)) {
        newSelectedItems.delete(id);
      } else {
        newSelectedItems.add(id);
      }
    }

    setSelectedItems(newSelectedItems);
    setLastSelectedIndex(index);
  };

  // sedangkan ini untuk select all
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Select all items
      const allItems = subItems.map((item) => item.id);
      setSelectedItems(new Set(allItems as string[]));
    } else {
      // Clear all selections
      setSelectedItems(new Set());
    }
  };
  // ===============================

  useEffect(() => {
    const fetchSubItems = async () => {
      setLoading(true); // Mulai loading
      try {
        const rootId = localStorage.getItem("rootId");
        const data: GetAllRootResponse = await openFolder(
          id === undefined ? (rootId as string) : (id as string),
          sortBy,
          sortDirection
        );

        setSubItems(data.result as SubItem[]);
      } catch (error) {
        console.error("Error fetching sub items:", error);
      } finally {
        setLoading(false); // Selesai loading
      }
    };

    fetchSubItems(); // Panggil fungsi fetch
  }, [id, sortBy, sortDirection]);

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

  // ============================================================
  // terpaksa dilakukan karena radix-ui tidak membawa subItem pilihan
  const handleContextMenu = () => {
    setSelectedItem(subItemDetect); // Simpan item yang dipilih
    setIsModalOpen(true); // Tampilkan modal
  };
  // ============================================================

  // close modal update dan delete
  const handleClose = () => setIsModalOpen(false);

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

  const handleBulkDeleteItesm = async () => {
    try {
      await bulkDelete(selectedItems);

      if (id === undefined) {
        setTriggerLeft(true);
      }

      setSubItems((prevItems) =>
        prevItems.filter((item) => !selectedItems.has(item.id as string))
      );
      // Update state dengan menghapus item
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  /*
  apabila klik bread crumb dan mengarah ke halaman lain, maka akan diperiksa terlebih dahulu
  semisal [/explorer, /datA, /dataB, /dataC], dan apabila langsung klik /dataA, maka
  akan menjadi [/explorer, /datA]
  */
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

  // untuk handle upload single file
  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault(); // Mencegah perilaku default
    try {
      const files = event.dataTransfer.files; // Ambil file yang di-drop
      const rootId = localStorage.getItem("rootId");
      const parentId = id === undefined ? (rootId as string) : (id as string);
      if (files.length > 0) {
        const createdItem: GetCreateResponse = await fileUploader(
          parentId,
          files[0]
        );
        if (id === undefined) {
          setTriggerLeft(true);
        }
        // Perbarui state dengan memeriksa tipe
        setSubItems((prevItems) => [
          ...prevItems,
          createdItem.result as SubItem,
        ]);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // Mencegah perilaku default untuk mengizinkan drop
  };

  // hanndle copy here
  const handleCopyItemHere = async () => {
    try {
      const createdItem: GetCreateResponse = await copyItem(
        subItemDetect.id as string
      );

      setTriggerLeft(true);

      // // Perbarui state dengan memeriksa tipe
      setSubItems((prevItems) => [...prevItems, createdItem.result as SubItem]);
    } catch (error) {
      console.error("Error copy item here:", error);
    }
  };

  // handle copy paste
  const handleCopyPaste = async () => {
    try {
      const rootId = localStorage.getItem("rootId");
      const parentId = id === undefined ? (rootId as string) : (id as string);
      const copyPathData = sessionStorage.getItem("copyPath");
      let copyPathJson;
      if (copyPathData) {
        copyPathJson = JSON.parse(copyPathData);
        const createdItem: GetCreateResponse = await copyPasteItem(
          copyPathJson as string,
          parentId as string
        );
        setTriggerLeft(true);

        // // Perbarui state dengan memeriksa tipe
        setSubItems((prevItems) => [
          ...prevItems,
          createdItem.result as SubItem,
        ]);
      }
    } catch (error) {
      console.error("Error copy paste item:", error);
    }
  };

  // =================================
  // untuk handling sorting
  const handleSortByChange = (criteria: "createdAt" | "name" | "type") => {
    setSortBy(criteria);
  };

  const handleSortDirectionChange = (direction: "ASC" | "DESC") => {
    setSortDirection(direction);
  };
  // =================================

  return (
    <ContextMenu.Root>
      <div
        className="p-2 max-h-[80vh] bg-white min-h-[80vh] overflow-y-auto "
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onPaste={handleCopyPaste}
      >
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
            <ContextMenu.Trigger className="ContextMenuTrigger">
              <div className="flex flex-row gap-2 items-center w-full py-4">
                <div className="flex flex-row gap-2 items-center w-full">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    className="cursor-pointer"
                  />
                  Select All
                </div>
                {selectedItems.size > 0 && (
                  <p
                    onClick={handleBulkDeleteItesm}
                    className="pr-4 text-red-500 cursor-pointer"
                  >
                    Delete
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-4 w-auto">
                {subItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded-md transition-transform transform hover:scale-105 cursor-pointer ${
                      selectedItems.has(item.id as string) ? "bg-blue-200" : ""
                    }`}
                    draggable // Tambahkan atribut draggable
                    onDoubleClick={async () => {
                      if (item.type === "folder") {
                        setBreadcrumb((prev) => [
                          ...prev,
                          {
                            name: item.name as string,
                            url: `/explorer/${item.id}`,
                          },
                        ]);
                        navigate(`/explorer/${item.id}`);
                      } else {
                        try {
                          const response = await openFile(item.id as string);
                          console.log("Response from opening file:", response);
                        } catch (error) {
                          console.error("Error opening file:", error);
                        }
                      }
                    }}
                    onContextMenu={() => setSubItemDetect(item)}
                    onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                      handleItemClick(item.id as string, index, event)
                    }
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
                      handleDeleteItem(id);
                      setIsModalOpen(false);
                    }}
                    onEdit={(newName: { name: string }) => {
                      handleUpdateItem(
                        selectedItem?.id as string,
                        newName.name
                      );
                      setIsModalOpen(false);
                    }}
                    onClose={handleClose}
                    type={selectedItem?.type as string}
                  />
                )}
              </div>
            </ContextMenu.Trigger>
            <ContextMenu.Portal>
              <ContextMenu.Content
                // sideOffset={5 as number}
                // align="end"
                className="ContextMenuContent"
                onCloseAutoFocus={(e) => {
                  e.preventDefault(); // Mencegah fokus otomatis
                  setSubItemDetect({}); // Atur subItemDetect ke {}
                }}
                onEscapeKeyDown={() => setSubItemDetect({})}
              >
                <ContextMenu.Item
                  className="ContextMenuItem"
                  onClick={() => {
                    handleContextMenu();
                  }}
                  disabled={
                    !subItemDetect || Object.keys(subItemDetect).length === 0
                  }
                >
                  Rename/Delete
                </ContextMenu.Item>
                <ContextMenu.Item
                  className="ContextMenuItem"
                  onClick={handleCopyItemHere}
                  disabled={
                    !subItemDetect || Object.keys(subItemDetect).length === 0
                  }
                >
                  Copy here
                </ContextMenu.Item>
                <ContextMenu.Item
                  className="ContextMenuItem"
                  disabled={
                    !subItemDetect || Object.keys(subItemDetect).length === 0
                  }
                  onClick={() => {
                    const dataToSave = subItemDetect.id;

                    // Simpan data dalam session storage sebagai JSON string
                    sessionStorage.setItem(
                      "copyPath",
                      JSON.stringify(dataToSave)
                    );
                  }}
                >
                  Copy (And Paste Using CTRL + V)
                </ContextMenu.Item>
                {/*  */}
                <ContextMenu.Sub>
                  <ContextMenu.SubTrigger className="ContextMenuSubTrigger">
                    Sorting
                    <div className="RightSlot">
                      <FaChevronRight />
                    </div>
                  </ContextMenu.SubTrigger>
                  <ContextMenu.Portal>
                    <ContextMenu.SubContent
                      className="ContextMenuSubContent"
                      sideOffset={2}
                      alignOffset={-5}
                    >
                      <ContextMenu.Item
                        className="ContextMenuItem"
                        onClick={() => handleSortByChange("createdAt")}
                      >
                        By Created Item {sortBy === "createdAt" && <FaCheck />}
                      </ContextMenu.Item>
                      <ContextMenu.Item
                        className="ContextMenuItem"
                        onClick={() => handleSortByChange("name")}
                      >
                        By Name {sortBy === "name" && <FaCheck />}
                      </ContextMenu.Item>
                      <ContextMenu.Item
                        className="ContextMenuItem"
                        onClick={() => handleSortByChange("type")}
                      >
                        By Type {sortBy === "type" && <FaCheck />}
                      </ContextMenu.Item>
                      <ContextMenu.Separator className="ContextMenuSeparator" />
                      <ContextMenu.Item
                        className="ContextMenuItem"
                        onClick={() => handleSortDirectionChange("ASC")}
                      >
                        Ascending {sortDirection === "ASC" && <FaCheck />}
                      </ContextMenu.Item>
                      <ContextMenu.Item
                        className="ContextMenuItem"
                        onClick={() => handleSortDirectionChange("DESC")}
                      >
                        Descending {sortDirection === "DESC" && <FaCheck />}
                      </ContextMenu.Item>
                    </ContextMenu.SubContent>
                  </ContextMenu.Portal>
                </ContextMenu.Sub>
                {/*  */}
              </ContextMenu.Content>
            </ContextMenu.Portal>
          </>
        ) : (
          <p className="text-center text-gray-500">No items found.</p>
        )}
      </div>
    </ContextMenu.Root>
  );
};

export default Explorer;
