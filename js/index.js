// js/index.js

async function fetchCurrentDate() {
    try {
        const response = await fetch('http://worldtimeapi.org/api/ip');
        const data = await response.json();
        return new Date(data.utc_datetime);
    } catch (error) {
        console.error('Error fetching current date:', error);
        return new Date(); // Sử dụng thời gian cục bộ nếu không thể lấy thời gian từ API
    }
}

async function updateText() {
    const currentDate = await fetchCurrentDate();
    const storedDate = localStorage.getItem('lastUpdateDate');
    const index = localStorage.getItem('textIndex') || '0';

    // Danh sách các văn bản
    const texts = [
        "HoangNguyen-hour-p650q3wx2jvtu9gb",
        "HoangNguyen-hour-p650q3wữ2jvtdjdk",
        "HoangNguyen-hour-ư djdbebxj",
        "HoangNguyen-hour-hdbdbdq3wữ2jvtdjdk"
    ];

    let lastUpdateDate = storedDate ? new Date(storedDate) : null;

    // Nếu không có ngày lưu trữ, thiết lập ngày hiện tại
    if (!lastUpdateDate) {
        localStorage.setItem('lastUpdateDate', currentDate.toISOString());
        localStorage.setItem('textIndex', '0');
        document.querySelector('.saochepkey').innerText = texts[0];
        return;
    }

    // Tính số ngày đã trôi qua từ lần cập nhật cuối cùng
    const daysPassed = Math.floor((currentDate - lastUpdateDate) / (24 * 60 * 60 * 1000));

    if (daysPassed > 0) {
        // Cập nhật ngày hiện tại và văn bản mới
        localStorage.setItem('lastUpdateDate', currentDate.toISOString());

        let newIndex = parseInt(index, 10) + daysPassed;
        if (newIndex >= texts.length) {
            newIndex = texts.length - 1; // Giới hạn đến văn bản cuối cùng nếu vượt quá số lượng
        }
        localStorage.setItem('textIndex', newIndex);

        document.querySelector('.saochepkey').innerText = texts[newIndex];
    }
}

function updateDateTime() {
    fetchCurrentDate().then(currentDate => {
        const dateTimeStr = currentDate.toLocaleString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'numeric', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric', 
            second: 'numeric' 
        });
        document.getElementById('datetime').textContent = 'Ngày giờ: ' + dateTimeStr;
    });
}

function updateFPS() {
    let lastTime = performance.now();
    let frameCount = 0;
    const fpsElement = document.getElementById('fps');

    function calculateFPS() {
        const now = performance.now();
        frameCount++;
        if (now - lastTime >= 1000) {
            const fps = (frameCount * 1000) / (now - lastTime);
            fpsElement.textContent = 'FPS: ' + fps.toFixed(1);
            frameCount = 0;
            lastTime = now;
        }
        requestAnimationFrame(calculateFPS);
    }
    calculateFPS();
}

// Initialize text, date/time, and FPS updates
updateText();
setInterval(updateDateTime, 1000);
updateDateTime();
updateFPS();