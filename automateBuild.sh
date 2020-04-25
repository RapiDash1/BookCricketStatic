echo "Automate push and build started"
shopt -s extglob
echo "Copying files to ../../StaticFiles/BookCricketStatic/"
cp -r !(package*||node_modules*) ../../StaticFiles/BookCricketStatic/
echo "......"
echo "Copying completed"
shopt -u extglob
git add .
git commit -m "$1"
echo "commited with message ----> $1"
git push
echo "Successfully pushed to repository : BookCricket"
cd ../../StaticFiles/BookCricketStatic/
echo "Changed directory to static files"
git add .
git commit -m "$1"
echo "commited to static file repository with message ----> $1"
git push
echo "Successfully pushed to repository : BookCricketStatic"
echo "....."
echo "Started to build the app for deployment"
npm run deploy
echo "Succesfully deployed to github at : https://rapidash1.github.io/BookCricketStatic/"
cd ../../BookCricket/client/
echo "Switched back directory" 
 
