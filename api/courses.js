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
        return res.status(400).json({ error: "Veuillez fournir une date avec ?date=jjmmaaaa" });
    }

    try {
        const pmuUrl = `https://offline.pmu.fr/api/exploration/programme/${date}`;
        
        // On simule un vrai navigateur web pour ne pas se faire bloquer par le PMU
        const response = await fetch(pmuUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json"
            }
        });
        
        if (!response.ok) {
            throw new Error(`Le PMU a refusé la connexion (Erreur ${response.status})`);
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des données PMU", details: error.message });
    }
}
