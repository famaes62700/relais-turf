export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { date } = req.query; // Format attendu: ddmmyyyy

    if (!date) {
        return res.status(400).json({ error: "Date manquante" });
    }

    try {
        // Vraie API interne du PMU pour récupérer le programme du jour au format JJMMAAAA
        const pmuApiUrl = `https://online.turf.pmu.fr/client/rest/v1/programme/${date}`;
        
        const response = await fetch(pmuApiUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
                "Accept": "application/json"
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erreur PMU ${response.status}`);
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        // En cas de blocage de l'API mobile, on renvoie une erreur propre avec les détails
        return res.status(500).json({ 
            error: "Impossible de joindre l'API officielle PMU du jour", 
            details: error.message 
        });
    }
}
