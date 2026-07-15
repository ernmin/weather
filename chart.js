function extractData(weather_data) {
    let data = weather_data.daily.temperature_2m_max
    let dateStrings = weather_data.daily.time
    if (checkBox.checked) {
        return [data, dateStrings]
    }
    else {
        dataF = data.map(num => (num * (9/5) + 32).toFixed(1));
        return [dataF, dateStrings]
    }
    
}

// function drawChart(data, dateStrings) {
function drawChart(weather) {
    let [data, dateStrings] = extractData(weather);// extractData(weather_data)
    
    const canvas = document.getElementById('lineChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Padding configuration to ensure text fits perfectly
    const paddingLeftRight = 60;
    const paddingTopBottom = 60;
    const chartWidth = canvas.width - (paddingLeftRight * 2);
    const chartHeight = canvas.height - (paddingTopBottom * 2);

    // Find the maximum value to automatically scale the Y-axis heights
    const maxVal = Math.max(...data);

    // Mapping helper functions
    function getX(index) {
        return paddingLeftRight + (index * (chartWidth / (data.length - 1)));
    }

    function getY(value) {
        return paddingTopBottom + chartHeight - ((value / maxVal) * chartHeight);
    }

    // --- 1. DRAW HORIZONTAL GRID LINES & Y LABELS ---
    ctx.strokeStyle = '#eef0f2';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#666';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 10; i++) {
        const val = ((maxVal * 1.5) / 10) * i;
        const y = getY(val);
        
        ctx.beginPath();
        ctx.moveTo(paddingLeftRight, y);
        ctx.lineTo(canvas.width - paddingLeftRight, y);
        ctx.stroke();

        ctx.fillText(Math.round(val), paddingLeftRight - 15, y + 4);
    }

    // --- 2. DRAW THE X-AXIS DATE LABELS ---
    ctx.textAlign = 'center';
    for (let i = 0; i < dateStrings.length; i++) {
        const x = getX(i);
        const y = paddingTopBottom + chartHeight + 22;
        
        // Convert string to Date object and format cleanly (e.g., "Jul 1")
        const dateObj = new Date(dateStrings[i]);
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        ctx.fillText(formattedDate, x, y);
    }

    // --- 3. DRAW THE CHART LINE ---
    ctx.beginPath();
    ctx.strokeStyle = '#007bff'; // Royal Blue
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';

    ctx.moveTo(getX(0), getY(data[0]));
    for (let i = 1; i < data.length; i++) {
        ctx.lineTo(getX(i), getY(data[i]));
    }
    ctx.stroke();

    // --- 4. DRAW THE DATA POINTS (DOTS) ---
    ctx.fillStyle = '#007bff';
    for (let i = 0; i < data.length; i++) {
        ctx.beginPath();
        ctx.arc(getX(i), getY(data[i]), 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Optional value display above each node dot
        ctx.fillStyle = '#1e293b';
        ctx.fillText(data[i], getX(i), getY(data[i]) - 12);
        ctx.fillStyle = '#007bff'; // reset for next dot loop
    }

    canvas.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)"
}

function destroyChart() {
    const canvas = document.querySelector('#lineChart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    canvas.style.boxShadow = ""
    const divCity = document.querySelector('#city-country')
    divCity.textContent = ""
}

