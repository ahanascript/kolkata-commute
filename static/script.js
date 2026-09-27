fetch("/locations")
    .then(response => response.json())
    .then(locations => {

        const fromSelect = document.getElementById("from");
        const toSelect = document.getElementById("to");

        locations.forEach(location => {

            const option1 = document.createElement("option");
            option1.value = location.id;
            option1.textContent = location.name;

            const option2 = document.createElement("option");
            option2.value = location.id;
            option2.textContent = location.name;

            fromSelect.appendChild(option1);
            toSelect.appendChild(option2);
        });
    });


function findRoutes() {

    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;

    if (!from || !to) {
        alert("Please select both locations.");
        return;
    }

    if (from === to) {
        alert("Source and destination cannot be the same.");
        return;
    }

    fetch(`/routes?from=${from}&to=${to}`)
        .then(response => response.json())
        .then(routes => {

            const results = document.getElementById("results");
            const routeCount = document.getElementById("route-count");

            results.innerHTML = "";

            if (routes.length === 0) {

                routeCount.textContent = "";

                results.innerHTML = `
                    <div class="no-route">
                        No routes found between these locations.
                    </div>
                `;

                return;
            }

            routeCount.textContent = `${routes.length} route${routes.length > 1 ? "s" : ""} found`;

            routes.forEach(route => {

                results.innerHTML += `
                    <div class="route-card">

                        <div class="route-card-header">
                            <h3>${route.transport_mode}</h3>

                            <span class="transport-badge">
                                ${route.transport_mode}
                            </span>
                        </div>

                        <div class="route-path">
                            <span>${route.source}</span>

                            <span class="route-arrow">→</span>

                            <span>${route.destination}</span>
                        </div>

                        <div class="route-info">

                            <div class="route-detail">
                                <span class="route-detail-label">
                                    Fare
                                </span>

                                <span class="route-detail-value">
                                    ₹${route.fare}
                                </span>
                            </div>

                            <div class="route-detail">
                                <span class="route-detail-label">
                                    Estimated Time
                                </span>

                                <span class="route-detail-value">
                                    ${route.estimated_time}
                                </span>
                            </div>

                        </div>

                    </div>
                `;
            });
        });
}


/* Swap From and To locations */

function swapLocations() {

    const fromSelect = document.getElementById("from");
    const toSelect = document.getElementById("to");

    const temp = fromSelect.value;

    fromSelect.value = toSelect.value;
    toSelect.value = temp;
}
