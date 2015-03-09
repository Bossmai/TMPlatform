del/q db
mkdir db
start cmd /c "mongod --dbpath db" 
timeout /t 5
mongoimport -d test -c phoneType --file %cd%\data\phoneType.dat
mongoimport -d test -c slaver --file %cd%\data\slaver.dat
mongoimport -d test -c app --file %cd%\data\app.dat
npm start

