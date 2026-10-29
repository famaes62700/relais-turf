export default async function handler(req, res) {
    // 1. Désactiver les sécurités CORS qui bloquaient votre téléphone
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Réponse rapide pour les requêtes de vérification du navigateur
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 2. Récupérer la date demandée par votre application
    const { date } = req.query; // Format attendu: ddmmyyyy

    if (!date) {
        return res.status(400).json({ error: "Veuillez fournir une date avec ?date=jjmmaaaa" });
    }

    try {
        // 3. Interroger les serveurs publics du PMU depuis notre relais (qui ne sera pas bloqué)
        const pmuUrl = `https://offline.pmu.fr/api/exploration/programme/${date}`;
        
        const response = await fetch(pmuUrl);
        
        if (!response.ok) {
            throw new Error(`Le PMU a refusé la connexion (Erreur ${response.status})`);
        }

        const data = await response.json();
        
        // 4. Renvoyer les vraies données PMU à votre application
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des données PMU", details: error.message });
    }
}
