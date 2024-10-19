import Swal from "sweetalert2";

interface AlertProps {
  title: string;
  text: string;
  icon: "success" | "error";
  onConfirm?: () => void; // Callback untuk dijalankan setelah konfirmasi
}

const Alert = ({ title, text, icon, onConfirm }: AlertProps) => {
  const showAlert = async () => {
    const result = await Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: "Okay",
    });

    if (result.isConfirmed && onConfirm) {
      onConfirm(); // Panggil callback jika ada
    }
  };

  showAlert(); // Panggil fungsi alert saat komponen dirender

  return null; // Komponen tidak merender apapun
};

export default Alert;
