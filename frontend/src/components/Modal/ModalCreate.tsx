import { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { useModal } from "../../hooks/useModal";

interface ModalCreateProps {
  value: string | number | boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const ModalCreate: React.FC<ModalCreateProps> = ({ value, setIsModalOpen }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { openModal } = useModal();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Jika klik terjadi di luar modal
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false); // Menutup modal
      }
    };

    // Tambah event listener untuk mendeteksi klik di luar modal
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Hapus event listener ketika komponen di-unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsModalOpen]);
  return (
    <div
      ref={modalRef}
      className="absolute left-[14px] mt-2 bg-white p-4 rounded-md shadow-lg border w-[200px]"
    >
      <div className="flex flex-row justify-between">
        <h2 className="text-sm font-bold mb-2">Pilih Opsi</h2>
        <h2 className="text-sm font-bold mb-2 cursor-pointer">
          <IoMdClose
            onClick={() => {
              setIsModalOpen(false);
            }}
          />
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        <button
          className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600"
          onClick={() => {
            openModal("folder");
            setIsModalOpen(false); // Menutup modal setelah memilih opsi
          }}
        >
          Tambah Folder
        </button>
        <button
          className="bg-green-500 text-white py-1 px-2 rounded-md hover:bg-green-600"
          onClick={() => {
            console.log("Tambah File, value:", value);
            openModal("file");
            setIsModalOpen(false); // Menutup modal setelah memilih opsi
          }}
        >
          Tambah File
        </button>
      </div>
    </div>
  );
};

export default ModalCreate;
