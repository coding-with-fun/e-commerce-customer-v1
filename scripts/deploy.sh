exho "Deployment started..."
echo "Pulling latest code..."

git pull

echo "Installing packages"

npm install

echo "Building website"
npm run build

echo "Restarting server"
pm2 restart e-comerce-customer --update-env

echo "Deployment completed..."
