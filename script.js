// Function to retrieve and display data
function displayData() {
    let total = {
        lukaKecil: 0,
        lukaSedang: 0,
        lukaBesar: 0,
        kurangDalam: 0,
        normatif: 0,
        rapat: 0,
        boros: 0,
        sangatBoros: 0,
        batasDepan: 0,
        batasBelakang: 0,
        sotokan: 0,
        petikan: 0,
        lebih45: 0,
        kurang35: 0,
        bergelombang: 0,
        mangkok: 0,
        bowl: 0,
        pohonTidakDisadap: 0,
        talangMepet: 0
    };

    const divisors = {
        lukaKecil: 3,
        lukaSedang: 5,
        lukaBesar: 7,
        kurangDalam: 2,
        normatif: 0.1,
        rapat: 4,
        boros: 6,
        sangatBoros: 10,
        batasDepan: 2,
        batasBelakang: 2,
        sotokan: 5,
        petikan: 5,
        lebih45: 3,
        kurang35: 3,
        bergelombang: 2,
        mangkok: 3,
        bowl: 2,
        pohonTidakDisadap: 10,
        talangMepet: 1
    };

    let rekapHtml = '<table><tr><th>Form Tap</th><th>Data</th></tr>';

    // Loop through each form data from localStorage
    for (let i = 1; i <= 5; i++) {
        const formData = JSON.parse(localStorage.getItem(`formDataTap${i}`));
        if (formData) {
            let dataHtml = '';
            for (const key in formData) {
                const value = parseInt(formData[key]) || 0;
                const calculatedValue = value / divisors[key];
                dataHtml += `<p>${key}: ${value} (dibagi ${divisors[key]} = ${calculatedValue.toFixed(2)})</p>`;
                total[key] += calculatedValue; // Sum the totals
            }
            rekapHtml += `<tr><td>Form Tap ${i}</td><td>${dataHtml}</td></tr>`;
        } else {
            rekapHtml += `<tr><td>Form Tap ${i}</td><td>Data tidak ditemukan.</td></tr>`;
        }
    }

    rekapHtml += '</table>';
    document.getElementById('rekapData').innerHTML = rekapHtml;

    // Display the total data
    let totalHtml = '<table><tr><th>Data</th><th>Total</th><th>Kelas</th></tr>';
    for (const key in total) {
        const totalValue = total[key];
        let kelas;
        if (totalValue < 15) {
            kelas = 'A';
        } else if (totalValue >= 16 && totalValue <= 25) {
            kelas = 'B';
        } else {
            kelas = 'C';
        }
        totalHtml += `<tr><td>${key}</td><td>${totalValue.toFixed(2)}</td><td>${kelas}</td></tr>`;
    }
    // Add a total row at the bottom
    totalHtml += `<tr class="total-row"><td>Total Keseluruhan</td><td>${Object.values(total).reduce((sum, value) => sum + value, 0).toFixed(2)}</td><td>${getKelas(Object.values(total).reduce((sum, value) => sum + value, 0))}</td></tr>`;
    totalHtml += '</table>';
    document.getElementById('totalData').innerHTML = totalHtml;
}

// Function to get class based on total value
function getKelas(value) {
    if (value < 15) {
        return 'A';
    } else if (value >= 16 && value <= 25) {
        return 'B';
    } else {
        return 'C';
    }
}

// Function to save final data
function saveFinal() {
    const rekapData = {
        rekap: document.getElementById('rekapData').innerHTML,
        total: document.getElementById('totalData').innerHTML
    };
    localStorage.setItem('finalRecapData', JSON.stringify(rekapData));
    alert('Data berhasil disimpan sebagai final.');
}

// Function to download data in Excel format
function downloadData() {
    const rekapData = {
        rekap: document.getElementById('rekapData').innerText,
        total: document.getElementById('totalData').innerText
    };
    const data = [];
    const headers = ['Data', 'Total', 'Kelas'];
    data.push(headers);

    for (const key in total) {
        const totalValue = total[key];
        let kelas;
        if (totalValue < 15) {
            kelas = 'A';
        } else if (totalValue >= 16 && totalValue <= 25) {
            kelas = 'B';
        } else {
            kelas = 'C';
        }
        data.push([key, totalValue.toFixed(2), kelas]);
    }

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap Data');

    // Export the workbook
    XLSX.writeFile(wb, 'rekap_data.xlsx');
}

// Function to print data in Excel format
function printData() {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Data</title>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h1>Rekapitulasi Data</h1>');
    printWindow.document.write(document.getElementById('rekapData').innerHTML);
    printWindow.document.write('<h2>Total</h2>');
    printWindow.document.write(document.getElementById('totalData').innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// Call the function to display data when the page loads
window.onload = displayData;

// Event listeners for buttons
document.getElementById('saveButton').addEventListener('click', saveFinal);
document.getElementById('downloadButton').addEventListener('click', downloadData);
document.getElementById('printButton').addEventListener('click', printData);