const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Koneksi ke MongoDB
mongoose.connect("mongodb://localhost:27017/rekapData", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema Rekap Data
const RekapSchema = new mongoose.Schema({
    date: String,
    total: Number,
    classification: String,
    evaluatorData: Object
});

const Rekap = mongoose.model("Rekap", RekapSchema);

// Simpan Rekap Data
app.post("/api/rekap", async (req, res) => {
    try {
        const { date, total, classification, evaluatorData } = req.body;
        let rekap = await Rekap.findOne({ date });

        if (rekap) {
            // Update jika sudah ada
            rekap.total = total;
            rekap.classification = classification;
            rekap.evaluatorData = evaluatorData;
        } else {
            // Buat baru jika belum ada
            rekap = new Rekap({ date, total, classification, evaluatorData });
        }
        
        await rekap.save();
        res.json({ message: "Data berhasil disimpan", rekap });
    } catch (error) {
        res.status(500).json({ message: "Error menyimpan data", error });
    }
});

// Ambil semua Rekap Data
app.get("/api/rekap", async (req, res) => {
    try {
        const rekapData = await Rekap.find();
        res.json(rekapData);
    } catch (error) {
        res.status(500).json({ message: "Error mengambil data", error });
    }
});

// Ambil Rekap Data berdasarkan tanggal
app.get("/api/rekap/:date", async (req, res) => {
    try {
        const rekap = await Rekap.findOne({ date: req.params.date });
        if (!rekap) return res.status(404).json({ message: "Data tidak ditemukan" });
        res.json(rekap);
    } catch (error) {
        res.status(500).json({ message: "Error mengambil data", error });
    }
});

app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
