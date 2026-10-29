async function loadLivePmu() {
    const dateInput = document.getElementById('raceDate').value; // Format AAAA-MM-JJ
    const statusText = document.getElementById('statusText');
    statusText.innerHTML = '<span class="text-amber-400"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Chargement des courses en direct...</span>';

    const parts = dateInput.split('-');
    const ddmmyyyy = `${parts[2]}${parts[1]}${parts[0]}`;

    try {
        // URL cible officielle du PMU
        const targetUrl = `https://online.turf.pmu.fr/client/rest/v1/programme/${ddmmyyyy}`;
        
        // Utilisation d'un proxy public mondial pour faire transiter la requête sans erreur CORS ni blocage 500
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error("Erreur du service de contournement");

        const proxyData = await response.json();
        if (!proxyData.contents) throw new Error("Données vides reçues");

        const data = JSON.parse(proxyData.contents);

        if (data && data.programme && data.programme.reunions) {
            liveMeetingsData = data.programme.reunions;
            populateMeetingsSelect(liveMeetingsData);
            statusText.innerHTML = `<span class="text-emerald-400"><i class="fa-solid fa-check mr-2"></i>Direct PMU actif (${liveMeetingsData.length} réunions).</span>`;
        } else {
            throw new Error("Aucune réunion trouvée pour cette date.");
        }
    } catch (err) {
        console.error(err);
        statusText.innerHTML = `<span class="text-red-400 font-bold"><i class="fa-solid fa-triangle-exclamation mr-2"></i>Indisponible pour cette date (Utilisez une date du jour).</span>`;
        clearDisplay();
    }
}
