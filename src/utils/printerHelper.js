import { swalToastError } from "src/helpers/swalFunction";
import { swalConfirmationOnly } from "src/helpers/swalFunctionPos";
import { setPrinterStatus } from "src/store/apps/config";
import axios from 'src/configs/axios'


let ePosDev = null;
let printer = null;
let connected = false;

export const connectToPrinter = ({
  printerConfig,
  dispatch,
}) => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.epson) {
      console.error("❌ ePOS SDK belum dimuat!");
      dispatch(setPrinterStatus({ connected: false, loading: false, error: "ePOS SDK belum dimuat!" }));
      reject("ePOS SDK belum dimuat!");
      return;
    }

    console.log("📡 Mencoba terhubung ke printer...");

    if (connected) {
      console.log("✅ Sudah terhubung ke printer.");
      dispatch(setPrinterStatus({ connected: true, loading: false }));
      resolve(printer);
      return;
    }

    ePosDev = new window.epson.ePOSDevice();

    dispatch(setPrinterStatus({ loading: true }));
    ePosDev.connect(printerConfig?.domain_type === "IP" ? printerConfig.ip : printerConfig?.domain, printerConfig?.port, (data) => {
      if (data === "OK" || data === "SSL_CONNECT_OK") {
        console.log("✅ Terhubung ke printer!");
        connected = true;
        ePosDev.createDevice(
          "local_printer",
          ePosDev.DEVICE_TYPE_PRINTER,
          { crypto: false, buffer: false },
          (printerInstance, code) => {
            if (printerInstance === null) {
              console.error("❌ Gagal membuat device printer:", code);
              dispatch(setPrinterStatus({ connected: false, loading: false, error: code }));
              reject(`Gagal membuat printer: ${code}`);
              return;
            }
            printer = printerInstance;
            console.log("🖨️ Printer siap digunakan.");
            dispatch(setPrinterStatus({ connected: true, loading: false }));
            resolve(printer);
          }
        );
      } else {
        console.log("❌ Gagal terhubung ke printer:", data);
        dispatch(setPrinterStatus({ connected: false, loading: false, error: data }));
        reject(data);
      }
    });

    ePosDev.ondisconnect = () => {
      connected = false;
      printer = null;
    };

  });
};

export const getPrinter = () => printer;

export const printPointOfSale = async (dispatch, code) => {
  swalConfirmationOnly({
    title: "Print Point of Sale",
    text: "Apakah anda yakin ingin mencetak Point of Sale ini?",
    showCancelButton: true,
    confirmButtonText: "Ya, Cetak",
    cancelButtonText: "Tidak",
    onClickYes: async () => {
      try {
        dispatch(setPrinterStatus({ printing: true }));

        // 🔹 Fetch data transaksi dari backend
        const response = await axios.post(`/point-of-sale/print-v3/${code}`);
        const posData = response.data.data;

        // 🔹 Ambil printer
        const printer = getPrinter();
        if (!printer) {
          swalToastError({ label: "Printer", error: "Printer tidak ditemukan" });
          dispatch(setPrinterStatus({ printing: false }));
          return;
        }

        // 🔹 Ambil buffer dari API (sudah dalam format ESC/POS)
        const dataString = posData.buffer;
        printer.addText(dataString);
        printer.addCut(printer.CUT_FEED);
        printer.send();

        console.log("✅ Berhasil mencetak Point of Sale!");
        dispatch(setPrinterStatus({ printing: false }));
      } catch (error) {
        console.error("❌ Gagal mengambil data POS:", error);
        swalToastError({ label: "Error", error: "Gagal mengambil data transaksi" });
        dispatch(setPrinterStatus({ printing: false }));
      }
    },
  });
};
