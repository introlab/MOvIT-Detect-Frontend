# Stop services
echo "Ferme le frontdend"
sudo systemctl stop movit_frontend.service

# Update sources
echo "MAJ code"
git pull origin master
git submodule update --init --recursive

# Re-compile frontend
echo "Compilation frontend (peut prendre 1-2 minutes)"
yarn build

# Start services
echo "Redémarre frontend..."
sudo systemctl start movit_frontend.service

# refait le lien des ports pour le debug
echo "Retablie connexion des ports"
npm run dev