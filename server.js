const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/rekapDB", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const rekapSchema = new mongoose.Schema({
    date: String,
    total: Number,
    classification: String,
    evaluatorData: Object
});

const Rekap = mongoose.model("Rekap", rekapSchema);

app.post("/api/rekap", async (req, res) => {
    try {
        const rekap = new Rekap(req.body);
        await rekap.save();
        res.json({ message: "Rekap berhasil disimpan", data: rekap });
    } catch (error) {
        res.status(500).json({ error: "Gagal menyimpan data" });
    }
});

app.get("/api/rekap", async (req, res) => {
    const rekapData = await Rekap.find();
    res.json(rekapData);
});

app.get("/api/rekap/:date", async (req, res) => {
    const rekap = await Rekap.findOne({ date: req.params.date });
    if (rekap) {
        res.json(rekap);
    } else {
        res.status(404).json({ error: "Data tidak ditemukan" });
    }
});

app.listen(5000, () => console.log("Server berjalan di port 5000"));
