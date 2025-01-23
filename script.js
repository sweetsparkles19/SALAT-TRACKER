document.addEventListener("DOMContentLoaded", () => {
    const prayerList = document.getElementById("prayer-list");
    const detectLocationButton = document.getElementById("detect-location");
    const manualLocationInput = document.getElementById("manual-location");
    const fetchManualButton = document.getElementById("fetch-manual");

    // Fetch prayer times based on latitude and longitude
    async function fetchPrayerTimes(lat, lon) {
        const response = await fetch(`/api/prayer-times?lat=${lat}&lon=${lon}`);
        const data = await response.json();

        if (data && data.timings) {
            displayPrayerTimes(data.timings);
        } else {
            alert("Gagal mengambil jadwal salat!");
        }
    }

    // Display prayer times on the page
    function displayPrayerTimes(timings) {
        prayerList.innerHTML = ""; // Clear the list first
        for (const [prayer, time] of Object.entries(timings)) {
            const listItem = document.createElement("li");
            listItem.textContent = `${prayer}: ${time}`;
            prayerList.appendChild(listItem);
        }
    }

    // Detect location automatically
    detectLocationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchPrayerTimes(latitude, longitude);
                },
                () => {
                    alert("Gagal mendeteksi lokasi!");
                }
            );
        } else {
            alert("Browser Anda tidak mendukung Geolocation.");
        }
    });

    // Fetch prayer times manually based on location input
    fetchManualButton.addEventListener("click", async () => {
        const location = manualLocationInput.value.trim();
        if (location) {
            const response = await fetch(`/api/prayer-times?location=${encodeURIComponent(location)}`);
            const data = await response.json();
            if (data && data.timings) {
                displayPrayerTimes(data.timings);
            } else {
                alert("Gagal menemukan jadwal salat berdasarkan lokasi!");
            }
        } else {
            alert("Silakan masukkan lokasi.");
        }
    });
});
