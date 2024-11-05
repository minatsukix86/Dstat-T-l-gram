
📡 Bot Telegram avec Surveillance de Trafic Réseau (DSTAT) en SSH
Bienvenue dans le projet de bot Telegram interactif ! Ce bot vous permet de surveiller le trafic réseau de votre serveur à distance, en utilisant des commandes Telegram pour sélectionner une interface réseau, définir la durée de surveillance, et obtenir des statistiques en temps réel.

🚀 Fonctionnalités
Commandes interactives : le bot accepte les commandes pour lancer et arrêter la surveillance du trafic.
Surveillance réseau en SSH : possibilité de choisir l'interface réseau et la durée pour une analyse personnalisée.
Rapports intermédiaires : le bot envoie des résumés à mi-parcours et des rapports complets à la fin de la surveillance.
Intégration Discord : envoie un récapitulatif de l’analyse directement dans un canal Discord via un webhook.
🛠️ Installation
Pré-requis
Node.js installé
Compte Telegram pour créer un bot et obtenir le token
Accès SSH au serveur cible
Un webhook Discord pour recevoir les résumés de trafic

🔧 Utilisation
Commandes disponibles
/start : Affiche les commandes disponibles et l'ID de l'utilisateur.
/count : Permet de sélectionner une interface et une durée pour surveiller le trafic réseau.
/review : Sondage pour choisir le meilleur botnet.
Le bot répond aux options de chaque commande pour une interaction facile et en temps réel.

Exemples
Envoyez /count pour commencer la surveillance du trafic réseau.
Sélectionnez une interface (par ex. eth0) puis définissez la durée (par ex. 120 secs).
Recevez un résumé intermédiaire et un rapport final avec le trafic entrant/sortant moyen et total.

📈 Résultats de la Surveillance
Trafic entrant : Calculé et affiché en Kbps, Mbps, ou Gbps selon la quantité de données.
Trafic sortant : De même, toutes les données sont formatées pour être facilement compréhensibles.
Récapitulatif dans Discord : Envoie automatiquement un résumé à mi-parcours et un rapport final sur le webhook configuré.
🐛 Dépannage
En cas d'erreur de connexion SSH, vérifiez que les informations de connexion (hôte, utilisateur, mot de passe) sont correctes et que le port SSH est ouvert.
Pour les erreurs de polling, assurez-vous que le token du bot est valide.
🤝 Contribuer
Les contributions sont les bienvenues ! Ouvrez une issue ou faites une pull request pour toute amélioration.
